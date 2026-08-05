# Vue theme presets (pantry-style)

9 design concepts ใน **Vue-friendly format** — ใช้กับ project ที่เป็น Vue
(เช่น pantry) ที่ใช้ variable names: `--bg`, `--surface`, `--fg`, `--accent`, ฯลฯ

```
themes/vue/
├── mcky.css           # dual mode  (:root + html[data-mode="dark"])
├── rack.css           # dark-only (force dark ผ่าน :root)
├── crt.css            # dark-only
├── noc.css            # dark-only
├── min.css            # light-only
├── glitchpage.css     # dark-only
├── claude.css         # dual mode
├── moss.css           # light-only
└── brut.css           # light-only
```

Format เดียวกับ pantry `claude.css` เดิม — drop-in โดยไม่ต้องแก้ component.

## Install (tweakcn-style — ทีละ theme)

```bash
# install 1 theme เข้า src/themes/<id>.css
npx dg add theme claude --vue --dir ./my-vue-app

# เพิ่ม theme อื่นทีหลัง
npx dg add theme mcky --vue --dir ./my-vue-app
```

ผลลัพธ์: copy `themes/vue/<id>.css` → `<dir>/src/themes/<id>.css`

## Theme swapper (Vue)

```ts
// src/lib/theme.ts — อ่านเฉพาะ themes ที่ install (dynamic glob)
import { ref } from 'vue'

const themeModules = import.meta.glob('../themes/*.css', { eager: true, query: '?raw' })

export const THEMES = Object.fromEntries(
  Object.entries(themeModules).map(([path, mod]) => {
    const css = (mod as { default: string }).default
    const id = path.split('/').pop()!.replace('.css', '')
    return [id, { id, css }]
  })
)
export const THEME_IDS = Object.keys(THEMES)

// inject via <style> tag
function applyTheme() {
  const theme = THEMES[activeTheme.value]
  let el = document.getElementById('dg-theme') as HTMLStyleElement | null
  if (!el) { el = document.createElement('style'); el.id = 'dg-theme'; document.head.appendChild(el) }
  el.textContent = theme.css
}
```

## Variable mapping

| DG shadcn var | Vue var |
|---|---|
| `--background` | `--bg` |
| `--foreground` | `--fg` |
| `--card` | `--surface` |
| `--primary` | `--accent` |
| `--muted` | `--surface-2` |
| `--muted-foreground` | `--fg-muted` |
| `--destructive` | `--danger` |
| `--warning` | `--warn` |

มี derived vars เพิ่ม: `--surface-3`, `--border-light`, `--fg-dim`,
`--accent-soft`, `--shadow`, `--font-sans`, `--font-mono`

## Regenerate

```bash
npx dg vue-theme            # generate ทั้ง 9
npx dg vue-theme mcky       # generate อันเดียว
```

source: `tools/vue-theme.mjs` (mapping จาก shadcn themes)
