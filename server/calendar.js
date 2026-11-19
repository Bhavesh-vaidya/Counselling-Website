import './env.js';

// Creates a Google Calendar event on the business calendar and returns the unique
// Google Meet link Google generates for it. Uses plain HTTPS calls (no extra packages).
//
// Two ways to talk to Google (pick ONE in server/.env):
//   "script" (recommended): a small Google Apps Script running inside the business Gmail
//            account (GOOGLE_SCRIPT_URL + GOOGLE_SCRIPT_SECRET). No consent screen, no expiry.
//   "oauth":  Google Cloud OAuth client + refresh token (GOOGLE_CLIENT_ID/SECRET/REFRESH_TOKEN).
const TOKEN_URL = process.env.GOOGLE_TOKEN_URL || 'https://oauth2.googleapis.com/token';
const API_BASE = process.env.GOOGLE_API_BASE || 'https://www.googleapis.com/calendar/v3';
export const TIMEZONE = 'Asia/Kolkata';

<<<<<<< HEAD
const scriptUrl = () => (process.env.GOOGLE_SCRIPT_URL || '').trim();
const scriptSecret = () => (process.env.GOOGLE_SCRIPT_SECRET || '').trim();

export const calendarMode = () => {
  if (scriptUrl() && scriptSecret()) return 'script';
=======
export const calendarMode = () => {
  if (process.env.GOOGLE_SCRIPT_URL && process.env.GOOGLE_SCRIPT_SECRET) return 'script';
>>>>>>> ae9c0337741534602ece59deb41f0ada407b45bb
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN) return 'oauth';
  return null;
};
export const calendarConfigured = () => calendarMode() !== null;

let cached = { token: null, expiresAt: 0 };

const getAccessToken = async () => {
  if (cached.token && Date.now() < cached.expiresAt - 60_000) return cached.token;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) {
    if (data.error === 'invalid_grant') {
      throw new Error('Google permission expired or was revoked. Run "npm run google-auth" again.');
    }
    throw new Error(`Google sign-in failed: ${data.error_description || data.error || res.status}`);
  }
  cached = { token: data.access_token, expiresAt: Date.now() + (data.expires_in || 3600) * 1000 };
  return cached.token;
};

const MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
const pad = (n) => String(n).padStart(2, '0');

// ("Mon Oct 26 2026", "08:00 PM", 45) -> "2026-10-26T20:45:00" (no timezone: Google applies Asia/Kolkata)
export const slotToLocalIso = (dateStr, timeStr, addMinutes = 0) => {
  const dm = /^[A-Za-z]{3} ([A-Za-z]{3}) (\d{1,2}) (\d{4})$/.exec(String(dateStr).trim());
  const tm = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i.exec(String(timeStr).trim());
  if (!dm || !tm || !(dm[1] in MONTHS)) throw new Error(`Invalid session date/time: "${dateStr}" "${timeStr}"`);
  let h = Number(tm[1]) % 12;
  if (/pm/i.test(tm[3])) h += 12;
  const d = new Date(Date.UTC(Number(dm[3]), MONTHS[dm[1]], Number(dm[2]), h, Number(tm[2]) + addMinutes));
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:00`;
};

const meetLinkOf = (event) =>
  event.hangoutLink || event.conferenceData?.entryPoints?.find((e) => e.entryPointType === 'video')?.uri || null;

const withTimeout = (promise, ms, label) =>
  Promise.race([promise, new Promise((_, rej) => setTimeout(() => rej(new Error(`${label} timed out`)), ms))]);

// ---- Apps Script mode ------------------------------------------------------
<<<<<<< HEAD
export const callScript = async (payload, timeoutMs = 18_000) => {
  const res = await withTimeout(
    fetch(scriptUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ secret: scriptSecret(), ...payload }),
      redirect: 'follow', // Apps Script answers through a redirect
    }),
    timeoutMs,
=======
const callScript = async (payload) => {
  const res = await withTimeout(
    fetch(process.env.GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ secret: process.env.GOOGLE_SCRIPT_SECRET, ...payload }),
      redirect: 'follow', // Apps Script answers through a redirect
    }),
    18_000,
>>>>>>> ae9c0337741534602ece59deb41f0ada407b45bb
    'Google Apps Script'
  );
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      'Google script returned an unexpected response. Check the deployment is set to "Anyone" and GOOGLE_SCRIPT_URL ends with /exec.'
    );
  }
  if (!data.ok) throw new Error(`Google script error: ${data.error || 'unknown'}`);
  return data;
};

<<<<<<< HEAD
// ONE call that creates the calendar event (with Meet link) AND sends the booking emails.
// Used on hosts with short function time limits (Netlify free plan = 10 s): the script keeps
// running on Google's side even if our function stops waiting for it.
export const bookingViaScript = (payload, timeoutMs) => callScript({ action: 'booking', ...payload }, timeoutMs);

=======
>>>>>>> ae9c0337741534602ece59deb41f0ada407b45bb
const createViaScript = async ({ summary, description, dateStr, timeStr, minutes, requestId }) => {
  const data = await callScript({
    action: 'create',
    summary,
    description,
    start: slotToLocalIso(dateStr, timeStr),
    end: slotToLocalIso(dateStr, timeStr, minutes),
    timeZone: TIMEZONE,
    requestId,
  });
  if (!data.meetLink) throw new Error('Google created the event but no Meet link was returned.');
  return { eventId: data.eventId, meetLink: data.meetLink };
};

/** Returns { eventId, meetLink } */
export const createMeetEvent = async ({ summary, description, dateStr, timeStr, minutes, requestId }) => {
  if (calendarMode() === 'script') {
    return createViaScript({ summary, description, dateStr, timeStr, minutes, requestId });
  }
  const token = await withTimeout(getAccessToken(), 10_000, 'Google sign-in');
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const res = await withTimeout(
    fetch(`${API_BASE}/calendars/primary/events?conferenceDataVersion=1&sendUpdates=none`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        summary,
        description,
        start: { dateTime: slotToLocalIso(dateStr, timeStr), timeZone: TIMEZONE },
        end: { dateTime: slotToLocalIso(dateStr, timeStr, minutes), timeZone: TIMEZONE },
        conferenceData: {
          createRequest: { requestId, conferenceSolutionKey: { type: 'hangoutsMeet' } },
        },
        reminders: { useDefault: true },
      }),
    }),
    15_000,
    'Google Calendar'
  );
  const event = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Google Calendar error ${res.status}: ${event?.error?.message || 'unknown error'}`);
  }

  let link = meetLinkOf(event);
  // Google occasionally finishes creating the Meet room a moment later
  for (let i = 0; i < 4 && !link; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    const again = await fetch(`${API_BASE}/calendars/primary/events/${event.id}?conferenceDataVersion=1`, { headers });
    if (again.ok) link = meetLinkOf(await again.json());
  }
  if (!link) throw new Error('Google created the event but no Meet link was returned.');
  return { eventId: event.id, meetLink: link };
};

export const deleteEvent = async (eventId) => {
  if (calendarMode() === 'script') {
    await callScript({ action: 'delete', eventId });
    return;
  }
  const token = await getAccessToken();
  await fetch(`${API_BASE}/calendars/primary/events/${eventId}?sendUpdates=none`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
};
