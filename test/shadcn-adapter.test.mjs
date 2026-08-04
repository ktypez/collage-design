/* =============================================================================
   test/shadcn-adapter.test.mjs — unit tests for tools/shadcn-adapter.mjs
   ---------------------------------------------------------------------------
   Run: node --test test/shadcn-adapter.test.mjs
   ============================================================================= */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { toShadcnValue, formatBlock, generateShadcn } from '../tools/shadcn-adapter.mjs';

// =============================================================================
// toShadcnValue — color tokens → hex (exact), oklch, or hsl fallback
// =============================================================================
describe('toShadcnValue', () => {
  describe('color tokens', () => {
    it('returns exact hex for mcky --primary (from hex-source)', () => {
      assert.equal(toShadcnValue('--primary', '50 100% 71%', 'mcky', 'light', false), '#ffe066');
    });
    it('returns oklch for --primary when useOklch=true', () => {
      const v = toShadcnValue('--primary', '50 100% 71%', 'mcky', 'light', true);
      assert.ok(v.startsWith('oklch('), v);
      assert.ok(!v.includes('NaN'), v);
    });
    it('returns exact hex for --background', () => {
      assert.equal(toShadcnValue('--background', '60 17% 95%', 'mcky', 'light', false), '#f5f5f0');
    });
    it('returns exact hex for --accent (--accent fallback to --primary hex)', () => {
      assert.equal(toShadcnValue('--accent', '50 100% 71%', 'mcky', 'light', false), '#ffe066');
    });
    it('falls back to hsl() when no hex available', () => {
      const v = toShadcnValue('--popover', '0 0% 100%', 'mcky', 'light', false);
      assert.equal(v, 'hsl(0 0% 100%)');
    });
    it('handles alpha in hsl', () => {
      const v = toShadcnValue('--border', '60 7% 7% / 0.12', 'claude', 'light', false);
      assert.equal(v, 'hsl(60 7% 7% / 0.12)');
    });
  });

  describe('non-color tokens', () => {
    it('passes through radius value', () => {
      assert.equal(toShadcnValue('--radius', '0.375rem', 'mcky', 'light', false), '0.375rem');
    });
    it('passes through shadow value', () => {
      assert.equal(toShadcnValue('--shadow', '4px 4px 0 var(--border)', 'mcky', 'light', false), '4px 4px 0 var(--border)');
    });
    it('passes through font value', () => {
      assert.equal(toShadcnValue('--font-sans', "'JetBrains Mono', monospace", 'mcky', 'light', false), "'JetBrains Mono', monospace");
    });
    it('passes through border-width value', () => {
      assert.equal(toShadcnValue('--border-width', '3px', 'mcky', 'light', false), '3px');
    });
  });

  describe('edge cases', () => {
    it('unknown theme → hsl fallback', () => {
      const v = toShadcnValue('--background', '0 0% 50%', 'nonexistent', 'light', false);
      assert.equal(v, 'hsl(0 0% 50%)');
    });
    it('hsl(var(...)) reference → converted to var()', () => {
      const v = toShadcnValue('--shadow', '4px 4px 0 hsl(var(--border))', 'mcky', 'light', false);
      assert.ok(v.includes('var(--border)'));
      assert.ok(!v.includes('hsl(hsl'));
    });
  });
});

