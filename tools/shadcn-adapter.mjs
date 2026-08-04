#!/usr/bin/env node
/* =============================================================================
   shadcn-adapter.mjs — convert 9 DG themes → shadcn v4 format
   -----------------------------------------------------------------------------
   Reads the canonical THEMES map (shared with codegen.mjs) and emits
   themes/shadcn/<id>.css — a drop-in shadcn v4 theme preset:

     - :root { }        light values  (hsl() wrapped)
     - .dark { }        dark values   (dual-mode themes only)
     - :root, .dark { } single-mode themes (dark-only or light-only)

   Also emits themes/shadcn/_base.css — the one-time @theme inline mapping
   block that binds shadcn Tailwind tokens (--color-*) to our CSS vars.

   Usage:
     node tools/shadcn-adapter.mjs            # generate all 9
     node tools/shadcn-adapter.mjs mcky       # generate one
     node tools/shadcn-adapter.mjs --check    # verify output only
   ============================================================================= */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { THEMES } from './codegen.mjs';
import { extractHex } from './hex-source.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'themes', 'shadcn');

// =============================================================================
// Color detection — values that need hsl() wrapping
//   "50 100% 71%"           → "hsl(50 100% 71%)"
//   "60 7% 7% / 0.12"       → "hsl(60 7% 7% / 0.12)"
// =============================================================================
const HSL_RE = /^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%(\s*\/\s*[\d.]+)?$/;

// =============================================================================
// @theme inline block (shared, one-time setup)
// =============================================================================
const THEME_INLINE = `/* ============================================================================
   _base.css — one-time shadcn v4 setup (theme-agnostic)
   ----------------------------------------------------------------------------
   Add this to your globals.css AFTER "import tailwindcss".
   It binds Tailwind tokens (--color-*) to our CSS variables so components
   can use bg-primary / text-muted-foreground / etc.
   ========================================================================== */

@theme inline {
  /* radius scale derived from --radius */
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);

  /* core surface + brand */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  /* status (extra — not in default shadcn, optional) */
  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-info: var(--info);
  --color-accent-2: var(--accent-2);
}
`;

// =============================================================================
// Generator
// =============================================================================
const COLOR_TOKENS = new Set([
  '--background', '--foreground', '--card', '--card-foreground',
  '--popover', '--popover-foreground',
  '--primary', '--primary-foreground',
  '--secondary', '--secondary-foreground',
  '--muted', '--muted-foreground',
  '--accent', '--accent-foreground',
  '--destructive', '--destructive-foreground',
  '--success', '--warning', '--info',
  '--border', '--input', '--ring',
  '--accent-2', '--accent-deep', '--accent-dim',
  '--terracotta', '--terracotta-foreground', '--clay',
]);

// hex map: { slot: '#rrggbb' } — exact brand colors from concepts/<id>.css
const HEX = extractHex;
const hexCache = {};

function getHex(themeId, mode) {
  const key = `${themeId}:${mode}`;
  if (!(key in hexCache)) {
    const h = extractHex(themeId);
    hexCache[key] = h ? h[mode] : null;
  }
  return hexCache[key];
}

/**
 * Emit a token value for shadcn:
 * - color tokens: prefer EXACT original hex (precision fix), fallback hsl()
 * - non-colors (radius/border-width/fonts/shadows): pass through
 */
function toShadcnValue(token, value, themeId, mode) {
  if (COLOR_TOKENS.has(token)) {
    const hexMap = getHex(themeId, mode);
    const hex = hexMap && hexMap[token];
    if (hex) return hex; // exact brand color — no rounding loss
    let v = String(value).trim();
    v = v.replace(/hsl\(\s*var\((--[\w-]+)\)\s*\)/g, 'var($1)');
    return HSL_RE.test(v) ? `hsl(${v})` : v;
  }
  return String(value).trim(); // non-colors pass through
}

function formatBlock(tokens, filter = null, themeId = null, mode = 'light') {
  const keys = Object.keys(tokens).filter((k) => !filter || filter.includes(k));
  keys.sort();
  return keys
    .map((k) => `  ${k.padEnd(28, ' ')}: ${toShadcnValue(k, tokens[k], themeId, mode)};`)
    .join('\n');
}

function generateShadcn(themeId) {
  const theme = THEMES[themeId];
  if (!theme) throw new Error(`unknown theme: ${themeId}`);
  const { meta, light, dark, single } = theme;

  const header = `/* ============================================================================
   ${meta.name} — shadcn v4 theme preset (id: ${themeId})
   generated by tools/shadcn-adapter.mjs (Track A)
   ----------------------------------------------------------------------------
   HOW TO USE in a shadcn v4 project (React + Radix + Tailwind v4):
   1. One-time: add themes/shadcn/_base.css mapping into your globals.css
      (the @theme inline block — identical for every theme).
   2. Paste the :root / .dark blocks below into globals.css, replacing the
      existing :root/.dark variable definitions.
   3. For dark-only themes the values sit in ":root, .dark" so the theme is
      dark regardless of the .dark class. For dual-mode themes, toggle
      <html class="dark"> to switch.
   ========================================================================== */

`;

  let body;

  if (single === 'dark' || single === 'light') {
    // single mode: same values everywhere (hex from light map)
    body = `:root, .dark {\n${formatBlock(light, null, themeId, 'light')}\n}`;
    if (single === 'light') {
      body += `\n\n/* light-only theme — .dark inherits :root (stays light) */`;
    }
  } else if (dark) {
    // dual mode: light in :root (hex light), dark in .dark (hex dark)
    body = `:root {\n${formatBlock(light, null, themeId, 'light')}\n}\n\n.dark {\n${formatBlock(dark, null, themeId, 'dark')}\n}`;
  } else {
    body = `:root {\n${formatBlock(light, null, themeId, 'light')}\n}`;
  }

  return header + body + '\n';
}

// =============================================================================
// Main
// =============================================================================
const args = process.argv.slice(2);
const checkOnly = args.includes('--check');
const ids = args.filter((a) => !a.startsWith('--'));
const validIds = Object.keys(THEMES);
const targets = ids.length ? ids : validIds;

for (const id of targets) {
  if (!validIds.includes(id)) { console.error(`✗ unknown theme: ${id}`); process.exitCode = 1; continue; }
  const css = generateShadcn(id);
  if (!checkOnly) {
    fs.mkdirSync(OUT, { recursive: true });
    fs.writeFileSync(path.join(OUT, `${id}.css`), css);
    console.log(`  ✓ ${id.padEnd(12)} → themes/shadcn/${id}.css (${css.split('\n').length} lines)`);
  } else {
    console.log(`  ✓ ${id.padEnd(12)} valid (${css.split('\n').length} lines)`);
  }
}

if (!checkOnly) {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, '_base.css'), THEME_INLINE);
  console.log('  ✓ _base.css (shared @theme inline mapping)');
}
