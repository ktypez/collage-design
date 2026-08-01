/* =============================================================================
   themes/mcky/manifest.js — mcky.space (neobrutalism)
   -----------------------------------------------------------------------------
   แกะ DNA จาก mcky.space (Astro 7 static site, ~/mcky.space)
   - neobrutalism: border 3px ดำ + hard shadow 4px 4px 0 + radius 6px
   - 100% mono (JetBrains Mono self-hosted) — ระบบทั้งเว็บ mono หมด
   - accent สด 8 สี (amber hover / mint / red / blue / purple / orange / cyan / pink)
   - dual mode: light (#f5f5f0) + dark (#0a0a0a) — shadow เปลี่ยนตาม border
   ============================================================================= */
export const manifest = {
  id: 'mcky',
  name: 'mcky.space',
  dot: '#ffe066',

  /* UI copy — log / terminal tone */
  ui: {
    heroMeta: '~/mcky.space',
    genIdle: '> idle…',
    genReady: '> saved · hard shadow',
    genHint: '// 3px borders. no mercy.',
    outputTitle: 'MCKY.SPACE · LOG',
    outputTag: 'DONE',
    uploadText: 'drop a card here',
    logIntro: '$ astro build --static',
    ach: ['🏆 3px border gang', '🏆 Mono or nothing', '🏆 Hard shadows only', '🏆 No React, no Tailwind'],
    heroTitle: 'mcky<span class="ext">.space</span>',
    heroDesc: 'neobrutalism ที่อยู่ในเว็บจริง<br>amber hover · mono 100% · hard shadow 4px',
  },

  /* Design tokens — dual mode (light/dark) */
  tokens: {
    mode: ['light', 'dark'],
    light: {
      bg:          '#f5f5f0',  // paper
      surface:     '#ffffff',  // raised
      code:        '#f5f5f0',
      border:      '#000000',
      ink:         '#000000',
      inkMuted:    '#333333',
      inkDim:      '#777777',
      accent:      '#ffe066',  // amber — hover/highlight
      accentSoft:  'rgba(255,224,102,0.35)',
      success:     '#06d6a0',  // mint
      warn:        '#ff9f43',  // orange
      danger:      '#ff6b6b',  // red
      info:        '#4361ee',  // blue
    },
    dark: {
      bg:          '#0a0a0a',
      surface:     '#141414',
      code:        '#141414',
      border:      '#888888',
      ink:         '#e0e0e0',
      inkMuted:    '#a0a0a0',
      inkDim:      '#666666',
      accent:      '#ffe066',
      accentSoft:  'rgba(255,224,102,0.18)',
      success:     '#06d6a0',
      warn:        '#ff9f43',
      danger:      '#ff6b6b',
      info:        '#4361ee',
    },

    fontMono: "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace",
  },

  /* Canvas manifest — สำหรับ collage output (paper grid, hard shadow) */
  canvas: {
    bg: { gradient: ['#f5f5f0', '#ffffff', '#f5f5f0'], vertical: true },
    cell: {
      border: '#000000', width: 3, rounded: 6,
      label: 'card {n}', labelColor: '#333333', labelBg: 'rgba(255,255,255,0.9)',
      bg: '#ffffff',
    },
    header: {
      text: 'MCKY.SPACE · CARDS',
      color: '#000000', font: 'mono', size: 36, pad: 48, glow: false,
    },
    overlay: 'none',
    photoFx: 'none',
    presetAccent: false,
  },

  hooks: {
    preDraw: null,
    postDraw: null,
  },
};
