/* =============================================================================
   hex-source.mjs — extract original hex colors from concepts/<id>.css
   -----------------------------------------------------------------------------
   Precision fix: our canonical THEMES map stores HSL (rounded), so
   hsl(240 8% 4%) renders as rgb(9,9,11) instead of original #0a0a0c.
   This module reads the ORIGINAL hex from concepts/<id>.css so shadcn
   output can emit exact brand colors.

   Mapping: concept var → token slot (matches tools/map.md)
   ============================================================================= */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CONCEPTS = path.join(ROOT, 'concepts');

// concept var → slot (derived from tools/map.md, same for all 9 concepts)
const MAP = {
  '--bg': '--background',
  '--surface': '--card',
  '--surface-2': '--muted',
  '--surface-3': '--muted',       // extra surface → muted (no dedicated slot)
  '--fg': '--foreground',
  '--fg-muted': '--muted-foreground',
  '--accent': '--primary',
  '--danger': '--destructive',
  '--warn': '--warning',
  '--success': '--success',
  '--info': '--info',
  '--border': '--border',
  '--border-bright': '--ring',
  '--accent-deep': '--accent-deep',
  '--accent-dim': '--accent-dim',
  '--accent-2': '--accent-2',
  '--cyan': '--accent-2',          // mcky cyan → accent-2
  '--led-cyan': '--info',          // rack led cyan → info
  '--ok': '--success',             // noc ok → success
  '--terra': '--terracotta',
  '--clay': '--clay',
};

const HEX_RE = /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g;

function normalizeHex(h) {
  if (h.length === 4) {
    return '#' + h[1]+h[1]+h[2]+h[2]+h[3]+h[3];
  }
  return h.toLowerCase();
}

/**
 * Extract hex map for a concept: { light: { slot: hex }, dark: { slot: hex } }
 */
export function extractHex(conceptId) {
  const file = path.join(CONCEPTS, `${conceptId}.css`);
  if (!fs.existsSync(file)) return null;
  const css = fs.readFileSync(file, 'utf8');

  // split into light (:root or top-level) and dark ([data-mode="dark"])
  const darkMatch = css.match(/\[data-mode="dark"\]\s*\{([\s\S]*?)\n\}/);
  const darkBody = darkMatch ? darkMatch[1] : null;
  // light = everything before the dark block
  const lightBody = darkMatch ? css.slice(0, darkMatch.index) : css;

  const extract = (body) => {
    const out = {};
    if (!body) return out;
    for (const [varName, slot] of Object.entries(MAP)) {
      const re = new RegExp(`${varName}\\s*:\\s*([^;]+);`, 'g');
      let m;
      while ((m = re.exec(body)) !== null) {
        const val = m[1].trim();
        const hex = val.match(HEX_RE);
        if (hex) {
          out[slot] = normalizeHex(hex[0]);
          break; // first occurrence wins
        }
      }
    }
    return out;
  };

  const light = extract(lightBody);
  const dark = extract(darkBody || '');

  return { light, dark: Object.keys(dark).length ? dark : null };
}

/** All hex for all 9 concepts */
export function extractAllHex() {
  const ids = ['mcky', 'rack', 'crt', 'noc', 'min', 'glitchpage', 'claude', 'moss', 'brut'];
  const out = {};
  for (const id of ids) {
    const h = extractHex(id);
    if (h) out[id] = h;
  }
  return out;
}