// =============================================================================
// generateShadcn — full theme output
// =============================================================================
describe('generateShadcn', () => {
  describe('format correctness', () => {
    it('returns a string with :root block', () => {
      const css = generateShadcn('mcky', false);
      assert.ok(css.includes(':root {'), 'has :root');
      assert.ok(css.includes('--background'), 'has --background');
      assert.ok(css.includes('}'), 'has closing brace');
    });
    it('has header comment', () => {
      const css = generateShadcn('mcky', false);
      assert.ok(css.includes('mcky.space'), 'header includes theme name');
      assert.ok(css.includes('hex (exact brand color)'), 'header shows hex mode');
    });
    it('oklch mode header shows oklch', () => {
      const css = generateShadcn('mcky', true);
      assert.ok(css.includes('oklch'), 'header shows oklch');
    });
  });

  describe('mode-specific blocks', () => {
    it('dual theme has both :root and .dark', () => {
      const css = generateShadcn('mcky', false);
      assert.ok(css.includes(':root {'), 'has :root');
      assert.ok(css.includes('.dark {'), 'has .dark');
    });
    it('dark-only theme has :root, .dark combined', () => {
      const css = generateShadcn('rack', false);
      assert.ok(css.includes(':root, .dark {'), 'has combined :root, .dark');
      assert.ok(!css.includes('.dark {\n') || css.split('.dark {').length <= 2, 'no separate .dark block');
    });
    it('light-only theme has :root, .dark combined + comment', () => {
      const css = generateShadcn('brut', false);
      assert.ok(css.includes(':root, .dark {'), 'has combined :root, .dark');
      assert.ok(css.includes('light-only'), 'has light-only comment');
    });
    it('dual theme .dark has different values from :root', () => {
      const css = generateShadcn('mcky', false);
      // extract background from :root and .dark
      const rootBg = css.match(/:root \{\n[^}]*--background\s*:\s*(\S+);/)?.[1];
      const darkBg = css.match(/\.dark \{\n[^}]*--background\s*:\s*(\S+);/)?.[1];
      assert.ok(rootBg, 'root has --background');
      assert.ok(darkBg, '.dark has --background');
      assert.notEqual(rootBg, darkBg, 'different values');
    });
  });

  describe('color format', () => {
    // helper: extract a CSS var value from a block (handles spaces inside oklch/hsl)
    const extractVal = (css, blockRe, varName) => {
      const block = css.match(new RegExp(`${blockRe}\\s*\\{([\\s\\S]*?)\\n\\}`))?.[1] || '';
      const m = block.match(new RegExp(`${varName}\\s*:\\s*([^;]+);`));
      return m?.[1]?.trim();
    };

    it('hex mode: color tokens are hex', () => {
      const css = generateShadcn('mcky', false);
      const bg = extractVal(css, ':root', '--background');
      assert.ok(bg?.startsWith('#'), `--background should be hex: ${bg}`);
    });
    it('oklch mode: color tokens are oklch', () => {
      const css = generateShadcn('mcky', true);
      const bg = extractVal(css, ':root', '--background');
      assert.ok(bg?.startsWith('oklch('), `--background should be oklch: ${bg}`);
    });
    it('non-color tokens stay as-is in both modes', () => {
      const cssHex = generateShadcn('mcky', false);
      const cssOklch = generateShadcn('mcky', true);
      const hexRadius = extractVal(cssHex, ':root', '--radius');
      const oklchRadius = extractVal(cssOklch, ':root', '--radius');
      assert.equal(hexRadius, oklchRadius, 'radius same in both modes');
    });
  });

  describe('all 9 themes', () => {
    const themes = ['mcky', 'rack', 'crt', 'noc', 'min', 'glitchpage', 'claude', 'moss', 'brut'];
    for (const id of themes) {
      it(`${id} produces valid CSS`, () => {
        const css = generateShadcn(id, false);
        assert.ok(css.includes(':root'), `${id}: has :root`);
        assert.ok(css.includes('--background'), `${id}: has --background`);
        assert.ok(css.includes('--primary'), `${id}: has --primary`);
        assert.ok(!css.includes('undefined'), `${id}: no undefined values`);
      });
      it(`${id} oklch produces no NaN`, () => {
        const css = generateShadcn(id, true);
        assert.ok(!css.includes('NaN'), `${id}: oklch NaN found`);
      });
    }
  });

  describe('known values', () => {
    const extractVal = (css, blockRe, varName) => {
      const block = css.match(new RegExp(`${blockRe}\\s*\\{([\\s\\S]*?)\\n\\}`))?.[1] || '';
      const m = block.match(new RegExp(`${varName}\\s*:\\s*([^;]+);`));
      return m?.[1]?.trim();
    };
    it('mcky light primary = #ffe066', () => {
      const css = generateShadcn('mcky', false);
      assert.equal(extractVal(css, ':root', '--primary'), '#ffe066');
    });
    it('mcky dark background = #0a0a0a', () => {
      const css = generateShadcn('mcky', false);
      assert.equal(extractVal(css, '.dark', '--background'), '#0a0a0a');
    });
    it('rack background (dark-only) = #0a0a0c', () => {
      const css = generateShadcn('rack', false);
      assert.equal(extractVal(css, ':root, \\.dark', '--background'), '#0a0a0c');
    });
    it('mcky oklch primary is valid oklch', () => {
      const css = generateShadcn('mcky', true);
      const val = extractVal(css, ':root', '--primary');
      assert.ok(val?.startsWith('oklch('), `has oklch primary: ${val}`);
      assert.ok(!val.includes('NaN'), `no NaN: ${val}`);
    });
  });
});

// =============================================================================
// accent fallback logic
// =============================================================================
describe('accent fallback', () => {
  it('mcky --accent hex comes from --primary hex (not hsl)', () => {
    const v = toShadcnValue('--accent', 'unused', 'mcky', 'light', false);
    assert.equal(v, '#ffe066', 'should use --primary hex');
  });
  it('non-existing theme --accent falls back to hsl', () => {
    const v = toShadcnValue('--accent', '240 50% 50%', 'nonexistent', 'light', false);
    assert.equal(v, 'hsl(240 50% 50%)');
  });
});
