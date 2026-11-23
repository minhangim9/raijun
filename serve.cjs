const {createReadStream} = require('node:fs');
const {stat} = require('node:fs/promises');
const {createServer} = require('node:http');
const path = require('node:path');

const ports = [8080, 8081, 8082];
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.txt': 'text/plain; charset=utf-8',
  '.wav': 'audio/wav',
  '.webmanifest': 'application/manifest+json',
  '.webp': 'image/webp',
};

function resolveRequest(port, pathname) {
  if (port === 8082) return ['raijun-ep1-giyeok', pathname];
  if (port === 8081) {
    const routes = {'/': '/legacy.html', '/index.html': '/legacy.html', '/transfer.html': '/transfer.html'};
    return ['hub', routes[pathname] || ''];
  }
  for (const [prefix, dir] of [['/hangul/', 'raijun-hangul-demo'], ['/numbers/', 'raijun-game-numbers-shapes-ep1']]) {
    if (pathname.startsWith(prefix)) return [dir, pathname.slice(prefix.length - 1)];
  }
  if (pathname.startsWith('/lobby-art/') ||
      ['/', '/index.html', '/home.css', '/home.js', '/shared.js', '/hangul-cards.js', '/game-nav.css'].includes(pathname)) {
    return ['hub', pathname];
  }
  return [];
}

for (const port of ports) {
  createServer(async (request, response) => {
    try {
      const url = new URL(request.url, 'http://localhost');
      const pathname = decodeURIComponent(url.pathname);
      if (port === 8080 && ['/hangul', '/numbers'].includes(pathname)) {
        response.writeHead(308, {location: pathname + '/' + url.search}).end();
        return;
      }
      const [dir, relative] = resolveRequest(port, pathname);
      if (!relative) {
        response.writeHead(404).end();
        return;
      }
      const root = path.join(__dirname, dir);
      const file = path.resolve(root, '.' + (relative === '/' ? '/index.html' : relative));
      if (!file.startsWith(root + path.sep)) {
        response.writeHead(403).end();
        return;
      }
      const details = await stat(file);
      if (!details.isFile()) {
        response.writeHead(404).end();
        return;
      }
      const {size} = details;
      const headers = {
        'content-type': contentTypes[path.extname(file)] || 'application/octet-stream',
        'accept-ranges': 'bytes',
        'content-length': size,
      };
      if (port === 8081) {
        headers['cache-control'] = 'no-store';
        if (relative === '/transfer.html') headers['content-security-policy'] = "frame-ancestors http://127.0.0.1:8080";
      }
      let range;
      if (request.headers.range) {
        const match = /^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
        if (match && (match[1] || match[2])) {
          const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
          const end = match[1] && match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
          if (start <= end) range = {start, end};
        }
        if (!range) {
          response.writeHead(416, {'content-range': 'bytes */' + size}).end();
          return;
        }
        headers['content-range'] = `bytes ${range.start}-${range.end}/${size}`;
        headers['content-length'] = range.end - range.start + 1;
      }
      response.writeHead(range ? 206 : 200, headers);
      if (request.method === 'HEAD') response.end();
      else createReadStream(file, range).on('error', () => response.destroy()).pipe(response);
    } catch {
      response.writeHead(404).end();
    }
  }).listen(port, '127.0.0.1', () => console.log(`http://127.0.0.1:${port}/`));
}
