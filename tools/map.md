# Concept → Token Mapping

คู่มือ map variable เก่าจาก 9 concepts (ใน `concepts/<id>.css`) เข้า standard token schema (`src/tokens/schema.css`).

ใช้สำหรับ:
- **คน**: อ่านดูว่า concept ไหน map ตรงไหน
- **`tools/codegen.mjs`** (Phase 5): generate `themes/<id>/theme.css` อัตโนมัติ

## Format Conversion

| Concept format | Schema format | หมายเหตุ |
|---|---|---|
| `#ffe066` (hex) | `50 100% 71%` (HSL) | codegen แปลง auto |
| `rgba(20, 20, 19, 0.12)` | `<hsl> / 0.12` (alpha) | แยก base HSL + alpha |
| `4px 4px 0 var(--border)` | full value (ไม่ต้องแปลง) | complex shadow copy ตรง |

## Standard Slot Reference (ย่อ)

ดู slot definitions ฉบับเต็มที่ [`src/tokens/schema.md`](../src/tokens/schema.md)

**Core (25):** `--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--destructive-foreground`, `--success`, `--warning`, `--info`, `--border`, `--input`, `--ring`, `--radius`, `--border-width`, `--shadow`

**Extended (9):** `--accent-2`, `--accent-2-foreground`, `--accent-deep`, `--accent-dim`, `--terracotta`, `--terracotta-foreground`, `--clay`, `--ease-spring`, `--mode`

---

## 1. mcky — Neobrutalism (mono + hard shadow)

**Source:** `concepts/mcky.css` · **DNA:** border 3px ดำ + hard shadow 4px 4px 0 + amber hover + mono 100% + dual mode

### Light mode

| Concept var | Value (hex) | HSL | Maps to | Notes |
|---|---|---|---|---|
| `--bg` | `#f5f5f0` | `60 17% 95%` | `--background` | |
| `--fg` | `#000000` | `0 0% 0%` | `--foreground` | |
| `--surface` | `#ffffff` | `0 0% 100%` | `--card` | |
| `--surface-2` | `#eaeae4` | `60 17% 91%` | `--muted` | |
| `--border` | `#000000` | `0 0% 0%` | `--border`, `--input`, `--ring` | mcky ใช้ border ดำเสมอ |
| `--fg-muted` | `#333333` | `0 0% 20%` | `--muted-foreground` | |
| `--fg-dim` | `#777777` | `0 0% 47%` | derive `--secondary-foreground` | |
| `--accent` | `#ffe066` | `50 100% 71%` | `--primary` | amber |
| `--accent-deep` | `#d9a400` | `47 100% 42%` | `--accent-deep` | hover/active |
| `--success` | `#06d6a0` | `161 95% 43%` | `--success` | |
| `--warn` | `#ff9f43` | `27 100% 63%` | `--warning` | |
| `--danger` | `#ff6b6b` | `0 100% 71%` | `--destructive` | |
| `--info` | `#4361ee` | `228 81% 60%` | `--info` | |
| `--purple` | `#9b5de5` | `269 75% 64%` | skip | ไม่ใช้ใน mcky |
| `--cyan` | `#00cec9` | `176 100% 41%` | `--accent-2` | mcky ใช้ cyan เป็น secondary |
| `--pink` | `#ff6b9d` | `340 100% 71%` | skip | ไม่ใช้ |
| `--shadow` | `4px 4px 0 var(--border)` | (no convert) | `--shadow`, `--shadow-md`, `--shadow-lg` | mcky hard-shadow เดียวกันทุกขนาด |
| `--font-mono` | `'JetBrains Mono', ...` | (no convert) | `--font-sans`, `--font-mono`, `--font-display`, `--font-serif` | mcky ใช้ mono เดียวทั้งเว็บ |

**Extras:** `--accent-2` (cyan) — เก็บไว้ใช้กับ status/info variant

**Custom (ไม่มีใน schema):**
- `--border-width: 3px` (เพิ่มเข้า theme.css)
- `--shadow: 4px 4px 0 hsl(var(--border))` (hard shadow)

### Dark mode

