import React from 'react';
import PolicyPage from '../components/PolicyPage';
import { BUSINESS } from '../config/business';

const sections = [
  {
    heading: 'Booking and payment',
    body: [
      'Sessions are paid for in full, online, in Indian Rupees (INR) through Razorpay at the time of booking. A booking is confirmed only after your payment succeeds. Your confirmation and Google Meet link are emailed to you straight away.',
    ],
  },
  {
    heading: 'No rescheduling',
    body: [
      'Because each session time is reserved for you alone, booked sessions cannot be rescheduled. Please choose your date and time carefully before you pay.',
    ],
  },
  {
    heading: 'No refunds for client cancellations',
    body: [
      'All session fees are non-refundable. This applies to cancellations, missed sessions (no-shows) and late arrivals.',
    ],
  },
  {
    heading: 'Errors on our side',
    body: [
      'The only exceptions are cases where the session was not delivered because of us. You will receive a full refund of the session fee if:',
      [
        'we cancel your session;',
        'a technical problem on our side prevents the session from taking place; or',
        'you were charged but your booking was not confirmed, or you were charged more than once for the same booking.',
      ],
    ],
  },
  {
    heading: 'How to report a problem',
    body: [
      `Email ${BUSINESS.email} within 7 days of the session date (or of the payment date, if your booking was not confirmed). Please include your full name, the email address used for booking and your Razorpay payment ID (shown on your confirmation page and email). We will reply within 3 business days.`,
    ],
  },
  {
    heading: 'Refund timeline',
    body: [
      'Where a refund is due, it is sent to the original payment method through Razorpay within 5 to 7 business days. Your bank or card issuer may take a few additional days to show the amount in your account.',
    ],
  },
  {
    heading: 'Late arrival',
    body: [
      'Sessions begin and end at the scheduled times. If you join late, the session still ends at the scheduled time and the fee is not reduced.',
    ],
  },
];

const RefundPolicy = () => (
  <PolicyPage
    title="Refund & Cancellation Policy"
    intro={`This policy explains how cancellations and refunds work for sessions booked with ${BUSINESS.name}. Please read it before you book.`}
    sections={sections}
  />
);

export default RefundPolicy;
