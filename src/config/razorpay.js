// ---------------------------------------------------------------------------
// Razorpay + backend configuration
// ---------------------------------------------------------------------------
// While no real Razorpay account exists the site runs in DEMO MODE:
// the payment step is simulated and nothing is charged.
//
// When you get real keys, create a `.env` file in the project root:
//   VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx     (or rzp_live_...)
//   VITE_API_URL=https://your-backend.onrender.com
// and put the SECRET in server/.env (never in the frontend). See SETUP.md.
// ---------------------------------------------------------------------------

export const DEMO_KEY_ID = 'rzp_test_DEMO_KEY_ID';

export const RAZORPAY_KEY_ID =
  import.meta.env.VITE_RAZORPAY_KEY_ID || DEMO_KEY_ID;

export const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000'
).replace(/\/$/, '');

export const IS_DEMO = RAZORPAY_KEY_ID === DEMO_KEY_ID;

// Business details shown inside the Razorpay checkout window
export const BUSINESS_NAME = 'Anora Counseling';
export const THEME_COLOR = '#3a5a40';

// Replace with the real Google Meet link when available
export const MEET_LINK =
  import.meta.env.VITE_MEET_LINK || 'https://meet.google.com/demo-link-here';

// Business inbox shown on the website (all enquiries & bookings go here too)
export const BUSINESS_EMAIL = 'anoracounselling@gmail.com';
