import {
  collection,
  doc,
  getDocs,
  query,
  where,
  runTransaction,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

// Every start time that can exist (which of these a client may pick depends on the
// service - see `slots` in src/data/services.js).
export const SLOT_TIMES = ['06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM'];

// Short break after every session before the next client can start.
export const BREAK_MINUTES = 15;

// A booking blocks the calendar from its start until the session ends PLUS the break.
// e.g. 90 min at 6:00 PM blocks 6:00 - 7:45 PM, so nobody (any service) can start at 6 or 7 PM.
const blockedUntil = (startMin, minutes) => startMin + minutes + BREAK_MINUTES;

// A slot document (collection "slots") holds ONLY date/time/status, never client
// data, so it is safe for the website to read it and grey out taken times.
//   status "held"   -> someone is paying right now (expires after HOLD_MINUTES)
//   status "booked" -> permanently taken
const HOLD_MINUTES = 15;

// "08:00 PM" -> minutes since midnight (1200)
export const timeToMin = (label) => {
  const [t, ap] = label.trim().split(/\s+/);
  let [h, m] = t.split(':').map(Number);
  if (/pm/i.test(ap) && h !== 12) h += 12;
  if (/am/i.test(ap) && h === 12) h = 0;
  return h * 60 + m;
};

// Accepts a Date or a string like "Mon Oct 26 2026" -> "2026-10-26" (local day)
export const toIsoDay = (input) => {
  const d = input instanceof Date ? input : new Date(input);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const slotId = (date, time) => `${toIsoDay(date)}_${time.replace(/[\s:]/g, '')}`;

// Identifies this browser tab so our own hold never blocks us
export const getHolderId = () => {
  let id = sessionStorage.getItem('slotHolderId');
  if (!id) {
    id = (crypto.randomUUID && crypto.randomUUID()) || `h_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem('slotHolderId', id);
  }
  return id;
};

const blocksUs = (slot, holderId) => {
  if (slot.status === 'booked') return true;
  if (slot.status === 'held') {
    const live = (slot.expiresAt?.toMillis?.() ?? 0) > Date.now();
    return live && slot.holderId !== holderId;
  }
  return false;
};

// Time range of an existing slot doc (older docs without end time count as 60 min)
const rangeOf = (slot) => {
  const start = Number.isFinite(slot.startMin) ? slot.startMin : timeToMin(slot.time);
  const end = Number.isFinite(slot.endMin) ? slot.endMin : start + 60;
  return [start, end];
};

export const clashes = (slot, holderId, start, end) => {
  if (!blocksUs(slot, holderId)) return false;
  const [s, e] = rangeOf(slot);
  return start < e && end > s;
};

/** Set of start times ("08:00 PM") that cannot be booked on that date for a session of `minutes` */
export const fetchTakenSlots = async (date, minutes = 60) => {
  const snap = await getDocs(query(collection(db, 'slots'), where('date', '==', toIsoDay(date))));
  const holderId = getHolderId();
  const docs = [];
  snap.forEach((d) => docs.push(d.data()));
  const taken = new Set();
  SLOT_TIMES.forEach((t) => {
    const start = timeToMin(t);
    if (docs.some((s) => clashes(s, holderId, start, blockedUntil(start, minutes)))) taken.add(t);
  });
  return taken;
};

// Reads every slot of that day inside a transaction and throws if the new
// session would overlap anything already booked / being paid for.
const assertFree = async (tx, date, time, minutes, holderId) => {
  const start = timeToMin(time);
  const refs = SLOT_TIMES.map((t) => doc(db, 'slots', slotId(date, t)));
  const snaps = await Promise.all(refs.map((r) => tx.get(r)));
  snaps.forEach((snap) => {
    if (snap.exists() && clashes(snap.data(), holderId, start, blockedUntil(start, minutes))) {
      throw new Error('SLOT_TAKEN');
    }
  });
};

/** Reserve the slot before payment. Throws Error('SLOT_TAKEN') if someone else has it. */
export const holdSlot = async (date, time, minutes = 60) => {
  const ref = doc(db, 'slots', slotId(date, time));
  const holderId = getHolderId();
  const startMin = timeToMin(time);
  await runTransaction(db, async (tx) => {
    await assertFree(tx, date, time, minutes, holderId);
    tx.set(ref, {
      date: toIsoDay(date),
      time,
      startMin,
      endMin: blockedUntil(startMin, minutes),
      status: 'held',
      holderId,
      expiresAt: Timestamp.fromMillis(Date.now() + HOLD_MINUTES * 60000),
      createdAt: serverTimestamp(),
    });
  });
};

/** Give the slot back right away (payment cancelled / failed) instead of waiting for the hold to expire. */
export const releaseHold = async (date, time) => {
  const ref = doc(db, 'slots', slotId(date, time));
  const holderId = getHolderId();
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) return;
    const s = snap.data();
    if (s.status !== 'held' || s.holderId !== holderId) return;
    tx.set(ref, { ...s, expiresAt: Timestamp.fromMillis(Date.now() - 1000) });
  });
};

/** After payment: mark slot booked and save the booking in ONE atomic step. Returns booking id. */
export const confirmBookingWithSlot = async (date, time, minutes, bookingData) => {
  const slotRef = doc(db, 'slots', slotId(date, time));
  const bookingRef = doc(collection(db, 'bookings'));
  const holderId = getHolderId();
  const startMin = timeToMin(time);
  await runTransaction(db, async (tx) => {
    await assertFree(tx, date, time, minutes, holderId);
    tx.set(slotRef, {
      date: toIsoDay(date),
      time,
      startMin,
      endMin: blockedUntil(startMin, minutes),
      status: 'booked',
      holderId,
      createdAt: serverTimestamp(),
    });
    tx.set(bookingRef, { ...bookingData, slotId: slotRef.id, createdAt: serverTimestamp() });
  });
  return bookingRef.id;
};
