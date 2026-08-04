# shadcn v4 theme presets

9 design concepts ของเราใน **shadcn v4 format** — ใช้ได้กับ project ที่ใช้
React + Radix UI + Tailwind v4 (ผ่าน shadcn/ui registry)

```
themes/shadcn/
├── _base.css          # one-time setup: @theme inline mapping (ใช้ร่วมทุก theme)
├── mcky.css           # dual mode  (light + dark)
├── rack.css           # dark-only
├── crt.css            # dark-only
├── noc.css            # dark-only
├── min.css            # light-only (บังคับ light แม้ใน .dark)
├── glitchpage.css     # dark-only
├── claude.css         # dual mode
├── moss.css           # light-only
└── brut.css           # light-only
```

## Format

- สีทั้งหมด wrap ใน `hsl(...)` (ตรงกับที่ shadcn v4 รับได้ — docs ของเขาก็ใช้ hsl)
- hard-shadow ใช้ `var(--border)` แทน `hsl(var(--border))` (เพราะ --border เป็น hsl() แล้ว)
- non-color (radius/border-width/font/shadow) ผ่านตรง

## วิธีใช้ใน shadcn project

### 1. One-time setup — globals.css

เอา `_base.css` (block `@theme inline`) ไปใส่ใน `globals.css` หลัง `@import "tailwindcss"`.
block นี้เหมือนกันทุก theme — ทำครั้งเดียว.

### 2. เลือก theme

- **dual** (mcky, claude): เอา `:root` (light) + `.dark` (dark) ไปวางใน globals.css
  แล้ว toggle `<html class="dark">`
- **dark-only** (rack, crt, noc, glitchpage): วาง block `:root, .dark` — เป็น dark เสมอ
- **light-only** (min, moss, brut): วาง block `:root, .dark` — เป็น light เสมอ (กัน `.dark` default มาครอบ)

### 3. ใช้ components

`npx shadcn@latest add <component>` → components (Radix-based) อ่าน `var(--color-*)` ผ่าน `@theme inline` → ได้ theme เราเลย

## Regenerate

```bash
npx dg shadcn            # generate ทั้ง 9 + _base.css
npx dg shadcn mcky       # generate อันเดียว
npx dg shadcn --check    # verify เท่านั้น (ไม่เขียนไฟล์)
```

source of truth ยังเป็น `tools/codegen.mjs` (THEMES map) — แก้ตรงนั้นแล้ว `dg codegen && dg shadcn`
จะอัปเดตทั้ง vanilla + shadcn format

## หมายเหตุ architecture

ตัวนี้เป็น **Track A** ของแผน pivot:
- **เก็บ**: token map (THEMES), codegen, validate, 9 themes
- **แทน**: component primitives ที่ปั้นเอง → Radix via shadcn registry
- **ผล**: themes/shadcn/ = drop-in กับ shadcn project ใดก็ได้
