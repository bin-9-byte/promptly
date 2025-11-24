import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ============================================================
// Vite 配置
// ============================================================
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});
