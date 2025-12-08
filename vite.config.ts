/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'esnext',
  },
  plugins: [react()],
  server: {
    open: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        url: 'http://localhost',
      },
    },
    setupFiles: ['./src/setupStoragePolyfill.ts', './src/setupTests.ts'],
    env: {
      NODE_NO_WARNINGS: '1',
    },
    coverage: {
      reporter: ['text', 'clover'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/@types/*',
        'src/*.d.ts',
        'src/i18n.ts',
        'src/index.{ts,tsx}',
        'src/reportWebVitals.ts',
        'src/mocks/*',
        'src/setupTests.ts',
      ],
    },
  },
});
