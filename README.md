# Design Gallery

**9 design concepts → shadcn v4 theme presets** — React + Radix UI + Tailwind v4.
เปลี่ยนธีมทั้งแอปด้วยการสลับ CSS variables ชุดเดียว.

```
design concepts (mcky, rack, crt, noc, min, glitchpage, claude, moss, brut)
        │
        ▼
themes/shadcn/<id>.css   ← shadcn v4 format (:root/.dark, hex exact)
        │
        ▼
ติดตั้งทีละ theme (tweakcn/shadcn-style) → ใช้กับโปรเจกต์
```

## Quick start

**Model: ติดตั้ง theme ทีละตัว** — เหมือน shadcn/tweakcn ที่ `add` component ตัวที่ใช้
ไม่ใช่โหลดทั้งหมด. เริ่มจาก 1 theme แล้วเพิ่มทีหลังตามต้องการ.

### 1. React + shadcn project

```bash
# create shadcn project (React + Radix + Tailwind v4)
npx shadcn@latest init -b radix

# install ONE theme into globals.css
npx dg add theme mcky --shadcn --dir .

# add Radix components
npx shadcn@latest add button card dialog tabs

# done — components follow the theme
```

### 2. Vue project (pantry-style)

```bash
# install ONE theme into src/themes/<id>.css
npx dg add theme claude --vue --dir ./my-vue-app

# add another theme later
npx dg add theme mcky --vue --dir ./my-vue-app
npx dg add theme brut --vue --dir ./my-vue-app
```

### 3. DG web UI (this project's app/dg-ui)

```bash
# install ONE theme into app/dg-ui/src/themes/<id>.css
npx dg add theme mcky --ui --dir app/dg-ui

# add more as needed
npx dg add theme rack --ui --dir app/dg-ui
```

## CLI (`dg`)

```bash
npx dg add theme <id> --shadcn   # ⭐ React/shadcn → write globals.css
npx dg add theme <id> --vue      # ⭐ Vue/pantry → copy src/themes/<id>.css
npx dg add theme <id> --ui       # ⭐ DG web UI → copy app/dg-ui/src/themes/<id>.css
npx dg add theme <id>            # copy vanilla theme.css (legacy)
npx dg add component <name>      # copy vanilla component (legacy)
npx dg theme <id>                # show link snippet
npx dg list [themes|components]  # list themes/components
npx dg codegen [id...]           # regenerate vanilla themes
npx dg shadcn [id...]            # regenerate shadcn v4 presets
npx dg vue-theme [id...]         # regenerate Vue theme CSS
npx dg check                     # syntax + token contract + contrast
npx dg help [cmd]
```

### Install models

| flag | target | ผล |
|---|---|---|
| `--shadcn` | React + Tailwind project | เขียน `:root`/`.dark` blocks ลง globals.css |
| `--vue` | Vue project (pantry) | copy `themes/vue/<id>.css` → `src/themes/` |
| `--ui` | DG web UI (app/dg-ui) | copy `themes/shadcn/<id>.css` → `src/themes/` |

ทั้งหมดเป็น **import 1 theme ต่อครั้ง** (tweakcn-style) — ไม่ bundle ทั้งหมด.

```bash
dg add theme rack --shadcn --dir ./my-app              # auto-find globals.css
dg add theme claude --shadcn --globals ./app/globals.css
dg add theme mcky --vue --dir ./pantry
dg add theme brut --ui --dir app/dg-ui
```

## Themes (9)

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

**Mode semantics ใน shadcn:**
- `dual` (mcky, claude) → `:root` light + `.dark` dark — toggle `<html class="dark">`
- `dark-only` (rack, crt, noc, glitchpage) → `:root, .dark` dark — เป็น dark เสมอ
- `light-only` (min, moss, brut) → `:root, .dark` light — เป็น light เสมอ (กัน `.dark` default มาครอบ)

## Format (shadcn v4)

