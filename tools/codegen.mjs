#!/usr/bin/env node
/* =============================================================================
   codegen.mjs — generate themes/<id>/theme.css from canonical mapping
   -----------------------------------------------------------------------------
   Source of truth: tools/map.md (9-concept mapping)
   Output:          themes/<id>/{theme.css, theme.json}

   Usage:
     node tools/codegen.mjs                 # generate all 9
     node tools/codegen.mjs mcky            # generate one
     node tools/codegen.mjs mcky claude     # generate subset

   No external deps. Pure data → file generation.
   ============================================================================= */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const THEMES_DIR = path.join(ROOT, 'themes');

// =============================================================================
// THEME DEFINITIONS — derived from tools/map.md
// Each theme: { id, meta, light, dark?, single? }
// - `light` and `dark` are maps of token-name → HSL/value
// - If no `dark`, theme is light-only
// - If `single: 'dark'`, same values applied in both :root and [data-mode="dark"]
// - If `single: 'light'`, same values applied in :root and [data-mode="dark"]
// =============================================================================

export const THEMES = {

  mcky: {
    meta: {
      name: 'mcky.space',
      vibe: 'neobrutalism — 3px border, hard shadow, mono 100%',
      dot: '#ffe066',
      modes: 'dual',
    },
    light: {
      '--background': '60 17% 95%',
      '--foreground': '0 0% 0%',
      '--card': '0 0% 100%',
      '--card-foreground': '0 0% 0%',
      '--popover': '0 0% 100%',
      '--popover-foreground': '0 0% 0%',
      '--muted': '60 17% 91%',
      '--muted-foreground': '0 0% 20%',
      '--primary': '50 100% 71%',
      '--primary-foreground': '0 0% 0%',
      '--secondary': '60 17% 91%',
      '--secondary-foreground': '0 0% 0%',
      '--accent': '50 100% 71%',
      '--accent-foreground': '0 0% 0%',
      '--destructive': '0 100% 71%',
      '--destructive-foreground': '0 0% 0%',
      '--success': '161 95% 43%',
      '--warning': '27 100% 63%',
      '--info': '228 81% 60%',
      '--border': '0 0% 0%',
      '--input': '0 0% 0%',
      '--ring': '0 0% 0%',
      '--radius': '0.375rem',
      '--border-width': '3px',
      '--shadow': '4px 4px 0 hsl(var(--border))',
      '--shadow-md': '4px 4px 0 hsl(var(--border))',
      '--shadow-lg': '4px 4px 0 hsl(var(--border))',
      '--accent-deep': '47 100% 42%',
      '--accent-2': '176 100% 41%',
      '--font-sans': "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace",
      '--font-mono': "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace",
      '--font-serif': "'JetBrains Mono', ui-monospace, monospace",
      '--font-display': "'JetBrains Mono', ui-monospace, monospace",
    },
    dark: {
      '--background': '0 0% 4%',
      '--foreground': '0 0% 88%',
      '--card': '0 0% 8%',
      '--card-foreground': '0 0% 88%',
      '--popover': '0 0% 8%',
      '--popover-foreground': '0 0% 88%',
      '--muted': '0 0% 12%',
      '--muted-foreground': '0 0% 63%',
      '--primary': '50 100% 71%',
      '--primary-foreground': '0 0% 0%',
      '--secondary': '0 0% 12%',
      '--secondary-foreground': '0 0% 88%',
      '--accent': '50 100% 71%',
      '--accent-foreground': '0 0% 0%',
      '--destructive': '0 100% 71%',
      '--destructive-foreground': '0 0% 0%',
      '--border': '0 0% 53%',
      '--input': '0 0% 53%',
      '--ring': '50 100% 71%',
      '--accent-deep': '50 100% 71%',
    },
  },

  rack: {
    meta: { name: 'STACK//FRAME', vibe: 'server rack, brushed metal, amber LED', dot: '#ffb000', modes: 'dark' },
    single: 'dark',
    light: {
      '--background': '240 8% 4%',
      '--foreground': '240 7% 96%',
      '--card': '240 9% 9%',
      '--card-foreground': '240 7% 96%',
      '--popover': '240 9% 9%',
      '--popover-foreground': '240 7% 96%',
      '--muted': '240 9% 7%',
      '--muted-foreground': '240 5% 56%',
      '--primary': '40 100% 50%',
      '--primary-foreground': '240 8% 4%',
      '--secondary': '240 9% 7%',
      '--secondary-foreground': '240 7% 96%',
      '--accent': '40 100% 50%',
      '--accent-foreground': '240 8% 4%',
      '--destructive': '4 100% 59%',
      '--destructive-foreground': '240 7% 96%',
      '--success': '145 100% 50%',
      '--warning': '40 100% 50%',
      '--info': '190 100% 50%',
      '--border': '240 8% 18%',
      '--input': '240 8% 18%',
      '--ring': '240 8% 24%',
      '--radius': '0',
      '--border-width': '1px',
      '--shadow': 'none',
      '--shadow-md': 'none',
      '--shadow-lg': 'none',
      '--accent-2': '145 100% 50%',
      '--font-sans': "'Inter', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', ui-monospace, monospace",
    },
  },

  crt: {
    meta: { name: 'PIXSH v1.0', vibe: 'retro CRT, phosphor green, scanlines', dot: '#4af626', modes: 'dark' },
    single: 'dark',
    light: {
      '--background': '60 17% 2%',
      '--foreground': '105 32% 78%',
      '--card': '60 13% 5%',
      '--card-foreground': '105 32% 78%',
      '--popover': '60 13% 5%',
      '--popover-foreground': '105 32% 78%',
      '--muted': '60 14% 7%',
      '--muted-foreground': '110 12% 51%',
      '--primary': '110 92% 56%',
      '--primary-foreground': '60 17% 2%',
      '--secondary': '60 14% 7%',
      '--secondary-foreground': '105 32% 78%',
      '--accent': '110 92% 56%',
      '--accent-foreground': '60 17% 2%',
      '--destructive': '0 79% 69%',
      '--destructive-foreground': '60 17% 2%',
      '--border': '120 21% 19%',
      '--input': '120 21% 19%',
      '--ring': '120 21% 30%',
      '--radius': '0',
      '--border-width': '1px',
      '--shadow': 'none',
      '--shadow-md': 'none',
      '--shadow-lg': 'none',
      '--accent-dim': '117 73% 37%',
      '--font-sans': "'VT323', 'Inter', sans-serif",
      '--font-mono': "'VT323', 'JetBrains Mono', ui-monospace, monospace",
    },
  },

  noc: {
    meta: { name: 'PACKETGRID', vibe: 'NOC dashboard, dark slate, cyan + green', dot: '#35f0c8', modes: 'dark' },
    single: 'dark',
    light: {
      '--background': '207 29% 5%',
      '--foreground': '207 38% 90%',
      '--card': '206 28% 9%',
      '--card-foreground': '207 38% 90%',
      '--popover': '206 28% 9%',
      '--popover-foreground': '207 38% 90%',
      '--muted': '207 28% 11%',
      '--muted-foreground': '209 16% 56%',
      '--primary': '169 86% 57%',
      '--primary-foreground': '207 29% 5%',
      '--secondary': '207 28% 11%',
      '--secondary-foreground': '207 38% 90%',
      '--accent': '169 86% 57%',
      '--accent-foreground': '207 29% 5%',
      '--destructive': '0 79% 69%',
      '--destructive-foreground': '207 38% 90%',
      '--success': '152 67% 55%',
      '--warning': '38 92% 50%',
      '--info': '190 100% 50%',
      '--border': '207 27% 16%',
      '--input': '207 27% 16%',
      '--ring': '209 27% 23%',
      '--radius': '0',
      '--border-width': '1px',
      '--shadow': 'none',
      '--shadow-md': 'none',
      '--shadow-lg': 'none',
      '--accent-2': '190 100% 50%',
      '--font-sans': "'Inter', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', ui-monospace, monospace",
    },
  },

  min: {
    meta: { name: 'collage.sh', vibe: 'minimal geek, lime accent', dot: '#7a9a01', modes: 'light' },
    single: 'light',
    light: {
      '--background': '60 9% 96%',
      '--foreground': '80 13% 10%',
      '--card': '0 0% 100%',
      '--card-foreground': '80 13% 10%',
      '--popover': '0 0% 100%',
      '--popover-foreground': '80 13% 10%',
      '--muted': '75 8% 93%',
      '--muted-foreground': '90 6% 36%',
      '--primary': '73 98% 19%',
      '--primary-foreground': '60 9% 96%',
      '--secondary': '75 8% 93%',
      '--secondary-foreground': '80 13% 10%',
      '--accent': '73 98% 19%',
      '--accent-foreground': '60 9% 96%',
      '--destructive': '7 63% 49%',
      '--destructive-foreground': '0 0% 100%',
      '--border': '90 9% 88%',
      '--input': '90 9% 88%',
      '--ring': '90 9% 81%',
      '--radius': '0',
      '--border-width': '1px',
      '--shadow': 'none',
      '--shadow-md': 'none',
      '--shadow-lg': 'none',
      '--accent-2': '65 65% 49%',
      '--font-sans': "'Inter', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', ui-monospace, monospace",
    },
  },

  glitchpage: {
    meta: { name: 'GLITCHPAGE', vibe: 'error page — dark navy, neon pink, Thai copy', dot: '#ff3d8f', modes: 'dark' },
    single: 'dark',
    light: {
      '--background': '230 53% 10%',
      '--foreground': '234 79% 95%',
      '--card': '233 53% 16%',
      '--card-foreground': '234 79% 95%',
      '--popover': '233 53% 16%',
      '--popover-foreground': '234 79% 95%',
      '--muted': '232 53% 20%',
      '--muted-foreground': '232 36% 68%',
      '--primary': '333 100% 62%',
      '--primary-foreground': '230 53% 10%',
      '--secondary': '232 53% 20%',
      '--secondary-foreground': '234 79% 95%',
      '--accent': '333 100% 62%',
      '--accent-foreground': '230 53% 10%',
      '--destructive': '351 100% 62%',
      '--destructive-foreground': '230 53% 10%',
      '--info': '187 100% 61%',
      '--border': '232 38% 25%',
      '--input': '232 38% 25%',
      '--ring': '230 42% 35%',
      '--radius': '0',
      '--border-width': '1px',
      '--shadow': 'none',
      '--shadow-md': 'none',
      '--shadow-lg': 'none',
      '--accent-2': '187 100% 61%',
      '--font-sans': "'Sarabun', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', ui-monospace, monospace",
      '--font-display': "'Kanit', sans-serif",
    },
  },

  claude: {
    meta: { name: 'CLAUDE PAPER', vibe: 'warm editorial — clay accent, paper surfaces, serif', dot: '#d97757', modes: 'dual' },
    light: {
      '--background': '60 25% 98%',
      '--foreground': '60 7% 7%',
      '--card': '0 0% 100%',
      '--card-foreground': '60 7% 7%',
      '--popover': '0 0% 100%',
      '--popover-foreground': '60 7% 7%',
      '--muted': '56 27% 95%',
      '--muted-foreground': '60 4% 23%',
      '--primary': '14 64% 60%',
      '--primary-foreground': '60 25% 98%',
      '--secondary': '56 27% 95%',
      '--secondary-foreground': '60 7% 7%',
      '--accent': '14 64% 60%',
      '--accent-foreground': '60 25% 98%',
      '--destructive': '5 58% 43%',
      '--destructive-foreground': '60 25% 98%',
      '--success': '141 32% 36%',
      '--warning': '41 100% 31%',
      '--info': '210 43% 38%',
      '--border': '60 7% 7% / 0.12',
      '--input': '60 7% 7% / 0.12',
      '--ring': '60 7% 7% / 0.22',
      '--radius': '0.75rem',
      '--border-width': '1px',
      '--shadow': '0 1px 2px hsl(60 7% 7% / 0.05), 0 8px 24px -18px hsl(60 7% 7% / 0.18)',
      '--shadow-md': '0 1px 2px hsl(60 7% 7% / 0.05), 0 8px 24px -18px hsl(60 7% 7% / 0.18)',
      '--shadow-lg': '0 4px 12px hsl(60 7% 7% / 0.1), 0 24px 48px -24px hsl(60 7% 7% / 0.25)',
      '--accent-deep': '14 47% 49%',
      '--font-sans': "'Source Serif 4', 'Source Han Serif SC', Georgia, serif",
      '--font-mono': "ui-monospace, 'SF Mono', monospace",
      '--font-serif': "'Source Serif 4', 'Source Han Serif SC', Georgia, serif",
      '--font-display': "'Source Serif 4', Georgia, serif",
    },
    dark: {
      '--background': '60 3% 18%',
      '--foreground': '60 25% 98%',
      '--card': '60 3% 21%',
      '--card-foreground': '60 25% 98%',
      '--popover': '60 3% 21%',
      '--popover-foreground': '60 25% 98%',
      '--muted': '60 4% 14%',
      '--muted-foreground': '60 4% 78%',
      '--primary': '14 64% 60%',
      '--primary-foreground': '60 3% 18%',
      '--secondary': '60 4% 14%',
      '--secondary-foreground': '60 25% 98%',
      '--accent': '14 64% 60%',
      '--accent-foreground': '60 3% 18%',
      '--destructive': '5 58% 43%',
      '--destructive-foreground': '60 25% 98%',
      '--border': '60 25% 98% / 0.14',
      '--input': '60 25% 98% / 0.14',
      '--ring': '60 25% 98% / 0.24',
    },
  },

  moss: {
    meta: { name: 'MOSS', vibe: 'organic — earth palette, blob shapes, Fraunces', dot: '#6a8c3f', modes: 'light' },
    single: 'light',
    light: {
      '--background': '43 38% 94%',
      '--foreground': '38 14% 16%',
      '--card': '48 53% 98%',
      '--card-foreground': '38 14% 16%',
      '--popover': '48 53% 98%',
      '--popover-foreground': '38 14% 16%',
      '--muted': '47 38% 90%',
      '--muted-foreground': '33 8% 39%',
      '--primary': '89 39% 40%',
      '--primary-foreground': '43 38% 94%',
      '--secondary': '47 38% 90%',
      '--secondary-foreground': '38 14% 16%',
      '--accent': '89 39% 40%',
      '--accent-foreground': '43 38% 94%',
      '--destructive': '12 53% 43%',
      '--destructive-foreground': '48 53% 98%',
      '--success': '92 31% 36%',
      '--warning': '39 57% 44%',
      '--info': '200 21% 38%',
      '--border': '38 14% 16% / 0.14',
      '--input': '38 14% 16% / 0.14',
      '--ring': '38 14% 16% / 0.28',
      '--radius': '0.75rem',
      '--border-width': '1px',
      '--shadow': '0 2px 4px hsl(38 14% 16% / 0.06), 0 14px 40px -20px hsl(38 14% 16% / 0.25)',
      '--shadow-md': '0 4px 8px hsl(38 14% 16% / 0.08), 0 24px 56px -24px hsl(38 14% 16% / 0.3)',
      '--shadow-lg': '0 8px 16px hsl(38 14% 16% / 0.1), 0 32px 80px -32px hsl(38 14% 16% / 0.35)',
      '--accent-deep': '90 42% 30%',
      '--terracotta': '18 49% 53%',
      '--terracotta-foreground': '43 38% 94%',
      '--clay': '30 63% 60%',
      '--ease-spring': 'cubic-bezier(0.34, 1.4, 0.5, 1)',
      '--font-sans': "'Fraunces', 'Source Serif 4', Georgia, serif",
      '--font-mono': "ui-monospace, 'SF Mono', monospace",
      '--font-serif': "'Fraunces', 'Source Serif 4', Georgia, serif",
      '--font-display': "'Fraunces', Georgia, serif",
    },
  },

  brut: {
    meta: { name: 'BRUT', vibe: 'brutalist — raw black/white/red, 0px radius, Anton', dot: '#ff2e00', modes: 'light' },
    single: 'light',
    light: {
      '--background': '43 24% 89%',
      '--foreground': '0 0% 5%',
      '--card': '0 0% 100%',
      '--card-foreground': '0 0% 5%',
      '--popover': '0 0% 100%',
      '--popover-foreground': '0 0% 5%',
      '--muted': '43 19% 81%',
      '--muted-foreground': '60 4% 23%',
      '--primary': '10 100% 50%',
      '--primary-foreground': '0 0% 100%',
      '--secondary': '43 19% 81%',
      '--secondary-foreground': '0 0% 5%',
      '--accent': '10 100% 50%',
      '--accent-foreground': '0 0% 100%',
      '--destructive': '10 100% 50%',
      '--destructive-foreground': '0 0% 100%',
      '--border': '0 0% 5%',
      '--input': '0 0% 5%',
      '--ring': '10 100% 50%',
      '--radius': '0',
      '--border-width': '2px',
      '--shadow': 'none',
      '--shadow-md': 'none',
      '--shadow-lg': 'none',
      '--accent-deep': '8 100% 39%',
      '--font-sans': "'IBM Plex Mono', 'JetBrains Mono', ui-monospace, monospace",
      '--font-mono': "'IBM Plex Mono', ui-monospace, monospace",
      '--font-display': "'Anton', 'Impact', sans-serif",
    },
  },
};

