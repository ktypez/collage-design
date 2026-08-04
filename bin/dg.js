#!/usr/bin/env node
/* =============================================================================
   dg.js — Design Gallery CLI
   -----------------------------------------------------------------------------
   Zero-dependency tool — node builtins only.
   Use: npx dg <command> [args]

   Commands:
     init [dir]                  Scaffold tokens + components + JS in target dir
     add component <name>        Copy a single component (CSS + usage example)
     add theme <id|file>         Copy a theme file into project
     theme <id>                  Print the link snippet for a theme
     list [themes|components]    List available themes or components
     serve [--port N]            Local preview server (app/)
     check                       Syntax check + token contract
     codegen <theme-id>          Generate themes/<id>/theme.css from concepts/<id>.css
     help [cmd]                  Show help for a command
   ============================================================================= */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const C = {
  reset: '\x1b[0m',
  dim:   '\x1b[2m',
  bold:  '\x1b[1m',
  green: '\x1b[32m',
  yellow:'\x1b[33m',
  red:   '\x1b[31m',
  cyan:  '\x1b[36m',
  gray:  '\x1b[90m',
};
const useColor = process.stdout.isTTY && !process.env.NO_COLOR;

const paint = (color, s) => useColor ? `${C[color]}${s}${C.reset}` : s;
const log  = (s) => console.log(s);
const ok   = (s) => log(paint('green', `  ✓ ${s}`));
const warn = (s) => log(paint('yellow', `  ! ${s}`));
const err  = (s) => log(paint('red',   `  ✗ ${s}`));
const info = (s) => log(paint('cyan',  `  · ${s}`));
const dim  = (s) => log(paint('dim',   `    ${s}`));

// =============================================================================
// Component registry
// =============================================================================
// Maps component name → CSS class root + JS initializer + category
// js: null  = CSS-only (no JS needed)
// js: 'fn'  = extract that function + all helper functions in same section
// js: 'Toast' = special: extract Toast queue manager object literal
const COMPONENTS = {
  // foundations
  btn:         { css: 'x-btn',          js: null,                 cat: 'foundations' },
  input:       { css: 'x-input',        js: null,                 cat: 'foundations' },
  textarea:    { css: 'x-textarea',     js: null,                 cat: 'foundations' },
  select:      { css: 'x-select',       js: null,                 cat: 'foundations' },
  checkbox:    { css: 'x-check',        js: null,                 cat: 'foundations' },
  radio:       { css: 'x-radio',        js: null,                 cat: 'foundations' },
  switch:      { css: 'x-switch',       js: null,                 cat: 'foundations' },
  label:       { css: 'x-label',        js: null,                 cat: 'foundations' },
  separator:   { css: 'x-sep',          js: null,                 cat: 'foundations' },
  skeleton:    { css: 'x-skeleton',     js: null,                 cat: 'foundations' },
  kbd:         { css: 'x-kbd',          js: null,                 cat: 'foundations' },
  toggle:      { css: 'x-toggle',       js: ['initToggles'],      cat: 'foundations' },

  // surfaces
  card:        { css: 'x-card',         js: null,                 cat: 'surfaces' },
  alert:       { css: 'x-alert',        js: null,                 cat: 'surfaces' },
  badge:       { css: 'x-badge',        js: null,                 cat: 'surfaces' },
  status:      { css: 'x-status',       js: null,                 cat: 'surfaces' },
  blockquote:  { css: 'x-quote',        js: null,                 cat: 'surfaces' },
  code:        { css: 'x-code',         js: null,                 cat: 'surfaces' },
  terminal:    { css: 'x-term',         js: null,                 cat: 'surfaces' },
  empty:       { css: 'x-empty',        js: null,                 cat: 'surfaces' },
  avatar:      { css: 'x-avatar',       js: null,                 cat: 'surfaces' },
  aspect:      { css: 'x-aspect',       js: null,                 cat: 'surfaces' },

  // data
  table:       { css: 'x-table',        js: null,                 cat: 'data' },
  tabs:        { css: 'x-tabs',         js: ['initTabs'],         cat: 'data' },
  accordion:   { css: 'x-accordion',    js: ['initAccordions'],   cat: 'data' },
  progress:    { css: 'x-progress',     js: null,                 cat: 'data' },
  pagination:  { css: 'x-pagination',   js: null,                 cat: 'data' },
  breadcrumb:  { css: 'x-crumb',        js: null,                 cat: 'data' },
  scroll:      { css: 'x-scroll',       js: null,                 cat: 'data' },
  spinner:     { css: 'x-spinner',      js: null,                 cat: 'data' },

  // forms
  form:        { css: 'x-form',         js: null,                 cat: 'forms' },
  field:       { css: 'x-field',        js: null,                 cat: 'forms' },
  item:        { css: 'x-item',         js: null,                 cat: 'forms' },
  slider:      { css: 'x-slider',       js: ['initSliders'],      cat: 'forms' },
  togglegroup: { css: 'x-toggle-group', js: ['initToggleGroups'], cat: 'forms' },
  combobox:    { css: 'x-combobox',     js: ['initComboboxes'],   cat: 'forms' },
  command:     { css: 'x-command',      js: ['initCommands'],     cat: 'forms' },

  // overlays
  dialog:      { css: 'x-dialog',       js: ['initDialogs','initDialogEl','bindOverlay','createOverlay','trapTab'], cat: 'overlays' },
  sheet:       { css: 'x-sheet',        js: ['initSheets','initSheetEl','bindOverlay','createOverlay','trapTab'], cat: 'overlays' },
  drawer:      { css: 'x-drawer',       js: ['initDrawers','initDrawerEl','bindOverlay','createOverlay','trapTab'], cat: 'overlays' },
  popover:     { css: 'x-popover',      js: ['initPopovers'],     cat: 'overlays' },
  tooltip:     { css: 'x-tooltip',      js: ['initTooltips'],     cat: 'overlays' },
  hovercard:   { css: 'x-hovercard',    js: ['initHoverCards'],   cat: 'overlays' },
  menu:        { css: 'x-menu',         js: ['initMenus'],        cat: 'overlays' },
  contextmenu: { css: 'x-contextmenu',  js: ['initContextMenus'], cat: 'overlays' },
  menubar:     { css: 'x-menubar',      js: ['initMenubars'],     cat: 'overlays' },
  navmenu:     { css: 'x-navmenu',      js: ['initNavMenus'],     cat: 'overlays' },
  toast:       { css: 'x-toast',        js: 'Toast',              cat: 'overlays' },

  // advanced
  resizable:   { css: 'x-resizable',    js: ['initResizables'],   cat: 'advanced' },
  collapsible: { css: 'x-collapsible',  js: ['initCollapsibles'], cat: 'advanced' },
  calendar:    { css: 'x-cal',          js: ['initCalendars'],    cat: 'advanced' },
  datepicker:  { css: 'x-datepicker',   js: ['initDatePickers'],  cat: 'advanced' },
  carousel:    { css: 'x-carousel',     js: ['initCarousels'],    cat: 'advanced' },
};

