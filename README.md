# Collage Design

Brand refresh exploration for the **Collage Maker** LINE LIFF app.

This is a **standalone design project** — separate from the production codebase.
The goal: explore 4 visual directions (rack / CRT / NOC / minimal), iterate freely,
and pick the best one for re-skinning the production app.

## Live URLs (LAN)

| Page | URL | Notes |
|---|---|---|
| Gallery (4 concepts) | https://lab.local/design/preview.html | Landing |
| Theme switcher (interactive) | https://lab.local/design/preview-themes.html | Try all 4 themes live |
| Collage maker (working app) | https://lab.local/design/app.html | Real upload → canvas → PNG download |

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
| STACK//FRAME | `/status` (device-status) | https://lab.local/status/ |
| PIXSH CRT | Glance (root dashboard) | https://lab.local/ |
| PACKETGRID | LIFF collage production | https://lab.local/collage/ |
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

- Vanilla HTML/CSS/JS — no build step
- GSAP via CDN for theme transitions
- Canvas API for collage composition
- No backend, no LINE LIFF (app.html is offline-capable)

## Setup

This project is **served via nginx** (location `/design/`) from
`/home/admin/collage-design/`. No build/dev server needed.

To preview locally:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/preview.html
```

## Reverting

The production app (LIFF collage) is **not** in this folder.
The actual production code is at `/home/admin/collage/frontend/index.html`.
If you want to revert that to a previous theme, restore from
`/home/admin/collage/frontend/_archive/`.
// test
