# shadcn-demo — DG themes drop-in proof (Track C)

พิสูจน์ว่า 9 design concepts จาก design-gallery ใช้เป็น **shadcn v4 theme preset**
ได้จริง — React 19 + Radix UI + Tailwind v4, ผ่าน shadcn CLI.

## Stack

- Vite + React 19 + TypeScript
- Tailwind v4 (`@tailwindcss/vite`)
- shadcn/ui (Radix base, Nova preset) — `components.json`
- 9 theme presets จาก `../../themes/shadcn/` (คัดลอกเข้า `src/themes/`)

## วิธีรัน

```bash
npm install
npm run dev
```

เปิด browser → เลือก theme 9 ตัว (mcky/rack/crt/noc/min/glitchpage/claude/moss/brut)
→ UI ทั้งหมดเปลี่ยนทันที (runtime CSS injection, ไม่ต้อง reload)

## สิ่งที่พิสูจน์ได้

| เรื่อง | ผล |
|---|---|
| 9 themes drop-in | `--background` var ตรงกับไฟล์ 100% ทุกตัว |
| Colors | hsl() ของเรา render ถูก (เห็น precision diff ~1-2 rgb จาก hex→HSL round) |
| Radius | mcky 0.375rem → button 4.8px |
| Radix components | Dialog/Tabs/Card/Button ใช้ theme tokens จริง |
| Dark mode | dual (mcky/claude) flip, dark-only อยู่ dark, light-only อยู่ light |
| Production | `npm run build` + preview 200 |

## Architecture

```
src/
├── globals.css          # shadcn init: @theme inline mapping + base :root/.dark
├── themes/*.css         # 9 DG themes (copy จาก ../../themes/shadcn/)
├── lib/theme.tsx        # ThemeProvider — inject theme css แบบ dynamic (?raw)
├── components/ui/*      # shadcn components (Radix) — จาก CLI
└── App.tsx              # demo page
```

Theme switching ใช้ `import("./themes/<id>.css?raw")` → inject `<style id="dg-theme">`
ทับ globals.css. เพราะ theme file มีแค่ `:root`/`.dark` variable blocks,
มัน override ค่า shadcn default ที่ runtime → เปลี่ยน theme ได้ทันที.

## Regenerate theme files

```bash
cd ../..  # repo root
node tools/shadcn-adapter.mjs   # regenerate themes/shadcn/*.css
cp themes/shadcn/*.css examples/shadcn-demo/src/themes/   # sync ลง demo
```

## Note: node_modules / dist ไม่ commit

`node_modules/` และ `dist/` ถูก ignore (ดู .gitignore ของ demo) — คนใช้ต้อง
`npm install` เอง. Commit เฉพาะ source.
