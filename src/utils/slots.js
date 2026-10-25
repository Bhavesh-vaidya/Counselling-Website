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

// A slot document (collection "slots") holds ONLY date/time/status, never client
// data, so it is safe for the website to read it and grey out taken times.
//   status "held"   -> someone is paying right now (expires after HOLD_MINUTES)
//   status "booked" -> permanently taken
const HOLD_MINUTES = 15;

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

/** Set of time labels ("08:00 PM") already taken on that date */
export const fetchTakenSlots = async (date) => {
  const snap = await getDocs(query(collection(db, 'slots'), where('date', '==', toIsoDay(date))));
  const holderId = getHolderId();
  const taken = new Set();
  snap.forEach((d) => {
    const s = d.data();
    if (blocksUs(s, holderId)) taken.add(s.time);
  });
  return taken;
};

/** Reserve the slot before payment. Throws Error('SLOT_TAKEN') if someone else has it. */
export const holdSlot = async (date, time) => {
  const ref = doc(db, 'slots', slotId(date, time));
  const holderId = getHolderId();
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (snap.exists() && blocksUs(snap.data(), holderId)) throw new Error('SLOT_TAKEN');
    tx.set(ref, {
      date: toIsoDay(date),
      time,
      status: 'held',
      holderId,
      expiresAt: Timestamp.fromMillis(Date.now() + HOLD_MINUTES * 60000),
      createdAt: serverTimestamp(),
    });
  });
};

/** After payment: mark slot booked and save the booking in ONE atomic step. Returns booking id. */
export const confirmBookingWithSlot = async (date, time, bookingData) => {
  const slotRef = doc(db, 'slots', slotId(date, time));
  const bookingRef = doc(collection(db, 'bookings'));
  const holderId = getHolderId();
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(slotRef);
    if (snap.exists() && blocksUs(snap.data(), holderId)) throw new Error('SLOT_TAKEN');
    tx.set(slotRef, {
      date: toIsoDay(date),
      time,
      status: 'booked',
      holderId,
      createdAt: serverTimestamp(),
    });
    tx.set(bookingRef, { ...bookingData, slotId: slotRef.id, createdAt: serverTimestamp() });
  });
  return bookingRef.id;
};
