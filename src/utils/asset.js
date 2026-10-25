// Resolves files placed in /public/assets so they work both locally and on
// GitHub Pages (where the site lives under /Counselling-Website/).
export const asset = (file) => `${import.meta.env.BASE_URL}assets/${file}`;
