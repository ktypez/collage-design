/* =============================================================================
   components.js — Design Gallery Framework · vanilla JS controllers
   -----------------------------------------------------------------------------
   ⚠️ DEPRECATED (2026-08-04) — DO NOT use for new work.
   The vanilla component layer (base.css + components.js) is frozen. It has
   known accessibility gaps and hand-rolled primitives that we no longer
   maintain. The framework now ships as shadcn theme presets (React + Radix
   UI + Tailwind v4):

     themes/shadcn/<id>.css   ← design concepts as shadcn v4 themes
     npx dg add theme <id> --shadcn   ← install into a shadcn project

   This file is kept ONLY for the legacy concept gallery (app/*.html).
   Migration path: see src/components/DEPRECATED.md
   -----------------------------------------------------------------------------
   Interactive behavior for components in base.css.
   No dependencies · framework-agnostic · auto-init + MutationObserver.
   Loaded as <script type="module"> or via <script defer>.
   ============================================================================= */

(function () {
  'use strict';

  // ---- helpers ----
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const fire = (el, name, detail) => {
    el.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, cancelable: true }));
  };

  const focusableSel =
    'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), ' +
    'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  // =============================================================================
  // 0. Auto-init + dynamic content
  // =============================================================================
  const init = () => {
    initAccordions();
    initTabs();
    initCollapsibles();
    initToggles();
    initToggleGroups();
    initDialogs();
    initSheets();
    initDrawers();
    initTooltips();
    initPopovers();
    initHoverCards();
    initMenus();
    initContextMenus();
    initMenubars();
    initNavMenus();
    initComboboxes();
    initCommands();
    initSliders();
    initCalendars();
    initDatePickers();
    initCarousels();
    initResizables();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-init for dynamic content
  const mo = new MutationObserver((muts) => {
    for (const m of muts) {
      m.addedNodes.forEach((n) => {
        if (!(n instanceof Element)) return;
        if (n.matches?.('[data-x], .x-tabs, .x-accordion, .x-dialog, .x-tooltip, .x-popover, .x-menu, .x-slider, .x-cal, .x-datepicker, .x-carousel, .x-resizable, .x-combobox, .x-command, .x-collapsible, .x-toggle-group, .x-sheet, .x-drawer')) {
          initOne(n);
        }
        $$('[data-x], .x-tabs, .x-accordion, .x-dialog, .x-tooltip, .x-popover, .x-menu, .x-slider, .x-cal, .x-datepicker, .x-carousel, .x-resizable, .x-combobox, .x-command, .x-collapsible, .x-toggle-group, .x-sheet, .x-drawer', n).forEach(initOne);
      });
    }
  });
  if (document.body) mo.observe(document.body, { childList: true, subtree: true });
  else document.addEventListener('DOMContentLoaded', () => mo.observe(document.body, { childList: true, subtree: true }));

  function initOne(el) {
    if (el.classList?.contains('x-tabs'))           initTabsEl(el);
    else if (el.classList?.contains('x-accordion'))    initAccordionEl(el);
    else if (el.classList?.contains('x-dialog'))       initDialogEl(el);
    else if (el.classList?.contains('x-sheet'))        initSheetEl(el);
    else if (el.classList?.contains('x-drawer'))       initDrawerEl(el);
    else if (el.classList?.contains('x-tooltip'))      initTooltipEl(el);
    else if (el.classList?.contains('x-popover'))      initPopoverEl(el);
    else if (el.classList?.contains('x-hovercard'))    initHoverCardEl(el);
    else if (el.classList?.contains('x-menu'))         initMenuEl(el);
    else if (el.classList?.contains('x-context-menu') || el.classList?.contains('x-contextmenu')) initContextMenuEl(el);
    else if (el.classList?.contains('x-menubar'))      initMenubarEl(el);
    else if (el.classList?.contains('x-navmenu'))      initNavMenuEl(el);
    else if (el.classList?.contains('x-combobox'))     initComboboxEl(el);
    else if (el.classList?.contains('x-command'))      initCommandEl(el);
    else if (el.classList?.contains('x-slider'))       initSliderEl(el);
    else if (el.classList?.contains('x-cal'))          initCalendarEl(el);
    else if (el.classList?.contains('x-datepicker'))   initDatePickerEl(el);
    else if (el.classList?.contains('x-carousel'))     initCarouselEl(el);
    else if (el.classList?.contains('x-resizable'))    initResizableEl(el);
    else if (el.classList?.contains('x-collapsible'))  initCollapsibleEl(el);
    else if (el.classList?.contains('x-toggle-group')) initToggleGroupEl(el);
  }

  // =============================================================================
  // 1. Accordion
  // =============================================================================
  function initAccordions() { $$('.x-accordion').forEach(initAccordionEl); }
  function initAccordionEl(acc) {
    if (acc.dataset.xInited) return;
    acc.dataset.xInited = '1';
    $$('.x-accordion-trigger', acc).forEach((t) => {
      if (t.dataset.xBound) return;
      t.dataset.xBound = '1';
      t.addEventListener('click', () => {
        const open = t.getAttribute('aria-expanded') === 'true';
        const single = acc.dataset.type !== 'multiple';
        if (single) {
          $$('.x-accordion-trigger', acc).forEach((o) => {
            o.setAttribute('aria-expanded', 'false');
            o.nextElementSibling?.setAttribute('hidden', '');
          });
        }
        t.setAttribute('aria-expanded', String(!open));
        const content = t.nextElementSibling;
        if (content) {
          if (open && single) content.setAttribute('hidden', '');
          else content.removeAttribute('hidden');
        }
        fire(t, 'accordion:toggle', { open: !open });
      });
    });
  }

  // =============================================================================
  // 2. Tabs
  // =============================================================================
  function initTabs() { $$('.x-tabs').forEach(initTabsEl); }
  function initTabsEl(tabs) {
    if (tabs.dataset.xInited) return;
    tabs.dataset.xInited = '1';
    const list = $('.x-tabs-list', tabs);
    if (!list) return;
    const triggers = $$('.x-tabs-trigger', list);
    const panels = triggers.map((t) => $(`#${t.getAttribute('aria-controls')}`) || document.getElementById(t.dataset.panel));

    const select = (i) => {
      triggers.forEach((t, j) => {
        const active = i === j;
        t.setAttribute('data-state', active ? 'active' : 'inactive');
        t.setAttribute('aria-selected', String(active));
        t.tabIndex = active ? 0 : -1;
      });
      panels.forEach((p, j) => { if (p) p.toggleAttribute('hidden', i !== j); });
      fire(tabs, 'tabs:change', { index: i });
    };

    triggers.forEach((t, i) => {
      if (t.dataset.xBound) return;
      t.dataset.xBound = '1';
      t.addEventListener('click', () => select(i));
      t.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); select((i + 1) % triggers.length); triggers[(i + 1) % triggers.length].focus(); }
        if (e.key === 'ArrowLeft')  { e.preventDefault(); select((i - 1 + triggers.length) % triggers.length); triggers[(i - 1 + triggers.length) % triggers.length].focus(); }
        if (e.key === 'Home')       { e.preventDefault(); select(0); triggers[0].focus(); }
        if (e.key === 'End')        { e.preventDefault(); select(triggers.length - 1); triggers[triggers.length - 1].focus(); }
      });
    });
  }

  // =============================================================================
  // 3. Collapsible
  // =============================================================================
  function initCollapsibles() { $$('.x-collapsible').forEach(initCollapsibleEl); }
  function initCollapsibleEl(c) {
    if (c.dataset.xInited) return;
    c.dataset.xInited = '1';
    const trigger = $('.x-collapsible-trigger', c);
    const content = $('.x-collapsible-content', c);
    if (!trigger || !content) return;
    const open = () => { content.dataset.state = 'open'; trigger.setAttribute('aria-expanded', 'true'); fire(c, 'collapsible:open'); };
    const close = () => { content.dataset.state = 'closed'; trigger.setAttribute('aria-expanded', 'false'); fire(c, 'collapsible:close'); };
    if (content.dataset.state === 'open') open(); else close();
    trigger.addEventListener('click', () => content.dataset.state === 'open' ? close() : open());
  }

  // =============================================================================
  // 4. Toggle (single, used inside toggle-group or standalone)
  // =============================================================================
  function initToggles() { $$('.x-toggle').forEach((t) => {
    if (t.dataset.xInited) return;
    t.dataset.xInited = '1';
    if (t.hasAttribute('aria-pressed')) t.dataset.state = t.getAttribute('aria-pressed') === 'true' ? 'on' : 'off';
    t.addEventListener('click', () => {
      const on = t.dataset.state === 'on';
      const next = !on;
      t.dataset.state = next ? 'on' : 'off';
      t.setAttribute('aria-pressed', String(next));
      fire(t, 'toggle:change', { pressed: next });
    });
  }); }

  // =============================================================================
  // 5. Toggle Group
  // =============================================================================
  function initToggleGroups() { $$('.x-toggle-group').forEach(initToggleGroupEl); }
  function initToggleGroupEl(g) {
    if (g.dataset.xInited) return;
    g.dataset.xInited = '1';
    const type = g.dataset.type || 'single'; // single | multiple
    const items = $$('.x-toggle', g);
    const apply = () => {
      const active = items.filter((i) => i.dataset.state === 'on').map((i) => i.dataset.value || i.textContent.trim());
      fire(g, 'toggle-group:change', { value: type === 'multiple' ? active : (active[0] ?? null) });
    };
    items.forEach((t) => {
      if (!t.dataset.value) t.dataset.value = t.textContent.trim();
      t.addEventListener('click', () => {
        const on = t.dataset.state === 'on';
        if (type === 'single') {
          items.forEach((o) => { o.dataset.state = 'off'; o.setAttribute('aria-pressed', 'false'); });
        }
        t.dataset.state = on ? 'off' : 'on';
        t.setAttribute('aria-pressed', String(!on));
        apply();
      });
    });
  }

  // =============================================================================
  // 6. Dialog / Sheet / Drawer (shared overlay controller)
  // =============================================================================
  function initDialogs() { $$('.x-dialog').forEach(initDialogEl); }
  function initDialogEl(d) {
    if (d.dataset.xInited) return;
    d.dataset.xInited = '1';
    const overlay = createOverlay();
    bindOverlay(d, overlay, 'x-dialog-backdrop');
  }
  function initSheets() { $$('.x-sheet').forEach(initSheetEl); }
  function initSheetEl(s) {
    if (s.dataset.xInited) return;
    s.dataset.xInited = '1';
    const overlay = createOverlay();
    bindOverlay(s, overlay, 'x-sheet-backdrop');
  }
  function initDrawers() { $$('.x-drawer').forEach(initDrawerEl); }
  function initDrawerEl(d) {
    if (d.dataset.xInited) return;
    d.dataset.xInited = '1';
    const overlay = createOverlay();
    bindOverlay(d, overlay, 'x-drawer-backdrop');
  }

  function createOverlay() {
    const o = document.createElement('div');
    o.className = 'x-dialog-backdrop';
    o.dataset.state = 'closed';
    return o;
  }

  function bindOverlay(content, overlay, overlayClass) {
    overlay.className = overlayClass;
    overlay.dataset.state = 'closed';
    const id = content.id || `x-over-${Math.random().toString(36).slice(2, 8)}`;
    content.id = id;
    content.dataset.state = 'closed';
    const triggerSel = `[data-dialog-open="${id}"], [data-sheet-open="${id}"], [data-drawer-open="${id}"]`;
    const closeSel   = `[data-dialog-close], [data-sheet-close], [data-drawer-close], .x-dialog-close`;

    // remember where the dialog lived so we can put it back on close
    let homeParent = null, homeNext = null;

    const open = () => {
      if (content.dataset.state === 'open') return;
      clearTimeout(content._xTimer);
      content.dataset.state = 'open';
      overlay.dataset.state = 'open';
      if (homeParent === null && content.parentNode) {
        homeParent = content.parentNode;
        homeNext = content.nextSibling;
      }
      if (!overlay.isConnected) document.body.appendChild(overlay);
      if (!content.isConnected) document.body.appendChild(content);
      document.body.style.overflow = 'hidden';
      const focusable = $(focusableSel, content);
      if (focusable) focusable.focus();
      fire(content, 'overlay:open');
    };

    const close = () => {
      if (content.dataset.state === 'closed' || content.dataset.state === 'closing') return;
      content.dataset.state = 'closing';
      overlay.dataset.state = 'closing';
      document.body.style.overflow = '';
      clearTimeout(content._xTimer);
      // after fade-out, fully hide + detach overlay + move dialog back home
      content._xTimer = setTimeout(() => {
        content.dataset.state = 'closed';
        overlay.dataset.state = 'closed';
        overlay.remove();
        if (content.isConnected) {
          if (homeParent) {
            if (homeNext && homeNext.parentNode === homeParent) homeParent.insertBefore(content, homeNext);
            else homeParent.appendChild(content);
          } else {
            content.remove();
          }
        }
      }, 200);
      fire(content, 'overlay:close');
    };

    content.close = close;
    content.open = open;
    $$(triggerSel).forEach((t) => t.addEventListener('click', open));
    $$(closeSel, content).forEach((c) => c.addEventListener('click', close));
    // no-close variant: disable backdrop + ESC dismissal
    if (!content.classList.contains('no-close')) {
      overlay.addEventListener('click', close);
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && content.dataset.state === 'open') close();
      });
    }
    content.addEventListener('keydown', trapTab);
  }

  function trapTab(e) {
    if (e.key !== 'Tab') return;
    const f = $$(focusableSel, e.currentTarget);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
  }

  // =============================================================================
  // 7. Tooltip / Popover / HoverCard (shared hover/click trigger)
  // =============================================================================
  function initTooltips() { $$('.x-tooltip').forEach(initTooltipEl); }
  function initTooltipEl(t) {
    if (t.dataset.xInited) return;
    t.dataset.xInited = '1';
    const content = $('.x-tooltip-content', t);
    if (!content) return;
    content.dataset.state = 'closed';
    let timer;
    const show = () => { clearTimeout(timer); timer = setTimeout(() => { content.dataset.state = 'open'; }, t.dataset.delay || 200); };
    const hide = () => { clearTimeout(timer); content.dataset.state = 'closed'; };
    t.addEventListener('mouseenter', show);
    t.addEventListener('mouseleave', hide);
    t.addEventListener('focusin', show);
    t.addEventListener('focusout', hide);
  }

  function initPopovers() { $$('.x-popover').forEach(initPopoverEl); }
  function initPopoverEl(p) {
    if (p.dataset.xInited) return;
    p.dataset.xInited = '1';
    const trigger = $('.x-popover-trigger', p) || p.firstElementChild;
    const content = $('.x-popover-content', p);
    if (!trigger || !content) return;
    content.dataset.state = 'closed';
    const toggle = (e) => { e?.stopPropagation(); content.dataset.state = content.dataset.state === 'open' ? 'closed' : 'open'; };
    trigger.addEventListener('click', toggle);
    document.addEventListener('click', (e) => {
      if (content.dataset.state === 'open' && !p.contains(e.target)) content.dataset.state = 'closed';
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') content.dataset.state = 'closed'; });
  }

  function initHoverCards() { $$('.x-hovercard').forEach(initHoverCardEl); }
  function initHoverCardEl(h) {
    if (h.dataset.xInited) return;
    h.dataset.xInited = '1';
    const content = $('.x-hovercard-content', h);
    if (!content) return;
    content.dataset.state = 'closed';
    let openT, closeT;
    const open  = () => { clearTimeout(closeT); content.dataset.state = 'open'; };
    const close = () => { clearTimeout(openT); content.dataset.state = 'closed'; };
    h.addEventListener('mouseenter', () => { openT = setTimeout(open, parseInt(h.dataset.delay, 10) || 300); });
    h.addEventListener('mouseleave', () => { closeT = setTimeout(close, 200); });
  }

  // =============================================================================
  // 8. Menu / Dropdown
  // =============================================================================
  function initMenus() { $$('.x-menu').forEach(initMenuEl); }
  function initMenuEl(m) {
    if (m.dataset.xInited) return;
    m.dataset.xInited = '1';
    const trigger = $('.x-menu-trigger', m);
    const content = $('.x-menu-content', m);
    if (!trigger || !content) return;
    content.dataset.state = 'closed';
    const items = $$('.x-menu-item, .x-menu-checkbox-item, .x-menu-radio-item, [role="menuitem"]', content);
    let activeIdx = -1;

    const open = () => { content.dataset.state = 'open'; trigger.setAttribute('aria-expanded', 'true'); activeIdx = 0; items[0]?.focus(); fire(m, 'menu:open'); };
    const close = () => { content.dataset.state = 'closed'; trigger.setAttribute('aria-expanded', 'false'); activeIdx = -1; fire(m, 'menu:close'); };

    trigger.addEventListener('click', (e) => { e.stopPropagation(); content.dataset.state === 'open' ? close() : open(); });
    document.addEventListener('click', (e) => { if (content.dataset.state === 'open' && !m.contains(e.target)) close(); });
    document.addEventListener('keydown', (e) => {
      if (content.dataset.state !== 'open') return;
      if (e.key === 'Escape') { close(); trigger.focus(); }
      if (e.key === 'ArrowDown') { e.preventDefault(); activeIdx = (activeIdx + 1) % items.length; items[activeIdx].focus(); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); activeIdx = (activeIdx - 1 + items.length) % items.length; items[activeIdx].focus(); }
      if (e.key === 'Home')      { e.preventDefault(); activeIdx = 0; items[0].focus(); }
      if (e.key === 'End')       { e.preventDefault(); activeIdx = items.length - 1; items[items.length - 1].focus(); }
    });

    items.forEach((it) => {
      it.setAttribute('tabindex', '-1');
      it.addEventListener('click', (e) => {
        if (it.dataset.disabled === 'true') { e.preventDefault(); return; }
        fire(it, 'menu:select', { value: it.dataset.value || it.textContent.trim() });
        if (!it.classList.contains('x-menu-sub-trigger')) close();
      });
    });
  }

  // =============================================================================
  // 9. Context Menu
  // =============================================================================
  function initContextMenus() { $$('.x-contextmenu, [data-context-menu]').forEach(initContextMenuEl); }
  function initContextMenuEl(c) {
    if (c.dataset.xInited) return;
    c.dataset.xInited = '1';
    const menu = $('.x-context-menu', c) || c;
    const target = c.dataset.target ? $(c.dataset.target) : c;
    if (!menu || !target) return;
    menu.dataset.state = 'closed';
    menu.style.position = 'fixed';
    const open = (x, y) => { menu.style.left = x + 'px'; menu.style.top = y + 'px'; menu.dataset.state = 'open'; };
    const close = () => { menu.dataset.state = 'closed'; };
    target.addEventListener('contextmenu', (e) => { e.preventDefault(); open(e.clientX, e.clientY); });
    document.addEventListener('click', (e) => { if (menu.dataset.state === 'open' && !menu.contains(e.target)) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    document.addEventListener('scroll', close, true);
  }

  // =============================================================================
  // 10. Menubar
  // =============================================================================
  function initMenubars() { $$('.x-menubar').forEach(initMenubarEl); }
  function initMenubarEl(bar) {
    if (bar.dataset.xInited) return;
    bar.dataset.xInited = '1';
    const triggers = $$('.x-menu-trigger', bar);
    const contents = triggers.map((t) => t.nextElementSibling);
    const closeAll = () => { triggers.forEach((t) => t.setAttribute('aria-expanded', 'false')); contents.forEach((c) => c && (c.dataset.state = 'closed')); };
    triggers.forEach((t, i) => {
      t.setAttribute('aria-haspopup', 'true');
      t.setAttribute('aria-expanded', 'false');
      t.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = t.getAttribute('aria-expanded') === 'true';
        closeAll();
        if (!open) { t.setAttribute('aria-expanded', 'true'); if (contents[i]) contents[i].dataset.state = 'open'; }
      });
    });
    bar.addEventListener('keydown', (e) => {
      const idx = triggers.indexOf(document.activeElement);
      if (idx < 0) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); triggers[(idx + 1) % triggers.length].focus(); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); triggers[(idx - 1 + triggers.length) % triggers.length].focus(); }
      if (e.key === 'ArrowDown')  { e.preventDefault(); triggers[idx].click(); }
    });
    document.addEventListener('click', (e) => { if (!bar.contains(e.target)) closeAll(); });
  }

  // =============================================================================
  // 11. Navigation Menu (mega menu)
  // =============================================================================
  function initNavMenus() { $$('.x-navmenu').forEach(initNavMenuEl); }
  function initNavMenuEl(nm) {
    if (nm.dataset.xInited) return;
    nm.dataset.xInited = '1';
    const triggers = $$('.x-navmenu-trigger', nm);
    const contents = $$('.x-navmenu-content', nm);
    const closeAll = () => { triggers.forEach((t) => t.setAttribute('aria-expanded', 'false')); contents.forEach((c) => c.dataset.state = 'closed'); };
    triggers.forEach((t, i) => {
      t.setAttribute('aria-expanded', 'false');
      t.addEventListener('mouseenter', () => { closeAll(); t.setAttribute('aria-expanded', 'true'); if (contents[i]) contents[i].dataset.state = 'open'; });
      t.addEventListener('click', (e) => { e.stopPropagation(); const open = t.getAttribute('aria-expanded') === 'true'; closeAll(); if (!open) { t.setAttribute('aria-expanded', 'true'); if (contents[i]) contents[i].dataset.state = 'open'; } });
    });
    contents.forEach((c) => {
      c.addEventListener('mouseleave', () => { c.dataset.state = 'closed'; triggers[contents.indexOf(c)].setAttribute('aria-expanded', 'false'); });
    });
    document.addEventListener('click', (e) => { if (!nm.contains(e.target)) closeAll(); });
  }

  // =============================================================================
  // 12. Combobox
  // =============================================================================
  function initComboboxes() { $$('.x-combobox').forEach(initComboboxEl); }
  function initComboboxEl(cb) {
    if (cb.dataset.xInited) return;
    cb.dataset.xInited = '1';
    const input = $('input', cb);
    const list = $('.x-combobox-list', cb);
    if (!input || !list) return;
    const opts = $$('.opt', list);
    let activeIdx = -1;

    const close = () => { list.hidden = true; activeIdx = -1; };
    const open  = () => { list.hidden = false; };
    const highlight = (i) => {
      activeIdx = i;
      opts.forEach((o, j) => o.dataset.active = i === j ? 'true' : 'false');
      if (i >= 0) opts[i].scrollIntoView({ block: 'nearest' });
    };
    const filter = () => {
      const q = input.value.toLowerCase();
      let first = -1;
      opts.forEach((o, j) => {
        const match = o.textContent.toLowerCase().includes(q);
        o.hidden = !match;
        if (match && first < 0) first = j;
      });
      highlight(first);
    };

    input.addEventListener('focus', () => { filter(); open(); });
    input.addEventListener('input', filter);
    input.addEventListener('blur', () => setTimeout(close, 150));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); highlight(Math.min(activeIdx + 1, opts.length - 1)); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); highlight(Math.max(activeIdx - 1, 0)); }
      if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); opts[activeIdx].click(); }
      if (e.key === 'Escape')    { close(); }
    });
    opts.forEach((o) => {
      o.addEventListener('click', () => {
        input.value = o.dataset.value || o.textContent.trim();
        fire(cb, 'combobox:change', { value: input.value });
        close();
      });
    });
  }

  // =============================================================================
  // 13. Command (cmdk)
  // =============================================================================
  function initCommands() { $$('.x-command').forEach(initCommandEl); }
  function initCommandEl(cmd) {
    if (cmd.dataset.xInited) return;
    cmd.dataset.xInited = '1';
    const input = $('.x-command-input input', cmd);
    const items = $$('.x-command-item', cmd);
    const empty = $('.x-command-empty', cmd);
    let activeIdx = 0;

    const visible = () => items.filter((i) => !i.hidden);
    const highlight = (i) => {
      const v = visible();
      if (!v.length) return;
      activeIdx = ((i % v.length) + v.length) % v.length;
      items.forEach((it) => it.dataset.selected = 'false');
      v[activeIdx].dataset.selected = 'true';
      v[activeIdx].scrollIntoView({ block: 'nearest' });
    };
    const filter = () => {
      const q = input.value.toLowerCase();
      let firstMatch = 0;
      let count = 0;
      items.forEach((it, j) => {
        const txt = it.textContent.toLowerCase();
        const match = !q || txt.includes(q);
        it.hidden = !match;
        if (match) { if (count === 0) firstMatch = j; count++; }
      });
      if (empty) empty.hidden = count > 0;
      activeIdx = firstMatch;
      highlight(firstMatch);
    };

    input?.addEventListener('input', filter);
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); highlight(activeIdx + 1); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); highlight(activeIdx - 1); }
      if (e.key === 'Enter')     { e.preventDefault(); const v = visible(); v[activeIdx]?.click(); }
      if (e.key === 'Escape')    { input.value = ''; filter(); }
    });
    items.forEach((it) => {
      it.addEventListener('click', () => {
        fire(cmd, 'command:select', { value: it.dataset.value || it.textContent.trim() });
        it.dataset.selected = 'true';
        setTimeout(() => { it.dataset.selected = 'false'; }, 200);
      });
    });
    filter();
  }

  // =============================================================================
  // 14. Slider
  // =============================================================================
  function initSliders() { $$('.x-slider').forEach(initSliderEl); }
  function initSliderEl(s) {
    if (s.dataset.xInited) return;
    s.dataset.xInited = '1';
    const track = $('.x-slider-track', s);
    const range = $('.x-slider-range', s);
    const thumb = $('.x-slider-thumb', s);
    const input = $('input[type="range"]', s);
    if (!input) return;
    const min = parseFloat(input.min || '0');
    const max = parseFloat(input.max || '100');
    const step = parseFloat(input.step || '1');

    const update = (val) => {
      const pct = ((val - min) / (max - min)) * 100;
      if (range) range.style.width = pct + '%';
      if (thumb) thumb.style.left = `calc(${pct}% - ${pct * 0.5}px)`;
      thumb.style.left = pct + '%';
      thumb.style.transform = 'translateX(-50%)';
      input.value = val;
      fire(s, 'slider:change', { value: val });
    };

    const onPointer = (e) => {
      const rect = track.getBoundingClientRect();
      const x = (e.touches?.[0]?.clientX ?? e.clientX) - rect.left;
      const pct = Math.max(0, Math.min(1, x / rect.width));
      const val = min + Math.round((pct * (max - min)) / step) * step;
      update(val);
    };

    let dragging = false;
    const start = (e) => { dragging = true; onPointer(e); e.preventDefault(); };
    const move  = (e) => { if (dragging) onPointer(e); };
    const end   = () => { dragging = false; };
    track.addEventListener('pointerdown', start);
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', end);
    input.addEventListener('input', () => update(parseFloat(input.value)));
    input.addEventListener('keydown', (e) => {
      const v = parseFloat(input.value);
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp')   { e.preventDefault(); update(v + step); }
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowDown') { e.preventDefault(); update(v - step); }
    });
    update(parseFloat(input.value));
  }

  // =============================================================================
  // 15. Calendar
  // =============================================================================
  function initCalendars() { $$('.x-cal').forEach(initCalendarEl); }
  function initCalendarEl(cal) {
    if (cal.dataset.xInited) return;
    cal.dataset.xInited = '1';
    const titleEl = $('.x-cal-title', cal);
    const grid = $('.x-cal-grid', cal);
    let view = new Date();
    view.setDate(1);
    const selected = new Set();

    const render = () => {
      const y = view.getFullYear(), m = view.getMonth();
      const today = new Date();
      const firstDay = new Date(y, m, 1).getDay();
      const daysInMonth = new Date(y, m + 1, 0).getDate();
      const daysPrev = new Date(y, m, 0).getDate();
      const monthName = view.toLocaleString(undefined, { month: 'long', year: 'numeric' });
      titleEl.textContent = monthName;
      const dows = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
      let html = dows.map((d) => `<div class="x-cal-dow">${d}</div>`).join('');
      for (let i = firstDay - 1; i >= 0; i--) html += `<button class="x-cal-day muted" data-day="${daysPrev - i}" data-month="${m - 1}">${daysPrev - i}</button>`;
      for (let d = 1; d <= daysInMonth; d++) {
        const isToday = today.getFullYear() === y && today.getMonth() === m && today.getDate() === d;
        const isSelected = selected.has(`${y}-${m}-${d}`);
        html += `<button class="x-cal-day${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}" data-day="${d}" data-month="${m}">${d}</button>`;
      }
      const total = firstDay + daysInMonth;
      const trailing = (7 - (total % 7)) % 7;
      for (let d = 1; d <= trailing; d++) html += `<button class="x-cal-day muted" data-day="${d}" data-month="${m + 1}">${d}</button>`;
      grid.innerHTML = html;
      $$('.x-cal-day', grid).forEach((b) => {
        b.addEventListener('click', () => {
          const day = parseInt(b.dataset.day, 10);
          const month = parseInt(b.dataset.month, 10);
          const d = new Date(y, month, day);
          const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
          if (selected.has(key)) selected.delete(key); else selected.add(key);
          fire(cal, 'cal:select', { date: d, key });
          render();
        });
      });
    };

    $('.x-cal-prev', cal)?.addEventListener('click', () => { view.setMonth(view.getMonth() - 1); render(); });
    $('.x-cal-next', cal)?.addEventListener('click', () => { view.setMonth(view.getMonth() + 1); render(); });
    render();
  }

  // =============================================================================
  // 16. Date Picker
  // =============================================================================
  function initDatePickers() { $$('.x-datepicker').forEach(initDatePickerEl); }
  function initDatePickerEl(dp) {
    if (dp.dataset.xInited) return;
    dp.dataset.xInited = '1';
    const input = $('input', dp);
    const pop = $('.x-datepicker-popover', dp);
    if (!input || !pop) return;
    const cal = $('.x-cal', pop) || (() => { const c = document.createElement('div'); c.className = 'x-cal'; c.innerHTML = '<div class="x-cal-header"><div class="x-cal-title"></div><div class="x-cal-nav"><button class="x-cal-prev">‹</button><button class="x-cal-next">›</button></div></div><div class="x-cal-grid"></div>'; pop.appendChild(c); initCalendarEl(c); return c; })();
    pop.dataset.state = 'closed';
    const open = () => { pop.dataset.state = 'open'; };
    const close = () => { pop.dataset.state = 'closed'; };
    dp.addEventListener('click', (e) => { if (e.target.closest('.x-cal')) return; e.stopPropagation(); pop.dataset.state === 'open' ? close() : open(); });
    document.addEventListener('click', (e) => { if (!dp.contains(e.target)) close(); });
    cal.addEventListener('cal:select', (e) => {
      const d = e.detail.date;
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      input.value = `${yyyy}-${mm}-${dd}`;
      fire(dp, 'date:change', { value: input.value });
      close();
    });
  }

  // =============================================================================
  // 17. Carousel
  // =============================================================================
  function initCarousels() { $$('.x-carousel').forEach(initCarouselEl); }
  function initCarouselEl(c) {
    if (c.dataset.xInited) return;
    c.dataset.xInited = '1';
    const track = $('.x-carousel-track', c);
    const slides = $$('.x-carousel-slide', track);
    const prev = $('.x-carousel-prev', c);
    const next = $('.x-carousel-next', c);
    const dots = $$('.x-carousel-dot', c);
    let i = 0;
    const go = (n) => {
      i = ((n % slides.length) + slides.length) % slides.length;
      track.style.transform = `translateX(-${i * 100}%)`;
      dots.forEach((d, j) => d.dataset.active = j === i ? 'true' : 'false');
      fire(c, 'carousel:change', { index: i });
    };
    prev?.addEventListener('click', () => go(i - 1));
    next?.addEventListener('click', () => go(i + 1));
    dots.forEach((d, j) => d.addEventListener('click', () => go(j)));
    if (c.dataset.autoplay) {
      setInterval(() => go(i + 1), parseInt(c.dataset.autoplay, 10) || 5000);
    }
  }

  // =============================================================================
  // 18. Resizable
  // =============================================================================
  function initResizables() { $$('.x-resizable').forEach(initResizableEl); }
  function initResizableEl(r) {
    if (r.dataset.xInited) return;
    r.dataset.xInited = '1';
    const panels = $$('.x-resizable-panel', r);
    const handle = $('.x-resizable-handle', r);
    if (!handle || panels.length < 2) return;
    const isVertical = !r.classList.contains('vertical');
    const sizes = [50, 50];
    const apply = () => {
      panels[0].style.flex = `0 0 ${sizes[0]}%`;
      if (isVertical) panels[0].style.height = sizes[0] + '%';
      panels[1].style.flex = `1 1 ${sizes[1]}%`;
      if (isVertical) panels[1].style.height = sizes[1] + '%';
    };
    apply();
    let dragging = false;
    const onMove = (e) => {
      if (!dragging) return;
      const rect = r.getBoundingClientRect();
      const pos = isVertical ? (e.clientY - rect.top) / rect.height : (e.clientX - rect.left) / rect.width;
      const pct = Math.max(10, Math.min(90, pos * 100));
      sizes[0] = pct;
      sizes[1] = 100 - pct;
      apply();
    };
    const onUp = () => { dragging = false; handle.dataset.resizing = 'false'; };
    handle.addEventListener('pointerdown', (e) => { dragging = true; handle.dataset.resizing = 'true'; e.preventDefault(); });
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }

  // =============================================================================
  // 19. Toast (sonner-style queue manager)
  // =============================================================================
  const Toast = {
    get vp() {
      let v = $('#x-toast-viewport');
      if (!v) {
        v = document.createElement('div');
        v.id = 'x-toast-viewport';
        v.className = 'x-toast-viewport';
        document.body.appendChild(v);
      }
      return v;
    },
    show(opts = {}) {
      const t = document.createElement('div');
      t.className = `x-toast ${opts.variant || ''}`;
      t.dataset.state = 'open';
      t.innerHTML = `
        <div class="body">
          ${opts.title ? `<div class="title">${opts.title}</div>` : ''}
          ${opts.description ? `<div class="desc">${opts.description}</div>` : ''}
        </div>
        <button class="close" aria-label="Close">✕</button>
      `;
      this.vp.appendChild(t);
      const close = () => {
        t.dataset.state = 'closed';
        setTimeout(() => t.remove(), 200);
      };
      t.querySelector('.close').addEventListener('click', close);
      if (opts.duration !== Infinity) setTimeout(close, opts.duration || 4000);
      return { close };
    },
    success(title, opts = {})    { return this.show({ ...opts, title, variant: 'success' }); },
    error(title, opts = {})      { return this.show({ ...opts, title, variant: 'danger' }); },
    warning(title, opts = {})    { return this.show({ ...opts, title, variant: 'warn' }); },
    info(title, opts = {})       { return this.show({ ...opts, title, variant: 'info' }); },
  };
  window.DG = window.DG || {};
  window.DG.Toast = Toast;

})();
