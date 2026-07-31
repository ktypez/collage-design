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
├── preview.html               ← gallery index (4 concept cards)
├── preview-rack.html          ← standalone STACK//FRAME concept
├── preview-crt.html           ← standalone PIXSH concept
├── preview-noc.html           ← standalone PACKETGRID concept
├── preview-minimal.html       ← standalone collage.sh concept
├── preview-themes.html        ← interactive theme switcher (all 4 in one)
└── app.html                   ← working collage maker (themeable, 4 themes)
```

## Tech

- Vanilla HTML/CSS/JS — no build step required (but optional, see below)
- GSAP via CDN for theme transitions
- Canvas API for collage composition
- No backend, no LINE LIFF (app.html is offline-capable)

## Setup

This project is **served via nginx** (location `/design/`) from
`/home/admin/collage-design/`. No build needed for serving.

To preview locally without nginx:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/preview.html
```

## Build (optional — asset optimization)

A build script is included that minifies HTML + inline CSS + inline JS
and optimizes inline SVGs using `html-minifier-terser` and `svgo`.

```bash
npm install            # one-time
npm run build         # minify → ./dist/
npm run size          # show before/after sizes
npm run preview       # serve dist/ on :8000
npm run build:watch   # rebuild on change
npm run clean         # remove dist/
```

Typical savings: **~28% smaller files** (~61KB saved across 7 files).

The `dist/` output is gitignored — only source files are tracked.

## Reverting

The production app (LIFF collage) is **not** in this folder.
The actual production code is at `/home/admin/collage/frontend/index.html`.
If you want to revert that to a previous theme, restore from
`/home/admin/collage/frontend/_archive/`.
