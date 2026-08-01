# Design Gallery

**Central design library** ของโปรเจกต์ — ที่รวม visual identity, design system,
และ theme engine ที่ทุกคนในทีมหยิบไปใช้ได้

> สร้างจากงาน redesign แอป Collage Maker (LINE LIFF) แต่ตอนนี้เป็น
> **คลัง design กลาง** — ไม่ผูกกับ app ตัวเดียว

## Docs & Reference

| File | ที่อยู่ | คืออะไร |
|---|---|---|
| **PLAN.md** | `PLAN.md` | Project plan — live URLs, structure ปัจจุบัน, workflow, roadmap |
| **README.md** | `README.md` | เอกสารคลัง design กลาง (ฉบับปัจจุบัน) |
| **index.html** | `index.html` | Landing page (card list — 6 designs) |
| Core | `src/js/core/` | design-system core — `canvas-renderer.js` (client), `sharp-renderer.js` (production), `overlays.js`, `app.js` |
| Engine | `src/js/engine/` | theme-agnostic core — layout, photo, export |
| Themes | `src/js/themes/<id>/` | 1 โฟลเดอร์ต่อ design — manifest.js (+ optional canvas.js) |

> **STACK//FRAME เต็มรูปแบบ** (rack units + LEDs + brushed metal) ดูได้ที่
> `https://192.168.1.47/status/` (device-status) และ `concepts/rack.html` ในคลัง

## Live URLs (LAN)

| Page | URL | Notes |
|---|---|---|
| **Gallery Index** (landing) | https://192.168.1.47/design/ | card list — เลือก design ได้ |
| Concept RACK | https://192.168.1.47/design/concepts/rack.html | **full components** — buttons, inputs, controls, table, terminal |
| Concept CRT | https://192.168.1.47/design/concepts/crt.html | **full components** — phosphor green, scanlines, mono |
| Concept NOC | https://192.168.1.47/design/concepts/noc.html | **full components** — cyan + grid, monitoring-style |
| Concept MIN | https://192.168.1.47/design/concepts/min.html | **full components** — minimal, lime accent, Inter |
| **Concept GLITCHPAGE** | https://192.168.1.47/design/concepts/glitchpage.html | **full components** — error page, neon pink + glitch |
| **Concept CLAUDE PAPER** | https://192.168.1.47/design/concepts/claude.html | **full components** — warm editorial, clay accent, **dual light/dark mode** |

## Component Coverage (per concept)

แต่ละ concept page แสดง component **15+ แบบ** ในสไตล์ของธีมนั้น:
button (variants, sizes) · input/textarea/select · checkbox/radio/switch · card · status pill · badge (filled/outline/muted) · kbd · alert · tabs · progress · pagination · spinner · table · terminal · breadcrumb

## 6 Designs ในคลัง

| # | Name | id | Vibe | Production |
|---|---|---|---|---|
| 1 | `STACK//FRAME` | rack | Server rack, brushed metal, amber LEDs | `/status` (device-status) |
| 2 | `PIXSH v1.0` | crt | Retro CRT, phosphor green, scanlines | Glance dashboard |
| 3 | `PACKETGRID` | noc | NOC dashboard, dark slate, cyan + green | design reference |
| 4 | `collage.sh` | min | Minimal geek, lime accent | default theme |
| 5 | `GLITCHPAGE` | glitchpage | Error-page DNA — dark navy, drift grid, glitch number, terminal, Thai copy | nginx error pages (design source — deploy pending) |
| 6 | `CLAUDE PAPER` | claude | Warm editorial — clay accent, paper surfaces, bilingual serif, **dual light/dark mode** | Obsidian theme (unofficial, from law-of-cycles/claude-paper-obsidian) |

## Architecture: Design = Plugin

Engine เป็น theme-agnostic. แต่ละ design เป็น plugin เต็มตัว:

```
src/
├── engine/            ← theme-agnostic core (layout, photo, export)
├── core/              ← canvas-renderer + sharp-renderer + overlays lib
└── themes/            ← 1 โฟลเดอร์ต่อ design — manifest.js (+ optional canvas.js)
```

> **Concept pages เป็น standalone เต็มตัว** — `concepts/<id>.html` โยง CSS ของตัวเอง
> (`concepts/<id>.css`) ไม่ได้แชร์ template กลาง เพราะแต่ละ concept คือ brand identity
> ที่แยกกันชัดเจน เปลี่ยนอะไรในหน้าเดียวไม่กระทบหน้าอื่น

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

### 1. เป็น standalone หน้า UI
แต่ละ concept อยู่ใน `concepts/<id>.html` + `concepts/<id>.css` — คัดลอกทั้งคู่ไปใช้กับหน้าโปรเจกต์คุณ
(fonts ต้องโหลดตาม `<head>` ของ concept นั้น — ดู Google Fonts link ในหน้า)

### 2. เป็น reference ในโค้ด
manifest = แหล่งข้อมูลสี/type/motion ต่อ design — อ่านจาก `themes/<id>/manifest.js`

## Build / Tooling

```bash
npm run check   # syntax-check ทุก source module (zero dependency — ไม่ต้อง npm install)
```

`build.js` ใช้ node builtins ล้วนๆ — ไม่มี bundler, ไม่มี devDependencies.

## Adding a new design

```
1. mkdir src/js/themes/<id>
2. เขียน manifest.js (canvas spec + ui copy)
3. เขียน canvas.js (hooks เฉพาะถ้ามี)
4. register ใน src/js/themes/index.js
5. (ถ้าต้องการหน้า components แสดงสไตล์) สร้าง concepts/<id>.html + concepts/<id>.css standalone
6. npm run check && push
```

## Tech

- Vanilla ES modules (ESM) — zero dependency, ไม่ต้อง npm install
- GSAP via CDN (theme transitions ใน preview pages)
- Canvas API (client) + sharp (production backend renderer)
- Manifest-driven — design เปลี่ยน = แก้ manifest ไม่แตะ logic
- Fonts: Inter + JetBrains Mono (gallery), Source Serif 4 / Source Han Serif (CLAUDE PAPER)

## Repo

- GitHub: https://github.com/ktypez/design-gallery
- Served: nginx `/design/` → `/home/admin/design-gallery/`
