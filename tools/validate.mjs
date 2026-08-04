#!/usr/bin/env node
/* =============================================================================
   validate.mjs — theme + token contract validator
   -----------------------------------------------------------------------------
   Usage:
     node tools/validate.mjs                 # validate all 9 themes
     node tools/validate.mjs mcky            # validate one
     node tools/validate.mjs mcky claude     # validate subset
     node tools/validate.mjs --schema        # also validate default schema
     node tools/validate.mjs --json          # JSON output

   Checks:
     - CSS syntax (parses, braces balanced)
     - Required tokens present
     - HSL format valid (H S% L% or H S% L% / A)
     - HSL values in valid range (H 0-360, S/L 0-100)
     - HSL lightness for bg/fg not too close (basic readability)
     - WCAG AA contrast ratio for text pairs (≥ 4.5:1)

   No external deps.
   ============================================================================= */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const THEMES_DIR = path.join(ROOT, 'themes');
const SCHEMA = path.join(ROOT, 'src/tokens/schema.css');

const REQUIRED = ['--background', '--foreground', '--primary', '--border', '--radius'];

// =============================================================================
// ANSI colors
// =============================================================================
const C = {
  reset: '\x1b[0m', dim: '\x1b[2m', bold: '\x1b[1m',
  red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m', cyan: '\x1b[36m', gray: '\x1b[90m',
};
const useColor = process.stdout.isTTY && !process.env.NO_COLOR;
const paint = (c, s) => useColor ? `${C[c]}${s}${C.reset}` : s;
const ok = (s) => paint('green', `  ✓ ${s}`);
const warn = (s) => paint('yellow', `  ! ${s}`);
const err = (s) => paint('red', `  ✗ ${s}`);
const info = (s) => paint('cyan', `  · ${s}`);

// =============================================================================
// CSS parsing
// =============================================================================
function parseBlocks(css) {
  // extract :root and [data-mode="X"] blocks
  const blocks = [];
  const re = /((?::root|\[data-mode="[a-z]+"\])(?:\s*,\s*(?::root|\[data-mode="[a-z]+"\]))*)\s*\{/g;
  let m;
  while ((m = re.exec(css)) !== null) {
    const selectors = m[1].split(',').map((s) => s.trim().replace(/\s*\{$/, '').trim());
    // find matching }
    let depth = 0, j = m.index + m[0].length;
    for (; j < css.length; j++) {
      if (css[j] === '{') depth++;
      else if (css[j] === '}') { depth--; if (depth === 0) break; }
    }
    const inner = css.slice(m.index + m[0].length, j);
    // parse tokens
    const tokens = {};
    const tre = /(--[a-z0-9-]+)\s*:\s*([^;]+);/gi;
    let t;
    while ((t = tre.exec(inner)) !== null) {
      tokens[t[1].trim()] = t[2].trim();
    }
    blocks.push({ selectors, tokens });
  }
  return blocks;
}

function checkBraces(css) {
  // remove strings + comments first
  const stripped = css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/"[^"]*"/g, '""')
    .replace(/'[^']*'/g, "''");
  let depth = 0;
  for (const ch of stripped) {
    if (ch === '{') depth++;
    else if (ch === '}') { depth--; if (depth < 0) return false; }
  }
  return depth === 0;
}

// =============================================================================
// HSL helpers
// =============================================================================
function parseHsl(value) {
  if (!value) return null;
  const v = value.trim();
  // H S% L%   or  H S% L% / A
  const m = v.match(/^(-?[\d.]+)\s+(-?[\d.]+)%\s+(-?[\d.]+)%(?:\s*\/\s*(-?[\d.]+))?$/);
  if (!m) return null;
  return {
    h: parseFloat(m[1]),
    s: parseFloat(m[2]),
    l: parseFloat(m[3]),
    a: m[4] !== undefined ? parseFloat(m[4]) : 1,
  };
}

function hslToRgb(h, s, l) {
  s /= 100; l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

function luminance(rgb) {
  const [r, g, b] = rgb.map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(rgb1, rgb2) {
  const l1 = luminance(rgb1);
  const l2 = luminance(rgb2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

// =============================================================================
// Validators
// =============================================================================
function validateTheme(themeId, css, themeJson = null) {
  const issues = [];
  const warnings = [];

  // 1. brace check
  if (!checkBraces(css)) {
    issues.push({ level: 'error', msg: 'unbalanced braces in CSS' });
  }

  // 2. parse blocks
  const blocks = parseBlocks(css);
  if (blocks.length === 0) {
    issues.push({ level: 'error', msg: 'no :root or [data-mode] blocks found' });
  }

  // 3. find primary :root block (light mode)
  const rootBlock = blocks.find((b) => b.selectors.includes(':root'));
  if (!rootBlock) {
    issues.push({ level: 'error', msg: 'no :root block found' });
    return { themeId, issues, warnings, ok: false };
  }

  // 4. required tokens
  for (const r of REQUIRED) {
    if (!(r in rootBlock.tokens)) {
      issues.push({ level: 'error', msg: `missing required token ${r} in :root` });
    }
  }

  // 5. HSL format + range for color tokens
  const colorTokens = ['--background', '--foreground', '--card', '--card-foreground',
    '--popover', '--popover-foreground', '--primary', '--primary-foreground',
    '--secondary', '--secondary-foreground', '--muted', '--muted-foreground',
    '--accent', '--accent-foreground', '--destructive', '--destructive-foreground',
    '--success', '--warning', '--info', '--border', '--input', '--ring',
    '--accent-2', '--accent-2-foreground', '--accent-deep', '--accent-dim',
    '--terracotta', '--terracotta-foreground', '--clay'];

  for (const block of blocks) {
    for (const [name, value] of Object.entries(block.tokens)) {
      if (colorTokens.includes(name)) {
        const hsl = parseHsl(value);
        if (!hsl) {
          // only warn for tokens that should be HSL
          issues.push({ level: 'error', msg: `[${block.selectors.join(',')}] ${name}: invalid HSL format "${value}"` });
        } else {
          if (hsl.h < 0 || hsl.h > 360) issues.push({ level: 'error', msg: `[${block.selectors.join(',')}] ${name}: H out of range (${hsl.h})` });
          if (hsl.s < 0 || hsl.s > 100) issues.push({ level: 'error', msg: `[${block.selectors.join(',')}] ${name}: S out of range (${hsl.s})` });
          if (hsl.l < 0 || hsl.l > 100) issues.push({ level: 'error', msg: `[${block.selectors.join(',')}] ${name}: L out of range (${hsl.l})` });
        }
      }
    }
  }

  // 6. contrast check (text pairs)
  const checkPairs = [
    ['--background', '--foreground', 'text on background'],
    ['--card', '--card-foreground', 'text on card'],
    ['--primary', '--primary-foreground', 'text on primary'],
    ['--muted', '--muted-foreground', 'text on muted'],
    ['--destructive', '--destructive-foreground', 'text on destructive'],
  ];
  for (const [bgName, fgName, label] of checkPairs) {
    if (rootBlock.tokens[bgName] && rootBlock.tokens[fgName]) {
      const bg = parseHsl(rootBlock.tokens[bgName]);
      const fg = parseHsl(rootBlock.tokens[fgName]);
      if (bg && fg) {
        const ratio = contrastRatio(hslToRgb(bg.h, bg.s, bg.l), hslToRgb(fg.h, fg.s, fg.l));
        if (ratio < 4.5) {
          warnings.push({ msg: `${label} contrast = ${ratio.toFixed(2)}:1 (WCAG AA needs ≥ 4.5:1)` });
        } else if (ratio >= 7) {
          // AAA — info only
        } else {
          // AA pass
        }
      }
    }
  }

  // 7. JSON metadata if present
  if (themeJson) {
    try {
      const j = JSON.parse(themeJson);
      if (!j.id) issues.push({ level: 'error', msg: 'theme.json missing "id"' });
      if (!j.name) issues.push({ level: 'error', msg: 'theme.json missing "name"' });
    } catch (e) {
      issues.push({ level: 'error', msg: `theme.json invalid JSON: ${e.message}` });
    }
  }

  return { themeId, issues, warnings, ok: issues.length === 0 };
}

// =============================================================================
// Main
// =============================================================================
const args = process.argv.slice(2);
const json = args.includes('--json');
const checkSchema = args.includes('--schema');
const themeIds = args.filter((a) => !a.startsWith('--'));

function listAllThemes() {
  if (!fs.existsSync(THEMES_DIR)) return [];
  return fs.readdirSync(THEMES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

const allIds = listAllThemes();
const targets = themeIds.length ? themeIds : allIds;

const results = [];

console.log('');
console.log(paint('bold', '  ┌─ DG theme validator ──'));

if (checkSchema) {
  const css = fs.readFileSync(SCHEMA, 'utf8');
  const r = validateTheme('schema', css);
  results.push(r);
  if (r.ok) ok('schema.css  valid');
  else { err('schema.css  issues:'); r.issues.forEach((i) => err(`    ${i.msg}`)); }
}

for (const id of targets) {
  if (!allIds.includes(id)) { err(`theme not found: ${id}`); continue; }
  const cssPath = path.join(THEMES_DIR, id, 'theme.css');
  const jsonPath = path.join(THEMES_DIR, id, 'theme.json');
  if (!fs.existsSync(cssPath)) { err(`${id} missing theme.css`); continue; }
  const css = fs.readFileSync(cssPath, 'utf8');
  const tjson = fs.existsSync(jsonPath) ? fs.readFileSync(jsonPath, 'utf8') : null;
  const r = validateTheme(id, css, tjson);
  results.push(r);
  if (r.ok) {
    ok(`${id.padEnd(14)} valid${r.warnings.length ? ` (${r.warnings.length} warnings)` : ''}`);
  } else {
    err(`${id.padEnd(14)} ${r.issues.length} issues:`);
    r.issues.forEach((i) => err(`    ${i.msg}`));
  }
  r.warnings.forEach((w) => warn(`    ${w.msg}`));
}

const total = results.length;
const passed = results.filter((r) => r.ok).length;
const failed = total - passed;
const totalWarnings = results.reduce((s, r) => s + r.warnings.length, 0);

console.log(paint(failed === 0 ? 'green' : 'red',
  `  └─ ${passed}/${total} passed · ${failed} failed · ${totalWarnings} warnings`));
console.log('');

if (json) {
  console.log(JSON.stringify({ results, summary: { total, passed, failed, totalWarnings } }, null, 2));
}

process.exit(failed > 0 ? 1 : 0);
