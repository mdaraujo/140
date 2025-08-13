import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const rawBase = env.VITE_BASE_PATH || '/';
  const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;
  return {
    plugins: [react()],
    // Only needed when deploying in gh-pages or sub-path hosting
    base,
  };
});

// To deploy to gh-pages:
// npm run deploy
