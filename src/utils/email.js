import { API_URL } from '../config/razorpay';

/**
 * Asks the server to (1) create the Google Meet link for the chosen date/time and
 * (2) email the client and the business inbox. Never throws.
 * Resolves with { ok, meetLink } - meetLink is null if it could not be created.
 */
export const sendBookingEmail = async (payload) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 40000);
  try {
    const res = await fetch(`${API_URL}/booking-confirmation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, meetLink: data.meetLink || null };
  } catch (err) {
    console.error('Booking confirmation request failed:', err);
    return { ok: false, meetLink: null };
  } finally {
    clearTimeout(timer);
  }
};
