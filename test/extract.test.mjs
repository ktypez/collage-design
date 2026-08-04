/* =============================================================================
   test/extract.test.mjs — unit tests for conversion functions in tools/extract.mjs
   ---------------------------------------------------------------------------
   Run: node --test test/extract.test.mjs
   No deps — uses Node built-in test runner + assert.
   ============================================================================= */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  sanitizeValue, normalizeHex, extractHexValues,
  hexToRgb, rgbToHsl, hexToHslSpace,
  srgbToLinear, rgbToOklch, hexToOklchStr,
  relativeLuminance,
} from '../tools/extract.mjs';

// =============================================================================
// sanitizeValue — takes first `;` or `}` delimited token, strips junk
// =============================================================================
describe('sanitizeValue', () => {
  it('strips trailing } and ;', () => {
    assert.equal(sanitizeValue('  6px}@font{'), '6px');
    assert.equal(sanitizeValue('0.5rem}'), '0.5rem');
    assert.equal(sanitizeValue('#ff0000;'), '#ff0000');
  });
  it('preserves normal values', () => {
    assert.equal(sanitizeValue('#000000'), '#000000');
    assert.equal(sanitizeValue('#fff'), '#fff');
    assert.equal(sanitizeValue('rgb(255, 0, 0)'), 'rgb(255, 0, 0)');
  });
  it('handles CSS function values', () => {
    assert.equal(sanitizeValue('hsl(50 100% 71%)'), 'hsl(50 100% 71%)');
  });
  it('trims whitespace', () => {
    assert.equal(sanitizeValue('  #abc  '), '#abc');
  });
  it('returns empty for empty input', () => {
    assert.equal(sanitizeValue(''), '');
    assert.equal(sanitizeValue('   '), '');
  });
  it('strips CSS block junk', () => {
    assert.equal(sanitizeValue('6px}@font{font-family:JetBrains Mono}'), '6px');
    assert.equal(sanitizeValue('#000; background:blue'), '#000');
  });
});

// =============================================================================
// normalizeHex
// =============================================================================
describe('normalizeHex', () => {
  it('converts 3-digit to 6-digit lowercase', () => {
    assert.equal(normalizeHex('#fff'), '#ffffff');
    assert.equal(normalizeHex('#ABC'), '#aabbcc');
    assert.equal(normalizeHex('#f00'), '#ff0000');
    assert.equal(normalizeHex('#000'), '#000000');
  });
  it('preserves 6-digit lowercase', () => {
    assert.equal(normalizeHex('#ff00aa'), '#ff00aa');
    assert.equal(normalizeHex('#FF00AA'), '#ff00aa');
  });
  it('strips 4-digit alpha', () => {
    assert.equal(normalizeHex('#ff0000aa'), '#ff0000');
  });
  it('handles real hex values', () => {
    assert.equal(normalizeHex('#0a0a0c'), '#0a0a0c');
    assert.equal(normalizeHex('#f5f5f0'), '#f5f5f0');
    assert.equal(normalizeHex('#ffe066'), '#ffe066');
  });
});

// =============================================================================
// extractHexValues
// =============================================================================
describe('extractHexValues', () => {
  it('extracts 6-digit hex colors', () => {
    assert.deepEqual(extractHexValues('color: #ff0000; background: #00ff00;'), ['#ff0000', '#00ff00']);
  });
  it('normalizes 3-digit hex', () => {
    const hexes = extractHexValues('#fff #000');
    assert.ok(hexes.includes('#ffffff'));
    assert.ok(hexes.includes('#000000'));
  });
  it('extracts rgb colors', () => {
    assert.deepEqual(extractHexValues('rgba(255,0,0,0.5) rgb(0,255,0)'), ['#ff0000', '#00ff00']);
  });
  it('returns empty for no colors', () => {
    assert.deepEqual(extractHexValues('no colors here'), []);
  });
});

// =============================================================================
// hexToRgb
// =============================================================================
describe('hexToRgb', () => {
  it('pure red', () => assert.deepEqual(hexToRgb('#ff0000'), [255, 0, 0]));
  it('pure green', () => assert.deepEqual(hexToRgb('#00ff00'), [0, 255, 0]));
  it('pure blue', () => assert.deepEqual(hexToRgb('#0000ff'), [0, 0, 255]));
  it('black', () => assert.deepEqual(hexToRgb('#000000'), [0, 0, 0]));
  it('white', () => assert.deepEqual(hexToRgb('#ffffff'), [255, 255, 255]));
  it('mcky accent', () => assert.deepEqual(hexToRgb('#ffe066'), [255, 224, 102]));
  it('rack bg', () => assert.deepEqual(hexToRgb('#0a0a0c'), [10, 10, 12]));
});

