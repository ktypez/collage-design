/* =============================================================================
   core/app.js — main app wiring
   -----------------------------------------------------------------------------
   Theme switching, photo management, layout picker, generate, download, log.
   Engine (layout/photo/export) and themes are fully decoupled.
   ============================================================================= */

import { pickLayout, DAY_PRESETS, DAY_NAMES } from '../engine/layout.js';
import { loadImageFromFile, MAX_PHOTOS, MAX_FILE_SIZE } from '../engine/photo.js';
import { downloadPNG, copyToClipboard } from '../engine/export.js';
import { renderCollage } from './canvas-renderer.js';
import { THEMES, DEFAULT_THEME } from '../themes/index.js';

/* ============================= STATE ============================= */
const state = {
  photos: [],               // { id, src, img, name, selected }
  nextId: 1,
  currentTheme: localStorage.getItem('collage_theme') || DEFAULT_THEME,
  chosenLayout: 'auto',
  preset: defaultDayPreset(),
  achIdx: 0,
};

function defaultDayPreset() {
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return days[new Date().getDay()];
}

function activeManifest() { return THEMES[state.currentTheme]; }

/* ============================= HELPERS ============================= */
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

/* ---- log ---- */
const logEl = $('[data-log]');
export function log(type, msg) {
  const ts = new Date().toTimeString().slice(0, 8);
  const cls = ['ok', 'warn', 'err'].includes(type) ? type : '';
  const line = document.createElement('div');
  line.innerHTML = `<span class="ts">${ts}</span><span class="${cls}">${escapeHtml(msg)}</span>`;
  logEl.appendChild(line);
  logEl.scrollTop = logEl.scrollHeight;
  while (logEl.children.length > 50) logEl.removeChild(logEl.firstChild);
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

/* ---- toast ---- */
const toast = $('[data-toast]');
function showToast(text) {
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 2200);
}

/* ============================= THEME SWITCH ============================= */
function setActivePicker(t) {
  $$('[data-theme-btn]').forEach((c) => c.classList.toggle('active', c.dataset.themeBtn === t));
}

function applyThemeContent(t) {
  const m = THEMES[t];
  const ui = m.ui;
  $('[data-theme-label]').textContent = m.name;
  $('[data-hero-meta]').textContent = ui.heroMeta;
  $('[data-hero-title]').innerHTML = ui.heroTitle;
  $('[data-hero-desc]').innerHTML = ui.heroDesc;
  $('[data-upload-text]').textContent = ui.uploadText;
  $('[data-gen-hint]').textContent = ui.genHint;
  $('[data-output-title]').textContent = ui.outputTitle;
  $('[data-output-tag]').textContent = ui.outputTag;
  updateGenLabel();
  updateDayPickerVisibility();
}

export function switchTheme(next) {
  if (next === state.currentTheme) return;
  const tl = window.gsap ? window.gsap.timeline() : null;
  const targets = ['.hero', '.section', '.gen', '.gen-hint', '.output'];

  if (tl) {
    tl.to(targets, { opacity: 0, y: 8, duration: 0.2, ease: 'power2.in', stagger: 0.02 });
    tl.add(() => commitTheme(next));
    tl.fromTo(targets, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', stagger: 0.03 });
  } else {
    commitTheme(next);
  }
}

function commitTheme(next) {
  state.currentTheme = next;
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('collage_theme', next);
  setActivePicker(next);
  applyThemeContent(next);
}

/* ---- init theme ---- */
document.documentElement.setAttribute('data-theme', state.currentTheme);
setActivePicker(state.currentTheme);
applyThemeContent(state.currentTheme);

$$('[data-theme-btn]').forEach((chip) => {
  chip.addEventListener('click', () => switchTheme(chip.dataset.themeBtn));
});

/* ============================= DAY PRESET (min theme) ============================= */
const daySection = $('[data-day-section]');
const dayPicker = $('[data-day-picker]');

function updateDayPickerVisibility() {
  const visible = activeManifest().canvas.presetAccent === true;
  daySection.style.display = visible ? 'block' : 'none';
  if (visible) renderDayChips();
}

function renderDayChips() {
  dayPicker.innerHTML = '';
  Object.keys(DAY_PRESETS).forEach((key) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'day-chip' + (key === state.preset ? ' active' : '');
    btn.title = DAY_NAMES[key];
    btn.dataset.preset = key;
    btn.style.background = `linear-gradient(135deg, ${DAY_PRESETS[key].join(', ')})`;
    btn.addEventListener('click', () => {
      state.preset = key;
      renderDayChips();
    });
    dayPicker.appendChild(btn);
  });
}

/* ============================= UPLOAD ============================= */
const fileInput = $('#fileInput');
const uploadZone = $('[data-upload]');
const photoGrid = $('[data-photo-grid]');
const photoMeta = $('[data-photo-meta]');
const photoActions = $('[data-photo-actions]');

fileInput.addEventListener('change', (e) => {
  addFiles(Array.from(e.target.files));
  e.target.value = '';
});

['dragenter', 'dragover'].forEach((ev) => {
  uploadZone.addEventListener(ev, (e) => {
    e.preventDefault(); e.stopPropagation();
    uploadZone.classList.add('dragover');
  });
});
['dragleave', 'drop'].forEach((ev) => {
  uploadZone.addEventListener(ev, (e) => {
    e.preventDefault(); e.stopPropagation();
    uploadZone.classList.remove('dragover');
  });
});
uploadZone.addEventListener('drop', (e) => {
  const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
  addFiles(files);
});

