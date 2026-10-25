import './env.js';
import nodemailer from 'nodemailer';

// Single business inbox: receives every enquiry/booking and is the sender.
export const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL || 'anoracounseling@gmail.com';
export const BRAND = 'Archi Counseling';

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
        user: process.env.EMAIL_USER || BUSINESS_EMAIL,
        pass: (process.env.EMAIL_PASS || '').replace(/\s+/g, ''), // app password, spaces removed
      },
    });
  }
  return transporter;
};

export const mailConfigured = () => Boolean(process.env.EMAIL_PASS || process.env.MAIL_DRY_RUN);

export const sendMail = async ({ to, subject, text, html, replyTo }) => {
  const info = await getTransporter().sendMail({
    from: `"${BRAND}" <${process.env.EMAIL_USER || BUSINESS_EMAIL}>`,
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
  if (err?.code === 'EAUTH' || err?.responseCode === 535) {
    return 'Gmail rejected the login. Check EMAIL_USER and that EMAIL_PASS is a 16-character Google App Password for that same account (2-Step Verification must be ON).';
  }
  if (!process.env.EMAIL_PASS) return 'EMAIL_PASS is missing in server/.env.';
  return err?.message || String(err);
};