// =============================================================================
// rgbToHsl
// =============================================================================
describe('rgbToHsl', () => {
  it('pure red', () => assert.deepEqual(rgbToHsl(255, 0, 0), [0, 100, 50]));
  it('pure white', () => assert.deepEqual(rgbToHsl(255, 255, 255), [0, 0, 100]));
  it('pure black', () => assert.deepEqual(rgbToHsl(0, 0, 0), [0, 0, 0]));
  it('mid gray', () => assert.deepEqual(rgbToHsl(128, 128, 128), [0, 0, 50]));
  it('mcky accent #ffe066', () => assert.deepEqual(rgbToHsl(255, 224, 102), [48, 100, 70]));
  it('rack bg #0a0a0c', () => assert.deepEqual(rgbToHsl(10, 10, 12), [240, 9, 4]));
  it('mcky bg #f5f5f0', () => assert.deepEqual(rgbToHsl(245, 245, 240), [60, 20, 95]));
});

// =============================================================================
// hexToHslSpace
// =============================================================================
describe('hexToHslSpace', () => {
  it('mcky accent', () => assert.equal(hexToHslSpace('#ffe066'), '48 100% 70%'));
  it('rack bg', () => assert.equal(hexToHslSpace('#0a0a0c'), '240 9% 4%'));
  it('black', () => assert.equal(hexToHslSpace('#000000'), '0 0% 0%'));
  it('white', () => assert.equal(hexToHslSpace('#ffffff'), '0 0% 100%'));
  it('3-digit hex', () => assert.equal(hexToHslSpace('#fff'), '0 0% 100%'));
  it('mcky bg', () => assert.equal(hexToHslSpace('#f5f5f0'), '60 20% 95%'));
});

// =============================================================================
// srgbToLinear
// =============================================================================
describe('srgbToLinear', () => {
  it('0 → 0', () => assert.equal(srgbToLinear(0), 0));
  it('255 → ~1', () => assert.ok(Math.abs(srgbToLinear(255) - 1) < 0.001));
  it('128 → ~0.216', () => assert.ok(Math.abs(srgbToLinear(128) - 0.216) < 0.01));
  it('is monotonically increasing', () => {
    for (let i = 0; i <= 255; i += 17) {
      assert.ok(srgbToLinear(i) <= srgbToLinear(i + 1));
    }
  });
});

// =============================================================================
// rgbToOklch
// =============================================================================
describe('rgbToOklch', () => {
  it('black has L=0', () => {
    const { L } = rgbToOklch(0, 0, 0);
    assert.ok(Math.abs(L) < 0.001);
  });
  it('white has L=1', () => {
    const { L } = rgbToOklch(255, 255, 255);
    assert.ok(Math.abs(L - 1) < 0.01);
  });
  it('gray has C≈0', () => {
    const { C } = rgbToOklch(128, 128, 128);
    assert.ok(C < 0.01);
  });
  it('all outputs are finite for any RGB combo', () => {
    for (const r of [0, 64, 128, 192, 255])
      for (const g of [0, 64, 128, 192, 255])
        for (const b of [0, 64, 128, 192, 255]) {
          const { L, C, h } = rgbToOklch(r, g, b);
          assert.ok(Number.isFinite(L) && Number.isFinite(C) && Number.isFinite(h), `${r},${g},${b}`);
        }
  });
  it('mcky accent #ffe066', () => {
    const { L, C, h } = rgbToOklch(255, 224, 102);
    assert.ok(Math.abs(L - 0.885) < 0.01);
    assert.ok(Math.abs(C - 0.116) < 0.01);
    assert.ok(Math.abs(h - 112.3) < 2);
  });
  it('pure red oklch hue ~80.2', () => {
    const { h } = rgbToOklch(255, 0, 0);
    assert.ok(Math.abs(h - 80.2) < 1);
  });
});

// =============================================================================
// hexToOklchStr
// =============================================================================
describe('hexToOklchStr', () => {
  it('returns oklch() string format', () => {
    assert.ok(hexToOklchStr('#ff0000').startsWith('oklch('));
  });
  it('no NaN for standard colors', () => {
    const tests = ['#f5f5f0', '#0a0a0c', '#ffe066', '#ff3d8f', '#06d6a0', '#000', '#fff', '#888', '#ABC', '#f00'];
    for (const h of tests) {
      const result = hexToOklchStr(h);
      assert.ok(!result.includes('NaN'), `${h}: ${result}`);
    }
  });
  it('black → oklch(0.000 ...)', () => {
    assert.ok(hexToOklchStr('#000000').includes('0.000 0.000'));
  });
  it('white → oklch(~0.999 ...)', () => {
    const r = hexToOklchStr('#ffffff');
    assert.ok(r.includes('oklch(') && !r.includes('NaN'), `white: ${r}`);
  });
});

// =============================================================================
// relativeLuminance
// =============================================================================
describe('relativeLuminance', () => {
  it('black → 0', () => assert.equal(relativeLuminance('#000000'), 0));
  it('white → 1', () => assert.equal(relativeLuminance('#ffffff'), 1));
  it('pure red ≈ 0.2126', () => assert.ok(Math.abs(relativeLuminance('#ff0000') - 0.2126) < 0.001));
  it('pure green ≈ 0.7152', () => assert.ok(Math.abs(relativeLuminance('#00ff00') - 0.7152) < 0.001));
  it('returns [0,1] range', () => {
    for (const h of ['#000000', '#888888', '#ffffff', '#ffe066', '#0a0a0c']) {
      const l = relativeLuminance(h);
      assert.ok(l >= 0 && l <= 1, `${h}: ${l}`);
    }
  });
});
