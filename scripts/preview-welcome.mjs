// Isolated UI preview: no database, account creation, or production configuration.
import { createServer as createHttpServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const port = Number(process.env.PORT || 8088);
const root = fileURLToPath(new URL('../', import.meta.url));
const server = createHttpServer();
await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', resolve);
});
const vite = await createViteServer({
    configFile: false,
    root,
    plugins: [react(), tailwindcss()],
    resolve: {
        dedupe: ['react', 'react-dom', '@inertiajs/react', '@inertiajs/core'],
        alias: {
            '@': fileURLToPath(new URL('../resources/js', import.meta.url)),
        },
    },
    server: { middlewareMode: true, hmr: false },
    appType: 'custom',
});
server.on('request', async (req, res) => {
    if (req.method !== 'GET') {
        res.writeHead(405);
        res.end('Preview only. Writes and account creation are disabled.');
        return;
    }
    if (
        ['/', '/register'].includes(
            new URL(req.url, 'http://localhost').pathname,
        )
    ) {
        const lang =
            new URL(req.url, `http://localhost:${port}`).searchParams.get(
                'lang',
            ) || 'en';
        const locale = ['en', 'ja', 'uz', 'ru'].includes(lang) ? lang : 'en';
        const translations = JSON.parse(
            await readFile(
                new URL(`../lang/${locale}.json`, import.meta.url),
                'utf8',
            ),
        );
        const page = {
            component:
                new URL(req.url, 'http://localhost').pathname === '/register'
                    ? 'auth/register'
                    : 'welcome',
            props: {
                locale,
                auth: { user: null },
                canRegister: true,
                translations,
                supportedLocales: {
                    en: { name: 'English', native: 'English' },
                    ja: { name: 'Japanese', native: '日本語' },
                    uz: { name: 'Uzbek', native: 'O‘zbekcha' },
                    ru: { name: 'Russian', native: 'Русский' },
                },
                errors: {},
            },
            url: req.url,
            version: 'preview',
        };
        if (req.headers['x-inertia']) {
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'X-Inertia': 'true',
            });
            res.end(JSON.stringify(page));
            return;
        }
        const json = JSON.stringify(page)
            .replaceAll('&', '&amp;')
            .replaceAll("'", '&#39;')
            .replaceAll('<', '&lt;');
        const html = await vite.transformIndexHtml(
            '/',
            `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><div id="app" data-page='${json}'></div><script type="module" src="/resources/js/app.tsx"></script></body></html>`,
        );
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
    } else if (req.method !== 'GET') {
        res.writeHead(405);
        res.end('Preview only. Account creation is disabled.');
    } else
        vite.middlewares(req, res, () => {
            res.writeHead(404);
            res.end();
        });
});
async function close() {
    await vite.close();
    server.close();
}
process.on('SIGINT', () => {
    void close();
});
process.on('SIGTERM', () => {
    void close();
});
console.log(
    `Bozor welcome preview: http://127.0.0.1:${port}/ (no account creation)`,
);
