import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                brand: resolve(__dirname, 'brand-advertising.html'),
                film: resolve(__dirname, 'film-and-television.html'),
                music: resolve(__dirname, 'music-videos.html'),
                showreels: resolve(__dirname, 'showreels-and-self-tapes.html'),
            },
            output: {
                manualChunks: {
                    'lenis': ['@studio-freight/lenis'],
                    'hls': ['hls.js']
                }
            }
        },
        cssCodeSplit: true,
        assetsInlineLimit: 4096,
        // Using default esbuild minifier (faster and no extra dependency)
        minify: 'esbuild',
    },
});