| Concept var | Value (hex) | HSL | Maps to | Notes |
|---|---|---|---|---|
| `--bg` | `#0a0a0a` | `0 0% 4%` | `--background` | |
| `--fg` | `#e0e0e0` | `0 0% 88%` | `--foreground` | |
| `--surface` | `#141414` | `0 0% 8%` | `--card` | |
| `--surface-2` | `#1f1f1f` | `0 0% 12%` | `--muted` | |
| `--border` | `#888888` | `0 0% 53%` | `--border`, `--input`, `--ring` | dark mode border เทา |
| `--fg-muted` | `#a0a0a0` | `0 0% 63%` | `--muted-foreground` | |
| `--fg-dim` | `#666666` | `0 0% 40%` | `--secondary-foreground` | |
| `--accent` | `#ffe066` | `50 100% 71%` | `--primary` | เหมือน light |
| `--accent-deep` | `#ffe066` | `50 100% 71%` | `--accent-deep` | dark = เหมือน primary |

**Special:** mcky dark ใช้ amber border เป็น border เดียว (no `--border` override ใน dark — ใช้ `--accent` แทน)

### Generated theme.css (preview)

```css
/* themes/mcky/theme.css */
:root {
  --background: 60 17% 95%;
  --foreground: 0 0% 0%;
  --card: 0 0% 100%;
  --muted: 60 17% 91%;
  --muted-foreground: 0 0% 20%;
  --primary: 50 100% 71%;
  --primary-foreground: 0 0% 0%;
  --destructive: 0 100% 71%;
  --success: 161 95% 43%;
  --warning: 27 100% 63%;
  --info: 228 81% 60%;
  --border: 0 0% 0%;
  --input: 0 0% 0%;
  --ring: 0 0% 0%;
  --radius: 0.375rem;             /* 6px */
  --border-width: 3px;             /* mcky-specific */
  --shadow: 4px 4px 0 hsl(var(--border));  /* hard shadow */
  --accent-deep: 47 100% 42%;
  --accent-2: 176 100% 41%;
  --font-sans: 'JetBrains Mono', ui-monospace, monospace;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
  --font-serif: 'JetBrains Mono', ui-monospace, monospace;
  --font-display: 'JetBrains Mono', ui-monospace, monospace;
}

[data-mode="dark"] {
  --background: 0 0% 4%;
  --foreground: 0 0% 88%;
  --card: 0 0% 8%;
  --muted: 0 0% 12%;
  --muted-foreground: 0 0% 63%;
  --primary: 50 100% 71%;
  --primary-foreground: 0 0% 0%;
  --border: 0 0% 53%;
  --input: 0 0% 53%;
  --ring: 50 100% 71%;             /* ring = accent ใน dark */
  --accent-deep: 50 100% 71%;
}
```

---

## 2. rack — STACK//FRAME (server rack, no personality for UI)

**Source:** `concepts/rack.css` · **DNA:** dark slate, amber LED, green LED, mono, **light mode only** (rack คือ server UI = always dark)

| Concept var | Value (hex) | HSL | Maps to | Notes |
|---|---|---|---|---|
| `--bg` | `#0a0a0c` | `240 8% 4%` | `--background` | |
| `--fg` | `#f5f5f7` | `240 7% 96%` | `--foreground` | |
| `--surface` | `#16161a` | `240 9% 9%` | `--card` | |
| `--bg-2` | `#111114` | `240 9% 7%` | `--muted` | |
| `--border` | `#2a2a32` | `240 8% 18%` | `--border` | |
| `--border-bright` | `#3a3a42` | `240 8% 24%` | `--ring` | |
| `--fg-muted` | `#8a8a93` | `240 5% 56%` | `--muted-foreground` | |
| `--fg-dim` | `#5a5a63` | `240 5% 37%` | `--secondary-foreground` | |
| `--accent` | `#ffb000` | `40 100% 50%` | `--primary` | amber LED |
| `--accent-2` | `#00ff66` | `145 100% 50%` | `--accent-2` | green LED |
| `--danger` | `#ff3b30` | `4 100% 59%` | `--destructive` | |
| `--led-cyan` | `#00d4ff` | `190 100% 50%` | `--info` | LED cyan |
| `--font-mono` | `'JetBrains Mono', ...` | (no convert) | `--font-mono` | |
| `--font-sans` | `'Inter', ...` | (no convert) | `--font-sans` | rack มี sans ด้วย |

