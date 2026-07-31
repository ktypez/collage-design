# Design Gallery

**Central design library** ของโปรเจกต์ — ที่รวม visual identity, design system,
และ theme engine ที่ทุกคนในทีมหยิบไปใช้ได้

> สร้างจากงาน redesign แอป Collage Maker (LINE LIFF) แต่ตอนนี้เป็น
> **คลัง design กลาง** — ไม่ผูกกับ app ตัวเดียว

## Docs & Reference

| File | ที่อยู่ | คืออะไร |
|---|---|---|
| **PLAN.md** | `PLAN.md` | จุดเริ่มต้นของโปรเจกต์ — แผน/README เดิม (collage-design brand refresh) กู้คืนจาก git history |
| **README.md** | `README.md` | เอกสารคลัง design กลาง (ฉบับปัจจุบัน) |
| Core | `src/js/core/` | design-system core — `canvas-renderer.js` (client), `sharp-renderer.js` (production), `overlays.js`, `app.js` |
| Engine | `src/js/engine/` | theme-agnostic core — layout, photo, export |
| Themes | `src/js/themes/<id>/` | 1 โฟลเดอร์ต่อ design — manifest.js + canvas.js |

> **STACK//FRAME เต็มรูปแบบ** (rack units + LEDs + brushed metal) ดูได้ที่
> `https://192.168.1.47/status/` (device-status) และ `preview-rack.html` ในคลัง

## Live URLs (LAN)

| Page | URL | Notes |
|---|---|---|
| **Gallery Index** (landing) | https://192.168.1.47/design/preview.html | เข้าเริ่มต้นที่นี่ |
| **Review Gallery** | https://192.168.1.47/design/review.html | รีวิวเชิงลึกของแต่ละ design |
| Theme Switcher | https://192.168.1.47/design/preview-themes.html | ลอง 4 ธีมสลับสด |
| Concept RACK | https://192.168.1.47/design/preview-rack.html | standalone |
| Concept CRT | https://192.168.1.47/design/preview-crt.html | standalone |
| Concept NOC | https://192.168.1.47/design/preview-noc.html | standalone |
| Concept MIN | https://192.168.1.47/design/preview-minimal.html | standalone |

## 4 Designs ในคลัง

| # | Name | id | Vibe | Production |
|---|---|---|---|---|
| 1 | `STACK//FRAME` | rack | Server rack, brushed metal, amber LEDs | `/status` (device-status) |
| 2 | `PIXSH v1.0` | crt | Retro CRT, phosphor green, scanlines | Glance dashboard |
| 3 | `PACKETGRID` | noc | NOC dashboard, dark slate, cyan + green | design reference |
| 4 | `collage.sh` | min | Minimal geek, lime accent | default (7-days output) |

ดูรีวิวเต็ม (concept, strengths, weaknesses, best-for, specs, ratings) ได้ที่
**Review Gallery** — `review.html`

## Architecture: Design = Plugin

Engine เป็น theme-agnostic. แต่ละ design เป็น plugin เต็มตัว:

```
src/
├── engine/            ← theme-agnostic core (layout, photo, export)
├── core/              ← canvas-renderer + sharp-renderer + overlays lib
├── themes/
│   ├── rack/{manifest.js, canvas.js, ui.css}
│   ├── crt/ ...
│   ├── noc/ ...
│   └── min/ ...
└── index.html         ← app shell (source)
```

### `manifest.js` = single source of truth

```js
// themes/rack/manifest.js (example)
export const manifest = {
  id: 'rack', name: 'STACK//FRAME',
  ui: { heroMeta, genReady, outputTitle, ... },      // copy
  canvas: {
    bg: { gradient: ['#2a2a30', '#1c1c20', '#2a2a30'] },
    cell: { border: '#3a3a42', width: 3, label: 'UNIT {n}', ... },
    overlay: 'none', photoFx: 'none',
    chrome: { rails: {...}, leds: {...} },           // declarative chrome
  },
  hooks: { preDraw: drawRackRails, postDraw: drawRackLeds },  // client-only hooks
};
```

- **client canvas** (`core/canvas-renderer.js`) อ่าน manifest → วาด
- **production backend** (`core/sharp-renderer.js`) อ่าน manifest ตัวเดียวกัน → sharp
- เพิ่ม design ใหม่ = ใส่โฟลเดอร์ใน `themes/` + ลงทะเบียนใน `themes/index.js` — engine ไม่แตะ

### Render pipeline (ทั้ง client + sharp)
1. `hooks.preDraw` / chrome rails (behind)
2. background (manifest)
3. header (name/date)
4. photo cells (cover-fit + border + label + photoFx)
5. `hooks.postDraw` / chrome LEDs/bezel (on top)
6. generic overlays (scanline / vignette / grid / connectors)

## วิธีหยิบไปใช้

### 1. เป็น design ที่ใช้กับ backend (sharp rendering)
```bash
npm run copy:backend   # sync themes + sharp-renderer + fonts → /home/admin/collage/backend/design-system/
```
แล้ว backend เรียก `theme=rack|crt|noc|min` ใน API — ภาพ collage ออกตาม design

### 2. เป็น standalone หน้า UI
เปิด `preview-<id>.html` หรือคัดลอก CSS จาก `src/css/themes/<id>/ui.css` +
`base.css` ไปใช้กับหน้าโปรเจกต์คุณ (`<html data-theme="<id>">`)

### 3. เป็น reference ในโค้ด
manifest = แหล่งข้อมูลสี/type/motion ต่อ design — อ่านจาก `themes/<id>/manifest.js`

## Build / Tooling

```bash
npm install            # one-time (esbuild, html-minifier-terser, svgo)
npm run build          # = copy:backend (sync design-system → production)
npm run check          # syntax-check ทุก source module
```

`build.js` ถูกตัดเหลือเป็น **design-system sync tool** แล้ว (ไม่มี app bundling —
local collage maker ถูกถอดออกจากคลังแล้ว)

## Adding a new design

```
1. mkdir src/js/themes/<id>
2. เขียน manifest.js (canvas spec + ui copy)
3. เขียน canvas.js (hooks เฉพาะถ้ามี) + ui.css (ถ้ามี UI)
4. register ใน src/js/themes/index.js
5. npm run check && npm run copy:backend
6. push → production ใช้ได้ทันที
```

## Tech

- Vanilla ES modules — esbuild bundle (ถ้าต้องการ)
- GSAP via CDN (theme transitions)
- Canvas API (client) + sharp (production backend)
- Manifest-driven — design เปลี่ยน = แก้ manifest ไม่แตะ logic

## Repo

- GitHub: https://github.com/ktypez/collage-design
- Served: nginx `/design/` → `/home/admin/design-gallery/`
- Source of truth: production backend syncs from here (`npm run copy:backend`)
