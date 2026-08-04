# Design Gallery — Project Plan

> **Origin:** เริ่มจาก brand refresh ของแอป Collage Maker (LINE LIFF) ในปี 2026 — 9 concept designs ส่วนตัว
> **Now:** Shadcn-inspired vanilla framework — design system เปล่าๆ + 9 starter themes + tooling ครบ

---

## Live URLs (LAN)

nginx `/design/` → `/home/admin/design-gallery/`

| Page | URL |
|---|---|
| **Gallery Index** (legacy) | https://192.168.1.47/design/ |
| **App landing** | https://192.168.1.47/design/app/ |
| **Showcase** (component catalog) | https://192.168.1.47/design/app/showcase.html |
| **Playground** (live HSL editor) | https://192.168.1.47/design/app/playground.html |
| **Theme Builder** (wizard) | https://192.168.1.47/design/app/theme-builder.html |
| **Registry** (browse themes/components) | https://192.168.1.47/design/app/registry.html |
| **Theme test** (smoke test) | https://192.168.1.47/design/app/theme-test.html |
| **Examples: dashboard** (rack theme) | https://192.168.1.47/design/app/examples/dashboard.html |
| **Examples: blog** (claude theme) | https://192.168.1.47/design/app/examples/blog.html |
| **Examples: landing** (mcky theme) | https://192.168.1.47/design/app/examples/landing.html |
| **Examples: settings** (min theme) | https://192.168.1.47/design/app/examples/settings.html |

---

## Status: Phase 7 complete ✓

| # | Phase | Status | Output |
|---|---|---|---|
| 0 | Token schema + mapping | ✓ | `src/tokens/schema.css` (25+9 slots), `schema.md`, `tools/map.md` (9-concept mapping) |
| 1 | Component layer | ✓ | `src/components/base.css` (54 components, 1767 lines), `components.js` (796 lines) |
| 2 | Showcase + playground | ✓ | `app/showcase.html` (892), `app/playground.html` (887) |
| 3 | CLI (`dg`) | ✓ | `bin/dg.js` (888 lines, 8 commands) |
| 4 | Codegen + 9 themes | ✓ | `tools/codegen.mjs` + 9 generated `themes/<id>/` |
| 5 | App tooling UI | ✓ | `app/index.html`, `registry.html`, `theme-builder.html` |
| 6 | 4 example pages | ✓ | `app/examples/{dashboard,blog,landing,settings}.html` |
| 7 | Docs + validate | ✓ | `README.md` rewrite, `tools/validate.mjs` (contrast/HL format) |

---

## Current Architecture

```
design-gallery/
├── README.md                       # main docs (Phase 7 rewrite)
├── PLAN.md                         # this file
├── package.json                    # bin: dg, scripts: check
├── build.js                        # node --check wrapper
├── bin/
│   └── dg.js                       # CLI: init/add/theme/list/serve/check/codegen/help
├── src/
│   ├── tokens/
│   │   ├── schema.css              # default neutral + light/dark + extended slots
│   │   ├── schema.md               # slot reference
│   │   └── README.md               # how-to use + create theme
│   ├── components/
│   │   ├── base.css                # 54+ theme-agnostic components
│   │   ├── components.js           # vanilla JS controllers
│   │   └── (README planned)
│   ├── engine/                     # legacy canvas engine (kept for concepts)
│   ├── core/                       # canvas-renderer, sharp-renderer
│   ├── assets/                     # fonts
│   └── js/themes/                  # 9 legacy concept manifests
├── themes/                         # 9 generated themes
│   ├── mcky/{theme.css, theme.json}     # dual mode
│   ├── rack/                              # dark only
│   ├── crt/                               # dark only
│   ├── noc/                               # dark only
│   ├── min/                               # light only
│   ├── glitchpage/                        # dark only
│   ├── claude/{theme.css, theme.json}     # dual mode
│   ├── moss/                              # light only
│   └── brut/                              # light only
├── tools/
│   ├── codegen.mjs                 # generate theme.css from canonical map
│   ├── validate.mjs                # token contract + HSL format + contrast
│   └── map.md                      # 9-concept → standard slot mapping
├── concepts/                       # 9 legacy concept pages (kept as reference)
│   └── {rack,crt,noc,min,glitchpage,claude,moss,brut,mcky}.{html,css}
└── app/
    ├── index.html                  # landing
    ├── showcase.html               # component catalog
    ├── playground.html             # live HSL editor (10 presets)
    ├── theme-builder.html          # 3-step wizard (pick → tweak → export)
    ├── registry.html               # browse themes + components
    ├── theme-test.html             # smoke test (live theme switcher)
    └── examples/
        ├── dashboard.html          # rack theme · server-rack dashboard
        ├── blog.html               # claude theme · editorial article
        ├── landing.html            # mcky theme · neobrutalist marketing
        └── settings.html           # min theme · settings app
```