**Special:**
- `--border-width: 1px` (rack ไม่ override)
- `--radius: 0` (rack ไม่มี radius)
- `--shadow: none` (rack ไม่มี shadow)
- **No dark mode** — rack เป็น dark เดียว ตั้ง `--mode: 'dark'` (override schema ไม่ให้เปลี่ยนเป็น light)

### Generated theme.css (preview)

```css
/* themes/rack/theme.css */
:root, [data-mode="light"], [data-mode="dark"] {
  --background: 240 8% 4%;
  --foreground: 240 7% 96%;
  --card: 240 9% 9%;
  --muted: 240 9% 7%;
  --muted-foreground: 240 5% 56%;
  --primary: 40 100% 50%;
  --primary-foreground: 240 8% 4%;
  --destructive: 4 100% 59%;
  --info: 190 100% 50%;
  --border: 240 8% 18%;
  --input: 240 8% 18%;
  --ring: 240 8% 24%;
  --radius: 0;
  --shadow: none;
  --accent-2: 145 100% 50%;
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
  --mode: "dark";   /* force dark เสมอ */
}
```

---

## 3. crt — PIXSH v1.0 (phosphor green CRT)

**Source:** `concepts/crt.css` · **DNA:** ดำสนิท + phosphor green + scanline + VT323 + **light mode only** (CRT = always dark)

| Concept var | Value (hex) | HSL | Maps to | Notes |
|---|---|---|---|---|
| `--bg` | `#060605` | `60 17% 2%` | `--background` | near black |
| `--fg` | `#c5d9b7` | `105 32% 78%` | `--foreground` | phosphor green text |
| `--surface` | `#0d0d0b` | `60 13% 5%` | `--card` | |
| `--surface-2` | `#141410` | `60 14% 7%` | `--muted` | |
| `--border` | `#263a26` | `120 21% 19%` | `--border` | dark green |
| `--border-bright` | `#3d5c3d` | `120 21% 30%` | `--ring` | |
| `--fg-muted` | `#7a8f74` | `110 12% 51%` | `--muted-foreground` | |
| `--fg-dim` | `#4a5c46` | `120 13% 32%` | `--secondary-foreground` | |
| `--accent` | `#4af626` | `110 92% 56%` | `--primary` | phosphor green |
| `--accent-dim` | `#2e9e1e` | `117 73% 37%` | `--accent-dim` | dimmer green |
| `--danger` | `#ff5c5c` | `0 79% 69%` | `--destructive` | |
| `--font-mono` | `'VT323', 'JetBrains Mono', ...` | (no convert) | `--font-mono` | |
| `--font-sans` | `'VT323', 'Inter', ...` | (no convert) | `--font-sans` | |

**Special:**
- `--radius: 0` (CRT ไม่มี radius)
- `--border-width: 1px`
- **No dark mode**

### Generated theme.css (preview)

```css
/* themes/crt/theme.css */
:root, [data-mode="light"], [data-mode="dark"] {
  --background: 60 17% 2%;
  --foreground: 105 32% 78%;
  --card: 60 13% 5%;
  --muted: 60 14% 7%;
  --muted-foreground: 110 12% 51%;
  --primary: 110 92% 56%;
  --primary-foreground: 60 17% 2%;
  --destructive: 0 79% 69%;
  --border: 120 21% 19%;
  --input: 120 21% 19%;
  --ring: 120 21% 30%;
  --radius: 0;
  --accent-dim: 117 73% 37%;
  --font-sans: 'VT323', 'Inter', sans-serif;
  --font-mono: 'VT323', 'JetBrains Mono', ui-monospace, monospace;
  --mode: "dark";
}
```

---

## 4. noc — PACKETGRID (NOC dashboard, dark slate + cyan)

**Source:** `concepts/noc.css` · **DNA:** dark slate + cyan primary + green ok status + **light mode only**

