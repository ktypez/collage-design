# Design Gallery Framework

> **Shadcn-inspired vanilla framework** — 54 theme-able components, 9 starter themes, zero dependencies, zero build step.

Design Gallery คือ framework เปล่าๆ ที่ให้ component primitives + token system + themes โดยไม่ผูกกับ framework ไหนเลย. ใช้ HTML ตรงๆ + CSS variables + vanilla JS — copy 3 files, link ใน `<head>`, เปลี่ยนธีมได้ด้วยการ override `:root`.

```
┌─────────────────────────────────────────────┐
│  <link rel="stylesheet" href="tokens.css"> │  ← design tokens
│  <link rel="stylesheet" href="theme.css">  │  ← your theme (optional)
│  <link rel="stylesheet" href="base.css">   │  ← 54 components
│  <script src="components.js"></script>     │  ← interactive behavior
└─────────────────────────────────────────────┘
```

## Why?

| Problem | Solution |
|---|---|
| Component library ใหญ่ เพิ่ม deps เยอะ | ~25KB รวม CSS+JS, **0 dependencies** |
| Theme แต่ละอัน fork library ใหม่ | เปลี่ยนธีม = override 1 file ไม่แตะ component |
| ใช้ React/Tailwind ต้อง build step | Vanilla HTML+CSS+JS — เปิดใน browser ตรงๆ |
| HSL space-separated ช่วย opacity | ทุก color เป็น `H S% L%` → `hsl(var(--*) / 0.5)` ได้เลย |
| ไม่อยากเริ่ม design system ใหม่ทุก project | 54 components + 9 themes พร้อมใช้ |

## Quick start

### ทาง CLI (แนะนำ)

```bash
# scaffold โปรเจกต์ใหม่
npx dg init my-app
cd my-app
python3 -m http.server 3000   # เปิด index.html
```

### ทาง manual

```bash
# copy 3 files
cp src/tokens/schema.css   tokens.css
cp src/components/base.css  components.css
cp src/components/components.js components.js
```

แล้ว link ใน HTML:

```html
<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="themes/mcky/theme.css">  <!-- optional override -->
<link rel="stylesheet" href="components.css">
<script src="components.js" defer></script>
```

## CLI (`dg`)

```bash
npx dg init [dir]              # scaffold ใน target dir
npx dg add component <name>    # copy component เดียว + JS deps
npx dg add theme <id|file>     # copy theme file
npx dg theme <id>              # show link snippet
npx dg list [themes|c]         # list 9 themes / 53 components
npx dg codegen [id...]         # regenerate theme.css from canonical map
npx dg check                   # syntax check + token contract
npx dg help [cmd]              # contextual help
```

ตัวอย่าง:

```bash
npx dg add component dialog    # ได้ .x-dialog + bindOverlay + 4 helpers
npx dg add theme mcky          # copy themes/mcky/theme.css เข้าโปรเจกต์
npx dg theme brut --show        # print brut/theme.css เนื้อหาเต็ม
```

## Components (54+)

**Foundations (12):** button, input, textarea, select, checkbox, radio, switch, label, separator, skeleton, kbd, toggle

**Surfaces (10):** card, alert, badge, status-pill, blockquote, code, terminal, empty, avatar, aspect-ratio

**Data (8):** table, tabs, accordion, progress, pagination, breadcrumb, scroll-area, spinner

**Forms (7):** form, field, item, slider, toggle-group, combobox, command-palette

**Overlays (11):** dialog, sheet (4 directions), drawer, popover, tooltip, hover-card, dropdown-menu, context-menu, menubar, navigation-menu (mega), toast

**Advanced (6):** resizable, collapsible, calendar, date-picker, carousel

```html
<button class="x-btn primary sm">click</button>
<input class="x-input" placeholder="email">
<div class="x-card"><div class="x-card-title">title</div></div>
<button data-dialog-open="my">open</button>
<div class="x-dialog" id="my">…</div>
```

ดูทั้งหมดพร้อม variants ใน [showcase](app/showcase.html) (รัน `python3 -m http.server` แล้วเปิด)

## Themes (9 + custom)

