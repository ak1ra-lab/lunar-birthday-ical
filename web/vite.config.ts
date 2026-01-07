import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: './', // For GitHub Pages
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          lunar: ['lunar-typescript'],
          ui: ['@radix-ui/react-popover', 'lucide-react', 'date-fns', 'react-day-picker'],
        },
      },
    },
  },
});