| Concept var | Value (hex) | HSL | Maps to | Notes |
|---|---|---|---|---|
| `--bg` | `#0a0f14` | `207 29% 5%` | `--background` | |
| `--fg` | `#d9e6f2` | `207 38% 90%` | `--foreground` | |
| `--surface` | `#0f161d` | `206 28% 9%` | `--card` | |
| `--surface-2` | `#131c25` | `207 28% 11%` | `--muted` | |
| `--border` | `#1c2836` | `207 27% 16%` | `--border` | |
| `--border-bright` | `#2a3b4d` | `209 27% 23%` | `--ring` | |
| `--fg-muted` | `#7d8fa1` | `209 16% 56%` | `--muted-foreground` | |
| `--fg-dim` | `#4a5c6e` | `208 21% 36%` | `--secondary-foreground` | |
| `--accent` | `#35f0c8` | `169 86% 57%` | `--primary` | teal/cyan |
| `--accent-2` | `#00d4ff` | `190 100% 50%` | `--accent-2` | secondary cyan |
| `--danger` | `#ff5c5c` | `0 79% 69%` | `--destructive` | |
| `--ok` | `#3ddc84` | `152 67% 55%` | `--success` | |
| `--font-mono` | `'JetBrains Mono', ...` | (no convert) | `--font-mono` | |
| `--font-sans` | `'Inter', ...` | (no convert) | `--font-sans` | |

**Special:** `--radius: 0`, no shadow, no dark mode

### Generated theme.css (preview)

```css
/* themes/noc/theme.css */
:root, [data-mode="light"], [data-mode="dark"] {
  --background: 207 29% 5%;
  --foreground: 207 38% 90%;
  --card: 206 28% 9%;
  --muted: 207 28% 11%;
  --muted-foreground: 209 16% 56%;
  --primary: 169 86% 57%;
  --primary-foreground: 207 29% 5%;
  --destructive: 0 79% 69%;
  --success: 152 67% 55%;
  --border: 207 27% 16%;
  --input: 207 27% 16%;
  --ring: 209 27% 23%;
  --radius: 0;
  --accent-2: 190 100% 50%;
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
  --mode: "dark";
}
```

---

## 5. min — collage.sh (minimal, olive lime)

**Source:** `concepts/min.css` · **DNA:** minimal off-white + olive lime accent + light mode only

| Concept var | Value (hex) | HSL | Maps to | Notes |
|---|---|---|---|---|
| `--bg` | `#f6f7f4` | `60 9% 96%` | `--background` | |
| `--fg` | `#1a1c16` | `80 13% 10%` | `--foreground` | |
| `--surface` | `#ffffff` | `0 0% 100%` | `--card` | |
| `--surface-2` | `#f0f1ed` | `75 8% 93%` | `--muted` | |
| `--border` | `#e3e5df` | `90 9% 88%` | `--border` | |
| `--border-bright` | `#d2d5cd` | `90 9% 81%` | `--ring` | |
| `--fg-muted` | `#5d6157` | `90 6% 36%` | `--muted-foreground` | |
| `--fg-dim` | `#9aa097` | `100 6% 60%` | `--secondary-foreground` | |
| `--accent` | `#7a9a01` | `73 98% 19%` | `--primary` | olive lime |
| `--accent-bright` | `#c3d22a` | `65 65% 49%` | `--accent-2` | brighter lime |
| `--danger` | `#c7452f` | `7 63% 49%` | `--destructive` | |
| `--font-mono` | `'JetBrains Mono', ...` | (no convert) | `--font-mono` | |
| `--font-sans` | `'Inter', ...` | (no convert) | `--font-sans` | |

**Special:** `--radius: 0`, no shadow, no dark mode

### Generated theme.css (preview)

```css
/* themes/min/theme.css */
:root, [data-mode="light"], [data-mode="dark"] {
  --background: 60 9% 96%;
  --foreground: 80 13% 10%;
  --card: 0 0% 100%;
  --muted: 75 8% 93%;
  --muted-foreground: 90 6% 36%;
  --primary: 73 98% 19%;
  --primary-foreground: 60 9% 96%;
  --destructive: 7 63% 49%;
  --border: 90 9% 88%;
  --input: 90 9% 88%;
  --ring: 90 9% 81%;
  --radius: 0;
  --accent-2: 65 65% 49%;
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}
```

