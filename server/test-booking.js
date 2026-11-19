// Run:  npm run test-booking  [your-email@example.com]
// Pretends a client just paid (DEMO payment) and runs the REAL booking step: creates the Google
// Calendar event + Meet link and sends the confirmation emails, exactly like the live site.
// It does not touch Firestore or Razorpay. Afterwards it removes the test calendar event.
import { bookingConfirmation } from './handlers.js';
import { deleteEvent, calendarMode } from './calendar.js';
import { mailMode, BUSINESS_EMAIL } from './mailer.js';

const to = process.argv[2] || BUSINESS_EMAIL;
const tomorrow = new Date(Date.now() + 24 * 3600 * 1000).toDateString();
const id = Date.now();

console.log(`Email mode: ${mailMode()} | Calendar mode: ${calendarMode()}`);
console.log(`Test client email: ${to}\n`);

const { status, body } = await bookingConfirmation({
  fullName: 'Test Client',
  age: '30',
  email: to,
  concerns: 'This is a test booking from npm run test-booking.',
  history: '',
  serviceName: 'Emotional Clarity Session',
  date: tomorrow,
  time: '06:00 PM',
  paymentId: `pay_DEMO_${id}`,
  orderId: `order_DEMO_${id}`,
});

console.log('HTTP status :', status);
console.log('Meet link   :', body.meetLink || '(none)');
console.log('Client email:', body.clientEmailSent ? 'sent' : 'NOT sent');
console.log('Business email:', body.businessEmailSent ? 'sent' : 'NOT sent');
if (body.pending) console.log('Note: Google was slow; the script may still finish in the background.');
if (body.error) console.log('Error       :', body.error);

if (body.eventId) {
  try {
    await deleteEvent(body.eventId);
    console.log('\nTest calendar event removed. (The Meet link in the test emails no longer works - that is expected.)');
  } catch (e) {
    console.log('\nCould not remove the test event automatically - delete it from Google Calendar:', e.message);
  }
}
console.log(status === 200 ? '\nRESULT: OK - check both inboxes (and spam).' : '\nRESULT: FAILED - see messages above.');
process.exit(status === 200 ? 0 : 1);
