// Create 404.html for SPA fallback on GitHub Pages
// Copies index.html to 404.html so reloaded deep links work under gh-pages
import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

const dist = resolve(process.cwd(), 'dist');
const src = resolve(dist, 'index.html');
const dst = resolve(dist, '404.html');

try {
  copyFileSync(src, dst);
  console.log('SPA 404 fallback created at dist/404.html');
} catch (err) {
  console.error('Failed to create SPA 404 fallback:', err);
  process.exit(1);
}


