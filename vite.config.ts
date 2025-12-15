import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Cloudflare Pages exposes environment variables during build time.
  // Vite loads variables prefixed with VITE_ by default.
  // We polyfill process.env.API_KEY so the Gemini SDK works without changes.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || process.env.API_KEY),
    },
    build: {
      outDir: 'dist',
    },
  };
});