---

## 9 Themes

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

**Coverage**: 9/9 concepts map ได้ครบ — ไม่มี concept ไหนตกหล่น

---

## Workflow

```bash
# 1. explore
python3 -m http.server 3000
# เปิด http://localhost:3000/app/showcase.html

# 2. integrate
npx dg init my-app && cd my-app

# 3. เพิ่มธีม
npx dg add theme mcky

# 4. เพิ่ม component
npx dg add component dialog

# 5. validate
npx dg check
```

---

## Tech

- **HTML5** semantic markup
- **CSS3** — custom properties, HSL space-separated, grid, flexbox
- **Vanilla JS** (ES2017+, zero deps)
- **Zero build step** — copy files, link, done
- **~25KB** gzipped (CSS + JS combined)

---

## Roadmap (2026 Q3-Q4)

### Done (Phase 0-7 + Pivot Tracks)
- [x] Token schema (25+9 slots, HSL space-separated)
- [x] 54+ vanilla components (CSS + JS) — now DEPRECATED
- [x] 9 generated themes with metadata
- [x] CLI: init/add/theme/list/check/codegen/help
- [x] Showcase, playground, theme-builder, registry
- [x] 4 example pages dogfooding the framework
- [x] Token validator (HSL format, contrast, contract)
- [x] **PIVOT → shadcn**: 9 concepts เป็น shadcn v4 theme presets
- [x] **Track A**: shadcn-adapter.mjs + themes/shadcn/*.css + `dg shadcn`
- [x] **Track B**: `dg add theme <id> --shadcn` เขียน globals.css ตรง
- [x] **Track C**: examples/shadcn-demo (React 19 + Radix drop-in proof)
- [x] **Track D**: deprecate vanilla + precision fix (exact hex)
- [x] Dialog/sheet/drawer bounce-back bug fix (vanilla, frozen after)

### Next
- [ ] **`dg extract <url>`** — auto-generate shadcn theme จากเว็บจริง
- [ ] **oklch variant** — themes/shadcn/ emit oklch (shadcn native default)
- [ ] **JSON theme spec** — load themes จาก JSON (React Native-ready)
- [ ] **Animation presets** — `--ease-spring` (moss) ขยายเป็น motion tokens
- [ ] **shadcn registry integration** — themes เป็น shadcn registry item (`npx shadcn add theme`)

### Maybe
- [ ] Public npm publish (`@design-gallery/themes`) — private for now
- [ ] Online gallery (GitHub Pages deploy)
- [ ] More themes (CRT-scanline variant, morandi palettes, etc)
- [ ] Delete legacy vanilla components (หลัง concept gallery ไม่ใช้แล้ว)

---

## Conventions

- **Token names** — kebab-case, `--*` prefix, semantic (not visual): `--primary` not `--blue`
- **Values** — HSL space-separated for colors (`H S% L%`), rem/px for sizes
- **No hardcoded colors** in components — only `hsl(var(--*))`
- **Class prefix** — `.x-*` (avoids collision with Tailwind/Bootstrap)
- **State attributes** — `[data-state="open"]` for open/closed, `[aria-checked]` for toggles
- **Mode** — `[data-mode="light|dark"]` on `<html>`, falls back to `prefers-color-scheme`

---

## See also

- [README.md](README.md) — full docs
- [tools/map.md](tools/map.md) — 9-concept → standard slot mapping
- [src/tokens/schema.md](src/tokens/schema.md) — full token reference
- [app/showcase.html](app/showcase.html) — interactive component catalog
