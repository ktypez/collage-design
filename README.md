# Collage Design

Brand refresh exploration for the **Collage Maker** LINE LIFF app.

This is a **standalone design project** — separate from the production codebase.
The goal: explore 4 visual directions (rack / CRT / NOC / minimal), iterate freely,
and pick the best one for re-skinning the production app.

## Live URLs (LAN)

| Page | URL | Notes |
|---|---|---|
| Gallery (4 concepts) | https://192.168.1.47/design/preview.html | Landing |
| Theme switcher (interactive) | https://192.168.1.47/design/preview-themes.html | Try all 4 themes live |
| Collage maker (working app) | https://192.168.1.47/design/app.html | Real upload → canvas → PNG download |

## Concepts

| # | Name | Brand | Vibe |
|---|---|---|---|
| 1 | `STACK//FRAME` | rack | Server rack, brushed metal, amber LEDs |
| 2 | `PIXSH v1.0` | crt | Retro CRT terminal, phosphor green, scanlines |
| 3 | `PACKETGRID` | noc | NOC dashboard, dark slate, cyan + green |
| 4 | `collage.sh` | min | Minimal geek, lime accent, monospace details |

## Where each theme is used

| Theme | Service | URL |
|---|---|---|
| STACK//FRAME | `/status` (device-status) | https://192.168.1.47/status/ |
| PIXSH CRT | Glance (root dashboard) | https://192.168.1.47/ |
| PACKETGRID | LIFF collage production | https://report.mcky.space/liff (Vercel) · https://192.168.1.47/collage/ (LAN) |
| collage.sh | _(not deployed, gallery only)_ | — |

## File structure

```
collage-design/
├── README.md                  ← you are here
├── app.html                   ← ★ BUILT single-file collage maker (served by nginx)
├── src/                       ← ★ SOURCE OF TRUTH (modular)
│   ├── index.html             ← HTML shell (theme picker + day presets)
│   ├── css/
│   │   ├── base.css           ← shared components (uses CSS vars)
│   │   ├── main.css           ← CSS entry (@imports base + themes)
│   │   └── themes/*/ui.css    ← per-theme UI chrome ([data-theme="X"])
│   └── js/
│       ├── main.js            ← entry point
│       ├── engine/            ← theme-agnostic core
│       │   ├── layout.js      ← layouts + cover-fit + day presets
│       │   ├── photo.js       ← file → image loading
│       │   └── export.js      ← PNG download + clipboard
│       ├── core/
│       │   ├── canvas-renderer.js ← generic theme-aware renderer
│       │   ├── overlays.js    ← scanline/vignette/grid/connectors lib
│       │   └── app.js         ← app wiring (theme switch, upload, generate)
│       └── themes/
│           ├── index.js       ← registry (add theme here)
│           ├── rack/{manifest.js, canvas.js}   ← STACK//FRAME
│           ├── crt/{manifest.js, canvas.js}    ← PIXSH
│           ├── noc/{manifest.js, canvas.js}    ← PACKETGRID
│           └── min/{manifest.js, canvas.js}    ← collage.sh (DEFAULT)
├── preview.html               ← gallery index (4 concept cards)
├── preview-rack.html          ← standalone STACK//FRAME concept
├── preview-crt.html           ← standalone PIXSH concept
├── preview-noc.html           ← standalone PACKETGRID concept
├── preview-minimal.html       ← standalone collage.sh concept
├── preview-themes.html        ← interactive theme switcher (all 4 in one)
```

## Architecture: Theme as Plugin

**Engine is theme-agnostic.** Each theme is a self-contained plugin:

```
themes/<id>/
├── manifest.js   ← 🎨 DECLARATIVE spec (bg, cells, header, overlay, photoFx, hooks)
├── canvas.js     ← custom draw hooks (rails, bezel, accent strip...)
└── ui.css        ← UI chrome for the app shell
```

**`manifest.js` = single source of truth** — drives the canvas renderer.
Adding a new theme = drop a folder + register in `themes/index.js`. Engine untouched.

```js
// themes/rack/manifest.js (example)
export const manifest = {
  id: 'rack', name: 'STACK//FRAME',
  ui: { heroMeta, genReady, outputTitle, ... },   // copy
  canvas: {
    bg: { gradient: ['#2a2a30', '#1c1c20', '#2a2a30'] },
    cell: { border: '#3a3a42', width: 3, label: 'UNIT {n}', ... },
    overlay: 'none', photoFx: 'none',
    presetAccent: false,                            // ← only min = true
  },
  hooks: { preDraw: drawRackRails, postDraw: drawRackLeds },
};
```

**Canvas rendering pipeline** (generic, in `core/canvas-renderer.js`):
1. `hooks.preDraw` (rails/grid/connectors behind)
2. background (manifest)
3. header text (manifest + glow/LED)
4. photo cells (cover-fit + border + label + photoFx)
5. `hooks.postDraw` (LEDs/bezel/accent)
6. generic overlays (scanline / vignette / ...)

## Day presets (7 colors)

The 7 day-of-week gradients (`sun`..`sat`) belong **only to the default theme**
(`collage.sh` / min) via `presetAccent: true`. When min is active the day picker
appears and the chosen gradient renders as an accent strip on the exported PNG.
Other themes ignore day presets.

## Tech

- Vanilla HTML/CSS/JS modules — esbuild bundles to single-file app.html
- GSAP via CDN for theme transitions
- Canvas API for collage composition (theme-aware, manifest-driven)
- No backend, no LINE LIFF (app.html is offline-capable)

## Setup

This project is **served via nginx** (location `/design/`) from
`/home/admin/collage-design/`. The built `app.html` needs no build at serve time.

To preview locally without nginx:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/preview.html
```

## Build

The build bundles `src/` (ES modules + CSS) into the single-file `app.html`
via esbuild, then minifies HTML/CSS/JS and optimizes inline SVGs.

```bash
npm install            # one-time (esbuild, html-minifier-terser, svgo)
npm run build         # bundle src/ → app.html
npm run build:watch   # rebuild on change
npm run preview       # serve app.html on :8000
npm run copy:backend  # (Method A) copy design-system → production backend
npm run clean         # remove .tmp/ + app.html
```

`app.html` is committed so nginx serves it even without node installed.
During development, edit files under `src/` then `npm run build`.

Typical savings: **~28% smaller files** (~61KB saved across 7 files).

The `dist/` output is gitignored — only source files are tracked.

## Reverting

The production app (LIFF collage) is **not** in this folder.
The actual production code is at `/home/admin/collage/frontend/index.html`.
If you want to revert that to a previous theme, restore from
`/home/admin/collage/frontend/_archive/`.
