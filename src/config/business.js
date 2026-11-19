import { BUSINESS_EMAIL } from './razorpay';

// Business details shown on the Contact page and inside the policy pages.
// Leave phone/address empty ('') to hide them. Razorpay expects a real phone number,
// email and postal address to be visible on the website - fill these in before applying.
export const BUSINESS = {
  name: 'Anora Counseling',
  email: BUSINESS_EMAIL,
  phone: '+91 98695 88328',
  address: '301, Leela Tara, Fanaswadi, Girgaon, Mumbai - 400002',
  ownerName: 'Archi Mankar',
};

export const POLICIES_UPDATED = '15 November 2026';

// "Contact us" lines used at the bottom of every policy page
export const contactLines = () =>
  [
    BUSINESS.ownerName && `${BUSINESS.name} - ${BUSINESS.ownerName}`,
    `Email: ${BUSINESS.email}`,
    BUSINESS.phone && `Phone: ${BUSINESS.phone}`,
    BUSINESS.address && `Address: ${BUSINESS.address}`,
  ].filter(Boolean);
