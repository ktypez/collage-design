#!/usr/bin/env node
/* =============================================================================
   extract.mjs — extract a design system from any URL → shadcn v4 theme
   -----------------------------------------------------------------------------
   Two-layer heuristics:
   1. TOKEN layer — look for CSS custom properties that map to shadcn slots
      (--bg, --primary, --background, --color-foo, etc.)
   2. FREQUENCY layer — count color/radius/font usage across all stylesheets
      + body styles; classify most-frequent as bg/fg/primary/etc.

   Output: themes/extracted/<id>.css (shadcn v4 :root + .dark blocks)
           + themes/extracted/<id>.json (metadata + extracted color frequencies)

   Usage:
     node tools/extract.mjs https://example.com
     node tools/extract.mjs https://example.com --name mybrand --light-only
     node tools/extract.mjs --file ./local.html           # parse a local file
   ============================================================================= */

import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'themes', 'extracted');

// =============================================================================
// Token patterns (concept var → shadcn slot)
// =============================================================================
const TOKEN_PATTERNS = {
  // --background (also accept --bg, --bg-color, --background-color, etc.)
  '--background': /--(?:bg(?:-color)?|background(?:-color)?)\s*:\s*([^;}\n]+)/i,
  '--foreground': /--(?:text(?:-color)?|fg|foreground)\s*:\s*([^;}\n]+)/i,
  '--card': /--(?:card(?:-bg|-color)?|surface)\s*:\s*([^;}\n]+)/i,
  '--card-foreground': /--(?:card-(?:text|fg)|on-card|surface-foreground)\s*:\s*([^;}\n]+)/i,
  '--popover': /--popover\s*:\s*([^;}\n]+)/i,
  '--popover-foreground': /--popover-(?:text|fg)\s*:\s*([^;}\n]+)/i,
  '--primary': /--primary\s*:\s*([^;}\n]+)/i,
  '--primary-foreground': /--(?:primary-(?:text|fg)|on-primary)\s*:\s*([^;}\n]+)/i,
  '--secondary': /--secondary\s*:\s*([^;}\n]+)/i,
  '--secondary-foreground': /--secondary-(?:text|fg)\s*:\s*([^;}\n]+)/i,
  '--muted': /--muted(?:-bg|-color)?\s*:\s*([^;}\n]+)/i,
  '--muted-foreground': /--muted-(?:text|fg)\s*:\s*([^;}\n]+)/i,
  '--accent': /--accent(?:-bg|-color)?\s*:\s*([^;}\n]+)/i,
  '--accent-foreground': /--accent-(?:text|fg)\s*:\s*([^;}\n]+)/i,
  '--destructive': /--(?:destructive|danger|error)\s*:\s*([^;}\n]+)/i,
  '--success': /--success(?:-bg|-color)?\s*:\s*([^;}\n]+)/i,
  '--warning': /--warning(?:-bg|-color)?\s*:\s*([^;}\n]+)/i,
  '--info': /--info(?:-bg|-color)?\s*:\s*([^;}\n]+)/i,
  '--border': /--border(?:-color)?\s*:\s*([^;}\n]+)/i,
  '--input': /--input\s*:\s*([^;}\n]+)/i,
  '--ring': /--ring\s*:\s*([^;}\n]+)/i,
  '--radius': /--radius\s*:\s*([^;}\n]+)/i,
};

// Sanitize extracted value — strip trailing junk, trim
function sanitizeValue(v) {
  return v.trim().split(/\s+/).slice(0, 1)[0].replace(/[;}]+$/, '');
}

// =============================================================================
// Color value normalization
// =============================================================================
const HEX_RE = /#(?:[0-9a-fA-F]{3,8})\b/g;
const RGB_RE = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/g;
const HSL_RE = /hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([\d.]+)\s*)?\)/g;

function normalizeHex(h) {
  if (h.length === 4) return '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
  if (h.length === 5) return '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3] + h[4] + h[4];
  if (h.length === 9) return h.slice(0, 7); // strip alpha from #rrggbbaa
  return h.toLowerCase();
}

