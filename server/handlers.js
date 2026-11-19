// Framework-independent request handlers, shared by:
//   - server/index.js            (Express, for running on your own computer)
//   - netlify/functions/api.mjs  (Netlify Functions, for the live site)
// Every handler returns { status, body }.
import './env.js';
import crypto from 'crypto';
import {
  BUSINESS_EMAIL,
  BRAND,
  sendMail,
  mailConfigured,
  mailMode,
  explainMailError,
} from './mailer.js';
import {
  calendarConfigured,
  calendarMode,
  createMeetEvent,
  bookingViaScript,
  slotToLocalIso,
  TIMEZONE,
} from './calendar.js';
import {
  clientBookingEmail,
  businessBookingEmail,
  contactBusinessEmail,
  contactAutoReply,
} from './templates.js';

const ok = (body, status = 200) => ({ status, body });
const fail = (status, error) => ({ status, body: { error } });

const isEmail = (v) => typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= 254;
const clip = (v, n) => String(v ?? '').slice(0, n);

// Tiny in-memory rate limiter so the email endpoints can't be used for spam.
// (On Netlify it only remembers within one warm instance - best effort.)
const hits = new Map();
const limited = (ip, route, max, windowMs) => {
  const key = `${ip}:${route}`;
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (recent.length >= max) return true;
  recent.push(now);
  hits.set(key, recent);
  return false;
};
const TOO_MANY = () => fail(429, 'Too many requests. Please try again in a few minutes.');

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

const REAL_KEYS = Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET && !/DEMO/i.test(RAZORPAY_KEY_ID));

export const health = () =>
  ok({
    ok: true,
    razorpayConfigured: Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET),
    emailConfigured: mailConfigured(),
    googleMeetConfigured: calendarConfigured(),
    businessEmail: BUSINESS_EMAIL,
  });

