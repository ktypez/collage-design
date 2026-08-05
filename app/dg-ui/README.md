# DG Web UI (app/dg-ui)

The Design Gallery Framework web UI — React 19 + Vite + Tailwind v4 + shadcn-style components
(ปั้นเองใน `src/` ไม่ผ่าน shadcn CLI). HashRouter (fix สำหรับ static hosting หลาย path).

## Theme model — tweakcn-style (install ทีละตัว)

Themes เป็น **ไฟล์ CSS แยก** ใน `src/themes/<id>.css` — ไม่ bundle ทั้ง 9 ตัว.
เริ่มจาก themes ที่ ship มา (mcky, claude) แล้วเพิ่มทีหลังตามต้องการ.

```bash
# จาก repo root — install 1 theme เข้า src/themes/
node bin/dg.js add theme rack --ui --dir app/dg-ui
node bin/dg.js add theme brut --ui --dir app/dg-ui

# restart dev server — theme ขึ้นใน switcher ทันที
```

```
app/dg-ui/src/themes/     ← installed themes (เฉพาะตัวที่ติดตั้ง)
├── mcky.css              ← shipped
├── claude.css            ← shipped
└── rack.css              ← dg add theme rack --ui
```

### ไฟล์ที่เกี่ยวข้อง

- `src/lib/theme.tsx` — ThemeProvider: `import.meta.glob("../themes/*.css")`
  (อ่านเฉพาะที่ install), `AVAILABLE_THEMES` = registry metadata ของทั้ง 9,
  persistence ผ่าน `localStorage` (`dg:theme`, `dg:mode`).
- `src/Themes.tsx` — installed (สลับได้) vs available (dimmed + install hint).
- `src/Landing.tsx` — theme gallery filter เฉพาะ installed.

> **Note:** หลัง `dg add theme --ui` ต้อง restart dev server — `import.meta.glob`
> เป็น static (eager) ที่ Vite resolve ตอน start.

## Dev / Build

```bash
npm install
npm run dev            # vite dev (port 5500 ตามปกติ)
npm run build          # tsc -b && vite build → dist/
npm run preview        # preview production build
```

Serve production: `node tools/serve.mjs 8888` จาก repo root →
`http://<host>:8888/app/dg-ui/dist/`
