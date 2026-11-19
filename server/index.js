// Local / traditional server (Express). The live site uses netlify/functions/api.mjs,
// which calls the very same handlers (server/handlers.js).
import './env.js';
import express from 'express';
import cors from 'cors';
<<<<<<< HEAD
import * as h from './handlers.js';
import { BUSINESS_EMAIL, mailConfigured, mailMode, explainMailError, getTransporter } from './mailer.js';
import { calendarConfigured, calendarMode } from './calendar.js';
=======
import crypto from 'crypto';
import {
  BUSINESS_EMAIL,
  sendMail,
  mailConfigured,
  explainMailError,
  getTransporter,
} from './mailer.js';
import { calendarConfigured, calendarMode, createMeetEvent } from './calendar.js';
import {
  clientBookingEmail,
  businessBookingEmail,
  contactBusinessEmail,
  contactAutoReply,
} from './templates.js';
>>>>>>> ae9c0337741534602ece59deb41f0ada407b45bb

const app = express();
app.set('trust proxy', 1);

// Allow only your site (comma separated list), anyone while developing.
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
app.use(cors(allowedOrigins.length ? { origin: allowedOrigins } : undefined));
app.use(express.json({ limit: '50kb' }));

<<<<<<< HEAD
const route = (fn) => async (req, res) => {
  try {
    const { status, body } = await fn(req.body, req.ip);
    res.status(status).json(body);
=======
// Tiny in-memory rate limiter so the email endpoints can't be used for spam.
const hits = new Map();
const rateLimit = (max, windowMs) => (req, res, next) => {
  const key = `${req.ip}:${req.path}`;
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    return res.status(429).json({ error: 'Too many requests. Please try again in a few minutes.' });
  }
  recent.push(now);
  hits.set(key, recent);
  next();
};
const isEmail = (v) => typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= 254;
const clip = (v, n) => String(v ?? '').slice(0, n);

// ---------------------------------------------------------------------------
// Razorpay
// ---------------------------------------------------------------------------
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

// Prices and session lengths live here too so the browser can never choose its
// own amount or duration. Keep in sync with src/data/services.js (₹ rupees).
const SERVICES = {
  'Emotional Clarity Session': { price: 349, minutes: 45, slots: ['06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM'] },
  'Guided Counseling Session': { price: 649, minutes: 75, slots: ['06:00 PM', '08:00 PM'] },
  'Deep Insight Session': { price: 859, minutes: 90, slots: ['06:00 PM', '08:00 PM'] },
};
const SERVICE_PRICES = Object.fromEntries(Object.entries(SERVICES).map(([n, v]) => [n, v.price]));

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    razorpayConfigured: Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET),
    emailConfigured: mailConfigured(),
    googleMeetConfigured: calendarConfigured(),
    businessEmail: BUSINESS_EMAIL,
  });
});

// 1) Create an order -> frontend opens Razorpay checkout with this order id
app.post('/create-order', async (req, res) => {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return res.status(503).json({ error: 'Payments are not configured yet.' });
  }

  const { serviceName, amount, customer } = req.body || {};
  const expected = SERVICE_PRICES[serviceName];
  if (!expected) {
    return res.status(400).json({ error: 'Unknown service.' });
  }
  if (Number(amount) !== expected) {
    return res.status(400).json({ error: 'Amount does not match the selected service.' });
  }

  try {
    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: expected * 100, // paise
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`,
        notes: {
          service: serviceName,
          customer_name: customer?.name || '',
          customer_email: customer?.email || '',
        },
      }),
    });

    const order = await rzpRes.json();
    if (!rzpRes.ok) {
      console.error('RAZORPAY ORDER ERROR:', order);
      return res.status(502).json({ error: order?.error?.description || 'Could not create order.' });
    }

    res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (error) {
    console.error('CREATE ORDER ERROR:', error);
    res.status(500).json({ error: 'Could not create order.' });
  }
});

// 2) Verify the signature Razorpay returns after payment
app.post('/verify-payment', (req, res) => {
  if (!RAZORPAY_KEY_SECRET) {
    return res.status(503).json({ error: 'Payments are not configured yet.' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment details.' });
  }

  const expected = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const a = Buffer.from(expected);
  const b = Buffer.from(String(razorpay_signature));
  const valid = a.length === b.length && crypto.timingSafeEqual(a, b);

  if (!valid) {
    return res.status(400).json({ error: 'Payment verification failed.' });
  }
  res.json({ verified: true });
});

// ---------------------------------------------------------------------------
// Booking confirmation emails (client + business inbox)
// ---------------------------------------------------------------------------
const REAL_KEYS = Boolean(
  RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET && !/DEMO/i.test(RAZORPAY_KEY_ID)
);

// Only send emails for payments that really happened.
const paymentIsGenuine = async ({ paymentId, orderId, serviceName }) => {
  if (!REAL_KEYS) {
    // Demo mode: only simulated ids are accepted
    return /^pay_DEMO_\d+$/.test(paymentId);
  }
  if (!/^pay_[A-Za-z0-9]+$/.test(paymentId)) return false;
  const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
  const r = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Basic ${auth}` },
  });
  if (!r.ok) return false;
  const p = await r.json();
  return (
    p.order_id === orderId &&
    p.amount === SERVICE_PRICES[serviceName] * 100 &&
    ['captured', 'authorized'].includes(p.status)
  );
};

