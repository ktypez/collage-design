/* =============================================================================
   build.js — Collage Design asset optimizer
   -----------------------------------------------------------------------------
   - Minifies HTML + inline CSS + inline JS for all preview/*.html
   - Optimizes inline SVGs with svgo
   - Reports before/after sizes
   - Outputs to ./dist/
   - Optional: --watch (rebuild on change), --serve (http server on dist),
              --clean (rm dist), --size (just report sizes)
   ============================================================================= */

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { minify as htmlMinify } from 'html-minifier-terser';
import { optimize as svgOptimize } from 'svgo';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const SOURCES = [
  'preview.html',
  'preview-rack.html',
  'preview-crt.html',
  'preview-noc.html',
  'preview-minimal.html',
  'preview-themes.html',
  'app.html',
];

// =============================================================================
// html-minifier-terser config — aggressive but safe
// =============================================================================
const HTML_OPTS = {
  collapseWhitespace: true,
  conservativeCollapse: false,
  preserveLineBreaks: false,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  removeEmptyAttributes: true,
  removeOptionalTags: true,
  removeAttributeQuotes: false,         // keep quotes — safer for some browsers
  useShortDoctype: true,
  minifyCSS: true,
  minifyJS: true,
  minifyURLs: true,
  collapseBooleanAttributes: true,
  decodeEntities: true,
  sortAttributes: true,
  sortClassName: true,
  // Don't touch these — would break functionality
  caseSensitive: true,
  keepClosingSlash: true,
  processConditionalComments: true,
};

// =============================================================================
// svgo config — keep visual fidelity, remove cruft
// =============================================================================
const SVG_OPTS = {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // Keep viewBox (we rely on it)
          removeViewBox: false,
          // Aggressive: remove useless defs, metadata, etc.
          cleanupIds: { remove: true, minify: true },
          removeUselessDefs: true,
          removeEmptyAttrs: true,
          removeEmptyContainers: true,
          removeUnknownsAndDefaults: true,
        },
      },
    },
    // Remove inline width/height — let CSS handle sizing (must be after preset)
    { name: 'removeDimensions', active: true },
    { name: 'sortAttrs', active: true },
  ],
};

// =============================================================================
// Inline SVG optimizer — finds <svg>...</svg> blocks in HTML and runs svgo
// =============================================================================
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
    } catch (e) {
      // Skip if svgo can't parse — better to leave original than break
      console.warn(`  ⚠ svg optimize failed: ${e.message?.slice(0, 60)}`);
    }
  }
  return { result, count: matches.length };
}

// =============================================================================
// Minify one file
// =============================================================================
async function buildFile(name) {
  const srcPath = path.join(ROOT, name);
  const outPath = path.join(DIST, name);

  const src = fs.readFileSync(srcPath, 'utf8');
  const beforeSize = Buffer.byteLength(src, 'utf8');

  // 1. Optimize inline SVGs first (preserves them in minified HTML)
  const { result: htmlWithOptimizedSvgs, count: svgCount } = await optimizeInlineSvgs(src);

  // 2. Minify HTML (which includes minifying inline CSS + JS)
  const minified = await htmlMinify(htmlWithOptimizedSvgs, HTML_OPTS);

  // 3. Write to dist
  fs.mkdirSync(DIST, { recursive: true });
  fs.writeFileSync(outPath, minified, 'utf8');

  const afterSize = Buffer.byteLength(minified, 'utf8');
  const saved = beforeSize - afterSize;
  const pct = ((saved / beforeSize) * 100).toFixed(1);

  return { name, beforeSize, afterSize, saved, pct, svgCount };
}

