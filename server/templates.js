import { BRAND, BUSINESS_EMAIL } from './mailer.js';

export const esc = (v = '') =>
  String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');

const wrap = (title, inner) => `
<div style="background:#fcfbf9;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#333">
  <div style="max-width:560px;margin:auto;background:#fff;border:1px solid #f0eee9;border-radius:16px;padding:32px">
    <h2 style="font-family:Georgia,serif;color:#3a5a40;margin:0 0 4px">${esc(BRAND)}</h2>
    <h3 style="margin:16px 0;color:#1a1a1a">${esc(title)}</h3>
    ${inner}
    <p style="font-size:12px;color:#999;margin-top:28px">Questions? Write to <a href="mailto:${BUSINESS_EMAIL}" style="color:#3a5a40">${BUSINESS_EMAIL}</a></p>
  </div>
</div>`;

const row = (label, value) =>
  `<tr><td style="padding:6px 12px 6px 0;color:#888;vertical-align:top;white-space:nowrap">${esc(label)}</td><td style="padding:6px 0;color:#1a1a1a">${esc(value)}</td></tr>`;

export const clientBookingEmail = (b, meetLink) => ({
  subject: `${b.demo ? '[DEMO] ' : ''}Your session is confirmed - ${b.serviceName}`,
  text: `Hi ${b.fullName},

Your session is confirmed.

Service: ${b.serviceName}
Date: ${b.date}
Time: ${b.time}
Amount: ${b.price}
Payment ID: ${b.paymentId}

Join via Google Meet: ${meetLink}

Need to reschedule? Please let us know at least 24 hours in advance by replying to this email or writing to ${BUSINESS_EMAIL}.

${BRAND}`,
  html: wrap('Your session is confirmed', `
    <p>Hi ${esc(b.fullName)}, thank you for booking. Here are your details:</p>
    <table style="font-size:14px;border-collapse:collapse">
      ${row('Service', b.serviceName)}${row('Date', b.date)}${row('Time', b.time)}${row('Amount', b.price)}${row('Payment ID', b.paymentId)}
    </table>
    <p style="margin:24px 0"><a href="${esc(meetLink)}" style="background:#4a5f46;color:#fff;padding:12px 22px;border-radius:10px;text-decoration:none;font-weight:bold">Join Google Meet Session</a></p>
    <p style="font-size:14px;color:#555">Please find a quiet, private space and make sure your internet connection is stable.<br>Need to reschedule? Let us know at least 24 hours in advance by replying to this email.</p>
    ${b.demo ? '<p style="font-size:12px;color:#b45309">Demo booking - no payment was taken.</p>' : ''}`),
});

export const businessBookingEmail = (b) => ({
  subject: `${b.demo ? '[DEMO] ' : ''}New booking: ${b.serviceName} - ${b.fullName} (${b.date}, ${b.time})`,
  text: `New booking received

Service: ${b.serviceName}
Date: ${b.date}
Time: ${b.time}
Amount: ${b.price}
Payment ID: ${b.paymentId}
Order ID: ${b.orderId}

Client: ${b.fullName} (age ${b.age})
Email: ${b.email}

Primary concerns:
${b.concerns}

Brief history:
${b.history || '-'}
${b.demo ? '\n(DEMO booking - no payment taken)' : ''}`,
  html: wrap('New booking received', `
    <table style="font-size:14px;border-collapse:collapse">
      ${row('Service', b.serviceName)}${row('Date', b.date)}${row('Time', b.time)}${row('Amount', b.price)}
      ${row('Payment ID', b.paymentId)}${row('Order ID', b.orderId)}
      ${row('Client', `${b.fullName} (age ${b.age})`)}${row('Email', b.email)}
    </table>
    <p style="margin-bottom:4px"><strong>Primary concerns</strong></p><p style="margin-top:0">${esc(b.concerns)}</p>
    <p style="margin-bottom:4px"><strong>Brief history</strong></p><p style="margin-top:0">${esc(b.history || '-')}</p>
    ${b.demo ? '<p style="font-size:12px;color:#b45309">DEMO booking - no payment was taken.</p>' : ''}`),
});

export const contactBusinessEmail = ({ name, email, message }) => ({
  subject: `New message from ${name}`,
  text: `You have received a new inquiry from your website.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  html: wrap('New website enquiry', `
    <table style="font-size:14px;border-collapse:collapse">${row('Name', name)}${row('Email', email)}</table>
    <p style="margin-bottom:4px"><strong>Message</strong></p><p style="margin-top:0">${esc(message)}</p>
    <p style="font-size:12px;color:#888">Reply directly to this email to answer ${esc(name)}.</p>`),
});

export const contactAutoReply = ({ name }) => ({
  subject: `We received your message - ${BRAND}`,
  text: `Hi ${name},\n\nThank you for reaching out. We have received your message and will get back to you soon.\n\n${BRAND}\n${BUSINESS_EMAIL}`,
  html: wrap('We received your message', `<p>Hi ${esc(name)}, thank you for reaching out. We have received your message and will get back to you soon.</p>`),
});
