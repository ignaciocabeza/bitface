import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  root: new URL('.', import.meta.url).pathname,
  plugins: [tailwindcss(), react()],
  build: {
    outDir: 'dist',
  },
});
