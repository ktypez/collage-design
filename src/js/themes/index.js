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

export const THEMES = { rack, crt, noc, min, glitchpage };
export const THEME_IDS = Object.keys(THEMES);

/** Default theme = collage.sh (min) */
export const DEFAULT_THEME = 'min';
