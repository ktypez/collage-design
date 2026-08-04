#!/usr/bin/env node
/* =============================================================================
   registry-gen.mjs — generate shadcn-compatible registry.json
   ============================================================================= */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { THEMES } from './codegen.mjs';
import { extractHex } from './hex-source.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'themes', 'registry');

function themeToRegistry(themeId) {
  const theme = THEMES[themeId];
  if (!theme) return null;

  const hexMap = extractHex(themeId);
  const tokens = {};
  for (const [k, v] of Object.entries(theme.light)) {
    if (k.startsWith('--')) {
      const hex = hexMap?.light?.[k];
      tokens[k] = hex || v; // use hex for colors, raw for others
    }
  }

  return {
    name: `dg-${themeId}`,
    displayName: theme.meta.name,
    description: `Design Gallery theme: ${theme.meta.vibe}`,
    type: 'theme',
    id: `design-gallery-${themeId}`,
    mode: theme.single || 'dual',
    tokens,
    meta: {
      name: theme.meta.name,
      vibe: theme.meta.vibe,
      dot: theme.meta.dot,
      modes: theme.meta.modes,
      source: 'design-gallery',
    },
  };
}

function registryIndex() {
  return {
    name: 'design-gallery',
    description: '9 design concepts as shadcn theme presets',
    version: '0.5.0',
    homepage: 'https://github.com/ktypez/design-gallery',
    themes: Object.keys(THEMES).map((id) => ({
      id: `design-gallery-${id}`,
      name: THEMES[id].meta.name,
      displayName: THEMES[id].meta.name,
    })),
  };
}

// Main
fs.mkdirSync(OUT, { recursive: true });

// Index
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(registryIndex(), null, 2) + '\n');
console.log('  ✓ themes/registry/index.json');

// Per-theme
for (const id of Object.keys(THEMES)) {
  const r = themeToRegistry(id);
  fs.writeFileSync(path.join(OUT, `${id}.json`), JSON.stringify(r, null, 2) + '\n');
  console.log(`  ✓ ${id.padEnd(12)} → themes/registry/${id}.json`);
}
