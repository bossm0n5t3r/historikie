import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  build: {
    outDir: './dist',
    rollupOptions: {
      input: {
        popup: resolve(fileURLToPath(new URL('.', import.meta.url)), 'popup.html'),
        background: resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/background.ts')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  },
  publicDir: './public'
});