// =============================================================================
// Size-only report (no write)
// =============================================================================
async function reportSizes() {
  console.log('\n  File                          Original     Minified     Saved');
  console.log('  ' + '─'.repeat(64));
  let totalBefore = 0, totalAfter = 0;
  for (const name of SOURCES) {
    const src = fs.readFileSync(path.join(ROOT, name), 'utf8');
    const before = Buffer.byteLength(src, 'utf8');
    const { result: pre } = await optimizeInlineSvgs(src);
    const after = Buffer.byteLength(await htmlMinify(pre, HTML_OPTS), 'utf8');
    totalBefore += before;
    totalAfter += after;
    const saved = before - after;
    const pct = ((saved / before) * 100).toFixed(1);
    console.log(
      `  ${name.padEnd(30)} ${String(before).padStart(8)}b  ${String(after).padStart(8)}b  ${pct.padStart(5)}%`
    );
  }
  console.log('  ' + '─'.repeat(64));
  const totalSaved = totalBefore - totalAfter;
  const totalPct = ((totalSaved / totalBefore) * 100).toFixed(1);
  console.log(
    `  ${'TOTAL'.padEnd(30)} ${String(totalBefore).padStart(8)}b  ${String(totalAfter).padStart(8)}b  ${totalPct.padStart(5)}%`
  );
  console.log();
}

// =============================================================================
// Build all files
// =============================================================================
async function buildAll() {
  const t0 = Date.now();
  console.log('\n  ┌─ collage-design build ─────────────────────');
  const results = [];
  for (const name of SOURCES) {
    const r = await buildFile(name);
    results.push(r);
    console.log(
      `  │ ${r.name.padEnd(28)} ${String(r.beforeSize).padStart(7)}b → ${String(r.afterSize).padStart(7)}b  (${r.pct}% saved, ${r.svgCount} svg)`
    );
  }
  const total = results.reduce((a, r) => a + r.beforeSize, 0);
  const totalAfter = results.reduce((a, r) => a + r.afterSize, 0);
  const totalPct = (((total - totalAfter) / total) * 100).toFixed(1);
  const ms = Date.now() - t0;
  console.log(`  │`);
  console.log(`  │ ${'TOTAL'.padEnd(28)} ${String(total).padStart(7)}b → ${String(totalAfter).padStart(7)}b  (${totalPct}% saved)`);
  console.log(`  └─ ✓ built ${results.length} files in ${ms}ms → ./dist/`);
  console.log();
}

// =============================================================================
// Watch mode
// =============================================================================
function watch() {
  console.log('\n  👀 watching for changes... (Ctrl+C to stop)');
  let timer = null;
  for (const name of SOURCES) {
    fs.watch(path.join(ROOT, name), () => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        console.log(`\n  → ${name} changed, rebuilding...`);
        try {
          const r = await buildFile(name);
          console.log(`    ${r.name}: ${r.beforeSize}b → ${r.afterSize}b (${r.pct}% saved)`);
        } catch (e) {
          console.error(`    ✗ ${e.message}`);
        }
      }, 100);
    });
  }
}

// =============================================================================
// Dev server
// =============================================================================
function serve(port = 8000) {
  // Serve from dist if exists, else from root
  const root = fs.existsSync(DIST) ? DIST : ROOT;
  console.log(`\n  🌐 serving from ${path.relative(ROOT, root) || 'root'}/ on http://localhost:${port}/`);
  console.log(`     (open http://localhost:${port}/preview.html)`);
  const server = http.createServer((req, res) => {
    let url = req.url.split('?')[0];
    if (url === '/') url = '/preview.html';
    const filePath = path.join(root, url);
    if (!filePath.startsWith(root)) { res.writeHead(403); res.end(); return; }
    fs.readFile(filePath, (err, data) => {
      if (err) { res.writeHead(404); res.end('Not found'); return; }
      const ext = path.extname(filePath);
      const ct = {
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.svg': 'image/svg+xml',
        '.json': 'application/json',
        '.md': 'text/markdown',
      }[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': ct });
      res.end(data);
    });
  });
  server.listen(port);
}

// =============================================================================
// Main
// =============================================================================
const arg = process.argv[2];

if (arg === '--clean') {
  if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true });
    console.log('  ✓ ./dist/ cleaned');
  } else {
    console.log('  (nothing to clean)');
  }
} else if (arg === '--size') {
  await reportSizes();
} else if (arg === '--watch') {
  await buildAll();
  watch();
} else if (arg === '--serve' || arg === '--preview') {
  serve(8000);
} else {
  await buildAll();
}