---

## 6. glitchpage — error page (neon pink + cyan + Thai)

**Source:** `concepts/glitchpage.css` · **DNA:** dark navy + neon pink + cyan + glitch number + Thai copy + **light mode only**

| Concept var | Value (hex) | HSL | Maps to | Notes |
|---|---|---|---|---|
| `--bg` | `#0b0f2a` | `230 53% 10%` | `--background` | |
| `--fg` | `#e8eafc` | `234 79% 95%` | `--foreground` | |
| `--surface` | `#111640` | `233 53% 16%` | `--card` | |
| `--surface-2` | `#161c4d` | `232 53% 20%` | `--muted` | |
| `--border` | `#232a5e` | `232 38% 25%` | `--border` | |
| `--border-bright` | `#333d80` | `230 42% 35%` | `--ring` | |
| `--fg-muted` | `#8f96c9` | `232 36% 68%` | `--muted-foreground` | |
| `--fg-dim` | `#555d99` | `234 30% 47%` | `--secondary-foreground` | |
| `--accent` | `#ff3d8f` | `333 100% 62%` | `--primary` | hot pink |
| `--accent-2` | `#37e6ff` | `187 100% 61%` | `--accent-2` | cyan |
| `--danger` | `#ff3d5e` | `351 100% 62%` | `--destructive` | |
| `--font-mono` | `'JetBrains Mono', ...` | (no convert) | `--font-mono` | |
| `--font-sans` | `'Sarabun', ...` | (no convert) | `--font-sans` | Thai |
| `--font-display` | `'Kanit', ...` | (no convert) | `--font-display` | |

**Special:** `--radius: 0`, no shadow, no dark mode

### Generated theme.css (preview)

```css
/* themes/glitchpage/theme.css */
:root, [data-mode="light"], [data-mode="dark"] {
  --background: 230 53% 10%;
  --foreground: 234 79% 95%;
  --card: 233 53% 16%;
  --muted: 232 53% 20%;
  --muted-foreground: 232 36% 68%;
  --primary: 333 100% 62%;
  --primary-foreground: 230 53% 10%;
  --destructive: 351 100% 62%;
  --border: 232 38% 25%;
  --input: 232 38% 25%;
  --ring: 230 42% 35%;
  --radius: 0;
  --accent-2: 187 100% 61%;
  --font-sans: 'Sarabun', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
  --font-display: 'Kanit', sans-serif;
  --mode: "dark";
}
```

---

## 7. claude — CLAUDE PAPER (warm editorial + dual mode)

**Source:** `concepts/claude.css` · **DNA:** warm paper + clay accent + serif + dual mode (light + dark)

### Light mode

| Concept var | Value (hex/rgba) | HSL | Maps to | Notes |
|---|---|---|---|---|
| `--bg` | `#faf9f5` | `60 25% 98%` | `--background` | paper |
| `--fg` | `#141413` | `60 7% 7%` | `--foreground` | warm black |
| `--surface` | `#ffffff` | `0 0% 100%` | `--card` | |
| `--surface-2` | `#f5f4ed` | `56 27% 95%` | `--muted` | |
| `--surface-3` | `#f1efe8` | `47 22% 93%` | (skip — ไม่มี slot) | ใช้ร่วมกับ surface-2 |
| `--border` | `rgba(20,20,19,0.12)` | `60 7% 7% / 0.12` | `--border` | subtle border (12% alpha) |
| `--border-bright` | `rgba(20,20,19,0.22)` | `60 7% 7% / 0.22` | `--ring` | |
| `--fg-muted` | `#3d3d3a` | `60 4% 23%` | `--muted-foreground` | |
| `--fg-dim` | `rgba(20,20,19,0.45)` | `60 7% 7% / 0.45` | `--secondary-foreground` | |
| `--accent` | `#d97757` | `14 64% 60%` | `--primary` | clay |
| `--accent-deep` | `#b85c3f` | `14 47% 49%` | `--accent-deep` | |
| `--success` | `#3d7a4e` | `141 32% 36%` | `--success` | |
| `--warn` | `#a06a00` | `41 100% 31%` | `--warning` | |
| `--danger` | `#b03a2e` | `5 58% 43%` | `--destructive` | |
| `--info` | `#3a5f8a` | `210 43% 38%` | `--info` | |
| `--shadow` | `0 1px 2px rgba(20,20,19,0.05), 0 8px 24px -18px rgba(20,20,19,0.18)` | (no convert) | `--shadow`, `--shadow-md` | claude soft-shadow |
| `--font-serif` | `'Source Serif 4', ...` | (no convert) | `--font-sans`, `--font-serif`, `--font-display` | claude ใช้ serif ทั้งเว็บ |
| `--font-mono` | `ui-monospace, ...` | (no convert) | `--font-mono` | |

