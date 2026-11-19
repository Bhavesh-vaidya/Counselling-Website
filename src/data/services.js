// Single source of truth for service names, durations, prices and descriptions.
// (The server keeps its own copy of name/price/minutes in server/index.js so the
// browser can never choose its own amount - keep the two in sync.)
export const formatPrice = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

export const SERVICES = {
  clarity: {
    id: 'clarity',
    number: 1,
    route: '/service-clarity',
    name: 'Emotional Clarity Session',
    minutes: 45,
    price: 349,
    description:
      "A gentle starting point to help you express what you're feeling, understand your emotions better, and gain clarity about what you may be struggling with.",
    bestFor: 'When you feel overwhelmed, confused, or need someone to talk to.',
    // 45 min + short break fits every hour
    slots: ['06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM'],
  },
  guided: {
    id: 'guided',
    number: 2,
    route: '/service-guided',
    name: 'Guided Counseling Session',
    minutes: 75,
    price: 649,
    description:
      'Deeper emotional support and guidance for concerns like anxiety, stress, overthinking, self-esteem, relationship struggles, burnout, or emotional difficulties.',
    bestFor: 'When you need supportive guidance and practical coping strategies.',
    // longer session: start times 2 hours apart
    slots: ['06:00 PM', '08:00 PM'],
  },
  insight: {
    id: 'insight',
    number: 3,
    route: '/service-insight',
    name: 'Deep Insight Session',
    minutes: 90,
    price: 859,
    description:
      'An in-depth and advanced session to work deeply on emotional patterns, past experiences, triggers, behavioral responses, and long-term healing.',
    bestFor: 'When you want deep self-understanding, healing, and personal growth.',
    slots: ['06:00 PM', '08:00 PM'],
  },
};

export const SERVICE_LIST = [SERVICES.clarity, SERVICES.guided, SERVICES.insight];

export const IMPORTANT_NOTES = [
  'These sessions are online and confidential.',
  'You will receive the meeting link on your email as soon as your booking is confirmed.',
];

export const TRUST_POINTS = ['Safe & Confidential', 'Personalized Support', 'Evidence-Based Approach', 'Empathetic & Non-Judgmental'];
