# Anora Counseling - Setup Guide

## Services (single source of truth)
| Session | Length | Price | Start times offered (IST) |
|---|---|---|---|
| Emotional Clarity Session | 45 min | ₹349 | 6, 7, 8, 9 PM |
| Guided Counseling Session | 75 min | ₹649 | 6 PM, 8 PM |
| Deep Insight Session | 90 min | ₹859 | 6 PM, 8 PM |

Website text/prices/start times: `src/data/services.js`. The server keeps its own copy in
`server/index.js` (`SERVICES`) so a browser can never choose its own amount, length or
start time. **If you ever change a price, length or start time, change it in both files.**

## Run locally
```
npm install
npm run server      # backend on :5000 (emails, Meet links, Razorpay)  - keep it running
npm run dev         # website (second terminal)
```
Server settings live in `server/.env` (copy `server/.env.example`). Never commit it.

## 1. Firebase
- `src/firebase.js` points at project `anora-counseling`.
- Firebase Console -> Firestore Database -> **Rules** -> paste `firestore.rules` -> **Publish**.
  Re-publish whenever this file changes (it changed in this version: slots now store start/end times).

## 2. Email (anoracounselling@gmail.com)
Every email is sent FROM and delivered TO `anoracounselling@gmail.com`.
1. Google Account -> Security -> 2-Step Verification ON -> App passwords -> create one.
2. `server/.env`:  `EMAIL_PASS=xxxx xxxx xxxx xxxx`
3. `npm run test-email` -> a test mail must arrive.

## 3. Google Meet links (unique link per booking)
After a payment, the server creates a Google Calendar event for the exact date/time and
length the client booked and puts the generated Meet link in the confirmation email (and on
the confirmation page). The event also appears in the business calendar.
Clients are not added as guests; when they click the link they see "Ask to join" and you
admit them at session time.

### 3A. Recommended: Google Apps Script (about 10 minutes, free)
A tiny script lives inside the anoracounselling@gmail.com account and creates the events.
No Google Cloud project, no consent screen, no privacy-policy page, and the permission never expires.
Do everything signed in as **anoracounselling@gmail.com**.

1. Open https://script.google.com -> **New project**. Click "Untitled project" and rename it `Anora calendar helper`.
2. Delete the sample code in `Code.gs`. Open `server/google-apps-script.gs` from this project, copy ALL of it and paste it in.
3. Near the top, replace `PASTE_A_LONG_RANDOM_TEXT_HERE` with your own long random text (30+ letters/numbers, no spaces or quotes).
   Keep a copy of it - the server needs the same text. Press **Ctrl+S**.
4. Left sidebar -> **Services** (the + icon) -> choose **Google Calendar API** -> **Add**. (Leave identifier `Calendar`.)
5. Top bar: choose the function **authorize** in the dropdown -> **Run**. Click **Review permissions** -> choose
   anoracounselling@gmail.com -> "Google hasn't verified this app" (normal, it is your own script) -> **Advanced ->
   Go to Anora calendar helper (unsafe) -> Allow**. The log should say "Execution completed".
6. **Deploy -> New deployment** -> gear icon -> type **Web app** -> Description `v1` ->
   **Execute as: Me (anoracounselling@gmail.com)** -> **Who has access: Anyone** -> **Deploy**.
   (Allow access again if asked.) Copy the **Web app URL** (it ends with `/exec`).
7. Check it: open that URL in a browser. You should see `{"ok":true,"status":"Anora calendar helper is running"}`.
8. Put these in `server/.env`:
   ```
   GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/.../exec
   GOOGLE_SCRIPT_SECRET=the-same-long-random-text-from-step-3
   ```
9. Restart the server (`npm run server`): it prints `Google Meet links: ON (script)`.
   Run `npm run test-calendar`: it prints a test Meet link and removes the test event.
10. Make a demo booking: the client email must contain the Meet link, the event must appear in Google Calendar at the
    chosen date/time, and the confirmation page must show "Join Google Meet Session".

"Anyone" only means anyone with the secret URL can reach the script; without the secret text it refuses ("unauthorized").
Do not share the URL or the secret.

If you edit the script later: **Deploy -> Manage deployments -> pencil icon -> Version: New version -> Deploy** (the URL stays the same).

Troubleshooting:
- `Google script error: unauthorized` -> the secret in `server/.env` differs from the one in the script.
- `unexpected response` / HTML page -> the deployment access is not "Anyone", or the URL does not end in `/exec`.
- `Calendar is not defined` -> step 4 (Add the Google Calendar API service) is missing.
- Changes to the script have no effect -> publish a **New version** (see above).
- Event appears in the wrong calendar -> you authorised a different Google account; redo steps 5-6 as anoracounselling@gmail.com.

If Google ever fails, the booking and payment still succeed: the client email says the link
will follow, and the business email says **"Meet link: NOT CREATED - send manually"**.

### 3B. Alternative: Google Cloud OAuth (not needed if you did 3A)
Only use this if you prefer a normal Google Cloud setup. It requires publishing the OAuth app to
"In production", and Google then demands a homepage URL and a privacy-policy URL on a domain you
control; if left in "Testing", the permission expires every 7 days. Put `GOOGLE_CLIENT_ID` and
`GOOGLE_CLIENT_SECRET` (Desktop app client) in `server/.env`, then run `npm run google-auth`
and `npm run test-calendar`. If `GOOGLE_SCRIPT_URL` is set, the script (3A) is used instead.

## 4. Razorpay (when the account is ready)
1. Dashboard -> Account & Settings -> API Keys -> generate **Test** keys first.
2. `server/.env`: `RAZORPAY_KEY_ID=rzp_test_...` and `RAZORPAY_KEY_SECRET=...` (secret stays on the server only).
3. Project-root `.env`: `VITE_RAZORPAY_KEY_ID=rzp_test_...` (same key id, NOT the secret) and `VITE_API_URL=http://localhost:5000`.
4. Restart both. The booking button becomes **Pay ₹<price>** and opens the real Razorpay window.
5. Switch to `rzp_live_` keys after KYC activation.
Until then the site runs in DEMO MODE (simulated payment, bookings labelled `Demo - Not Paid`).

## 5. Deploy (later)
- **Backend** (Express) needs a host (Render / Railway). Set the same env vars there (EMAIL_PASS,
  GOOGLE_SCRIPT_*, RAZORPAY_*) plus `CORS_ORIGIN=https://<username>.github.io`.
- **Frontend** (GitHub Pages): GitHub -> Settings -> Secrets and variables -> Actions -> *Variables*:
  `VITE_RAZORPAY_KEY_ID`, `VITE_API_URL` (your backend URL). Push to `main` and the workflow deploys.

## Slot locking (no double booking, with breaks)
Taken times are stored in the Firestore collection `slots` and greyed out as "Booked" for everyone.
- Clarity (45 min) is offered every hour; Guided (75) and Deep Insight (90) only at 6 PM and 8 PM.
- A **15-minute break** follows every session (`BREAK_MINUTES` in `src/utils/slots.js`).
- A booking blocks everything from its start until the session ends plus the break, for ALL services.
  Example: Deep Insight at 6:00 PM runs to 7:30 PM (+ break = 7:45), so nobody can book 6:00 or 7:00 PM
  that day; 8:00 PM is still free. A Clarity session at 6:00 PM ends 6:45 (+ break = 7:00), so 7:00 PM stays free.
- A slot is held for 15 minutes while someone pays and is released immediately if they cancel.
