/* =============================================================================
   build.js — Collage Design build tool
   -----------------------------------------------------------------------------
   1. Bundle src/ → single-file app.html (esbuild JS + CSS, inline into shell)
   2. Minify HTML + inline CSS/JS
   3. Optimize inline SVGs
   4. Report sizes
   5. --copy: sync themes + sharp-renderer into production backend (Method A)

   Commands:
     npm run build         → bundle → app.html
     npm run size          → report sizes
     npm run preview       → serve built app.html on :8000
     npm run build:watch   → rebuild on change
     npm run clean         → rm dist/, .tmp/, app.html
     npm run copy:backend  → copy design-system into /home/admin/collage/backend/
   ============================================================================= */

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';
import { minify as htmlMinify } from 'html-minifier-terser';
import { optimize as svgOptimize } from 'svgo';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const TMP = path.join(ROOT, '.tmp');
const OUT_HTML = path.join(ROOT, 'app.html');
const BACKEND_DESIGN_DIR = '/home/admin/collage/backend/design-system';

/* =============================================================================
   Bundling
   ============================================================================= */
async function bundle() {
  fs.mkdirSync(TMP, { recursive: true });

  // JS bundle (IIFE, minified)
  await esbuild.build({
    entryPoints: [path.join(SRC, 'js', 'main.js')],
    bundle: true,
    format: 'iife',
    outfile: path.join(TMP, 'bundle.js'),
    minify: true,
    target: ['es2019'],
    legalComments: 'none',
  });

  // CSS bundle (imports base + theme css)
  await esbuild.build({
    entryPoints: [path.join(SRC, 'css', 'main.css')],
    bundle: true,
    outfile: path.join(TMP, 'bundle.css'),
    minify: true,
    loader: { '.css': 'css' },
  });

  const js = fs.readFileSync(path.join(TMP, 'bundle.js'), 'utf8');
  const css = fs.readFileSync(path.join(TMP, 'bundle.css'), 'utf8');

  // Read shell + inject
  let html = fs.readFileSync(path.join(SRC, 'index.html'), 'utf8');
  html = html.replace('<!--__CSS__-->', `<style>\n${css}\n</style>`);
  html = html.replace('<!--__JS__-->', `<script>\n${js}\n</script>`);

  return html;
}

/* =============================================================================
   SVG optimization (inline svg in html)
   ============================================================================= */
const SVG_OPTS = {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
          cleanupIds: { remove: true, minify: true },
          removeUselessDefs: true,
          removeEmptyAttrs: true,
          removeEmptyContainers: true,
        },
      },
    },
    { name: 'removeDimensions', active: true },
    { name: 'sortAttrs', active: true },
  ],
};

async function optimizeInlineSvgs(html) {
  const svgRe = /<svg\b[^>]*>[\s\S]*?<\/svg>/g;
  const matches = [...html.matchAll(svgRe)];
  let result = html;
  for (const m of matches) {
    try {
      const optimized = await svgOptimize(m[0], SVG_OPTS);
      if (optimized.data && optimized.data.length < m[0].length) {
        result = result.replace(m[0], optimized.data);
      }
    } catch {
      /* keep original if svgo fails */
    }
  }
  return { result, count: matches.length };
}

/* =============================================================================
   HTML minify
   ============================================================================= */
const HTML_OPTS = {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  removeEmptyAttributes: true,
  useShortDoctype: true,
  minifyCSS: true,
  minifyJS: true,
  minifyURLs: true,
  collapseBooleanAttributes: true,
  decodeEntities: true,
  sortAttributes: true,
  sortClassName: true,
  caseSensitive: true,
  keepClosingSlash: true,
  processConditionalComments: true,
};

/* =============================================================================
   Build
   ============================================================================= */