function extractHexValues(text) {
  const out = [];
  let m;
  while ((m = HEX_RE.exec(text)) !== null) out.push(normalizeHex(m[0]));
  while ((m = RGB_RE.exec(text)) !== null) {
    const [_, r, g, b] = m;
    out.push('#' + [r, g, b].map((c) => parseInt(c, 10).toString(16).padStart(2, '0')).join(''));
  }
  return out;
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function hexToHslSpace(hex) {
  const [r, g, b] = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(r, g, b);
  return `${h} ${s}% ${l}%`;
}

function relativeLuminance(hex) {
  const [r, g, b] = hexToRgb(hex);
  const lin = [r, g, b].map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

// =============================================================================
// Fetch + parse
// =============================================================================
async function fetchHtml(url) {
  if (url.startsWith('file://') || url.startsWith('/') || url.match(/^[a-z]+:\/\//i) === null) {
    if (fs.existsSync(url)) return fs.readFileSync(url, 'utf8');
  }
  const res = await fetch(url, { headers: { 'user-agent': 'dg-extract/1.0' }, redirect: 'follow' });
  if (!res.ok) throw new Error(`fetch ${url} → ${res.status}`);
  return res.text();
}

async function fetchCss(href, baseUrl) {
  try {
    const url = new URL(href, baseUrl).href;
    if (url.startsWith('file://') || url.match(/^https?:\/\//)) {
      const res = await fetch(url, { headers: { 'user-agent': 'dg-extract/1.0' }, redirect: 'follow' });
      if (!res.ok) return '';
      return res.text();
    }
  } catch {}
  return '';
}

// =============================================================================
// Style + link extraction
// =============================================================================
function extractStyleContent(html, baseUrl) {
  const blocks = [];

  // inline <style> blocks
  const styleRe = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
  let m;
  while ((m = styleRe.exec(html)) !== null) blocks.push(m[1]);

  // <link rel="stylesheet" href="..."> — async fetch
  const linkRe = /<link\b[^>]*\brel\s*=\s*["']?stylesheet["']?[^>]*\bhref\s*=\s*["']?([^"' >]+)/gi;
  const linkHrefs = [];
  while ((m = linkRe.exec(html)) !== null) linkHrefs.push(m[1]);

  return { blocks, linkHrefs, baseUrl };
}

// =============================================================================
// Color classification
// =============================================================================
function classifyColor(hex, counts) {
  const lum = relativeLuminance(hex);
  const isLight = lum > 0.5;
  // saturation via HSL
  const [r, g, b] = hexToRgb(hex);
  const [, s] = rgbToHsl(r, g, b);
  const isGray = s < 8; // low saturation = near-gray
  return { isLight, isGray, saturation: s, lum };
}

function pickByHeuristic(counts) {
  // counts: Map<hex, frequency>
  const entries = [...counts.entries()]
    .map(([hex, freq]) => ({ hex, freq, ...classifyColor(hex) }))
    .sort((a, b) => b.freq - a.freq);

  // background = most frequent near-gray that is light (or most frequent overall if no light)
  const lightGrays = entries.filter((e) => e.isGray && e.isLight);
  const darkGrays = entries.filter((e) => e.isGray && !e.isLight);
  const saturated = entries.filter((e) => !e.isGray);

  return {
    background: lightGrays[0]?.hex || entries[0]?.hex,
    foreground: darkGrays[0]?.hex || '#000000',
    primary: saturated[0]?.hex || entries[0]?.hex,
    secondary: saturated[1]?.hex || saturated[0]?.hex,
    accent: saturated[2]?.hex,
    destructive: saturated.find((e) => e.hex.includes('dc') || e.hex.includes('b9') || e.saturation > 60 && !e.isLight)?.hex || '#dc2626',
  };
}

// =============================================================================
// Main extractor
// =============================================================================
async function extractFromUrl(rawUrl, opts = {}) {
  const baseUrl = rawUrl;
  const html = await fetchHtml(rawUrl);

  // detect: is the file a CSS file (by extension)?
  const isCssFile = /\.css(\?|$)/i.test(rawUrl);

  const { blocks, linkHrefs, baseUrl: bu } = extractStyleContent(html, baseUrl);

  // fetch all external stylesheets
  const extCss = (await Promise.all(linkHrefs.map((h) => fetchCss(h, bu)))).join('\n');
  // for a CSS file, the content IS the stylesheet
  const allCss = (isCssFile ? html : blocks.join('\n')) + '\n' + extCss;

  // also collect inline style="" attributes
  const inlineRe = /\sstyle\s*=\s*["']([^"']+)["']/gi;
  let im;
  // reset regex state
  const inlineStyles = [];
  // when not a CSS file, the html is the original; for CSS file, skip inline (N/A)
  if (!isCssFile) {
    let im2;
    while ((im2 = inlineRe.exec(html)) !== null) inlineStyles.push(im2[1] + ';');
  }
  const combinedCss = allCss + '\n' + inlineStyles.join('');

  // ---- token layer ----
  const tokens = {};
  for (const [slot, re] of Object.entries(TOKEN_PATTERNS)) {
    const m = combinedCss.match(re);
    if (m) tokens[slot] = sanitizeValue(m[1]);
  }

  // ---- frequency layer (fallback) ----
  const hexes = extractHexValues(combinedCss);
  const counts = new Map();
  for (const h of hexes) counts.set(h, (counts.get(h) || 0) + 1);

  // if token layer missed something, fill from frequency
  if (Object.keys(tokens).length < 5 && counts.size > 0) {
    const picked = pickByHeuristic(counts);
    tokens['--background'] = tokens['--background'] || picked.background;
    tokens['--foreground'] = tokens['--foreground'] || picked.foreground;
    tokens['--primary'] = tokens['--primary'] || picked.primary;
    tokens['--destructive'] = tokens['--destructive'] || picked.destructive;
  }

  // extract font-family (prefer quoted; fallback to first segment)
  let fontFamily = null;
  const quotedRe = /font-family\s*:\s*["']([^"']+)["']/;
  const qm = combinedCss.match(quotedRe);
  if (qm) {
    fontFamily = qm[1].split(',')[0].trim();
  } else {
    const fontRe = /font-family\s*:\s*([^;{}\n]+)/g;
    let fm;
    while ((fm = fontRe.exec(combinedCss)) !== null) {
      const v = sanitizeValue(fm[1]);
      if (v && !v.startsWith('@')) {
        fontFamily = v.split(',')[0].trim().replace(/["']/g, '');
        break;
      }
    }
  }

  // extract border-radius (first found, non-zero)
  const radiusMatch = combinedCss.match(/border-radius\s*:\s*([^;{}\n]+)/);
  let radius = '0.5rem';
  if (radiusMatch) {
    const raw = sanitizeValue(radiusMatch[1]);
    if (raw.endsWith('px')) radius = `${parseFloat(raw) / 16}rem`;
    else if (raw.endsWith('rem')) radius = raw;
    else if (!isNaN(parseFloat(raw))) radius = `${raw}px`;
  }

  // pick a mode: if bg is dark → dark, light → light, mixed → dual
  let mode = 'light';
  if (tokens['--background']) {
    const lum = relativeLuminance(tokens['--background']);
    if (lum < 0.2) mode = 'dark';
  }

  return {
    tokens, // { '--background': '#...', ... }
    fontFamily,
    radius,
    mode,
    stats: { colorsFound: counts.size, tokensMatched: Object.keys(tokens).length },
  };
}

// =============================================================================
// Emit shadcn theme
// =============================================================================
function emitShadcn(themeId, data) {
  const { tokens, fontFamily, radius, mode, stats } = data;
  const lines = [];

  // emit colors as hsl() — preserves theme's existing color format
  // (precision fix from concepts is irrelevant here since this is auto-generated)
  const fmt = (k) => `  ${k.padEnd(28, ' ')}: ${tokens[k]};`;
  const colorKeys = [
    '--background', '--foreground', '--card', '--card-foreground',
    '--popover', '--popover-foreground',
    '--primary', '--primary-foreground',
    '--secondary', '--secondary-foreground',
    '--muted', '--muted-foreground',
    '--accent', '--accent-foreground',
    '--destructive', '--destructive-foreground',
    '--success', '--warning', '--info',
    '--border', '--input', '--ring',
  ];
  for (const k of colorKeys) {
    if (tokens[k]) lines.push(fmt(k));
  }
  if (data.radius) lines.push(`  ${('--radius').padEnd(28, ' ')}: ${data.radius};`);
  if (data.fontFamily) {
    const f = data.fontFamily;
    const safe = f.replace(/[{}]/g, '').trim() || 'inherit';
    lines.push(`  ${('--font-sans').padEnd(28, ' ')}: "${safe}", system-ui, sans-serif;`);
  }
  // skip mono/serif — would need separate detection, not from one font-family value

  const body = `:root {\n${lines.join('\n')}\n}`;

  return `/* ============================================================================
   ${themeId} — shadcn v4 theme preset (EXTRACTED)
   generated by tools/extract.mjs from ${data.mode === 'dark' ? 'dark' : 'light'} source
   stats: ${stats.colorsFound} colors found, ${stats.tokensMatched} tokens matched
   ========================================================================== */

${body}
`;
}

// =============================================================================
// CLI
// =============================================================================
function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'extracted';
}

const args = process.argv.slice(2);
const fileArg = args.find((a) => a.startsWith('--file='));
const input = fileArg ? fileArg.slice(7) : args.find((a) => !a.startsWith('--'));
const nameIdx = args.indexOf('--name');
const nameArg = nameIdx > -1 ? args[nameIdx + 1] : null;
const isLightOnly = args.includes('--light-only');
const isDarkOnly = args.includes('--dark-only');

if (!input) {
  console.error('usage: dg extract <url> [--name <id>] [--light-only|--dark-only]');
  console.error('       dg extract --file ./local.html');
  process.exit(1);
}

(async () => {
  console.log(`\n  ┌─ dg extract — ${input}`);
  try {
    const data = await extractFromUrl(input);
    const id = nameArg || slugify(new URL(input).hostname || input.replace(/[^a-z0-9]/gi, '-'));
    if (isLightOnly) data.mode = 'light';
    if (isDarkOnly) data.mode = 'dark';

    fs.mkdirSync(OUT, { recursive: true });
    const css = emitShadcn(id, data);
    fs.writeFileSync(path.join(OUT, `${id}.css`), css);
    fs.writeFileSync(
      path.join(OUT, `${id}.json`),
      JSON.stringify({ id, source: input, mode: data.mode, ...data.stats, extracted: data.tokens }, null, 2) + '\n',
    );
    console.log(`  │ mode:   ${data.mode}`);
    console.log(`  │ tokens: ${data.stats.tokensMatched} matched, ${data.stats.colorsFound} unique colors`);
    console.log(`  │ radius: ${data.radius}${data.fontFamily ? `, font: ${data.fontFamily}` : ''}`);
    console.log(`  │ → themes/extracted/${id}.css + .json`);
    console.log(`  └─ ✓ done\n`);
    // also print a quick summary of the main tokens
    if (data.tokens['--background']) console.log(`     --background ${data.tokens['--background']}`);
    if (data.tokens['--primary']) console.log(`     --primary    ${data.tokens['--primary']}`);
    if (data.tokens['--foreground']) console.log(`     --foreground ${data.tokens['--foreground']}`);
  } catch (e) {
    console.error(`  ✗ ${e.message}`);
    process.exit(1);
  }
})();
