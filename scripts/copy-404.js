// GitHub Pages has no server-side routing. Serving index.html as 404.html makes
// deep links like /Counselling-Website/booking work after a refresh.
import { copyFileSync, existsSync } from 'node:fs';

if (existsSync('dist/index.html')) {
  copyFileSync('dist/index.html', 'dist/404.html');
  console.log('Created dist/404.html for GitHub Pages SPA routing');
}
