#!/usr/bin/env node
/* =============================================================================
   vue-theme.mjs — generate Vue theme CSS (pantry-style: :root + [data-mode])
   -----------------------------------------------------------------------------
   Model: tweakcn/shadcn — ONE theme per file. Import 1, add more as needed.
   Output: themes/vue/<id>.css — self-contained CSS with pantry's variable
   names (--bg, --surface, --fg, --accent, ...). Same format as the original
   pantry claude.css so it drops in without touching components.

   Usage:
     node tools/vue-theme.mjs            # generate all 9
     node tools/vue-theme.mjs mcky       # generate one
   ============================================================================= */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'themes', 'vue');

// Pantry token mapping: DG shadcn var → pantry var
// (matches src/lib/dg-themes.ts in /home/admin/pantry)
const MAP = {
  '--background': '--bg',
  '--foreground': '--fg',
  '--card': '--surface',
  '--primary': '--accent',
  '--accent': '--accent',
  '--accent-deep': '--accent-deep',
  '--success': '--success',
  '--warning': '--warn',
  '--destructive': '--danger',
  '--border': '--border',
  '--muted': '--surface-2',
  '--muted-foreground': '--fg-muted',
};

// Source themes (same values as codegen THEMES light/dark, but as hex/HSL)
// Light values from themes/shadcn/*.css
const THEMES = {
  mcky: {
    name: 'mcky.space',
    light: { '--bg': '#f5f5f0', '--surface': '#ffffff', '--surface-2': '#eaeae4', '--border': '#000000', '--fg': '#000000', '--fg-muted': '#333333', '--accent': '#ffe066', '--accent-deep': '#d9a400', '--success': '#06d6a0', '--warn': '#ff9f43', '--danger': '#ff6b6b' },
    dark:  { '--bg': '#0a0a0a', '--surface': '#141414', '--surface-2': '#1f1f1f', '--border': '#888888', '--fg': '#e0e0e0', '--fg-muted': '#a0a0a0', '--accent': '#ffe066', '--accent-deep': '#ffe066', '--success': '#06d6a0', '--warn': '#ff9f43', '--danger': '#ff6b6b' },
  },
  rack: {
    name: 'STACK//FRAME',
    light: { '--bg': '#0a0a0c', '--surface': '#16161a', '--surface-2': '#111114', '--border': '#2a2a32', '--fg': '#f5f5f7', '--fg-muted': '#8a8a93', '--accent': '#ffb000', '--accent-deep': '#e09600', '--success': '#00ff66', '--warn': '#ffb000', '--danger': '#ff3b30' },
    dark: null,
  },
  crt: {
    name: 'PIXSH v1.0',
    light: { '--bg': '#060605', '--surface': '#0d0d0b', '--surface-2': '#141410', '--border': '#263a26', '--fg': '#c5d9b7', '--fg-muted': '#7a8f74', '--accent': '#4af626', '--accent-deep': '#2e9e1e', '--success': '#4af626', '--warn': '#ffb000', '--danger': '#ff5c5c' },
    dark: null,
  },
  noc: {
    name: 'PACKETGRID',
    light: { '--bg': '#0a0f14', '--surface': '#0f161d', '--surface-2': '#131c25', '--border': '#1c2836', '--fg': '#d9e6f2', '--fg-muted': '#7d8fa1', '--accent': '#35f0c8', '--accent-deep': '#1fae94', '--success': '#3ddc84', '--warn': '#fbbf24', '--danger': '#ff5c5c' },
    dark: null,
  },
  min: {
    name: 'collage.sh',
    light: { '--bg': '#f6f7f4', '--surface': '#ffffff', '--surface-2': '#f0f1ed', '--border': '#e3e5df', '--fg': '#1a1c16', '--fg-muted': '#5d6157', '--accent': '#7a9a01', '--accent-deep': '#5f7801', '--success': '#16a34a', '--warn': '#d97706', '--danger': '#c7452f' },
    dark: null,
  },
  glitchpage: {
    name: 'GLITCHPAGE',
    light: { '--bg': '#0b0f2a', '--surface': '#111640', '--surface-2': '#161c4d', '--border': '#232a5e', '--fg': '#e8eafc', '--fg-muted': '#8f96c9', '--accent': '#ff3d8f', '--accent-deep': '#d62a77', '--success': '#4ade80', '--warn': '#fbbf24', '--danger': '#ff3d5e' },
    dark: null,
  },
  claude: {
    name: 'CLAUDE PAPER',
    light: { '--bg': '#faf9f5', '--surface': '#ffffff', '--surface-2': '#f5f4ed', '--border': 'rgba(20,20,19,0.12)', '--fg': '#141413', '--fg-muted': '#3d3d3a', '--accent': '#d97757', '--accent-deep': '#b85c3f', '--success': '#3d7a4e', '--warn': '#a06a00', '--danger': '#b03a2e' },
    dark:  { '--bg': '#30302e', '--surface': '#383835', '--surface-2': '#262624', '--border': 'rgba(250,249,245,0.14)', '--fg': '#faf9f5', '--fg-muted': '#c2c0b6', '--accent': '#e38b6b', '--accent-deep': '#d97757', '--success': '#3d7a4e', '--warn': '#a06a00', '--danger': '#e0806f' },
  },
  moss: {
    name: 'MOSS',
    light: { '--bg': '#f5f1e8', '--surface': '#fdfbf5', '--surface-2': '#efe9db', '--border': 'rgba(46,42,36,0.14)', '--fg': '#2e2a24', '--fg-muted': '#6b645a', '--accent': '#6a8c3f', '--accent-deep': '#4f6d2d', '--success': '#5c7a3d', '--warn': '#b0832f', '--danger': '#a84d33' },
    dark: null,
  },
  brut: {
    name: 'BRUT',
    light: { '--bg': '#e8e4da', '--surface': '#ffffff', '--surface-2': '#d8d4ca', '--border': '#0d0d0d', '--fg': '#0d0d0d', '--fg-muted': '#3d3d3a', '--accent': '#ff2e00', '--accent-deep': '#c91f00', '--success': '#16a34a', '--warn': '#d97706', '--danger': '#dc2626' },
    dark: null,
  },
};