const COMPONENT_NAMES = Object.keys(COMPONENTS);

// =============================================================================
// Helpers
// =============================================================================
const exists = (p) => { try { fs.accessSync(p); return true; } catch { return false; } };
const readFile = (p) => fs.readFileSync(p, 'utf8');
const writeFile = (p, content) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, content); };
const copyFile = (src, dst) => { fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.copyFileSync(src, dst); };

function listThemes() {
  const dir = path.join(ROOT, 'themes');
  if (!exists(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const tp = path.join(dir, d.name, 'theme.css');
      const jp = path.join(dir, d.name, 'theme.json');
      return {
        id: d.name,
        css: exists(tp) ? tp : null,
        json: exists(jp) ? readFile(jp) : null,
      };
    });
}

function extractCssBlock(css, rootClass) {
  // find all lines that start with `.${rootClass}` (no space before = main class)
  // or `.${rootClass}--` or `.${rootClass}--something` or `.${rootClass}.variant`
  // and the parent block. We keep the whole block from each start to matching `}`.
  const lines = css.split('\n');
  const out = [];
  let depth = 0;
  let inBlock = false;
  let buf = [];

  const startsWithRoot = (line) => {
    const t = line.trimStart();
    if (t.startsWith('/*') || t.startsWith('*') || t.startsWith('//')) return false;
    // match: .x-foo { | .x-foo.variant { | .x-foo--size { | .x-foo:hover { | .x-foo[attr] { | .x-foo .child { | .x-foo>.child {
    const re = new RegExp(`^\\.${rootClass}(\\b|[\\s.\\[:>+~,\\)]|-{2})`);
    return re.test(t);
  };

  for (const line of lines) {
    if (!inBlock) {
      if (startsWithRoot(line)) { inBlock = true; depth = 0; buf = [line]; }
    } else {
      buf.push(line);
      for (const ch of line) {
        if (ch === '{') depth++;
        else if (ch === '}') { depth--; if (depth === 0) { inBlock = false; out.push(buf.join('\n')); buf = []; break; } }
      }
    }
  }
  return out.join('\n\n');
}