### Dark mode

| Concept var | Value (hex/rgba) | HSL | Maps to | Notes |
|---|---|---|---|---|
| `--bg` | `#30302e` | `60 3% 18%` | `--background` | |
| `--fg` | (implied `#faf9f5`) | `60 25% 98%` | `--foreground` | |
| `--surface` | `#383835` | `60 3% 21%` | `--card` | |
| `--surface-2` | `#262624` | `60 4% 14%` | `--muted` | |
| `--surface-3` | `#242422` | `60 6% 13%` | (skip) | |
| `--border` | `rgba(250,249,245,0.14)` | `60 25% 98% / 0.14` | `--border` | light alpha 14% on dark |
| `--border-bright` | `rgba(250,249,245,0.24)` | `60 25% 98% / 0.24` | `--ring` | |

### Generated theme.css (preview)

```css
/* themes/claude/theme.css */
:root {
  --background: 60 25% 98%;
  --foreground: 60 7% 7%;
  --card: 0 0% 100%;
  --muted: 56 27% 95%;
  --muted-foreground: 60 4% 23%;
  --primary: 14 64% 60%;
  --primary-foreground: 60 25% 98%;
  --destructive: 5 58% 43%;
  --success: 141 32% 36%;
  --warning: 41 100% 31%;
  --info: 210 43% 38%;
  --border: 60 7% 7% / 0.12;
  --input: 60 7% 7% / 0.12;
  --ring: 60 7% 7% / 0.22;
  --radius: 0.75rem;             /* 12px — claude เป็น editorial */
  --shadow: 0 1px 2px hsl(60 7% 7% / 0.05), 0 8px 24px -18px hsl(60 7% 7% / 0.18);
  --accent-deep: 14 47% 49%;
  --font-sans: 'Source Serif 4', 'Source Han Serif SC', Georgia, serif;
  --font-serif: 'Source Serif 4', 'Source Han Serif SC', Georgia, serif;
  --font-mono: ui-monospace, 'SF Mono', monospace;
  --font-display: 'Source Serif 4', Georgia, serif;
}

[data-mode="dark"] {
  --background: 60 3% 18%;
  --foreground: 60 25% 98%;
  --card: 60 3% 21%;
  --muted: 60 4% 14%;
  --muted-foreground: 60 4% 78%;     /* ไม่มีใน source — derive เป็น foreground + 60% */
  --primary: 14 64% 60%;
  --primary-foreground: 60 3% 18%;
  --border: 60 25% 98% / 0.14;
  --input: 60 25% 98% / 0.14;
  --ring: 60 25% 98% / 0.24;
}
```

---

## 8. moss — MOSS (organic, earth palette, spring motion)

**Source:** `concepts/moss.css` · **DNA:** warm paper + moss green + terracotta + Fraunces serif + spring easing + **light mode only**

