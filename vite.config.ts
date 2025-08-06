import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath, URL } from 'node:url';
import { copyFileSync, existsSync, mkdirSync } from 'fs';

const browser = process.env.TARGET_BROWSER || 'chrome';

export default defineConfig({
  build: {
    outDir: `./dist-${browser}`,
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
  publicDir: './public',
  plugins: [
    {
      name: 'copy-manifest',
      writeBundle() {
        const distDir = `./dist-${browser}`;
        if (!existsSync(distDir)) {
          mkdirSync(distDir, { recursive: true });
        }
        
        const manifestSrc = browser === 'firefox' 
          ? './public/manifest-firefox.json' 
          : './public/manifest.json';
        
        copyFileSync(manifestSrc, `${distDir}/manifest.json`);
        console.log(`Copied ${manifestSrc} to ${distDir}/manifest.json`);
      }
    }
  ]
});
