// vite.config.js
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { plugin as mdPlugin, Mode } from 'vite-plugin-markdown';
import MarkdownIt from 'markdown-it';
import fg from 'fast-glob';
import { readFileSync } from 'fs';
import { resolve, relative } from 'path';
import fs from 'fs';
import path from 'path';

const md = new MarkdownIt();

// Build html from md files
function emitHtmlPages() {
    return {
        name: 'emit-html-pages',
        apply: 'build',
        generateBundle(_, bundle) {
            const cssFile = Object.values(bundle)
                .find(f => f.type === 'asset' && f.fileName.endsWith('.css'))
                ?.fileName;

            for (const file of fg.sync('src/pages/**/*.md')) {
                const body = md.render(readFileSync(file, 'utf8'));
                const fileName = relative('src/pages', file).replace(/\.md$/, '.html');

                const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
${cssFile ? `<link rel="stylesheet" href="/${cssFile}">` : ''}
</head><body><article class="">${body}</article></body></html>`;

                this.emitFile({ type: 'asset', fileName, source: html });
            }
        }
    };
}

// 
function devServeMd() {
    return {
        name: 'dev-serve-md',
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                let url = req.originalUrl.split('?')[0];
                if (url.endsWith('/')) url += 'index';
                url = url.replace(/\.html$/, '');

                const mdPath = path.resolve(
                    process.cwd(),
                    'src/pages',
                    `.${url}.md`
                );

                if (fs.existsSync(mdPath)) {
                    const body = md.render(fs.readFileSync(mdPath, 'utf8'));

                    // Using the bundled CSS file from vite
                    const html = `<!DOCTYPE html><html><head>
<meta charset="utf-8">
<link rel="stylesheet" href="/src/styles.css">
</head><body><article class="">${body}</article></body></html>`;

                    res.setHeader('Content-Type', 'text/html');
                    res.end(html);
                    return;
                }
                next();
            });
        }
    };
}

// generate input maps (index.html and markdown files)
const mdFiles = fg.sync('src/pages/**/*.md');
const input = Object.fromEntries(
    [['main', 'index.html'],
    ...mdFiles.map(f => [
        relative('src/pages', f).replace(/\.md$/, ''),
        resolve(__dirname, f)
    ])]
);

export default defineConfig({
    appType: 'mpa',
    plugins: [
        tailwindcss(),
        mdPlugin({ mode: [Mode.HTML] }), // dev
        devServeMd(),                   // dev
        emitHtmlPages()                 // build
    ],
    build: { rollupOptions: { input } }
});
