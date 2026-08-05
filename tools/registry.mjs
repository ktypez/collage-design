#!/usr/bin/env node
/**
 * tools/registry.mjs
 * 
 * Convert themes/shadcn/<id>.css → registry:theme JSON items
 * Output: themes/registry/<id>.json + themes/registry/registry.json
 * 
 * Usage: node tools/registry.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SHADCN_DIR = path.join(ROOT, 'themes', 'shadcn');
const REGISTRY_DIR = path.join(ROOT, 'themes', 'registry');

// Theme metadata
const THEMES = [
  { id: 'mcky', name: 'mcky.space', vibe: 'neobrutalism, 3px border, hard shadow, mono 100%', mode: 'dual' },
  { id: 'rack', name: 'STACK//FRAME', vibe: 'server rack, amber LED, Inter+mono', mode: 'dark-only' },
  { id: 'crt', name: 'PIXSH v1.0', vibe: 'phosphor green, scanlines, VT323', mode: 'dark-only' },
  { id: 'noc', name: 'PACKETGRID', vibe: 'NOC dashboard, cyan+green', mode: 'dark-only' },
  { id: 'min', name: 'collage.sh', vibe: 'minimal, olive lime accent', mode: 'light-only' },
  { id: 'glitchpage', name: 'GLITCHPAGE', vibe: 'error page, neon pink, Thai', mode: 'dark-only' },
  { id: 'claude', name: 'CLAUDE PAPER', vibe: 'warm editorial, clay, Source Serif', mode: 'dual' },
  { id: 'moss', name: 'MOSS', vibe: 'organic, earth + terracotta, Fraunces', mode: 'light-only' },
  { id: 'brut', name: 'BRUT', vibe: 'brutalist, red+black, Anton', mode: 'light-only' },
];

// Parse CSS block (extract variables)
function parseCssBlock(css, selector) {
  // Handle both ":root, .dark" (combined) and ":root" / ".dark" (separate)
  const re = new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{([^}]*)\\}`, 'g');
  const match = re.exec(css);
  if (!match) return {};
  
  const vars = {};
  const lines = match[1].split('\n');
  for (const line of lines) {
    const m = line.match(/--([a-z0-9-]+)\s*:\s*([^;]+);/);
    if (m) {
      vars[`--${m[1]}`] = m[2].trim();
    }
  }
  return vars;
}

// Generate registry:theme item
function generateThemeItem(theme) {
  const cssPath = path.join(SHADCN_DIR, `${theme.id}.css`);
  if (!fs.existsSync(cssPath)) {
    console.error(`  ✗ ${theme.id}.css not found`);
    return null;
  }
  
  const css = fs.readFileSync(cssPath, 'utf-8');
  
  // Check if combined ":root, .dark" selector exists (not in comments)
  // Look for the actual CSS selector pattern
  const hasCombined = /^\s*:root\s*,\s*\.dark\s*\{/m.test(css);
  
  let light = {};
  let dark = {};
  
  if (hasCombined) {
    // Dark-only or light-only: all vars in ":root, .dark"
    const combined = parseCssBlock(css, ':root, .dark');
    light = combined;
    dark = combined;
  } else {
    // Dual mode: separate :root (light) and .dark
    light = parseCssBlock(css, ':root');
    dark = parseCssBlock(css, '.dark');
  }
  
  // Separate theme vars (non-color) from light/dark
  const themeVars = {};
  const colorKeys = ['--background', '--foreground', '--card', '--popover', '--primary', '--secondary', 
                     '--muted', '--accent', '--destructive', '--border', '--input', '--ring'];
  
  for (const [key, value] of Object.entries(light)) {
    if (!colorKeys.includes(key)) {
      themeVars[key] = value;
      delete light[key];
    }
  }
  
  // Also remove theme vars from dark (they're shared)
  for (const key of Object.keys(themeVars)) {
    delete dark[key];
  }
  
  const item = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: theme.id,
    type: 'registry:theme',
    description: `${theme.name} — ${theme.vibe}`,
    cssVars: {
      theme: themeVars,
      light: light,
      dark: dark,
    },
    meta: {
      name: theme.name,
      vibe: theme.vibe,
      mode: theme.mode,
    },
  };
  
  return item;
}

// Generate registry.json (collection)
function generateCollection(items) {
  return {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: 'design-gallery',
    homepage: 'https://design.mcky.space',
    items: items,
  };
}

// Main
function main() {
  console.log('');
  console.log('  Generating shadcn registry items...');
  console.log('');
  
  // Ensure registry dir exists
  if (!fs.existsSync(REGISTRY_DIR)) {
    fs.mkdirSync(REGISTRY_DIR, { recursive: true });
    console.log(`  ✓ Created ${path.relative(ROOT, REGISTRY_DIR)}/`);
  }
  
  const items = [];
  
  for (const theme of THEMES) {
    const item = generateThemeItem(theme);
    if (item) {
      const outPath = path.join(REGISTRY_DIR, `${theme.id}.json`);
      fs.writeFileSync(outPath, JSON.stringify(item, null, 2));
      console.log(`  ✓ ${theme.id}.json`);
      items.push(item);
    }
  }
  
  // Generate collection
  const collection = generateCollection(items);
  const collectionPath = path.join(REGISTRY_DIR, 'registry.json');
  fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 2));
  console.log(`  ✓ registry.json (collection)`);
  
  console.log('');
  console.log(`  Done! Generated ${items.length} theme items.`);
  console.log('');
  console.log('  Next:');
  console.log('    1. Add caddy route: design.mcky.space/r/* → themes/registry/');
  console.log('    2. Test: npx shadcn add https://design.mcky.space/r/<id>.json');
  console.log('');
}

main();
