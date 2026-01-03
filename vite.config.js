import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
    plugins: [
        tailwindcss(),
    ],
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                en: resolve(__dirname, 'en.html'),
                vision: resolve(__dirname, 'vision.html'),
                players_guide: resolve(__dirname, 'players_guide.html'),
                rules_swimmer26: resolve(__dirname, 'rules_swimmer26.html'),
                about_flags: resolve(__dirname, 'about_flags.html'),
            }
        }
    }
})