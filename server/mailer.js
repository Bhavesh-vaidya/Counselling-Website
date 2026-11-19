import './env.js';
import nodemailer from 'nodemailer';
import { callScript } from './calendar.js';

// Single business inbox: receives every enquiry/booking AND is the sender.
// Fixed in code on purpose so an old .env value can never misroute emails.
export const BUSINESS_EMAIL = 'anoracounselling@gmail.com';

if (process.env.EMAIL_USER && process.env.EMAIL_USER.toLowerCase() !== BUSINESS_EMAIL) {
  console.warn(
    `NOTE: EMAIL_USER in .env (${process.env.EMAIL_USER}) is ignored. ` +
      `All emails are sent from and to ${BUSINESS_EMAIL}; EMAIL_PASS must be that account's app password.`
  );
}
export const BRAND = 'Anora Counseling';

let transporter;
export const getTransporter = () => {
  if (!transporter && process.env.MAIL_DRY_RUN) {
    // Dev/testing: print emails to the console instead of sending
    transporter = nodemailer.createTransport({ jsonTransport: true });
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: BUSINESS_EMAIL,
        pass: (process.env.EMAIL_PASS || '').replace(/\s+/g, ''), // app password, spaces removed
      },
    });
  }
  return transporter;
};

// How emails leave the server:
//   "smtp"   - Gmail SMTP with an app password (fine on your own computer)
//   "script" - through the Google Apps Script over HTTPS (REQUIRED on Render's free tier,
//              which blocks the SMTP ports). Set EMAIL_TRANSPORT=script.
//   "dry"    - MAIL_DRY_RUN=1: print instead of sending (testing)
export const mailMode = () =>
  process.env.MAIL_DRY_RUN ? 'dry' : process.env.EMAIL_TRANSPORT === 'script' ? 'script' : 'smtp';

export const mailConfigured = () => {
  const mode = mailMode();
  if (mode === 'dry') return true;
  if (mode === 'script') return Boolean(process.env.GOOGLE_SCRIPT_URL && process.env.GOOGLE_SCRIPT_SECRET);
  return Boolean(process.env.EMAIL_PASS);
};

export const sendMail = async ({ to, subject, text, html, replyTo }) => {
  if (mailMode() === 'script') {
    return callScript({
      action: 'sendMail',
      to,
      subject,
      text,
      html,
      fromName: BRAND,
      replyTo: replyTo || BUSINESS_EMAIL,
    });
  }
  const info = await getTransporter().sendMail({
    from: `"${BRAND}" <${BUSINESS_EMAIL}>`,
    to,
    replyTo: replyTo || BUSINESS_EMAIL,
    subject,
    text,
    html,
  });
  if (process.env.MAIL_DRY_RUN) console.log(`[DRY RUN] to=${to} | subject=${subject}`);
  return info;
};

export const explainMailError = (err) => {
  if (mailMode() === 'script') {
    return `${err?.message || err} (sending through the Google script - see DEPLOY.md, "Update the Google script")`;
  }
  if (err?.code === 'EAUTH' || err?.responseCode === 535) {
    return 'Gmail rejected the login. Check that EMAIL_PASS in server/.env is the 16-character Google App Password created in the anoracounselling@gmail.com account (2-Step Verification must be ON), with no extra characters.';
  }
  if (!process.env.EMAIL_PASS) return 'EMAIL_PASS is missing in server/.env.';
  return err?.message || String(err);
};
