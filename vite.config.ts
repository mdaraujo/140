import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Only needed when deploying in gh-pages
  base: '/140',
});

// To deploy to gh-pages:
// npm run deploy