// =============================================================================
// Generator
// =============================================================================

const REQUIRED = ['--background', '--foreground', '--primary', '--border', '--radius'];

function formatBlock(selector, tokens) {
  const lines = [];
  const sorted = Object.entries(tokens).sort(([a], [b]) => a.localeCompare(b));
  for (const [name, value] of sorted) {
    lines.push(`  ${name.padEnd(28, ' ')}: ${value};`);
  }
  return `${selector} {\n${lines.join('\n')}\n}`;
}

function generateTheme(themeId) {
  const theme = THEMES[themeId];
  if (!theme) throw new Error(`unknown theme: ${themeId}`);

  // validate required slots
  const missing = REQUIRED.filter((r) => !(r in theme.light));
  if (missing.length) throw new Error(`${themeId}: missing required tokens: ${missing.join(', ')}`);

  // main block: :root (light) or single-mode (force light/dark)
  let mainBlock;
  if (theme.single) {
    mainBlock = formatBlock(':root, [data-mode="light"], [data-mode="dark"]', theme.light);
  } else {
    mainBlock = formatBlock(':root', theme.light);
  }

  // dark block (only for dual mode)
  let darkBlock = '';
  if (theme.dark && !theme.single) {
    const inner = formatBlock('', theme.dark).replace(/^\s*\{/, '{');
    darkBlock = '\n\n[data-mode="dark"] ' + inner;
  }

  const header = [
    '/* ============================================================================',
    `   themes/${themeId}/theme.css — ${theme.meta.name}`,
    '   generated by tools/codegen.mjs (Phase 4)',
    `   source: tools/map.md · ${theme.meta.vibe}`,
    `   mode:   ${theme.meta.modes}`,
    '   ========================================================================== */',
    '',
    '/* Link order: schema.css → this file → base.css */',
  ].join('\n');

  return header + '\n' + mainBlock + darkBlock + '\n';
}

function generateManifest(themeId) {
  const theme = THEMES[themeId];
  return JSON.stringify({
    id: themeId,
    name: theme.meta.name,
    vibe: theme.meta.vibe,
    dot: theme.meta.dot,
    modes: theme.meta.modes,
    single: theme.single || null,
    generated: new Date().toISOString(),
    source: 'tools/codegen.mjs',
  }, null, 2) + '\n';
}

function write(themeId) {
  const dir = path.join(THEMES_DIR, themeId);
  fs.mkdirSync(dir, { recursive: true });
  const cssPath = path.join(dir, 'theme.css');
  const jsonPath = path.join(dir, 'theme.json');
  fs.writeFileSync(cssPath, generateTheme(themeId));
  fs.writeFileSync(jsonPath, generateManifest(themeId));
  const cssLines = fs.readFileSync(cssPath, 'utf8').split('\n').length;
  console.log(`  ✓ ${themeId.padEnd(12)} → themes/${themeId}/theme.css (${cssLines} lines)`);
}

function list() {
  console.log('');
  console.log('  themes/');
  for (const id of Object.keys(THEMES)) {
    const t = THEMES[id];
    console.log(`    ${id.padEnd(12)} ${t.meta.modes.padEnd(6)}  ${t.meta.name}  (${t.meta.vibe})`);
  }
  console.log('');
}

// =============================================================================
// Main
// =============================================================================
const isDirectRun = process.argv[1] && import.meta.url === new URL('file://' + process.argv[1]).href;
if (!isDirectRun) {
  // imported (e.g. by shadcn-adapter.mjs) — only expose THEMES, don't run main
} else {
const targets = process.argv.slice(2);
const validIds = Object.keys(THEMES);

if (targets.includes('--list') || targets.includes('-l')) {
  list();
  process.exit(0);
}

const ids = targets.length ? targets : validIds;
const invalid = ids.filter((id) => !validIds.includes(id));
if (invalid.length) {
  console.error(`\n  ✗ unknown theme id(s): ${invalid.join(', ')}\n  valid: ${validIds.join(', ')}\n`);
  process.exit(1);
}

console.log('');
console.log('  ┌─ codegen: writing ' + ids.length + ' theme' + (ids.length === 1 ? '' : 's') + ' ──');
for (const id of ids) write(id);
console.log('  └─ ✓ done\n');

// print index
list();
}
