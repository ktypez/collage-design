/* =============================================================================
   themes/index.js — theme registry
   -----------------------------------------------------------------------------
   Adding a new theme = create a folder + register here. Engine untouched.
   ============================================================================= */
import { manifest as rack } from './rack/manifest.js';
import { manifest as crt } from './crt/manifest.js';
import { manifest as noc } from './noc/manifest.js';
import { manifest as min } from './min/manifest.js';
import { manifest as glitchpage } from './glitchpage/manifest.js';
import { manifest as claude } from './claude/manifest.js';
import { manifest as moss } from './moss/manifest.js';
import { manifest as brut } from './brut/manifest.js';
import { manifest as mcky } from './mcky/manifest.js';

export const THEMES = { rack, crt, noc, min, glitchpage, claude, moss, brut, mcky };
export const THEME_IDS = Object.keys(THEMES);

/** Default theme = collage.sh (min) */
export const DEFAULT_THEME = 'min';
