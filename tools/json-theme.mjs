#!/usr/bin/env node
/* =============================================================================
   json-theme.mjs — export themes as JSON spec (React Native / cross-platform)
   ============================================================================= */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { THEMES } from './codegen.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function themeToJSON(themeId, mode = 'light') {
  const theme = THEMES[themeId];
  if (!theme) throw new Error(`unknown theme: ${themeId}`);

  const tokens = mode === 'dark' && theme.dark ? theme.dark : theme.light;

  return {
    $schema: 'dg-theme-v1',
    id: themeId,
    name: theme.meta.name,
    vibe: theme.meta.vibe,
    dot: theme.meta.dot,
    mode,
    modes: theme.meta.modes,
    tokens: Object.fromEntries(
      Object.entries(tokens)
        .filter(([k]) => k.startsWith('--'))
        .sort(([a], [b]) => a.localeCompare(b))
    ),
    meta: {
      generated: new Date().toISOString(),
      generator: 'tools/json-theme.mjs',
      format: 'dg-theme-v1',
    },
  };
}

// Main
const args = process.argv.slice(2);
const ids = args.filter((a) => !a.startsWith('--'));
const validIds = Object.keys(THEMES);
const targets = ids.length ? ids : validIds;
const outDir = path.join(ROOT, 'themes', 'json');

for (const id of targets) {
  if (!validIds.includes(id)) { console.error(`✗ unknown theme: ${id}`); continue; }
  fs.mkdirSync(outDir, { recursive: true });
  const json = themeToJSON(id);
  fs.writeFileSync(path.join(outDir, `${id}.json`), JSON.stringify(json, null, 2) + '\n');
  console.log(`  ✓ ${id.padEnd(12)} → themes/json/${id}.json`);
}