function extractJsBlock(js, fnName) {
  // find `function fnName(` and capture until matching `}` of same depth
  const start = js.indexOf(`function ${fnName}(`);
  if (start < 0) return '';
  let depth = 0, i = start, foundFirst = false;
  for (; i < js.length; i++) {
    if (js[i] === '{') { depth++; foundFirst = true; }
    else if (js[i] === '}') { depth--; if (depth === 0 && foundFirst) return js.slice(start, i + 1); }
  }
  return '';
}

function extractJsFunctions(js, names) {
  // extract each function declaration in `names`, in source order, deduped
  const positions = [];
  for (const name of names) {
    const re = new RegExp(`function\\s+${name}\\s*\\(`, 'g');
    let m;
    while ((m = re.exec(js)) !== null) {
      positions.push({ name, start: m.index });
    }
  }
  positions.sort((a, b) => a.start - b.start);

  const blocks = [];
  for (let i = 0; i < positions.length; i++) {
    const p = positions[i];
    const end = i + 1 < positions.length ? positions[i + 1].start : js.length;
    // find matching } for this function — start from end of declaration
    const declStart = p.start;
    const openBrace = js.indexOf('{', declStart);
    if (openBrace < 0) continue;
    let depth = 0, j = openBrace;
    for (; j < end + 200 && j < js.length; j++) {
      if (js[j] === '{') depth++;
      else if (js[j] === '}') { depth--; if (depth === 0) break; }
    }
    if (depth === 0) {
      // dedupe by content
      const block = js.slice(declStart, j + 1);
      if (!blocks.includes(block)) blocks.push(block);
    }
  }
  return blocks.join('\n\n');
}

function color(s) { return s; }

// =============================================================================
// Commands
// =============================================================================

function help(cmd) {
  const cmds = {
    init: `init [dir]

  Scaffold a minimal DG setup in target directory (default: current).
  Copies:
    tokens.css      default neutral schema
    components.css  all 54+ components
    components.js   vanilla JS controllers
    index.html      demo page that wires it all together

  Examples:
    npx dg init
    npx dg init ./my-app
    npx dg init /tmp/test --no-demo`,

    add: `add <component|theme> <name>

  Copy a single component or theme into your project.

  Subcommands:
    component <name>    copy CSS block + JS init for one component
    theme <id|file>     copy a theme file

  Examples:
    npx dg add component button
    npx dg add component dialog --dir ./my-app
    npx dg add theme mcky
    npx dg add theme ./my-theme.css`,

    theme: `theme <id>

  Show the link snippet to activate a theme in your HTML.

  Examples:
    npx dg theme mcky
    npx dg theme rack
    npx dg theme mcky --show`,

    list: `list [themes|components]

  List available themes or components.

  Examples:
    npx dg list
    npx dg list themes
    npx dg list components`,

    serve: `serve [--port N]

  Start a local preview server (default port 3000).
  Serves from current directory, opens app/showcase.html.

  Examples:
    npx dg serve
    npx dg serve --port 8080`,

    check: `check

  Syntax-check all source modules + validate token contract.`,

    codegen: `codegen <theme-id>

  Generate themes/<id>/theme.css from concepts/<id>.css using tools/map.md.`,

    help: `help [command]

  Show help for a command.`,
  };
  if (!cmd) {
    log('');
    log(paint('bold', '  dg — Design Gallery CLI'));
    log(paint('dim',  '  zero-dep framework for theme-able components'));
    log('');
    log('  ' + paint('bold', 'Usage:') + ' npx dg <command> [args]');
    log('');
    log('  ' + paint('bold', 'Commands:'));
    for (const c of ['init', 'add', 'theme', 'list', 'serve', 'check', 'codegen', 'help']) {
      log(`    ${paint('cyan', c.padEnd(10))} ${paint('dim', cmds[c].split('\n')[0])}`);
    }
    log('');
    log('  ' + paint('bold', 'Run ') + paint('cyan', 'dg help <cmd>') + paint('bold', ' for details.'));
    log('');
    return;
  }
  if (!cmds[cmd]) { err(`unknown command: ${cmd}`); return; }
  log('');
  log('  ' + paint('bold', `dg ${cmd}`) + paint('dim', ' — ' + cmds[cmd].split('\n')[0].trim()));
  log('');
  log(cmds[cmd].split('\n').slice(1).map((l) => '  ' + l).join('\n'));
  log('');
}

