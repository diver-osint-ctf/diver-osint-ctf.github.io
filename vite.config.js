import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
    root: 'src',
    publicDir: '../public',
    plugins: [
        tailwindcss(),
    ],
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/index.html'),
                en: resolve(__dirname, 'src/en.html'),
                vision: resolve(__dirname, 'src/vision.html'),
                players_guide: resolve(__dirname, 'src/players_guide.html'),
                rules_swimmer26: resolve(__dirname, 'src/rules_swimmer26.html'),
                about_flags: resolve(__dirname, 'src/about_flags.html'),
            }
        }
    }
})