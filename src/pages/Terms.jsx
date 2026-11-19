import React from 'react';
import PolicyPage from '../components/PolicyPage';
import { BUSINESS } from '../config/business';

const sections = [
  {
    heading: 'About our service',
    body: [
      `${BUSINESS.name} provides online counseling and emotional-support sessions: Emotional Clarity Session (45 minutes), Guided Counseling Session (75 minutes) and Deep Insight Session (90 minutes). Current prices are shown on our Services page and again at checkout. All prices are in Indian Rupees (INR).`,
    ],
  },
  {
    heading: 'Not emergency or medical care',
    body: [
      'Our sessions offer emotional support and guidance. They are not an emergency service and are not a substitute for medical or psychiatric diagnosis, treatment or medication.',
      'If you are in crisis or believe you or someone else may be in danger, contact emergency services on 112 immediately, or call Tele-MANAS (the Government of India mental-health helpline) on 14416.',
    ],
  },
  {
    heading: 'Who can book',
    body: ['Our sessions are intended for adults aged 18 and over.'],
  },
  {
    heading: 'Booking and payment',
    body: [
      'You choose a service, date and time and pay online through Razorpay. A booking is confirmed once payment succeeds. We do not see or store your card, UPI or bank details.',
      'Booked sessions cannot be rescheduled, and fees are non-refundable except as set out in our Refund & Cancellation Policy.',
    ],
  },
  {
    heading: 'How sessions are delivered',
    body: [
      'Sessions take place online through Google Meet. Your unique link is emailed to you when your booking is confirmed. When you open the link you may need to wait to be admitted at the start time.',
    ],
  },
  {
    heading: 'Your responsibilities',
    body: [
      'To get the most from your session, please:',
      [
        'provide accurate information when booking;',
        'join from a quiet, private space with a stable internet connection;',
        'join on time, as sessions end at the scheduled time;',
        'treat the counselor with respect; and',
        'not record, share or publish any part of a session without written consent.',
      ],
    ],
  },
  {
    heading: 'Confidentiality',
    body: [
      'What you share in sessions is kept confidential. The only exceptions are where disclosure is required by law, or where it is necessary to protect you or another person from serious harm.',
    ],
  },
  {
    heading: 'No guarantee of outcomes',
    body: [
      'We deliver our services with reasonable care and skill, but we cannot guarantee any particular result. To the extent permitted by law, our liability for any claim relating to a session is limited to the fee you paid for that session.',
    ],
  },
  {
    heading: 'Website content',
    body: [
      `The text, design and images on this website belong to ${BUSINESS.name} and may not be copied or reused without our permission.`,
    ],
  },
  {
    heading: 'Changes to these terms',
    body: [
      'We may update these terms from time to time. The date at the top of this page shows when they were last changed. The terms in force when you book apply to that booking.',
    ],
  },
  {
    heading: 'Governing law',
    body: ['These terms are governed by the laws of India.'],
  },
];

const Terms = () => (
  <PolicyPage
    title="Terms of Service"
    intro={`By booking a session or using this website you agree to these terms. Please read them together with our Privacy Policy and Refund & Cancellation Policy.`}
    sections={sections}
  />
);

export default Terms;
