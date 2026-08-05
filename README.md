# Design Gallery

A shadcn registry (tweakcn-style) for design themes and UI elements.

## Overview

Design Gallery provides **9 design concepts** as shadcn-compatible themes and UI element packs. Install themes and components via the shadcn registry, just like tweakcn.

**Registry URL:** `https://design.mcky.space/r/`

## Quick Start

### 1. Create a shadcn project

```bash
npx shadcn@latest init
```

### 2. Add a theme

```bash
# Add theme (colors + variables)
npx shadcn add https://design.mcky.space/r/rack.json

# Add UI elements (LED strips, bezels, etc.)
npx shadcn add https://design.mcky.space/r/rack-elements.json
```

### 3. Use in your app

```tsx
import { Button } from "@/components/ui/button"
import { LedStrip, RackBezel, RackUnit } from "@/components/ui"

export default function Page() {
  return (
    <RackBezel label="// MOCKUP · RACK_01">
      <RackUnit label="UNIT 01 — my-app" ledColor="var(--accent-2)" />
      <LedStrip />
      <Button>Click me</Button>
    </RackBezel>
  )
}
```

## Available Themes

| ID | Name | Mode | Description |
|---|---|---|---|
| `mcky` | mcky.space | dual | Neobrutalism, 3px border, hard shadow, mono 100% |
| `rack` | STACK//FRAME | dark | Server rack, amber LED, Inter+mono |
| `crt` | PIXSH v1.0 | dark | Phosphor green, scanlines, VT323 |
| `noc` | PACKETGRID | dark | NOC dashboard, cyan+green |
| `min` | collage.sh | light | Minimal, olive lime accent |
| `glitchpage` | GLITCHPAGE | dark | Error page, neon pink, Thai |
| `claude` | CLAUDE PAPER | dual | Warm editorial, clay, Source Serif |
| `moss` | MOSS | light | Organic, earth + terracotta, Fraunces |
| `brut` | BRUT | light | Brutalist, red+black, Anton |

**Mode semantics:**
- `dual` — Has both light and dark variants. Toggle with `<html class="dark">`
- `dark-only` — Dark theme only. Applied via `:root, .dark { }`
- `light-only` — Light theme only. Shielded from `.dark` class override

## Available Elements

### rack-elements
Server rack UI elements:
- `LedStrip` — Animated LED indicators with staggered pulse
- `RackBezel` — Server rack header with status LED
- `RackUnit` — Individual rack unit with LED + screw details
- `RackMock` — Container for rack units

### crt-elements
CRT terminal UI elements:
- `CrtTerminal` — Phosphor glow terminal container
- `BlinkCursor` — Blinking block cursor
- `Scanlines` — Full-screen scanline overlay
- `CrtLed` — LED indicator with pulse animation

### glitchpage-elements
Glitch error page UI elements:
- `GlitchText` — RGB-split glitch text with clip-path layers
- `GlitchLabel` — Error label (monospace, uppercase)
- `GlitchStage` — Container for glitch elements

## Registry Structure

```
https://design.mcky.space/r/
├── registry.json          # Collection index (12 items)
├── mcky.json              # registry:theme
├── rack.json              # registry:theme
├── rack-elements.json     # registry:block (components)
├── crt.json               # registry:theme
├── crt-elements.json      # registry:block
├── glitchpage.json        # registry:theme
├── glitchpage-elements.json # registry:block
└── ... (9 themes + 3 element packs)
```

## Development

### Generate registry items

```bash
# Generate theme items from themes/shadcn/*.css
node tools/registry.mjs

# Generate element items from src/registry/elements/
node tools/registry-elements.mjs rack
node tools/registry-elements.mjs crt
node tools/registry-elements.mjs glitchpage
```

### Add new elements

1. Create component in `src/registry/elements/<concept>/`
2. Add to `tools/registry-elements.mjs` CONCEPTS config
3. Run `node tools/registry-elements.mjs <concept>`
4. Commit and push

### Registry format

**registry:theme** (colors + variables):
```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "rack",
  "type": "registry:theme",
  "cssVars": {
    "theme": { "radius": "0", "font-mono": "..." },
    "light": { "background": "#0a0a0c", "primary": "#ffb000" },
    "dark": { "background": "#0a0a0c", "primary": "#ffb000" }
  },
  "css": {
    "@layer base": {
      "body": {
        "background-color": "var(--background)",
        "color": "var(--foreground)"
      }
    }
  }
}
```

**registry:block** (components):
```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "rack-elements",
  "type": "registry:block",
  "files": [
    { "path": "led-strip.tsx", "content": "..." },
    { "path": "rack-bezel.tsx", "content": "..." }
  ]
}
```

## Architecture

```
design-gallery/
├── themes/
│   ├── shadcn/            # Source CSS (9 themes)
│   │   ├── mcky.css
│   │   ├── rack.css
│   │   └── ...
│   └── registry/          # Generated registry JSON
│       ├── registry.json  # Collection index
│       ├── mcky.json      # registry:theme
│       └── rack-elements.json  # registry:block
├── src/registry/elements/ # Source components
│   ├── rack/
│   │   ├── led-strip.tsx
│   │   ├── rack-bezel.tsx
│   │   └── effects.css
│   ├── crt/
│   └── glitchpage/
├── tools/
│   ├── registry.mjs       # Generate theme items
│   └── registry-elements.mjs  # Generate element items
└── concepts/              # Original concept HTML (source of truth)
    ├── rack.html
    ├── crt.html
    └── ...
```

## Hosting

Registry is hosted at `https://design.mcky.space/r/` via Caddy:

```caddyfile
design.mcky.space {
    handle_path /r/* {
        root * /home/admin/design-gallery/themes/registry
        header Content-Type "application/json"
        file_server
    }
}
```

## Known Issues

- Custom variables (e.g., `--accent-2`, `--led-cyan`) may need manual addition to globals.css after `npx shadcn add`
- Some themes use custom fonts that need to be loaded separately

## Roadmap

- [ ] Extract elements for remaining 6 concepts (noc, moss, mcky, brut, min, claude)
- [ ] Add font loading to theme registry items
- [ ] Create showcase page demonstrating all themes + elements
- [ ] Add more UI components per concept (cards, inputs, etc.)

## License

MIT

## Links

- Registry: https://design.mcky.space/r/
- GitHub: https://github.com/ktypez/design-gallery
- Inspired by: [tweakcn](https://tweakcn.com)