| Concept var | Value (hex/rgba) | HSL | Maps to | Notes |
|---|---|---|---|---|
| `--bg` | `#f5f1e8` | `43 38% 94%` | `--background` | warm paper |
| `--fg` | `#2e2a24` | `38 14% 16%` | `--foreground` | warm black |
| `--surface` | `#fdfbf5` | `48 53% 98%` | `--card` | |
| `--surface-2` | `#efe9db` | `47 38% 90%` | `--muted` | |
| `--surface-3` | `#eae3d3` | `45 35% 86%` | (skip) | ใช้ร่วมกับ muted |
| `--border` | `rgba(46,42,36,0.14)` | `38 14% 16% / 0.14` | `--border` | |
| `--border-bright` | `rgba(46,42,36,0.28)` | `38 14% 16% / 0.28` | `--ring` | |
| `--fg-muted` | `#6b645a` | `33 8% 39%` | `--muted-foreground` | |
| `--fg-dim` | `rgba(46,42,36,0.45)` | `38 14% 16% / 0.45` | `--secondary-foreground` | |
| `--accent` | `#6a8c3f` | `89 39% 40%` | `--primary` | moss green |
| `--accent-deep` | `#4f6d2d` | `90 42% 30%` | `--accent-deep` | |
| `--terra` | `#c4714a` | `18 49% 53%` | `--terracotta` | **extended slot** |
| `--clay` | `#d9a05b` | `30 63% 60%` | `--clay` | **extended slot** |
| `--success` | `#5c7a3d` | `92 31% 36%` | `--success` | |
| `--warn` | `#b0832f` | `39 57% 44%` | `--warning` | |
| `--danger` | `#a84d33` | `12 53% 43%` | `--destructive` | |
| `--info` | `#4a6b7a` | `200 21% 38%` | `--info` | |
| `--shadow` | `0 2px 4px rgba(46,42,36,0.06), 0 14px 40px -20px rgba(46,42,36,0.25)` | (no convert) | `--shadow`, `--shadow-md`, `--shadow-lg` | |
| `--ease-spring` | `cubic-bezier(0.34, 1.4, 0.5, 1)` | (no convert) | `--ease-spring` | **extended slot** |
| `--font-serif` | `'Fraunces', ...` | (no convert) | `--font-sans`, `--font-serif`, `--font-display` | moss ใช้ serif ทั้งเว็บ |
| `--font-mono` | `ui-monospace, ...` | (no convert) | `--font-mono` | |

**Special:**
- `--radius: 0.75rem` (moss rounded-soft, ไม่ใช่ 0)
- Extended slots: `--terracotta`, `--clay`, `--ease-spring`
- No dark mode

### Generated theme.css (preview)

```css
/* themes/moss/theme.css */
:root, [data-mode="light"], [data-mode="dark"] {
  --background: 43 38% 94%;
  --foreground: 38 14% 16%;
  --card: 48 53% 98%;
  --muted: 47 38% 90%;
  --muted-foreground: 33 8% 39%;
  --primary: 89 39% 40%;
  --primary-foreground: 43 38% 94%;
  --destructive: 12 53% 43%;
  --success: 92 31% 36%;
  --warning: 39 57% 44%;
  --info: 200 21% 38%;
  --border: 38 14% 16% / 0.14;
  --input: 38 14% 16% / 0.14;
  --ring: 38 14% 16% / 0.28;
  --radius: 0.75rem;
  --shadow: 0 2px 4px hsl(38 14% 16% / 0.06), 0 14px 40px -20px hsl(38 14% 16% / 0.25);
  --accent-deep: 90 42% 30%;
  --terracotta: 18 49% 53%;
  --terracotta-foreground: 43 38% 94%;
  --clay: 30 63% 60%;
  --ease-spring: cubic-bezier(0.34, 1.4, 0.5, 1);
  --font-sans: 'Fraunces', 'Source Serif 4', Georgia, serif;
  --font-serif: 'Fraunces', 'Source Serif 4', Georgia, serif;
  --font-mono: ui-monospace, 'SF Mono', monospace;
  --font-display: 'Fraunces', Georgia, serif;
}
```

---

## 9. brut — BRUT (brutalist, raw + 0 radius + Anton)

**Source:** `concepts/brut.css` · **DNA:** paper bg + black/white/red + 0px radius + 2px border + Anton display + **light mode only**

