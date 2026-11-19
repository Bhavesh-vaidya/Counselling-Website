// Run:  node server/test-email.js     (or: npm run test-email)
import { BUSINESS_EMAIL, sendMail, explainMailError, getTransporter, mailMode } from './mailer.js';

try {
  console.log(`Email mode: ${mailMode()}`);
  if (mailMode() === 'smtp') {
    await getTransporter().verify();
    console.log('SMTP login OK');
  }
  await sendMail({
    to: BUSINESS_EMAIL,
    subject: 'Test email from Anora website server',
    text: 'If you can read this, email sending works.',
  });
  console.log(`Test email sent to ${BUSINESS_EMAIL} - check the inbox (and spam).`);
} catch (err) {
  console.error('FAILED:', explainMailError(err));
  process.exit(1);
}
