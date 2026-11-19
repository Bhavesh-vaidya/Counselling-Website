import React from 'react';
import PolicyPage from '../components/PolicyPage';
import { BUSINESS } from '../config/business';

const sections = [
  {
    heading: 'Who we are',
    body: [
      `${BUSINESS.name} provides online counseling sessions. This policy explains what personal information we collect through this website, why, and the choices you have.`,
    ],
  },
  {
    heading: 'Information we collect',
    body: [
      [
        'Booking details: your full name, email address, age, the concerns you want to discuss, a brief history if you choose to share one, and the service, date and time you select.',
        'Payment details: the order and payment reference numbers from Razorpay. We never see or store your card, UPI or bank details.',
        'Contact form: your name, email address and message.',
      ],
      'We do not use advertising cookies or analytics trackers. Your browser temporarily stores your booking choices (in session storage) so they carry from one page to the next; this is cleared when you close the tab.',
    ],
  },
  {
    heading: 'Why we use it',
    body: [
      [
        'to schedule and deliver your session and create your Google Meet link;',
        'to send your booking confirmation and respond to your messages;',
        'to process payments and any refunds; and',
        'to meet our legal obligations.',
      ],
      'Information about your emotional wellbeing is sensitive. We ask only for what we need and use it only for these purposes. We never sell your information or use it for marketing.',
    ],
  },
  {
    heading: 'Who we share it with',
    body: [
      'We use the following service providers to run the website and deliver our service. They handle information only as needed to provide their service:',
      [
        'Razorpay - payment processing;',
        'Google - Firebase (our booking database), Gmail (confirmation emails) and Google Calendar and Meet (session links);',
        'Render - hosting for our server; and',
        'GitHub Pages - hosting for this website.',
      ],
      'Some of these providers may process information on servers located outside India. We do not share your information with anyone else unless required by law or to protect someone from serious harm.',
    ],
  },
  {
    heading: 'How long we keep it',
    body: [
      'We keep your information for as long as needed to provide our services, resolve disputes and meet legal requirements. You can ask us to delete it at any time (see "Your rights").',
    ],
  },
  {
    heading: 'Security',
    body: [
      'Data travels over encrypted (HTTPS) connections and our database is not publicly readable. No system is completely secure, but we take reasonable steps to protect your information.',
    ],
  },
  {
    heading: 'Your rights',
    body: [
      `In line with India's Digital Personal Data Protection Act, 2023, you may ask to access, correct or delete your personal information, or withdraw your consent to our using it, by emailing ${BUSINESS.email}. We will respond within a reasonable time, normally within 30 days.`,
    ],
  },
  {
    heading: 'Children',
    body: [
      'Our services are intended for adults aged 18 and over. We do not knowingly collect information from anyone under 18.',
    ],
  },
  {
    heading: 'Changes to this policy',
    body: ['We may update this policy from time to time. The date at the top shows when it was last changed.'],
  },
  {
    heading: 'Questions or complaints',
    body: [
      `If you have a question or complaint about how your information is handled, contact us using the details below and we will respond promptly.`,
    ],
  },
];

const Privacy = () => <PolicyPage title="Privacy Policy" sections={sections} />;

export default Privacy;