ธีมทั้งหมด override schema tokens — components ไม่รู้จักธีม ใช้แค่ `var(--*)`

| id | name | DNA | mode |
|---|---|---|---|
| `mcky` | mcky.space | neobrutalism, 3px border, hard shadow, mono 100% | dual |
| `rack` | STACK//FRAME | server rack, amber LED, Inter+mono | dark |
| `crt` | PIXSH v1.0 | phosphor green, scanlines, VT323 | dark |
| `noc` | PACKETGRID | NOC dashboard, cyan+green | dark |
| `min` | collage.sh | minimal, olive lime accent | light |
| `glitchpage` | GLITCHPAGE | error page, neon pink, Thai | dark |
| `claude` | CLAUDE PAPER | warm editorial, clay, Source Serif | dual |
| `moss` | MOSS | organic, earth + terracotta, Fraunces | light |
| `brut` | BRUT | brutalist, red+black, Anton | light |

### ใช้ธีม

```html
<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="themes/mcky/theme.css">  <!-- override -->
<link rel="stylesheet" href="components.css">
```

### สร้างธีมใหม่

**ทางเร็ว** — เปิด [theme-builder.html](app/theme-builder.html), เลือก preset → tweak → download

**ทาง code** — เขียน `theme.css` เอง:

```css
:root {
  --background: 60 17% 95%;
  --foreground: 0 0% 0%;
  --primary: 50 100% 71%;
  --radius: 0.375rem;
  --border-width: 3px;
  --shadow: 4px 4px 0 hsl(var(--border));
  --font-sans: 'JetBrains Mono', ui-monospace, monospace;
}

[data-mode="dark"] {
  --background: 0 0% 4%;
  --foreground: 0 0% 88%;
}
```

HSL format = `H S% L%` (space-separated, ไม่มี function wrap) เพื่อให้ใช้ `/ 0.5` ทำ opacity ได้

ดู schema เต็มที่ [src/tokens/schema.md](src/tokens/schema.md)

## Token system

25 standard slots + 9 extended slots (optional). ทุก color = HSL space-separated.

```css
/* core */
--background --foreground --card --card-foreground
--primary --primary-foreground --secondary --secondary-foreground
--muted --muted-foreground --accent --accent-foreground
--destructive --success --warning --info
--border --input --ring --radius
--shadow --shadow-md --shadow-lg --border-width
--font-sans --font-mono --font-serif --font-display

/* extended (ใช้เมื่อต้องการ) */
--accent-2 --accent-2-foreground --accent-deep --accent-dim
--terracotta --terracotta-foreground --clay
--ease-spring
```

## Architecture

```
src/
├── tokens/
│   ├── schema.css        # default neutral (light + dark + manual [data-mode])
│   ├── schema.md         # slot reference
│   └── README.md         # how-to use tokens
├── components/
│   ├── base.css          # 54+ components · uses var(--*) only · ~1767 lines
│   ├── components.js     # vanilla JS controllers · ~796 lines
│   └── README.md         # component catalog
themes/                   # 9 themes · generated by tools/codegen.mjs
tools/
├── codegen.mjs           # generate theme.css from canonical map
├── map.md                # 9-concept → standard slot mapping
└── validate.mjs          # token contract + HSL format + contrast
bin/
└── dg.js                 # CLI · 8 commands · zero-dep
app/                      # 10 HTML pages (showcase, playground, registry, examples, …)
```

### design = plugin

ธีมแต่ละตัวเป็น plugin เต็มตัว — แค่ override token, ไม่ต้องแตะ component. เพิ่มธีมใหม่ = เพิ่ม folder + register ใน `tools/codegen.mjs` (ดู THEMES constant)

## Examples

หน้าจริง 4 หน้า — แต่ละหน้า themed ต่างกัน ใช้ components จริง:

| page | theme | features |
|---|---|---|
| [dashboard](app/examples/dashboard.html) | rack | server-rack dashboard, LED status, live log |
| [blog](app/examples/blog.html) | claude | editorial article, TOC sidebar, related posts |
| [landing](app/examples/landing.html) | mcky | bold neobrutalism marketing page |
| [settings](app/examples/settings.html) | min | settings app with tabs + form |

