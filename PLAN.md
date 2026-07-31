# Design Gallery — Project Plan

คลัง design กลาง — รวม visual identity, design system, และ theme engine
ที่ทุกคนในทีมหยิบไปใช้ได้ (theme-agnostic engine + design = plugin)

> **Origin:** เริ่มจาก brand refresh ของแอป Collage Maker (LINE LIFF) ในปี 2026
> ตอนนี้ขยายเป็น central design library — แต่ละ design เป็น plugin เต็มตัว

## Live URLs (LAN)

> nginx `/design/` → `/home/admin/design-gallery/`

| Page | URL | Notes |
|---|---|---|
| **Gallery Index** (landing) | https://192.168.1.47/design/preview.html | เข้าเริ่มต้นที่นี่ — สลับธีมได้ |
| Concept RACK | https://192.168.1.47/design/preview/rack.html | standalone STACK//FRAME |
| Concept CRT | https://192.168.1.47/design/preview/crt.html | standalone PIXSH v1.0 |
| Concept NOC | https://192.168.1.47/design/preview/noc.html | standalone PACKETGRID |
| Concept MIN | https://192.168.1.47/design/preview/min.html | standalone collage.sh |
| Concept GLITCHPAGE | https://192.168.1.47/design/preview/glitchpage.html | standalone — error page theme (403/404/500/502/503) |

## 5 Designs ในคลัง

| # | Name | id | Vibe | Production |
|---|---|---|---|---|
| 1 | `STACK//FRAME` | rack | Server rack, brushed metal, amber LEDs | `/status` (device-status) |
| 2 | `PIXSH v1.0` | crt | Retro CRT, phosphor green, scanlines | Glance dashboard |
| 3 | `PACKETGRID` | noc | NOC dashboard, dark slate, cyan + green | design reference |
| 4 | `collage.sh` | min | Minimal geek, lime accent | default theme |
| 5 | `GLITCHPAGE` | glitchpage | Error-page DNA — dark navy, drift grid, glitch number, terminal, Thai copy | nginx error pages (design source — deploy pending) |

## File structure (current)

```
design-gallery/
├── README.md                   ← main docs (current)
├── PLAN.md                     ← you are here
├── build.js                    ← zero-dep tooling (npm run check)
├── package.json
├── preview.html                ← gallery index (landing, theme switcher)
├── preview/
│   ├── rack.html               ← standalone STACK//FRAME concept
│   ├── crt.html                ← standalone PIXSH v1.0 concept
│   ├── noc.html                ← standalone PACKETGRID concept
│   ├── min.html                ← standalone collage.sh concept
│   └── glitchpage.html         ← standalone GLITCHPAGE (error page) concept
└── src/
    ├── assets/fonts/           ← JetBrainsMono, VT323
    ├── css/
    │   ├── base.css
    │   ├── main.css
    │   └── themes/<id>/ui.css  ← per-theme UI tokens + chrome
    └── js/
        ├── main.js
        ├── core/               ← canvas-renderer, sharp-renderer, overlays, app
        ├── engine/             ← layout, photo, export (theme-agnostic)
        └── themes/<id>/        ← manifest.js + (optional) canvas.js
```

> **App shell (LIFF collage) ถูกถอดออกจากคลังแล้ว** — ไม่มี `app.html` ในรีโปนี้
> production code อยู่ที่ `/home/admin/collage/frontend/index.html` แยกต่างหาก

## Architecture: Design = Plugin

```
engine (theme-agnostic)   ← layout / photo / export
       ↑
   renderers (core)        ← canvas-renderer (client) + sharp-renderer (production)
       ↑
   overlays (generic)      ← scanline / vignette / grid / connectors
       ↑
   design = plugin         ← src/js/themes/<id>/{manifest.js, canvas.js, ui.css}
```

1 เพิ่ม design ใหม่ = ใส่โฟลเดอร์ + register ใน `themes/index.js` — engine ไม่แตะ

### `manifest.js` = single source of truth

- `ui` → copy (heroMeta, genReady, outputTitle, ...)
- `canvas` → bg, cell, header, overlay, photoFx, chrome
- `tokens` → design tokens (colors, type, motion)
- `statuses` → optional: per-code copy (เช่น GLITCHPAGE ใช้กับ nginx 403/404/...)
- `hooks` → preDraw / postDraw (client-only custom draw)

ทั้ง client canvas และ production backend อ่าน manifest เดียวกัน

## Tech

- Vanilla ES modules (ESM) — ไม่มี bundler
- Canvas API (client) + sharp (production backend)
- GSAP via CDN (theme transitions ใน preview pages)
- Manifest-driven — design เปลี่ยน = แก้ manifest ไม่แตะ logic
- Fonts: JetBrains Mono (mono), VT323 (CRT), Kanit + Sarabun (GLITCHPAGE)
- Tooling: ไม่มี devDependencies — `build.js` ใช้ node builtins ล้วนๆ

## Build / Check

```bash
npm run check   # syntax-check ทุก source module ใน src/js (zero dependency)
```

## Workflow การเพิ่ม design ใหม่

```
1. mkdir src/js/themes/<id>
2. เขียน manifest.js (canvas spec + ui copy + tokens)
3. เขียน canvas.js (hooks เฉพาะถ้ามี)
4. เขียน src/css/themes/<id>/ui.css (vars + chrome — ถ้ามี UI)
5. register ใน src/js/themes/index.js
6. สร้าง preview/<id>.html (standalone demo)
7. อัปเดต preview.html (var block + theme chip)
8. อัปเดต README.md + PLAN.md
9. npm run check
```

## Roadmap (2026 Q3)

- [x] Plugin architecture (engine + design = plugin)
- [x] sharp-renderer (production backend) — ใช้ manifest เดียวกับ client
- [x] Per-theme ui.css (UI tokens + chrome)
- [x] 5 designs: rack / crt / noc / min / glitchpage
- [ ] **Deploy GLITCHPAGE** → generate 403/404/500/502/503.html จาก manifest
  แล้ว deploy ไปที่ `/var/www/localhost/htdocs/`
- [ ] Design tokens sync (CSS variables) — ปัจจุบันฝังใน ui.css แต่ละ theme
- [ ] review.html — รีวิวเชิงลึกต่อ design (ถูกลบไปก่อนหน้าใน commit `0ced6b4`)

## Archive

- `review.html` / `preview-themes.html` / `app.html` — ถูกลบไปแล้วใน commit `0ced6b4`
  (ถ้าต้องการกู้คืน ดู git history)
- PLAN.md ฉบับก่อนหน้าเป็น "Collage Design" brand refresh exploration doc
  (เก่ามาก ไม่ตรงกับปัจจุบัน — เขียนใหม่หมด 2026-07-31)
