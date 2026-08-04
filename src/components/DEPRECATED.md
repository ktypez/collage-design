# Vanilla components — DEPRECATED

**Status: frozen since 2026-08-04.** No new features, no bug fixes (critical
security fixes only). Kept for the legacy concept gallery (`app/*.html`).

## Why deprecated

The vanilla component layer (`src/components/base.css` + `components.js`) was
built by hand — focus traps, ARIA, keyboard nav, state management. It had real
bugs (dialog bounce-back, weak accessibility) and no production consumers
(truck app used only the tokens, never the components).

Per the pivot decision (Track A-D), the framework now ships as **shadcn v4
theme presets**:

```
React 19 + Radix UI + Tailwind v4   ← components (proven, accessible)
        ↑
themes/shadcn/<id>.css              ← 9 design concepts (our tokens)
        ↑
npx dg add theme <id> --shadcn      ← install into a project
```

Radix handles the hard parts (focus trap, ARIA, keyboard) — we only ship the
theme layer, which is what the design concepts actually are.

## What this means

| Layer | Status |
|---|---|
| `src/tokens/schema.css` | ✅ still used (core of every theme) |
| `themes/<id>/theme.css` | ✅ vanilla theme (for the concept gallery) |
| `themes/shadcn/<id>.css` | ✅ **new path** — shadcn v4 format |
| `src/components/base.css` | 🔒 frozen (gallery only) |
| `src/components/components.js` | 🔒 frozen (gallery only) |

## Migration path

If you currently use the vanilla components, move to a shadcn project:

```bash
# 1. create a shadcn project (React + Radix + Tailwind v4)
npx shadcn@latest init -b radix

# 2. add our design concept as the theme
npx dg add theme mcky --shadcn --dir .

# 3. add Radix components (no hand-rolled primitives)
npx shadcn@latest add button card dialog tabs

# 4. done — components use the theme via @theme inline mapping
```

Or see `examples/shadcn-demo/` — a working React app with all 9 themes
switching at runtime.

## Timeline

- **2026-08-04** — Track A: shadcn adapter (9 themes → shadcn v4)
- **2026-08-04** — Track B: `dg add theme --shadcn` CLI
- **2026-08-04** — Track C: `examples/shadcn-demo/` drop-in proof
- **2026-08-04** — Track D: deprecate + precision fix (this file)

## File map

```
themes/shadcn/
├── _base.css          # one-time @theme inline mapping
├── mcky.css           # dual mode
├── rack.css           # dark-only
├── ... (9 themes)
└── README.md          # usage
tools/
├── shadcn-adapter.mjs # HSL → shadcn v4 (with exact hex via hex-source)
├── hex-source.mjs     # original hex extraction (precision fix)
├── codegen.mjs        # canonical THEMES map (single source of truth)
└── validate.mjs       # token contract + contrast
examples/shadcn-demo/  # React 19 + Radix drop-in proof
```