```css
:root {
  --background: #f5f5f0;        /* exact hex — precision fix (no hsl rounding) */
  --primary: #ffe066;
  --radius: 0.375rem;
  --border-width: 3px;
  --shadow: 4px 4px 0 var(--border);
  --font-sans: 'JetBrains Mono', ui-monospace, monospace;
}
.dark {
  --background: #0a0a0a;        /* dual themes only */
}
```

- สี = **hex เดิม** จาก concepts (แม่นยำ 100%, ไม่มี hex→HSL→RGB rounding loss)
- non-color (radius/border-width/fonts/shadow) ผ่านตรง
- `@theme inline` mapping อยู่ใน `themes/shadcn/_base.css` (ใช้ร่วมทุก theme)

## Architecture

```
themes/
├── shadcn/                 # ⭐ shadcn v4 presets (React/Tailwind)
│   ├── _base.css           # one-time @theme inline mapping
│   ├── <id>.css ×9         # 9 design concepts
│   └── README.md
├── vue/                    # ⭐ Vue themes (pantry-style :root + [data-mode])
│   ├── <id>.css ×9         # --bg/--surface/--fg/--accent vars
│   └── README.md
├── json/                   # 9 JSON themes (React Native)
├── registry/               # shadcn registry files
└── <id>/theme.css ×9       # vanilla format (legacy gallery)
app/dg-ui/
└── src/themes/             # ⭐ installed themes in DG web UI (tweakcn model)
    ├── mcky.css            # ← dg add theme mcky --ui
    ├── rack.css            # ← dg add theme rack --ui
    └── ...                 # เพิ่มทีละตัว
src/
├── tokens/schema.css       # token schema (core ของทุก theme)
└── components/             # 🔒 DEPRECATED vanilla (gallery only)
tools/
├── codegen.mjs             # canonical THEMES map (single source of truth)
├── hex-source.mjs          # original hex extraction (precision fix)
├── shadcn-adapter.mjs      # HSL → shadcn v4 (+ exact hex)
├── vue-theme.mjs           # shadcn → Vue theme CSS
├── validate.mjs            # token contract + contrast
└── map.md                  # concept → token mapping
examples/
└── shadcn-demo/            # React 19 + Radix drop-in proof
```

**Data flow:** `concepts/<id>.css` (design ต้นฉบับ) → `tools/hex-source.mjs`
(extract hex) + `tools/codegen.mjs` (THEMES map) → `shadcn-adapter.mjs` →
`themes/shadcn/<id>.css` (และ `vue-theme.mjs` → `themes/vue/<id>.css`).

## Regenerate

```bash
npx dg shadcn            # regenerate all 9 shadcn presets
npx dg shadcn mcky       # one theme
npx dg shadcn --check    # verify only
npx dg vue-theme         # regenerate all 9 Vue themes
npx dg vue-theme mcky    # one Vue theme
```

## Validation

```bash
npx dg check
```

- JS syntax ทั้งหมด
- Theme token contract (`--background/--foreground/--primary/--border/--radius`)
- HSL format + range
- WCAG AA contrast (text pairs)

## Legacy vanilla (deprecated)

`src/components/*` (54 components, base.css + components.js) — **frozen**
ตั้งแต่ 2026-08-04. มี accessibility gaps + primitives ที่ปั้นเอง → ใช้แค่ใน
concept gallery (`app/*.html`). ดู [DEPRECATED.md](src/components/DEPRECATED.md)

## Tech

- **Themes**: CSS custom properties (hex + hsl), shadcn v4 format
- **Components**: React 19 + Radix UI (ผ่าน shadcn CLI) — ไม่ปั้นเอง
- **Tooling**: zero-dep node scripts (codegen, adapter, vue-theme, validate, CLI)
- **No component build from us** — เราส่งแค่ theme layer
- **Install model**: tweakcn/shadcn-style — ติดตั้ง theme ทีละตัว ไม่ bundle ทั้งหมด

## Repo

- GitHub: https://github.com/ktypez/design-gallery
- Served: nginx `/design/` → `/home/admin/design-gallery/` (concept gallery)
- ดู [PLAN.md](PLAN.md), [DEPLOY.md](DEPLOY.md)