// Derived tokens from base (so components that use --surface-3, --fg-dim, etc still work)
function derive(base) {
  const lightness = base['--bg'].startsWith('#') ? parseInt(base['--bg'].slice(5, 7), 16) : 240;
  const isLight = lightness > 128;
  return {
    '--surface-3': isLight ? '#e8e8e8' : '#222222',
    '--border-light': isLight ? 'rgba(10,10,10,0.12)' : 'rgba(229,229,229,0.12)',
    '--fg-dim': isLight ? 'rgba(10,10,10,0.35)' : 'rgba(240,240,240,0.35)',
    '--accent-soft': 'rgba(217,119,87,0.08)',
    '--shadow': 'none',
    '--font-sans': "'Space Grotesk', 'Kanit', system-ui, sans-serif",
    '--font-mono': "'JetBrains Mono', 'SF Mono', monospace",
    ...base,
  };
}

function genCss(id) {
  const t = THEMES[id];
  if (!t) throw new Error(`unknown theme: ${id}`);
  const light = derive(t.light);
  const hasDark = !!t.dark;

  let css = `/* ==========================================================================\n`;
  css += `   ${t.name} (${id}) — DG theme for Vue/pantry\n`;
  css += `   generated by tools/vue-theme.mjs\n`;
  css += `   format: :root (light) + [data-mode="dark"]\n`;
  css += `   ========================================================================== */\n\n`;
  css += `:root {\n${Object.entries(light).map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}\n`;
  if (hasDark) {
    const dark = derive(t.dark);
    css += `\nhtml[data-mode="dark"] {\n${Object.entries(dark).map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}\n`;
  }
  return css;
}

const args = process.argv.slice(2);
const ids = args.length ? args : Object.keys(THEMES);

fs.mkdirSync(OUT, { recursive: true });
for (const id of ids) {
  if (!THEMES[id]) { console.error(`✗ unknown theme: ${id}`); continue; }
  const css = genCss(id);
  fs.writeFileSync(path.join(OUT, `${id}.css`), css);
  console.log(`  ✓ ${id.padEnd(12)} → themes/vue/${id}.css (${css.split('\n').length} lines)`);
}
