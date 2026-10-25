import { API_URL } from '../config/razorpay';

/** Asks the server to email the client and the business inbox. Never throws. */
export const sendBookingEmail = async (payload) => {
  try {
    const res = await fetch(`${API_URL}/booking-confirmation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (err) {
    console.error('Booking email request failed:', err);
    return false;
  }
};
