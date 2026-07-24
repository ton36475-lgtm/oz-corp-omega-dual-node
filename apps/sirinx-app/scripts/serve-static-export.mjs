import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(fileURLToPath(new URL('..', import.meta.url)));
const outDir = resolve(rootDir, 'out');

const contentTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.xml', 'application/xml; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp'],
  ['.woff2', 'font/woff2'],
]);

function resolveRequestPath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0] || '/');
  const normalized = normalize(decoded).replace(/^(\.\.(\/|\\|$))+/, '');
  const relative = normalized === sep ? 'index.html' : normalized.replace(/^\/+/, '');
  const candidates = [
    join(outDir, relative),
    join(outDir, `${relative}.html`),
    join(outDir, relative, 'index.html'),
  ];

  for (const candidate of candidates) {
    const resolved = resolve(candidate);
    if (!resolved.startsWith(outDir) || !existsSync(resolved)) continue;
    if (statSync(resolved).isFile()) return resolved;
  }

  return null;
}

export function createStaticExportServer() {
  if (!existsSync(outDir)) {
    throw new Error('Static export directory missing. Run `pnpm build` first.');
  }

  return createServer((req, res) => {
    const filePath = resolveRequestPath(req.url || '/');
    if (!filePath) {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    const ext = extname(filePath);
    const contentType =
      contentTypes.get(ext) ||
      (filePath.includes(`${sep}api${sep}`) ? 'application/json; charset=utf-8' : 'application/octet-stream');

    res.writeHead(200, {
      'content-type': contentType,
      'cache-control': 'no-store',
    });
    createReadStream(filePath).pipe(res);
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT || process.env.SIRINX_STATIC_PORT || 3002);
  const host = process.env.HOST || '127.0.0.1';
  const server = createStaticExportServer();

  server.listen(port, host, () => {
    console.log(`SIRINX static export serving http://${host}:${port}`);
  });
}
