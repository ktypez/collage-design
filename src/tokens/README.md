# Tokens — Design Gallery Framework

`schema.css` = **default neutral** token contract. ทุก component ใน framework อ่านจากตรงนี้

**นี่ไม่ใช่ธีม** — เป็นแค่ base. ธีมจริงอยู่ใน `themes/<id>/theme.css` (ผู้ใช้สร้างเอง)

## ไฟล์

- `schema.css` — default neutral + light/dark auto (HSL space-separated, shadcn-style)
- `schema.md` — slot definitions + กฎการ override (อ่านก่อนสร้าง theme)

## วิธีใช้

### 1. ใช้ default neutral เลย
```html
<link rel="stylesheet" href="src/tokens/schema.css">
<link rel="stylesheet" href="src/components/base.css">
<!-- ได้ neutral zinc-style UI -->
```

### 2. Override เป็นธีมตัวเอง
```html
<link rel="stylesheet" href="src/tokens/schema.css">
<link rel="stylesheet" href="themes/mcky/theme.css">  /* override ทับ */
<link rel="stylesheet" href="src/components/base.css">
```

### 3. Switch mode
```html
<html data-mode="dark">  <!-- force dark -->
```

## สร้างธีมใหม่

```bash
mkdir themes/my-theme
```

```css
/* themes/my-theme/theme.css */
:root {
  --primary: 50 100% 71%;          /* amber */
  --radius: 0.375rem;
  --border-width: 3px;
  --shadow: 4px 4px 0 0 0 0 0 / 0;  /* hard shadow */
  --font-sans: 'JetBrains Mono', ui-monospace, monospace;
}

[data-mode="dark"] {
  --background: 0 0% 4%;
  --foreground: 0 0% 88%;
  /* ... */
}
```

ขั้นต่ำคือ override 5-10 slots ให้ personality ออก — ไม่ต้องเขียนครบ 30+

## Validate

```bash
node tools/validate.mjs themes/my-theme/theme.css
```

จะเช็คว่า:
- syntax ถูก
- มี required slot ครบ (`--primary`, `--foreground`, `--background`, `--border`, `--radius`)
- contrast ratio ผ่าน WCAG AA (≥ 4.5:1 สำหรับ text)
- HSL format ถูกต้อง
