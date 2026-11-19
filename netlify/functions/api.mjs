// Netlify Function: the website's backend (contact form, booking emails + Meet links, Razorpay).
// /api/* is routed here by netlify.toml. The logic lives in server/handlers.js.
import * as h from '../../server/handlers.js';

const ROUTES = {
  'GET /health': h.health,
  'POST /create-order': h.createOrder,
  'POST /verify-payment': h.verifyPayment,
  'POST /booking-confirmation': h.bookingConfirmation,
  'POST /send': h.contact,
};

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  const method = (event.httpMethod || 'GET').toUpperCase();
  if (method === 'OPTIONS') return { statusCode: 204, body: '' };

  // Works whether Netlify passes the original path (/api/send) or the function path
  const rawPath = event.rawUrl ? new URL(event.rawUrl).pathname : event.path || '/';
  const path = rawPath.replace(/^\/(\.netlify\/functions\/api|api)(?=\/|$)/, '').replace(/\/+$/, '') || '/';

  const fn = ROUTES[`${method} ${path}`];
  if (!fn) return json(404, { error: 'Not found' });

  let body = {};
  if (method === 'POST') {
    try {
      const raw = event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString('utf8') : event.body || '';
      if (raw.length > 50_000) return json(413, { error: 'Request too large' });
      body = raw ? JSON.parse(raw) : {};
    } catch {
      return json(400, { error: 'Invalid JSON' });
    }
  }

  const headers = event.headers || {};
  const ip =
    headers['x-nf-client-connection-ip'] ||
    headers['client-ip'] ||
    String(headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    'unknown';

  try {
    const { status, body: out } = await fn(body, ip);
    return json(status, out);
  } catch (err) {
    console.error('UNEXPECTED ERROR:', err);
    return json(500, { error: 'Something went wrong. Please try again.' });
  }
};
