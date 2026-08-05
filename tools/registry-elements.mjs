#!/usr/bin/env node
/**
 * tools/registry-elements.mjs
 * 
 * Generate registry:block items for concept elements.
 * Reads component files and embeds them inline in the registry JSON.
 * 
 * Usage: node tools/registry-elements.mjs [concept-id]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ELEMENTS_DIR = path.join(ROOT, 'src', 'registry', 'elements');
const REGISTRY_DIR = path.join(ROOT, 'themes', 'registry');

// Concept elements metadata
const CONCEPTS = {
  rack: {
    name: 'rack-elements',
    displayName: 'STACK//FRAME Elements',
    description: 'Server rack UI elements — LED strips, bezel headers, rack units with animated indicators',
    files: ['led-strip.tsx', 'rack-bezel.tsx', 'rack-unit.tsx', 'rack-mock.tsx', 'effects.css', 'index.ts'],
    registryDependencies: [],
  },
  crt: {
    name: 'crt-elements',
    displayName: 'PIXSH v1.0 Elements',
    description: 'CRT terminal UI elements — phosphor glow terminal, scanlines overlay, blinking cursor, LED indicators',
    files: ['crt-terminal.tsx', 'blink-cursor.tsx', 'scanlines.tsx', 'crt-led.tsx', 'effects.css', 'index.ts'],
    registryDependencies: [],
  },
  glitchpage: {
    name: 'glitchpage-elements',
    displayName: 'GLITCHPAGE Elements',
    description: 'Glitch error page UI elements — RGB-split glitch text, error labels, animated stage',
    files: ['glitch-text.tsx', 'glitch-label.tsx', 'glitch-stage.tsx', 'effects.css', 'index.ts'],
    registryDependencies: [],
  },
  // Add more concepts as we extract them
};

function generateElementItem(conceptId, meta) {
  const conceptDir = path.join(ELEMENTS_DIR, conceptId);
  
  if (!fs.existsSync(conceptDir)) {
    console.error(`  ✗ ${conceptId} elements not found`);
    return null;
  }
  
  const files = [];
  
  for (const file of meta.files) {
    const filePath = path.join(conceptDir, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`  ⚠ ${file} not found, skipping`);
      continue;
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const target = file.endsWith('.css') ? 'app/globals.css' : `components/ui/${file}`;
    
    files.push({
      path: file,
      content: content,
      type: file.endsWith('.css') ? 'registry:file' : 'registry:component',
      target: target,
    });
  }
  
  const item = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: meta.name,
    type: 'registry:block',
    description: meta.description,
    registryDependencies: meta.registryDependencies || [],
    files: files,
    meta: {
      concept: conceptId,
    },
  };
  
  return item;
}

function main() {
  const conceptId = process.argv[2];
  
  if (conceptId && !CONCEPTS[conceptId]) {
    console.error(`Unknown concept: ${conceptId}`);
    console.error(`Available: ${Object.keys(CONCEPTS).join(', ')}`);
    process.exit(1);
  }
  
  console.log('');
  console.log('  Generating registry:block items for elements...');
  console.log('');
  
  const concepts = conceptId ? { [conceptId]: CONCEPTS[conceptId] } : CONCEPTS;
  
  for (const [id, meta] of Object.entries(concepts)) {
    const item = generateElementItem(id, meta);
    if (item) {
      const outPath = path.join(REGISTRY_DIR, `${meta.name}.json`);
      fs.writeFileSync(outPath, JSON.stringify(item, null, 2));
      console.log(`  ✓ ${meta.name}.json (${item.files.length} files)`);
    }
  }
  
  console.log('');
  console.log('  Done!');
  console.log('');
  console.log('  Usage:');
  console.log('    npx shadcn add https://design.mcky.space/r/rack-elements.json');
  console.log('');
}

main();
