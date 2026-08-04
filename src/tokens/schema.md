# Token Schema — Design Gallery Framework

Default neutral token schema ที่ทุก component ใช้อ้างอิง. อิง pattern จาก shadcn/ui + Radix Colors — เป็น contract ระหว่าง **theme** กับ **component**.

## หลักการ

1. **HSL space-separated** — เก็บเป็น `H S% L%` ไม่มี comma เพื่อให้ปรับ alpha ได้
   ```css
   color: hsl(var(--foreground) / 0.5);  /* 50% opacity */
   ```
2. **Theme = override เท่านั้น** — theme file แค่เขียน token ใหม่ทับ slot ที่ต้องการ ไม่ต้อง define ครบ
3. **Component ไม่ hardcode สี** — ใช้ `var(--*)` เท่านั้น
4. **Default neutral = zinc-style** — ไม่มี personality, เป็นแค่ base

## Mode

- **`:root`** = light (default)
- **`@media (prefers-color-scheme: dark)`** = dark auto (เฉพาะเมื่อไม่มี `[data-mode="light"]`)
- **`[data-mode="dark"]`** = manual dark (priority สูงกว่า system)
- **`[data-mode="light"]`** = cancel system dark

Theme ที่ไม่มี dark variant (rack, crt, noc, min, glitchpage, moss, brut) — ไม่ต้องเขียน dark block, ใช้ light เดียวจบ

## Standard Slots (25 required)

### Surface stack
| Slot | ใช้กับ | คำอธิบาย |
|---|---|---|
| `--background` | `body`, page bg | พื้นหลังหลัก |
| `--foreground` | text on background | สีตัวอักษร default |
| `--card` | `.x-card` bg | พื้นผิวยกระดับ |
| `--card-foreground` | text on card | ตัวอักษรบน card |
| `--popover` | dropdown/tooltip bg | พื้นหลัง popover |
| `--popover-foreground` | text on popover | ตัวอักษรบน popover |

### Brand
| Slot | ใช้กับ | คำอธิบาย |
|---|---|---|
| `--primary` | primary button, link | สีหลักของ brand |
| `--primary-foreground` | text on primary | ตัวอักษรบนปุ่ม primary |
| `--secondary` | secondary button, chip | สีรอง |
| `--secondary-foreground` | text on secondary | ตัวอักษรบน secondary |

### State
| Slot | ใช้กับ | คำอธิบาย |
|---|---|---|
| `--muted` | subtle bg (code block, disabled) | พื้นหลัง subtle |
| `--muted-foreground` | text on muted, placeholder | ตัวอักษร subtle |
| `--accent` | hover, selection, focus highlight | สีเน้น |
| `--accent-foreground` | text on accent | ตัวอักษรบน accent |
| `--destructive` | destructive button, danger border | สีอันตราย |
| `--destructive-foreground` | text on destructive | ตัวอักษรบน destructive |
| `--success` | success state, status pill | สีสำเร็จ |
| `--warning` | warning state, status pill | สีเตือน |
| `--info` | info state, status pill | สีข้อมูล |

### Lines & shape
| Slot | ใช้กับ | คำอธิบาย |
|---|---|---|
| `--border` | `.x-card`, divider | เส้นขอบ default |
| `--input` | `.x-input`, `.x-textarea` | เส้นขอบ input |
| `--ring` | focus ring | วง focus (มักจะเท่ากับ primary) |
| `--radius` | `--radius` ของทุก component | base radius |
| `--border-width` | border thickness (brut/mcky override) | ความหนา border |
| `--shadow` | `--shadow` default | shadow เบา |
| `--shadow-md` | medium shadow | shadow กลาง |
| `--shadow-lg` | large shadow | shadow หนัก |

### Type
| Slot | ใช้กับ | คำอธิบาย |
|---|---|---|
| `--font-sans` | body text | font sans-serif หลัก |
| `--font-mono` | code, kbd, terminal | font monospace |
| `--font-serif` | editorial, long-form | font serif |
| `--font-display` | h1, hero, banner | font heading |
| `--letter-spacing-tight` | display heading | tracking แน่น |
| `--letter-spacing-wide` | label, button | tracking ห่าง |

## Extended Slots (optional — ไม่ override ก็ได้)

Theme ไหนมี DNA พิเศษเพิ่ม slot เหล่านี้ได้ — ไม่มี component built-in ใช้ แต่ user เขียน component เพิ่มใช้ได้

| Slot | ใช้กับ theme | คำอธิบาย |
|---|---|---|
| `--accent-2` | rack (green), noc (cyan), glitchpage (cyan) | secondary accent — ใช้กับ LED/notification |
| `--accent-2-foreground` | คู่กับ `--accent-2` | ตัวอักษรบน `--accent-2` |
| `--accent-deep` | mcky, claude, moss, brut | darker version ของ primary ใช้กับ hover/active |
| `--accent-dim` | crt | dimmer version ของ primary ใช้กับ inactive state |
| `--terracotta` | moss | warm earth tone (secondary palette) |
| `--terracotta-foreground` | คู่กับ `--terracotta` | ตัวอักษรบน terracotta |
| `--clay` | moss | additional earth tone |
| `--ease-spring` | moss, mcky | bouncy easing curve |
| `--mode` | debug/tooling | string indicator: `"light"` หรือ `"dark"` |

## กฎการเขียน Theme

### ✅ ถูกต้อง
```css
/* themes/mcky/theme.css */
:root {
  --primary: 50 100% 71%;            /* amber override */
  --radius: 0.375rem;                /* 6px override */
  --border-width: 3px;               /* เฉพาะ mcky/brut */
  --shadow: 4px 4px 0 0 0 0 0 / 0;    /* hard shadow ของ mcky */
  --font-sans: 'JetBrains Mono', ...;  /* mono 100% */
}

[data-mode="dark"] {  /* mcky มี dark variant */
  --background: 0 0% 4%;
  /* ... */
}
```

### ❌ ผิด
```css
/* ❌ ห้าม hardcode hex/rgb ใน theme.css */
.x-btn { background: #ffe066; }

/* ❌ ห้าม override component โดยตรง */
:root { --x-btn-bg: #ffe066; }
```

Theme ทำหน้าที่ **ปรับ token** เท่านั้น — component อ่าน token เอง

## ตัวอย่าง: copy ธีม

```css
/* themes/<id>/theme.css — ขั้นต่ำ */
:root {
  --primary: <accent-hsl>;
  --radius: <rem>;
  /* + ไม่กี่ slot ที่ทำให้ personality ออก */
}
```

ถ้าธีมไม่มี dark variant → ไม่ต้องเขียน `[data-mode="dark"]` block