## Tools (in `app/`)

| page | purpose |
|---|---|
| [index.html](app/index.html) | landing — overview + 9 theme cards + 4 tool cards |
| [showcase.html](app/showcase.html) | component catalog — ทุก component × variants |
| [playground.html](app/playground.html) | live HSL picker — แก้ token เห็นทันที, 10 presets |
| [theme-builder.html](app/theme-builder.html) | wizard — pick preset → tweak → export |
| [registry.html](app/registry.html) | browse 9 themes + 53 components, copy install cmd |
| [theme-test.html](app/theme-test.html) | smoke test — switch theme live, see rendered |

## Workflow

```bash
# 1. explore
python3 -m http.server 3000
# เปิด http://localhost:3000/app/showcase.html

# 2. เลือกธีม
npx dg theme mcky    # ดู link snippet
# หรือไป app/playground.html เพื่อทดลอง

# 3. integrate
npx dg init my-app
cp themes/mcky/theme.css my-app/theme.css
# เพิ่ม link ใน my-app/index.html

# 4. extend
npx dg add component datepicker
# copy component CSS + JS เข้า my-app/

# 5. ship
# my-app/ = HTML + 3 CSS files + 1 JS file · พร้อม deploy
```

## Customization

### เปลี่ยนสีเฉพาะ component

```css
/* override scoped to a section */
.sidebar {
  --primary: 200 80% 50%;       /* แค่ใน .sidebar */
  --radius: 0;
}
```

### เพิ่ม component ใหม่

```css
/* components.css */
.x-my-widget {
  background: hsl(var(--card));
  border: var(--border-width) solid hsl(var(--border));
  border-radius: var(--radius);
  padding: 1rem;
}
```

```html
<div class="x-my-widget">hello</div>
```

### เพิ่มธีมใหม่

1. สร้าง `themes/<id>/{theme.css, theme.json}`
2. เพิ่ม entry ใน `tools/codegen.mjs` (ดู THEMES constant)
3. รัน `npx dg codegen <id>` เพื่อ verify
4. รัน `npx dg check` เพื่อ validate

## Validation

```bash
npx dg check
```

ตรวจ:
- JS syntax ทุก module
- HSL format ของทุก color token
- Required tokens ครบ (`--background`, `--foreground`, `--primary`, `--border`, `--radius`)
- WCAG AA contrast ratio (≥ 4.5:1 สำหรับ text)

## Tech

- **HTML5** semantic markup
- **CSS3** (custom properties, HSL, calc, grid, flexbox)
- **Vanilla JS** (ES2017+, ไม่มี dependencies)
- **Zero build step** — copy files, link, done
- **Zero runtime** — components.js 796 lines uncompressed, ไม่ tree-shake ไม่ dynamic import

## Browser support

ทุก browser ที่รองรับ:
- CSS custom properties (IE 11+ ไม่รองรับ — แนะนำ evergreen browsers)
- CSS grid + flexbox
- ES2017 (async/await, optional chaining)

ไม่ใช้: Web Components, Shadow DOM, IntersectionObserver, MutationObserver (มี fallback)

## License

MIT — ใช้ได้ทั้ง personal และ commercial ไม่ต้อง attribution

## Credits

Built by [ktypez](https://github.com/ktypez). Inspired by [shadcn/ui](https://ui.shadcn.com/), [Radix Colors](https://www.radix-ui.com/colors), and the open-source design system community.

9 starter themes แกะ DNA จาก: STACK//FRAME (server UI), PIXSH v1.0, PACKETGRID, collage.sh, GLITCHPAGE, CLAUDE PAPER, MOSS, BRUT, mcky.space — ทั้งหมดเป็น private concepts ของ repo นี้ (ดู `concepts/`).

## See also

- [PLAN.md](PLAN.md) — project plan, architecture, roadmap
- [tools/map.md](tools/map.md) — 9-concept → standard slot mapping
- [src/tokens/schema.md](src/tokens/schema.md) — full slot reference
- [app/showcase.html](app/showcase.html) — interactive component catalog