| Concept var | Value (hex/rgba) | HSL | Maps to | Notes |
|---|---|---|---|---|
| `--bg` | `#e8e4da` | `43 24% 89%` | `--background` | warm paper |
| `--fg` | `#0d0d0d` | `0 0% 5%` | `--foreground` | near black |
| `--surface` | `#ffffff` | `0 0% 100%` | `--card` | |
| `--surface-2` | `#d8d4ca` | `43 19% 81%` | `--muted` | |
| `--surface-3` | `#efebe2` | `45 26% 91%` | (skip) | ใช้ร่วมกับ muted |
| `--border` | `#0d0d0d` | `0 0% 5%` | `--border` | |
| `--fg-muted` | `#3d3d3a` | `60 4% 23%` | `--muted-foreground` | |
| `--fg-dim` | `rgba(13,13,13,0.55)` | `0 0% 5% / 0.55` | `--secondary-foreground` | |
| `--accent` | `#ff2e00` | `10 100% 50%` | `--primary` | brutalist red |
| `--accent-deep` | `#c91f00` | `8 100% 39%` | `--accent-deep` | |
| `--white` | `#ffffff` | `0 0% 100%` | `--primary-foreground` | (brut ใช้ white text on red) |
| `--font-disp` | `'Anton', 'Impact', ...` | (no convert) | `--font-display` | Anton display |
| `--font-mono` | `'IBM Plex Mono', ...` | (no convert) | `--font-mono`, `--font-sans` | brut ใช้ mono ทั้งเว็บ |

**Special:**
- `--radius: 0` (brut)
- `--border-width: 2px` (brut border 2px)
- `--shadow: none` (brut ไม่มี shadow)
- `--step: 0.05s` → translate เป็น transition duration ใน component (ไม่ใช่ token)
- No dark mode

### Generated theme.css (preview)

```css
/* themes/brut/theme.css */
:root, [data-mode="light"], [data-mode="dark"] {
  --background: 43 24% 89%;
  --foreground: 0 0% 5%;
  --card: 0 0% 100%;
  --muted: 43 19% 81%;
  --muted-foreground: 60 4% 23%;
  --primary: 10 100% 50%;
  --primary-foreground: 0 0% 100%;
  --destructive: 10 100% 50%;
  --border: 0 0% 5%;
  --input: 0 0% 5%;
  --ring: 10 100% 50%;
  --radius: 0;
  --border-width: 2px;
  --shadow: none;
  --accent-deep: 8 100% 39%;
  --font-sans: 'IBM Plex Mono', 'JetBrains Mono', ui-monospace, monospace;
  --font-mono: 'IBM Plex Mono', ui-monospace, monospace;
  --font-display: 'Anton', 'Impact', sans-serif;
}
```

---

## Cross-reference Summary

| Slot | mcky | rack | crt | noc | min | glitch | claude | moss | brut |
|---|---|---|---|---|---|---|---|---|---|
| `--background` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `--foreground` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `--card` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `--muted` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `--muted-foreground` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `--primary` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `--primary-foreground` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `--destructive` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `--success` | ✓ | — | — | ✓ | — | — | ✓ | ✓ | — |
| `--warning` | ✓ | — | — | — | — | — | ✓ | ✓ | — |
| `--info` | ✓ | ✓ | — | — | — | — | ✓ | ✓ | — |
| `--border` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `--input` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `--ring` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `--radius` | 6px | 0 | 0 | 0 | 0 | 0 | 12px | 12px | 0 |
| `--border-width` | 3px | 1px | 1px | 1px | 1px | 1px | 1px | 1px | 2px |
| `--shadow` | hard | none | none | none | none | none | soft | soft | none |
| `--accent-2` | cyan | green | — | cyan | lime | cyan | — | — | — |
| `--accent-deep` | ✓ | — | — | — | — | — | ✓ | ✓ | ✓ |
| `--accent-dim` | — | — | ✓ | — | — | — | — | — | — |
| `--terracotta` | — | — | — | — | — | — | — | ✓ | — |
| `--clay` | — | — | — | — | — | — | — | ✓ | — |
| `--ease-spring` | — | — | — | — | — | — | — | ✓ | — |
| Dual mode | ✓ | — | — | — | — | — | ✓ | — | — |
| Dark only (force) | — | ✓ | ✓ | ✓ | — | ✓ | — | — | — |
| Light only | — | — | — | — | ✓ | — | — | ✓ | ✓ |

**Coverage: 9/9 concepts map ได้ครบ** ไม่มี concept ไหนตกหล่น — แต่ละ concept ใช้ 18-26 slots จาก 34 ทั้งหมด
