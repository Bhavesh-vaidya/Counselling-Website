// ---------------------------------------------------------------------------
// Razorpay + backend configuration
// ---------------------------------------------------------------------------
// While no real Razorpay account exists the site runs in DEMO MODE:
// the payment step is simulated and nothing is charged.
//
// When you get real keys, create a `.env` file in the project root:
//   VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx     (or rzp_live_...)
//   VITE_API_URL=http://localhost:5000   (only needed to point at a different server)
// and put the SECRET in server/.env (never in the frontend). See SETUP.md.
// ---------------------------------------------------------------------------

export const DEMO_KEY_ID = 'rzp_test_DEMO_KEY_ID';

export const RAZORPAY_KEY_ID =
  import.meta.env.VITE_RAZORPAY_KEY_ID || DEMO_KEY_ID;

// Live site (Netlify): the backend is served from the same address under /api.
// Local development: the Express server on port 5000 (npm run server).
export const API_URL = (
  import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000')
).replace(/\/$/, '');

export const IS_DEMO = RAZORPAY_KEY_ID === DEMO_KEY_ID;

// Business details shown inside the Razorpay checkout window
export const BUSINESS_NAME = 'Anora Counseling';
export const THEME_COLOR = '#3a5a40';

// Business inbox shown on the website (all enquiries & bookings go here too)
export const BUSINESS_EMAIL = 'anoracounselling@gmail.com';

// Master switch for online booking.
//  - Local development: always ON.
//  - Live website: OFF until you set the GitHub variable VITE_BOOKINGS_OPEN to "true".
// While OFF, visitors see "Online booking is opening soon" instead of the calendar.
const bookingsFlag = import.meta.env.VITE_BOOKINGS_OPEN;
export const BOOKINGS_OPEN = bookingsFlag ? bookingsFlag === 'true' : import.meta.env.DEV;