async function buildAll() {
  const t0 = Date.now();
  console.log('\n  ┌─ collage-design build ─────────────────────');

  // 1. bundle src/ → inline html
  let html = await bundle();
  const bundledBytes = Buffer.byteLength(html, 'utf8');

  // 2. optimize inline svgs
  const { result: svgOut } = await optimizeInlineSvgs(html);
  html = svgOut;

  // 3. minify
  const minified = await htmlMinify(html, HTML_OPTS);
  fs.writeFileSync(OUT_HTML, minified, 'utf8');

  const finalBytes = Buffer.byteLength(minified, 'utf8');
  const ms = Date.now() - t0;
  console.log(`  │ bundled: ${(bundledBytes / 1024).toFixed(1)} KB`);
  console.log(`  │ minified: ${(finalBytes / 1024).toFixed(1)} KB (${Math.round((1 - finalBytes / bundledBytes) * 100)}% saved)`);
  console.log(`  └─ ✓ app.html written in ${ms}ms`);
  console.log();
}

/* =============================================================================
   Method A: copy design-system into production backend
   ============================================================================= */
async function copyToBackend() {
  console.log('\n  ┌─ copy design-system → backend/design-system ──');
  if (!fs.existsSync('/home/admin/collage/backend')) {
    console.log('  └─ ✗ /home/admin/collage/backend not found — skip');
    return;
  }
  fs.mkdirSync(BACKEND_DESIGN_DIR, { recursive: true });
  fs.mkdirSync(path.join(BACKEND_DESIGN_DIR, 'themes'), { recursive: true });

  // copy theme manifests + canvas hooks
  const themeIds = ['rack', 'crt', 'noc', 'min'];
  for (const id of themeIds) {
    const srcDir = path.join(SRC, 'js', 'themes', id);
    const dstDir = path.join(BACKEND_DESIGN_DIR, 'themes', id);
    fs.mkdirSync(dstDir, { recursive: true });
    for (const file of ['manifest.js', 'canvas.js']) {
      const s = path.join(srcDir, file);
      const d = path.join(dstDir, file);
      if (fs.existsSync(s)) fs.copyFileSync(s, d);
    }
    console.log(`  │ themes/${id}/  ✓`);
  }
  // copy engine + overlays (shared)
  for (const rel of ['engine/layout.js', 'core/overlays.js', 'core/canvas-renderer.js']) {
    const s = path.join(SRC, 'js', rel);
    const d = path.join(BACKEND_DESIGN_DIR, rel);
    fs.mkdirSync(path.dirname(d), { recursive: true });
    fs.copyFileSync(s, d);
  }
  console.log('  │ engine + core shared modules ✓');
  console.log(`  └─ ✓ copied → ${BACKEND_DESIGN_DIR}`);
  console.log();
}

/* =============================================================================
   Other commands
   ============================================================================= */
function watch() {
  console.log('\n  👀 watching src/ for changes... (Ctrl+C to stop)');
  let timer = null;
  const watchDirs = [path.join(SRC, 'js'), path.join(SRC, 'css')];
  watchDirs.forEach((dir) => {
    fs.watch(dir, { recursive: true }, () => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        console.log('  → change detected, rebuilding...');
        try { await buildAll(); } catch (e) { console.error(`    ✗ ${e.message}`); }
      }, 150);
    });
  });
}

function serve(port = 8000) {
  const file = fs.existsSync(OUT_HTML) ? OUT_HTML : path.join(SRC, 'index.html');
  console.log(`\n  🌐 serving ${path.basename(file)} on http://localhost:${port}/`);
  http.createServer((req, res) => {
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404); res.end('Not found'); return; }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
  }).listen(port);
}

function clean() {
  for (const p of [path.join(ROOT, '.tmp'), path.join(ROOT, 'dist'), OUT_HTML]) {
    if (fs.existsSync(p)) {
      fs.rmSync(p, { recursive: true, force: true });
      console.log(`  ✓ removed ${path.relative(ROOT, p) || 'app.html'}`);
    }
  }
}

function reportSize() {
  if (!fs.existsSync(OUT_HTML)) {
    console.log('  (app.html not built yet — run npm run build)');
    return;
  }
  const bytes = fs.statSync(OUT_HTML).size;
  console.log(`\n  app.html: ${(bytes / 1024).toFixed(1)} KB (${bytes} bytes)\n`);
}

/* =============================================================================
   Main
   ============================================================================= */
const arg = process.argv[2];
if (arg === '--clean') clean();
else if (arg === '--serve' || arg === '--preview') serve(8000);
else if (arg === '--watch') { buildAll().then(watch); }
else if (arg === '--copy') copyToBackend();
else if (arg === '--size') reportSize();
else buildAll();
