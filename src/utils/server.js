import { API_URL } from '../config/razorpay';

// Free server hosting sleeps after ~15 minutes of no traffic and takes up to a minute to
// wake. A tiny request as soon as the site opens means it is awake by the time someone
// reaches the contact form or booking page.
let woke = false;
export const wakeServer = () => {
  if (woke) return;
  woke = true;
  fetch(`${API_URL}/health`, { cache: 'no-store' }).catch(() => {});
};
