import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                about: resolve(__dirname, 'about.html'),
                careers: resolve(__dirname, 'careers.html'),
                pricing: resolve(__dirname, 'pricing.html'),
                signup: resolve(__dirname, 'signup.html'),
            },
        },
    },
});
