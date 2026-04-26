import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import handlebars from 'vite-plugin-handlebars'
import { resolve } from 'path'

const PAGE_CTX = {
    '/index.html': { bgClass: '', lang: 'ja', currentPath: '/' },
    '/en.html': { bgClass: '', lang: 'en', currentPath: '/en.html' },
    '/players_guide.html': { bgClass: 'bg-diver-500', lang: 'ja', currentPath: '/players_guide.html' },
    '/vision.html': { bgClass: 'bg-diver-500', lang: 'ja', currentPath: '/vision.html' },
    '/about_flags.html': { bgClass: 'bg-diver-500', lang: 'ja', currentPath: '/about_flags.html' },
    '/rules_swimmer26.html': { bgClass: 'bg-diver-500', lang: 'ja', currentPath: '/rules_swimmer26.html' },
}

export default defineConfig({
    root: 'src',
    publicDir: '../public',
    plugins: [
        tailwindcss(),
        handlebars({
            partialDirectory: resolve(__dirname, 'src/partials'),
            context: (pagePath) => PAGE_CTX[pagePath] ?? {},
            helpers: {
                eq: (a, b) => a === b,
            },
        }),
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