// Each payment is processed once: a retry/double-click gets the same answer and
// never creates a second calendar event or a second email.
const processed = new Map();

const processBooking = async (b) => {
  // 1) Unique Google Meet link for the exact date/time the client booked
  b.meetLink = null;
  if (calendarConfigured()) {
    try {
      const { meetLink } = await createMeetEvent({
        summary: `${b.serviceName} - ${b.fullName}`,
        description: `Client: ${b.fullName}\nEmail: ${b.email}\nPayment ID: ${b.paymentId}\nBooked via the Anora website.`,
        dateStr: b.date,
        timeStr: b.time,
        minutes: b.minutes,
        requestId: b.paymentId,
      });
      b.meetLink = meetLink;
    } catch (err) {
      console.error('GOOGLE MEET LINK FAILED:', err.message);
    }
  } else {
    console.warn('Google Calendar is not configured - sending the booking email without a Meet link.');
  }

  // 2) Emails: client first (with the link), business inbox second. One failing must not hide the other.
  const results = await Promise.allSettled([
    sendMail({ to: b.email, ...clientBookingEmail(b) }),
    sendMail({ to: BUSINESS_EMAIL, replyTo: b.email, ...businessBookingEmail(b) }),
  ]);
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      console.error(`BOOKING EMAIL (${i === 0 ? 'client' : 'business'}) FAILED:`, explainMailError(r.reason));
    }
  });

  return {
    meetLink: b.meetLink,
    clientEmailSent: results[0].status === 'fulfilled',
    businessEmailSent: results[1].status === 'fulfilled',
  };
};

app.post('/booking-confirmation', rateLimit(10, 10 * 60 * 1000), async (req, res) => {
  const body = req.body || {};
  const b = {
    fullName: clip(body.fullName, 100).trim(),
    age: clip(body.age, 3),
    email: clip(body.email, 254).trim(),
    concerns: clip(body.concerns, 3000),
    history: clip(body.history, 3000),
    serviceName: clip(body.serviceName, 100),
    date: clip(body.date, 40),
    time: clip(body.time, 20),
    paymentId: clip(body.paymentId, 60),
    orderId: clip(body.orderId, 60),
    demo: !REAL_KEYS,
  };

  if (!b.fullName || !isEmail(b.email) || !SERVICES[b.serviceName] || !b.date || !SERVICES[b.serviceName]?.slots.includes(b.time)) {
    return res.status(400).json({ error: 'Invalid booking details.' });
  }
  b.price = `₹${SERVICES[b.serviceName].price.toLocaleString('en-IN')}`;
  b.minutes = SERVICES[b.serviceName].minutes;

  try {
    if (!(await paymentIsGenuine(b))) {
      return res.status(402).json({ error: 'Payment could not be verified.' });
    }
>>>>>>> ae9c0337741534602ece59deb41f0ada407b45bb
  } catch (err) {
    console.error('UNEXPECTED ERROR:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};

<<<<<<< HEAD
app.get('/health', route(h.health));
app.post('/create-order', route(h.createOrder));
app.post('/verify-payment', route(h.verifyPayment));
app.post('/booking-confirmation', route(h.bookingConfirmation));
app.post('/send', route(h.contact));
=======
  if (!processed.has(b.paymentId)) processed.set(b.paymentId, processBooking(b));
  const result = await processed.get(b.paymentId);

  const ok = result.clientEmailSent || result.businessEmailSent;
  if (!ok) processed.delete(b.paymentId); // allow a later retry
  res.status(ok ? 200 : 500).json({ ...result, ...(ok ? {} : { error: 'Email could not be sent.' }) });
});

// ---------------------------------------------------------------------------
// Contact form email -> business inbox (+ short auto-reply to the sender)
// ---------------------------------------------------------------------------
app.post('/send', rateLimit(5, 10 * 60 * 1000), async (req, res) => {
  const name = clip(req.body?.name, 100).trim();
  const email = clip(req.body?.email, 254).trim();
  const message = clip(req.body?.message, 5000).trim();

  if (!name || !isEmail(email) || !message) {
    return res.status(400).json({ error: 'Please enter a valid name, email and message.' });
  }

  try {
    await sendMail({ to: BUSINESS_EMAIL, replyTo: email, ...contactBusinessEmail({ name, email, message }) });
  } catch (error) {
    console.error('CONTACT EMAIL FAILED:', explainMailError(error));
    return res.status(500).json({ error: 'Message could not be sent. Please try again later.' });
  }

  // Auto-reply is a courtesy; never fail the request because of it.
  sendMail({ to: email, ...contactAutoReply({ name }) }).catch((e) =>
    console.error('AUTO-REPLY FAILED:', explainMailError(e))
  );

  console.log('Contact email sent');
  res.json({ ok: true });
});
>>>>>>> ae9c0337741534602ece59deb41f0ada407b45bb

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
    console.log(calendarConfigured() ? `Google Meet links: ON (${calendarMode()})` : 'Google Meet links: OFF (see SETUP.md, "Google Meet links")');
  } catch (err) {
    console.error('EMAIL LOGIN FAILED:', explainMailError(err));
  }
});
