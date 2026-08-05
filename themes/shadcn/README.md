# shadcn v4 theme presets (React/Tailwind)

9 design concepts ใน **shadcn v4 format** — ใช้กับ project ที่ใช้
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

## Install (tweakcn-style — ทีละ theme)

```bash
# install 1 theme ลง globals.css ของ React/shadcn project
npx dg add theme mcky --shadcn --dir .

# เพิ่ม theme อื่นทีหลัง
npx dg add theme rack --shadcn --dir .
```

ผลลัพธ์: เขียน `:root`/`.dark` blocks ลง `globals.css` + เพิ่ม `@theme inline`
mapping ถ้ายังไม่มี + ลบ blocks เดิม (theme ใหม่ไม่ถูก override).

## Format

- สีทั้งหมดเป็น **hex เดิม** จาก concepts (precision fix — ไม่มี rounding loss)
- dual (mcky, claude) → `:root` light + `.dark` dark
- dark-only (rack, crt, noc, glitchpage) → `:root, .dark` dark
- light-only (min, moss, brut) → `:root, .dark` light (กัน `.dark` default มาครอบ)
- non-color (radius/border-width/font/shadow) ผ่านตรง

## วิธีใช้ใน shadcn project

### 1. One-time setup — globals.css

เอา `_base.css` (block `@theme inline`) ไปใส่ใน `globals.css` หลัง `@import "tailwindcss"`.
block นี้เหมือนกันทุก theme — ทำครั้งเดียว.

### 2. ติดตั้ง theme

```bash
npx dg add theme <id> --shadcn --dir .
```

- **dual** (mcky, claude): `:root` light + `.dark` dark → toggle `<html class="dark">`
- **dark-only** (rack, crt, noc, glitchpage): เป็น dark เสมอ
- **light-only** (min, moss, brut): เป็น light เสมอ

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

## หมายเหตุ

- สำหรับ Vue project ใช้ `--vue` (ดู `themes/vue/README.md`)
- สำหรับ DG web UI ใช้ `--ui` (ดู `app/dg-ui/src/themes/`)
