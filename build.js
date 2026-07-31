/* =============================================================================
   build.js — Design Gallery tooling
   -----------------------------------------------------------------------------
   Zero-dependency tool — ใช้ node builtins เท่านั้น (ไม่ต้อง npm install).

   Commands:
     npm run check  → syntax-check ทุก source module ใน src/js
   ============================================================================= */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, 'src');

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
  walk(SRC);
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
else console.log('usage: npm run check   (syntax-check src/js modules)');
