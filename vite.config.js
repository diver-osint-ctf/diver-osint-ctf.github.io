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

function generateHtmlString(body, cssFile) {
    return `<!doctype html><html>
<head>  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${cssFile ? `<link rel="stylesheet" href="/${cssFile}">` : `<link rel="stylesheet" href="/src/styles.css">`}
  <script type="module" src="/src/main.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap" rel="stylesheet">
  <meta property="og:title" content="DIVER OSINT CTF" />
  <meta property="og:description"
    content="DIVER OSINT CTF is a real-world oriented OSINT CTF. / DIVER OSINT CTF は現実世界指向の OSINT CTF（OSINTのコンテスト）です。" />
  <meta property="og:url" content="https://diverctf.org/" />
  <meta property="og:image" content="https://diverctf.org/ogp.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="DIVER OSINT CTF" />
  <title>DIVER OSINT CTF</title>
</head>
<body class="min-h-screen bg-gray-100 font-notosans-with-fallback">

  <header class="sticky top-0 bg-primary text-white bg-diver-500">
    <div class="container mx-auto px-4 md:px-10 lg:px-40 py-4 flex items-center justify-between">
      <a href="/" class="flex-shrink-0">
        <img src="./logo_circle.png" alt="DIVER OSINT CTF Logo" class="h-10 mx-auto md:mx-0">
      </a>

      <nav class="hidden md:flex space-x-6"> <!--PC Nav-->
        <a href="https://github.com/diver-osint-ctf/writeups"
          class="hover:text-blue-300 text-white no-underline">Archives (writeup)</a>
        <a href="/rules.html" class="hover:text-blue-300 text-white no-underline">CTF Rules</a>
        <a href="https://x.com/DIVER_OSINT_CTF" target="_blank" rel="noopener" class="hover:text-blue-300 text-white">
          <i class="fa-brands fa-x-twitter"></i>
        </a>
        <a href="https://github.com/diver-osint-ctf" target="_blank" rel="noopener"
          class="hover:text-blue-300 text-white">
          <i class="fab fa-github fa-lg"></i>
        </a>
        <a href="https://discord.diverctf.org/" target="_blank" rel="noopener" class="hover:text-blue-300 text-white">
          <i class="fab fa-discord fa-lg"></i>
        </a>
      </nav>

      <div class="md:hidden"> <!--Mobile Icon-->
        <button id="nav-toggle" class="focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>

    <nav id="mobile-menu" class="hidden bg-primary md:hidden"> <!--Mobile Nav-->
      <div class="px-4 pb-4 flex flex-col space-y-2">
        <a href="https://github.com/diver-osint-ctf/writeups"
          class="hover:text-gray-300 text-white no-underline">Archives (writeup)</a>
        <a href="/rules.html" class="hover:text-gray-300 text-white no-underline">CTF Rules</a>
        <div class="flex space-x-4 pt-2">
          <a href="https://x.com/DIVER_OSINT_CTF" target="_blank" rel="noopener" class="hover:text-gray-300 text-white">
            <i class="fa-brands fa-x-twitter"></i>
          </a>
          <a href="https://github.com/diver-osint-ctf" target="_blank" rel="noopener"
            class="hover:text-gray-300 text-white">
            <i class="fa-brands fa-github"></i>
          </a>
          <a href="https://discord.diverctf.org/" target="_blank" rel="noopener" class="hover:text-gray-300 text-white">
            <i class="fab fa-discord fa-lg"></i>
          </a>
        </div>
      </div>
    </nav>
  </header>

  <section class="container mx-auto px-4 lg:px-40 xl:px-60 py-8">
       ${body}
   </section>

</body>

</html>
`

}

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
                const html = generateHtmlString(body, cssFile);
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
                    const html = generateHtmlString(body);

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
