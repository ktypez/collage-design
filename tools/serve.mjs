#!/usr/bin/env node
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

function serve(req, res) {
  let url = new URL(req.url, `http://localhost`).pathname;
  if (url === '/') url = '/index.html';

  const filePath = path.join(ROOT, url);
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end('Forbidden'); return; }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    fs.createReadStream(filePath).pipe(res);
  } else {
    // SPA fallback: walk up from request path to find nearest index.html
    const parts = url.split('/').filter(Boolean);
    let fallback = null;
    for (let i = parts.length; i >= 0; i--) {
      const dir = path.join(ROOT, ...parts.slice(0, i));
      const candidate = path.join(dir, 'index.html');
      if (fs.existsSync(candidate)) { fallback = candidate; break; }
    }
    if (fallback) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(fallback).pipe(res);
    } else {
      res.writeHead(404); res.end('Not Found');
    }
  }
}

const port = parseInt(process.argv[2] || '3000', 10);
const server = http.createServer(serve);
server.listen(port, () => {
  console.log(`\n  DG dev server: http://localhost:${port}/`);
  console.log(`  Serving: ${ROOT}\n`);
  console.log(`  Routes:`);
  console.log(`    http://localhost:${port}/app/           → Web UI`);
  console.log(`    http://localhost:${port}/app/showcase.html → Components`);
  console.log(`    http://localhost:${port}/themes/shadcn/ → Shadcn themes\n`);
});
