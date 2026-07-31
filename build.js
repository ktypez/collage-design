/* =============================================================================
   build.js — Design Gallery build tool
   -----------------------------------------------------------------------------
   This repo is a CENTRAL DESIGN LIBRARY. The main build action syncs the
   design-system (theme manifests + sharp-renderer + fonts) into production
   so the gallery is the single source of truth.

   Commands:
     npm run build         → alias of copy:backend (default action)
     npm run copy:backend  → sync design-system → /home/admin/collage/backend/
     npm run check         → syntax-check all source modules
   ============================================================================= */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const BACKEND_DESIGN_DIR = '/home/admin/collage/backend/design-system';

const THEME_IDS = ['rack', 'crt', 'noc', 'min'];

/* =============================================================================
   copy:backend — sync the design-system into the production backend
   ============================================================================= */
function copyToBackend() {
  console.log('\n  ┌─ design-gallery → backend/design-system ──');
  if (!fs.existsSync('/home/admin/collage/backend')) {
    console.log('  └─ ✗ /home/admin/collage/backend not found — skip');
    process.exit(1);
  }
  fs.mkdirSync(BACKEND_DESIGN_DIR, { recursive: true });
  fs.mkdirSync(path.join(BACKEND_DESIGN_DIR, 'themes'), { recursive: true });
  fs.mkdirSync(path.join(BACKEND_DESIGN_DIR, 'fonts'), { recursive: true });

  // 1. theme manifests + canvas hooks
  for (const id of THEME_IDS) {
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

  // 2. engine + core (incl. sharp-renderer)
  for (const rel of ['engine/layout.js', 'core/overlays.js', 'core/canvas-renderer.js', 'core/sharp-renderer.js']) {
    const s = path.join(SRC, 'js', rel);
    const d = path.join(BACKEND_DESIGN_DIR, rel);
    if (fs.existsSync(s)) {
      fs.mkdirSync(path.dirname(d), { recursive: true });
      fs.copyFileSync(s, d);
    }
  }
  console.log('  │ engine + core shared modules ✓');

  // 3. fonts (mono + display for sharp text rendering)
  for (const f of ['JetBrainsMono-Regular.ttf', 'VT323-Regular.ttf']) {
    const s = path.join(SRC, 'assets', 'fonts', f);
    const d = path.join(BACKEND_DESIGN_DIR, 'fonts', f);
    if (fs.existsSync(s)) fs.copyFileSync(s, d);
  }
  console.log('  │ fonts (JetBrainsMono + VT323) ✓');
  console.log(`  └─ ✓ synced → ${BACKEND_DESIGN_DIR}`);
  console.log();
}

/* =============================================================================
   check — syntax-check all source modules
   ============================================================================= */
function check() {
  console.log('\n  ┌─ design-gallery source check ──');
  const files = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.js')) files.push(p);
    }
  };
  walk(path.join(SRC, 'js'));
  let bad = 0;
  for (const f of files) {
    try {
      execFileSync(process.execPath, ['--check', f], { stdio: 'pipe' });
      console.log(`  │ ✓ ${path.relative(SRC, f)}`);
    } catch (e) {
      const msg = String(e.stderr || e.message || '').split('\n').find((l) => l.includes('Error')) || e.message;
      console.log(`  │ ✗ ${path.relative(SRC, f)}: ${msg}`);
      bad++;
    }
  }
  console.log(bad === 0 ? `  └─ ✓ all ${files.length} modules OK` : `  └─ ✗ ${bad} broken`);
  console.log();
}

/* =============================================================================
   Main
   ============================================================================= */
const arg = process.argv[2];
if (arg === '--check') check();
else copyToBackend(); // default = copy:backend (single source of truth → production)