// 1) Create an order -> frontend opens Razorpay checkout with this order id
export const createOrder = async (body) => {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) return fail(503, 'Payments are not configured yet.');

  const { serviceName, amount, customer } = body || {};
  const expected = SERVICE_PRICES[serviceName];
  if (!expected) return fail(400, 'Unknown service.');
  if (Number(amount) !== expected) return fail(400, 'Amount does not match the selected service.');

  try {
    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` },
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
      return fail(502, order?.error?.description || 'Could not create order.');
    }
    return ok({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (error) {
    console.error('CREATE ORDER ERROR:', error);
    return fail(500, 'Could not create order.');
  }
};

// 2) Verify the signature Razorpay returns after payment
export const verifyPayment = (body) => {
  if (!RAZORPAY_KEY_SECRET) return fail(503, 'Payments are not configured yet.');

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body || {};
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return fail(400, 'Missing payment details.');
  }

  const expected = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(String(razorpay_signature));
  const valid = a.length === b.length && crypto.timingSafeEqual(a, b);

  return valid ? ok({ verified: true }) : fail(400, 'Payment verification failed.');
};

// ---------------------------------------------------------------------------
// Booking: Meet link + confirmation emails (client + business inbox)
// ---------------------------------------------------------------------------
// Only act on payments that really happened.
const paymentIsGenuine = async ({ paymentId, orderId, serviceName }) => {
  if (!REAL_KEYS) return /^pay_DEMO_\d+$/.test(paymentId); // demo mode: simulated ids only
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

const eventDetails = (b) => ({
  summary: `${b.serviceName} - ${b.fullName}`,
  description: `Client: ${b.fullName}\nEmail: ${b.email}\nPayment ID: ${b.paymentId}\nBooked via the Anora website.`,
});

// A) Everything in ONE call to the Google script (used when both calendar and email go
//    through the script, i.e. on Netlify). The script creates the event, picks the right
//    email wording depending on whether a Meet link exists, and sends both emails.
const LINK_TOKEN = '__MEET_LINK__';
const pick = (e) => ({ subject: e.subject, text: e.text, html: e.html });

const processCombined = async (b) => {
  const withLink = { client: clientBookingEmail({ ...b, meetLink: LINK_TOKEN }), biz: businessBookingEmail({ ...b, meetLink: LINK_TOKEN }) };
  const without = { client: clientBookingEmail({ ...b, meetLink: null }), biz: businessBookingEmail({ ...b, meetLink: null }) };
  const onNetlify = Boolean(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
  const timeoutMs = onNetlify ? 8500 : 18_000; // Netlify free functions stop at 10 s

  try {
    const data = await bookingViaScript(
      {
        event: {
          ...eventDetails(b),
          start: slotToLocalIso(b.date, b.time),
          end: slotToLocalIso(b.date, b.time, b.minutes),
          timeZone: TIMEZONE,
          requestId: b.paymentId,
        },
        emails: [
          { to: b.email, fromName: BRAND, replyTo: BUSINESS_EMAIL, withLink: pick(withLink.client), without: pick(without.client) },
          { to: BUSINESS_EMAIL, fromName: BRAND, replyTo: b.email, withLink: pick(withLink.biz), without: pick(without.biz) },
        ],
      },
      timeoutMs
    );
    if (data.eventError) console.error('GOOGLE MEET LINK FAILED:', data.eventError);
    const mailed = data.mailed || [];
    const skipped = data.duplicate === true; // already processed earlier: emails were sent then
    return {
      meetLink: data.meetLink || null,
      eventId: data.eventId || null,
      clientEmailSent: skipped || mailed[0] === true,
      businessEmailSent: skipped || mailed[1] === true,
    };
  } catch (err) {
    if (/timed out/i.test(err.message)) {
      // The script is still working on Google's side: the event and emails will still happen.
      console.warn('Google script is slow - answering without waiting for it:', err.message);
      return { meetLink: null, pending: true, clientEmailSent: false, businessEmailSent: false };
    }
    throw err;
  }
};

// B) Separate calls (local development, or when email goes through SMTP)
const processSeparately = async (b) => {
  b.meetLink = null;
  let eventId = null;
  if (calendarConfigured()) {
    try {
      const created = await createMeetEvent({
        ...eventDetails(b),
        dateStr: b.date,
        timeStr: b.time,
        minutes: b.minutes,
        requestId: b.paymentId,
      });
      b.meetLink = created.meetLink;
      eventId = created.eventId;
    } catch (err) {
      console.error('GOOGLE MEET LINK FAILED:', err.message);
    }
  } else {
    console.warn('Google Calendar is not configured - sending the booking email without a Meet link.');
  }

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
    eventId,
    clientEmailSent: results[0].status === 'fulfilled',
    businessEmailSent: results[1].status === 'fulfilled',
  };
};

const processBooking = (b) =>
  calendarMode() === 'script' && mailMode() === 'script' ? processCombined(b) : processSeparately(b);

// A retry/double-click gets the same answer (best effort per server instance; the Google
// script also refuses to create a second event for the same payment id).
const processed = new Map();

export const bookingConfirmation = async (body, ip = 'unknown') => {
  if (limited(ip, 'booking', 10, 10 * 60 * 1000)) return TOO_MANY();

  const x = body || {};
  const b = {
    fullName: clip(x.fullName, 100).trim(),
    age: clip(x.age, 3),
    email: clip(x.email, 254).trim(),
    concerns: clip(x.concerns, 3000),
    history: clip(x.history, 3000),
    serviceName: clip(x.serviceName, 100),
    date: clip(x.date, 40),
    time: clip(x.time, 20),
    paymentId: clip(x.paymentId, 60),
    orderId: clip(x.orderId, 60),
    demo: !REAL_KEYS,
  };

  if (!b.fullName || !isEmail(b.email) || !SERVICES[b.serviceName] || !b.date || !SERVICES[b.serviceName]?.slots.includes(b.time)) {
    return fail(400, 'Invalid booking details.');
  }
  b.price = `₹${SERVICES[b.serviceName].price.toLocaleString('en-IN')}`;
  b.minutes = SERVICES[b.serviceName].minutes;

  try {
    if (!(await paymentIsGenuine(b))) return fail(402, 'Payment could not be verified.');
  } catch (err) {
    console.error('PAYMENT CHECK ERROR:', err);
    return fail(502, 'Could not verify payment.');
  }

  let result;
  try {
    if (!processed.has(b.paymentId)) processed.set(b.paymentId, processBooking(b));
    result = await processed.get(b.paymentId);
  } catch (err) {
    processed.delete(b.paymentId);
    console.error('BOOKING CONFIRMATION FAILED:', explainMailError(err));
    return fail(500, 'Email could not be sent.');
  }

  const delivered = result.clientEmailSent || result.businessEmailSent || result.pending;
  if (!delivered) {
    processed.delete(b.paymentId); // allow a later retry
    return { status: 500, body: { ...result, error: 'Email could not be sent.' } };
  }
  return ok(result);
};

// ---------------------------------------------------------------------------
// Contact form email -> business inbox (+ short auto-reply to the sender)
// ---------------------------------------------------------------------------
export const contact = async (body, ip = 'unknown') => {
  if (limited(ip, 'contact', 5, 10 * 60 * 1000)) return TOO_MANY();

  const name = clip(body?.name, 100).trim();
  const email = clip(body?.email, 254).trim();
  const message = clip(body?.message, 5000).trim();
  if (!name || !isEmail(email) || !message) {
    return fail(400, 'Please enter a valid name, email and message.');
  }

  // Both are awaited: serverless hosts may stop the function as soon as we answer.
  const [toBusiness, autoReply] = await Promise.allSettled([
    sendMail({ to: BUSINESS_EMAIL, replyTo: email, ...contactBusinessEmail({ name, email, message }) }),
    sendMail({ to: email, ...contactAutoReply({ name }) }),
  ]);
  if (autoReply.status === 'rejected') console.error('AUTO-REPLY FAILED:', explainMailError(autoReply.reason));
  if (toBusiness.status === 'rejected') {
    console.error('CONTACT EMAIL FAILED:', explainMailError(toBusiness.reason));
    return fail(500, 'Message could not be sent. Please try again later.');
  }
  console.log('Contact email sent');
  return ok({ ok: true });
};
