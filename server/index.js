import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const app = express();

// Allow only your site in production (comma separated list), anyone in dev.
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
app.use(cors(allowedOrigins.length ? { origin: allowedOrigins } : undefined));
app.use(express.json());

// ---------------------------------------------------------------------------
// Razorpay
// ---------------------------------------------------------------------------
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

// Prices live here too so the browser can never choose its own amount.
// Keep in sync with the service pages (₹ rupees).
const SERVICE_PRICES = {
  'Emotional Clarity Session': 1500,
  'Guided Counseling Session': 1800,
  'Deep Insight Session': 2500,
};

app.get('/health', (_req, res) => {
  res.json({ ok: true, razorpayConfigured: Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) });
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
// Contact form email
// ---------------------------------------------------------------------------
app.post('/send', async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).send('Name, email and message are required.');
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS, // Your 16-character App Password
    },
  });

  try {
    await transporter.sendMail({
      from: `"Archi Website" <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_RECEIVER || 'sumitv2025@gmail.com',
      replyTo: email,
      subject: `New Message from ${name}`,
      text: `
        You have received a new inquiry from your website.

        Name: ${name}
        Email: ${email}

        Message:
        ${message}
      `,
    });
    console.log('Email sent successfully!');
    res.status(200).send('Email sent!');
  } catch (error) {
    console.error('SMTP ERROR:', error);
    res.status(500).send(error.toString());
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