async function addFiles(files) {
  log('info', `INTAKE ${files.length} file(s) — ${activeManifest().ui.logIntro}`);
  for (const f of files) {
    if (state.photos.length >= MAX_PHOTOS) {
      log('warn', `LIMIT max ${MAX_PHOTOS} photos`);
      showToast(`Max ${MAX_PHOTOS} photos`);
      break;
    }
    if (!f.type.startsWith('image/')) { log('err', `REJECT ${f.name} (not image)`); continue; }
    if (f.size > MAX_FILE_SIZE) { log('warn', `SKIP ${f.name} (too large: ${(f.size / 1024 / 1024).toFixed(1)}MB)`); continue; }
    try {
      const { src, img, name } = await loadImageFromFile(f);
      state.photos.push({ id: state.nextId++, src, img, name, selected: true });
      log('ok', `LOADED ${name} (${img.width}×${img.height})`);
    } catch (err) {
      log('err', `FAILED ${f.name}: ${err.message}`);
    }
  }
  renderPhotos();
  updateGenLabel();
}

function renderPhotos() {
  photoGrid.innerHTML = '';
  state.photos.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'p-card' + (p.selected ? '' : ' disabled');
    card.innerHTML = `
      <img src="${p.src}" alt="${p.name}">
      <span class="idx">${String(i + 1).padStart(2, '0')}</span>
      <span class="del" title="remove">×</span>
    `;
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('del')) {
        state.photos.splice(i, 1);
        log('info', `REMOVED ${p.name}`);
        renderPhotos();
        updateGenLabel();
        return;
      }
      p.selected = !p.selected;
      card.classList.toggle('disabled');
      updateGenLabel();
    });
    photoGrid.appendChild(card);
  });
  const total = state.photos.length;
  const sel = state.photos.filter((p) => p.selected).length;
  photoMeta.textContent = total === 0 ? '0 items' : `${sel}/${total} selected`;
  photoActions.style.display = total > 0 ? 'flex' : 'none';
}

$$('[data-act]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const act = btn.dataset.act;
    if (act === 'select-all') state.photos.forEach((p) => (p.selected = true));
    if (act === 'select-none') state.photos.forEach((p) => (p.selected = false));
    if (act === 'reset') { state.photos.length = 0; log('info', 'CLEARED all photos'); }
    renderPhotos();
    updateGenLabel();
  });
});

/* ============================= LAYOUT ============================= */
$$('[data-layout]').forEach((card) => {
  card.addEventListener('click', () => {
    $$('[data-layout]').forEach((c) => c.classList.remove('active'));
    card.classList.add('active');
    state.chosenLayout = card.dataset.layout;
  });
});
$('[data-layout="auto"]').classList.add('active');

/* ============================= GENERATE ============================= */
const genBtn = $('[data-gen]');
genBtn.addEventListener('click', () => {
  const sel = state.photos.filter((p) => p.selected).length;
  if (sel === 0) return;
  log('info', 'RENDER start');
  const t0 = performance.now();
  const canvas = generateCollage();
  const ms = (performance.now() - t0).toFixed(0);
  log('ok', `RENDER complete · ${canvas.width}×${canvas.height} · ${ms}ms`);

  const out = $('[data-output]');
  out.classList.remove('hidden');
  out.style.opacity = '0';
  requestAnimationFrame(() => {
    out.style.opacity = '1';
    out.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  const ach = activeManifest().ui.ach[state.achIdx % activeManifest().ui.ach.length];
  state.achIdx++;
  setTimeout(() => showToast(ach), 600);
});

function updateGenLabel() {
  const sel = state.photos.filter((p) => p.selected).length;
  const ui = activeManifest().ui;
  if (sel === 0) {
    genBtn.disabled = true;
    $('[data-gen-label]').textContent = ui.genIdle;
  } else {
    genBtn.disabled = false;
    $('[data-gen-label]').textContent = `${ui.genReady} (${sel})`;
  }
}

function generateCollage() {
  const size = parseInt($('#optSize').value, 10);
  const gap = parseInt($('#optGap').value, 10);
  const photos = state.photos.filter((p) => p.selected);
  const cells = pickLayout(photos.length, state.chosenLayout);
  const canvas = $('#outputCanvas');

  renderCollage(canvas, activeManifest(), {
    photos,
    cells,
    size,
    gap,
    preset: activeManifest().canvas.presetAccent ? state.preset : null,
  });

  log('ok', `EXPORT ready · click DOWNLOAD to save PNG (${size}×${size})`);
  return canvas;
}

/* ============================= DOWNLOAD / COPY ============================= */
$('[data-dl="png"]').addEventListener('click', () => {
  downloadPNG($('#outputCanvas'), 'collage')
    .then((blob) => {
      log('ok', `DOWNLOADED collage.png (${(blob.size / 1024).toFixed(0)}KB)`);
      showToast('✓ Downloaded');
    })
    .catch((err) => log('err', `EXPORT failed: ${err.message}`));
});

$('[data-dl="copy"]').addEventListener('click', async () => {
  try {
    await copyToClipboard($('#outputCanvas'));
    log('ok', 'COPIED to clipboard');
    showToast('✓ Copied to clipboard');
  } catch (e) {
    log('err', `COPY failed: ${e.message}`);
    showToast('Copy not supported');
  }
});

/* ============================= INIT ============================= */
log('info', 'READY · waiting for photos');
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.gsap) {
  window.gsap.globalTimeline.timeScale(0.01);
}
window.addEventListener('load', () => {
  if (!window.gsap) return;
  window.gsap.from('.hero h1', { y: 16, opacity: 0, duration: 0.5, ease: 'power2.out' });
  window.gsap.from('.pchip', { y: -8, opacity: 0, duration: 0.3, delay: 0.1, ease: 'power2.out', stagger: 0.04 });
});