// ----- init -----
function cmdInit(args) {
  const dir = path.resolve(args[0] || '.');
  const skipDemo = args.includes('--no-demo');
  const skipJs = args.includes('--no-js');

  log('');
  log(paint('bold', '  dg init — scaffolding ') + paint('cyan', dir));
  log('');

  if (exists(path.join(dir, 'tokens.css'))) {
    warn('tokens.css exists — skipping');
  } else {
    copyFile(path.join(ROOT, 'src/tokens/schema.css'), path.join(dir, 'tokens.css'));
    ok('tokens.css');
  }
  if (exists(path.join(dir, 'components.css'))) {
    warn('components.css exists — skipping');
  } else {
    copyFile(path.join(ROOT, 'src/components/base.css'), path.join(dir, 'components.css'));
    ok('components.css (54+ components)');
  }
  if (skipJs) {
    info('--no-js — skipping components.js');
  } else if (exists(path.join(dir, 'components.js'))) {
    warn('components.js exists — skipping');
  } else {
    copyFile(path.join(ROOT, 'src/components/components.js'), path.join(dir, 'components.js'));
    ok('components.js (vanilla JS controllers)');
  }

  if (!skipDemo && !exists(path.join(dir, 'index.html'))) {
    const demo = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>DG demo</title>
  <link rel="stylesheet" href="tokens.css">
  <link rel="stylesheet" href="components.css">
</head>
<body style="padding:2rem;max-width:900px;margin:0 auto">
  <h1>Hello, design-gallery</h1>
  <p style="color:hsl(var(--muted-foreground));margin-bottom:1.5rem">
    Edit <code>tokens.css</code> to change the theme. Open <code>app/showcase.html</code> in the framework for the full component catalog.
  </p>

  <div class="cluster" style="margin-bottom:1rem">
    <button class="x-btn primary">primary</button>
    <button class="x-btn outline">outline</button>
    <button class="x-btn ghost">ghost</button>
    <button class="x-btn destructive">destructive</button>
  </div>

  <div class="x-card" style="max-width:360px;margin-bottom:1rem">
    <div class="x-card-header"><div class="x-card-title">Card</div><div class="x-card-desc">using framework tokens</div></div>
    <div class="x-card-content">Content area</div>
  </div>

  <div class="x-alert info"><span class="icon info">i</span><div class="body"><div class="title">All wired up</div><div class="desc">tokens.css + components.css linked. Add <code>&lt;script src="components.js"&gt;&lt;/script&gt;</code> for interactive components.</div></div></div>

  <script src="components.js"></script>
</body>
</html>
`;
    writeFile(path.join(dir, 'index.html'), demo);
    ok('index.html (demo page)');
  }

  log('');
  log(paint('bold', '  Next steps:'));
  dim('1. Edit tokens.css to override colors / radius / fonts');
  dim('2. Open index.html in browser');
  dim('3. Run: npx dg add component <name> to add more');
  dim('4. Run: npx dg theme mcky to see link snippet for a theme');
  log('');
}

// ----- add -----
function cmdAdd(args) {
  if (args.length === 0) return help('add');
  const sub = args[0];
  if (sub === 'component') return addComponent(args.slice(1));
  if (sub === 'theme')     return addTheme(args.slice(1));
  err(`unknown add subcommand: ${sub}`);
  help('add');
}

function addComponent(args) {
  if (args.length === 0) { err('component name required'); dim('run: dg list components'); return; }
  const name = args[0];
  const dirIdx = args.indexOf('--dir');
  const dir = path.resolve(dirIdx > -1 ? args[dirIdx + 1] : '.');
  const spec = COMPONENTS[name];
  if (!spec) {
    err(`unknown component: ${name}`);
    dim('run: dg list components');
    return;
  }

  log('');
  log(paint('bold', `  dg add component ${name}`) + paint('dim', ` → ${dir}`));
  log('');

  const cssPath = path.join(dir, 'components.css');
  const jsPath  = path.join(dir, 'components.js');

  // ensure target files exist
  if (!exists(cssPath)) {
    writeFile(cssPath, `/* components.css — DG components\n   imported: ${name}\n   add more with: npx dg add component <name> */\n\n`);
    ok(`created components.css`);
  }
  if (spec.js && !exists(jsPath)) {
    writeFile(jsPath, `/* components.js — DG controllers\n   imported: ${name}\n   add more with: npx dg add component <name> */\n\n`);
    ok(`created components.js`);
  }

  // extract CSS block from framework
  const sourceCss = readFile(path.join(ROOT, 'src/components/base.css'));
  const block = extractCssBlock(sourceCss, spec.css);
  if (!block) { err(`could not extract CSS for .${spec.css}`); return; }

  // append to components.css with marker
  const marker = `\n/* ── ${name} (added by dg) ── */\n`;
  if (readFile(cssPath).includes(marker.trim())) {
    warn(`${name} already in components.css — skipping`);
  } else {
    fs.appendFileSync(cssPath, marker + block + '\n');
    ok(`appended .${spec.css} to components.css`);
  }

  // extract JS if interactive
  if (spec.js) {
    const sourceJs = readFile(path.join(ROOT, 'src/components/components.js'));
    let jsBlock;
    if (spec.js === 'Toast') {
      // special: Toast is exported on window.DG
      const start = sourceJs.indexOf('const Toast = {');
      let depth = 0, i = start, found = false;
      for (; i < sourceJs.length; i++) {
        if (sourceJs[i] === '{') { depth++; found = true; }
        else if (sourceJs[i] === '}') { depth--; if (depth === 0 && found) break; }
      }
      jsBlock = sourceJs.slice(start, i + 1);
    } else if (Array.isArray(spec.js)) {
      jsBlock = extractJsFunctions(sourceJs, spec.js);
    } else {
      jsBlock = extractJsBlock(sourceJs, spec.js);
    }
    if (!jsBlock) { err(`could not extract JS for ${spec.js}`); return; }

    const jsMarker = `\n/* ── ${name} (added by dg) ── */\n`;
    if (readFile(jsPath).includes(jsMarker.trim())) {
      warn(`${name} already in components.js — skipping`);
    } else {
      fs.appendFileSync(jsPath, jsMarker + jsBlock + '\n');
      ok(`appended ${Array.isArray(spec.js) ? spec.js.length + ' fns' : spec.js} to components.js`);
    }
  }

  log('');
  log(paint('bold', '  Usage:'));
  dim(spec.js ? `<div class="${spec.css}">...</div>` : `<button class="${spec.css} primary">label</button>`);
  log('');
  log(paint('bold', '  Full example:'));
  const example = usageExample(name, spec);
  if (example) dim(example.replace(/\n/g, '\n    '));
  log('');
}

function usageExample(name, spec) {
  const ex = {
    btn: `<button class="x-btn primary">click me</button>
<button class="x-btn outline sm">small</button>
<button class="x-btn destructive">delete</button>`,
    input: `<input class="x-input" placeholder="type here">
<input class="x-input" type="email" placeholder="email">`,
    checkbox: `<label class="x-check"><input type="checkbox" checked> remember me</label>`,
    switch: `<label class="x-switch"><input type="checkbox" checked><span class="sl"></span></label>`,
    card: `<div class="x-card">
  <div class="x-card-header"><div class="x-card-title">Title</div></div>
  <div class="x-card-content">Body</div>
  <div class="x-card-footer"><button class="x-btn sm primary">save</button></div>
</div>`,
    alert: `<div class="x-alert info">
  <span class="icon info">i</span>
  <div class="body"><div class="title">Heads up</div><div class="desc">message</div></div>
</div>`,
    badge: `<span class="x-badge">default</span>
<span class="x-badge success">ok</span>`,
    tabs: `<div class="x-tabs">
  <div class="x-tabs-list">
    <button class="x-tabs-trigger" data-state="active" data-panel="t1">Tab 1</button>
    <button class="x-tabs-trigger" data-panel="t2">Tab 2</button>
  </div>
  <div class="x-tabs-content" id="t1">content 1</div>
  <div class="x-tabs-content" id="t2" hidden>content 2</div>
</div>`,
    accordion: `<div class="x-accordion">
  <div class="x-accordion-item">
    <button class="x-accordion-trigger" aria-expanded="true">Item 1</button>
    <div class="x-accordion-content"><div class="inner">content 1</div></div>
  </div>
  <div class="x-accordion-item">
    <button class="x-accordion-trigger" aria-expanded="false">Item 2</button>
    <div class="x-accordion-content" hidden><div class="inner">content 2</div></div>
  </div>
</div>`,
    dialog: `<button class="x-btn primary" data-dialog-open="my-dialog">open</button>

<div class="x-dialog" id="my-dialog">
  <div class="x-dialog-header">
    <div><div class="x-dialog-title">Title</div></div>
    <button class="x-dialog-close" data-dialog-close>✕</button>
  </div>
  <div class="x-dialog-body">content</div>
  <div class="x-dialog-footer">
    <button class="x-btn ghost" data-dialog-close>cancel</button>
  </div>
</div>`,
    sheet: `<button class="x-btn" data-sheet-open="my-sheet">open</button>
<div class="x-sheet right" id="my-sheet">
  <div class="x-sheet-header"><div class="x-dialog-title">Title</div>
    <button class="x-dialog-close" data-sheet-close>✕</button>
  </div>
  <div class="x-sheet-body">content</div>
</div>`,
    drawer: `<button class="x-btn" data-drawer-open="my-drawer">open</button>
<div class="x-drawer" id="my-drawer">
  <div class="x-drawer-handle"></div>
  <div class="x-sheet-header"><div class="x-dialog-title">Title</div>
    <button class="x-dialog-close" data-drawer-close>✕</button>
  </div>
  <div class="x-sheet-body">content</div>
</div>`,
    tooltip: `<span class="x-tooltip">
  <button class="x-btn outline">hover me</button>
  <span class="x-tooltip-content top">Tooltip text</span>
</span>`,
    popover: `<div class="x-popover">
  <button class="x-popover-trigger x-btn primary">open</button>
  <div class="x-popover-content bottom">
    <div style="padding:0.5rem">Popover content</div>
  </div>
</div>`,
    hovercard: `<span class="x-hovercard" data-delay="300">
  <a href="#">@username</a>
  <div class="x-hovercard-content bottom">
    <div style="font-weight:600">Name</div>
    <div style="font-size:12px;color:hsl(var(--muted-foreground))">bio</div>
  </div>
</span>`,
    menu: `<div class="x-menu">
  <button class="x-menu-trigger x-btn outline">menu ▾</button>
  <div class="x-menu-content bottom">
    <div class="x-menu-item" data-value="edit">Edit</div>
    <div class="x-menu-item" data-value="delete">Delete</div>
  </div>
</div>`,
    contextmenu: `<div class="x-contextmenu" data-target="#ctx-area">
  <div class="x-context-menu">
    <div class="x-menu-item" data-value="cut">Cut</div>
    <div class="x-menu-item" data-value="copy">Copy</div>
  </div>
</div>
<div id="ctx-area">right-click here</div>`,
    menubar: `<div class="x-menubar">
  <button class="x-menu-trigger">File</button>
  <div class="x-menu-content bottom">
    <div class="x-menu-item">New</div>
    <div class="x-menu-item">Open</div>
  </div>
  <button class="x-menu-trigger">Edit</button>
  <div class="x-menu-content bottom">
    <div class="x-menu-item">Undo</div>
  </div>
</div>`,
    navmenu: `<div class="x-navmenu">
  <button class="x-navmenu-trigger">Products</button>
  <div class="x-navmenu-content">
    <a class="x-navmenu-link" href="#"><span class="icon">🎨</span>
      <div><div class="title">Designer</div><div class="desc">for teams</div></div>
    </a>
  </div>
</div>`,
    toast: `// JS only — CSS for .x-toast is loaded
DG.Toast.success('Saved!');
DG.Toast.error('Failed', { description: 'exit code 1' });
DG.Toast.info('New version available');
DG.Toast.warning('Slow network');`,
    combobox: `<div class="x-combobox">
  <input type="text" placeholder="search...">
  <button class="trigger">▾</button>
  <div class="x-combobox-list" hidden>
    <div class="opt" data-value="a">Apple</div>
    <div class="opt" data-value="b">Banana</div>
  </div>
</div>`,
    command: `<div class="x-command">
  <div class="x-command-input">
    <input type="text" placeholder="Type a command...">
  </div>
  <div class="x-command-list">
    <div class="x-command-item">📅 Calendar</div>
    <div class="x-command-item">⚙️ Settings</div>
  </div>
</div>`,
    slider: `<div class="x-slider">
  <div class="x-slider-track">
    <div class="x-slider-range" style="width:50%"></div>
    <div class="x-slider-thumb" style="left:50%;transform:translateX(-50%)"></div>
  </div>
  <input type="range" min="0" max="100" value="50">
</div>`,
    calendar: `<div class="x-cal">
  <div class="x-cal-header">
    <div class="x-cal-title"></div>
    <div class="x-cal-nav">
      <button class="x-cal-prev">‹</button>
      <button class="x-cal-next">›</button>
    </div>
  </div>
  <div class="x-cal-grid"></div>
</div>`,
    datepicker: `<div class="x-datepicker">
  <input type="text" placeholder="YYYY-MM-DD" readonly>
  <div class="x-datepicker-popover" data-state="closed">
    <div class="x-cal">...</div>
  </div>
</div>`,
    carousel: `<div class="x-carousel">
  <div class="x-carousel-track">
    <div class="x-carousel-slide">slide 1</div>
    <div class="x-carousel-slide">slide 2</div>
  </div>
  <button class="x-carousel-prev">‹</button>
  <button class="x-carousel-next">›</button>
  <div class="x-carousel-dots">
    <button class="x-carousel-dot" data-active="true"></button>
    <button class="x-carousel-dot"></button>
  </div>
</div>`,
    resizable: `<div class="x-resizable vertical" style="height:200px">
  <div class="x-resizable-panel">A</div>
  <div class="x-resizable-handle"></div>
  <div class="x-resizable-panel">B</div>
</div>`,
    collapsible: `<div class="x-collapsible">
  <button class="x-collapsible-trigger" aria-expanded="false">
    Click to expand
  </button>
  <div class="x-collapsible-content" data-state="closed">
    <div style="padding:0.75rem">Hidden content</div>
  </div>
</div>`,
    togglegroup: `<div class="x-toggle-group" data-type="single">
  <button class="x-toggle" data-value="a" data-state="on" aria-pressed="true">A</button>
  <button class="x-toggle" data-value="b">B</button>
</div>`,
    table: `<div class="x-table-wrap">
  <table class="x-table">
    <thead><tr><th>name</th><th>status</th></tr></thead>
    <tbody>
      <tr><td>ada</td><td><span class="x-status ok">online</span></td></tr>
    </tbody>
  </table>
</div>`,
    form: `<form class="x-form">
  <div class="x-field">
    <label class="x-label">Name</label>
    <input class="x-input">
  </div>
  <div class="x-form-actions">
    <button class="x-btn primary" type="submit">save</button>
  </div>
</form>`,
    progress: `<div class="x-progress"><div class="fill" style="width:60%"></div></div>
<div class="x-progress success"><div class="fill" style="width:80%"></div></div>`,
    pagination: `<div class="x-pagination">
  <button class="p">‹</button>
  <button class="p active">1</button>
  <button class="p">2</button>
  <button class="p">›</button>
</div>`,
  };
  return ex[name] || `<div class="${spec.css}">...</div>`;
}

function addTheme(args) {
  if (args.length === 0) { err('theme id or file required'); dim('run: dg list themes'); return; }
  const arg = args[0];
  const dirIdx = args.indexOf('--dir');
  const dir = path.resolve(dirIdx > -1 ? args[dirIdx + 1] : '.');
  const dst = path.join(dir, 'theme.css');

  let src;
  if (exists(arg) && arg.endsWith('.css')) {
    src = path.resolve(arg);
  } else {
    src = path.join(ROOT, 'themes', arg, 'theme.css');
    if (!exists(src)) { err(`theme not found: ${arg}`); return; }
  }

  log('');
  log(paint('bold', `  dg add theme ${arg}`) + paint('dim', ` → ${dst}`));
  log('');
  copyFile(src, dst);
  ok('theme.css copied');
  log('');
  log(paint('bold', '  Link in HTML (after tokens.css, before components.css):'));
  dim('<link rel="stylesheet" href="theme.css">');
  log('');
}

// ----- theme -----
function cmdTheme(args) {
  if (args.length === 0) {
    const themes = listThemes();
    log('');
    log(paint('bold', '  Available themes:'));
    log('');
    if (!themes.length) { dim('  (no themes in themes/ — generate with: npx dg codegen <id>)'); }
    else themes.forEach((t) => log(`    ${paint('cyan', t.id.padEnd(14))} ${paint('dim', t.css ? '✓ theme.css' : '✗ missing')}`));
    log('');
    log('  ' + paint('bold', 'Usage:') + ' npx dg theme <id>');
    log('');
    return;
  }
  const id = args[0];
  const show = args.includes('--show');
  const themes = listThemes();
  const t = themes.find((x) => x.id === id);
  if (!t || !t.css) { err(`theme not found: ${id}`); dim('run: dg list themes'); return; }
  const css = readFile(t.css);
  log('');
  log(paint('bold', `  theme: ${id}`));
  if (t.json) {
    try {
      const meta = JSON.parse(t.json);
      if (meta.name) dim(`name: ${meta.name}`);
      if (meta.vibe) dim(`vibe: ${meta.vibe}`);
      if (meta.modes) dim(`modes: ${meta.modes.join(', ')}`);
    } catch {}
  }
  log('');
  log(paint('bold', '  Link snippet:'));
  log(paint('cyan', `    <link rel="stylesheet" href="src/tokens/schema.css">`));
  log(paint('cyan', `    <link rel="stylesheet" href="themes/${id}/theme.css">  <!-- override -->`));
  log(paint('cyan', `    <link rel="stylesheet" href="src/components/base.css">`));
  log('');
  if (show) {
    log(paint('bold', '  Contents:'));
    log('');
    css.split('\n').forEach((l) => dim(l));
  } else {
    dim(`tip: add --show to print the full theme.css content`);
  }
  log('');
}

// ----- list -----
function cmdList(args) {
  const what = args[0] || 'all';
  log('');
  if (what === 'themes' || what === 'all') {
    log(paint('bold', '  themes:'));
    const themes = listThemes();
    if (!themes.length) {
      dim('  (none — generate with: npx dg codegen <id>)');
    } else {
      themes.forEach((t) => {
        let meta = '';
        if (t.json) { try { const m = JSON.parse(t.json); if (m.name) meta = m.name; } catch {} }
        log(`    ${paint('cyan', t.id.padEnd(14))} ${paint('dim', t.css ? '✓' : '✗')}  ${meta}`);
      });
    }
    log('');
  }
  if (what === 'components' || what === 'all') {
    log(paint('bold', '  components:'));
    const byCat = {};
    for (const [name, spec] of Object.entries(COMPONENTS)) {
      (byCat[spec.cat] = byCat[spec.cat] || []).push({ name, js: spec.js });
    }
    for (const [cat, items] of Object.entries(byCat)) {
      log(`    ${paint('dim', cat)}`);
      items.forEach((i) => log(`      ${paint('cyan', i.name.padEnd(14))} ${paint('dim', i.js ? 'js' : 'css')}`));
    }
    log('');
    log('  ' + paint('dim', `total: ${COMPONENT_NAMES.length} components`));
    log('');
  }
}

// ----- serve -----
function cmdServe(args) {
  const portIdx = args.indexOf('--port');
  const port = portIdx > -1 ? parseInt(args[portIdx + 1], 10) : 3000;
  // delegate to build.js for now
  warn('serve is implemented in build.js (npm run serve) — coming in next phase');
  info(`for now use: npx dg check or python3 -m http.server ${port}`);
}

// ----- check -----
function cmdCheck() {
  const SRC = path.join(ROOT, 'src');
  const files = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.js')) files.push(p);
    }
  };
  walk(SRC);
  let bad = 0;
  log('');
  log(paint('bold', '  ┌─ DG source check ──'));
  for (const f of files) {
    try {
      execFileSync(process.execPath, ['--check', f], { stdio: 'pipe' });
      ok(path.relative(ROOT, f));
    } catch (e) {
      err(path.relative(ROOT, f) + ': ' + (e.stderr?.toString().split('\n').find((l) => l.includes('Error')) || e.message));
      bad++;
    }
  }
  log(bad === 0 ? paint('green', `  └─ ✓ all ${files.length} modules OK`) : paint('red', `  └─ ✗ ${bad} broken`));
  log('');
}

// ----- codegen (placeholder) -----
function cmdCodegen(args) {
  if (args.length === 0) { err('concept id required'); dim('e.g. npx dg codegen mcky'); return; }
  warn('codegen will be implemented in Phase 5 — uses tools/map.md mapping table');
  dim('for now, copy concepts/<id>.css manually and convert hex → HSL');
}

// =============================================================================
// Main
// =============================================================================
const [, , cmd, ...rest] = process.argv;

const handlers = {
  init:    cmdInit,
  add:     cmdAdd,
  theme:   cmdTheme,
  list:    cmdList,
  serve:   cmdServe,
  check:   cmdCheck,
  codegen: cmdCodegen,
  help:    (a) => help(a[0]),
  '--help':() => help(),
  '-h':    () => help(),
};

if (!cmd || cmd === 'help' || cmd === '--help' || cmd === '-h') {
  help();
} else if (handlers[cmd]) {
  try { handlers[cmd](rest); }
  catch (e) { err(e.message); if (process.env.DG_DEBUG) console.error(e); process.exit(1); }
} else {
  err(`unknown command: ${cmd}`);
  help();
}
