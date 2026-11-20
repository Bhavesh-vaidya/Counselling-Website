// Local / traditional server (Express). The live site uses netlify/functions/api.mjs,
// which calls the very same handlers (server/handlers.js).
import './env.js';
import express from 'express';
import cors from 'cors';
import * as h from './handlers.js';
import { BUSINESS_EMAIL, mailConfigured, mailMode, explainMailError, getTransporter } from './mailer.js';
import { calendarConfigured, calendarMode } from './calendar.js';

const app = express();
app.set('trust proxy', 1);

// Allow only your site (comma separated list), anyone while developing.
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
app.use(cors(allowedOrigins.length ? { origin: allowedOrigins } : undefined));
app.use(express.json({ limit: '50kb' }));

const route = (fn) => async (req, res) => {
  try {
    const { status, body } = await fn(req.body, req.ip);
    res.status(status).json(body);
  } catch (err) {
    console.error('UNEXPECTED ERROR:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};

app.get('/health', route(h.health));
app.post('/create-order', route(h.createOrder));
app.post('/verify-payment', route(h.verifyPayment));
app.post('/booking-confirmation', route(h.bookingConfirmation));
app.post('/send', route(h.contact));

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    calendarConfigured()
      ? `Google Meet links: ON (${calendarMode()})`
      : 'Google Meet links: OFF (see SETUP.md, "Google Meet links")'
  );
  if (!mailConfigured()) {
    console.warn(
      mailMode() === 'script'
        ? 'WARNING: EMAIL_TRANSPORT=script but GOOGLE_SCRIPT_URL / GOOGLE_SCRIPT_SECRET are missing - emails will fail.'
        : 'WARNING: EMAIL_PASS is not set in server/.env - emails will fail.'
    );
    return;
  }
  if (mailMode() !== 'smtp') {
    console.log(`Email OK (${mailMode() === 'script' ? 'via Google script' : 'dry run'}, sending as ${BUSINESS_EMAIL})`);
    return;
  }
  try {
    await getTransporter().verify();
    console.log(`Email OK (sending as ${BUSINESS_EMAIL})`);
  } catch (err) {
    console.error('EMAIL LOGIN FAILED:', explainMailError(err));
  }
});
