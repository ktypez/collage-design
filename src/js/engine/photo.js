/* =============================================================================
   engine/photo.js — image loading from File objects
   -----------------------------------------------------------------------------
   Pure image pipeline: File → data URL → Image element.
   ============================================================================= */

/**
 * Load a File into an Image element (data URL).
 * Resolves with { src, img, name }.
 */
export function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve({ src: e.target.result, img, name: file.name });
      img.onerror = () => reject(new Error('decode failed'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('read failed'));
    reader.readAsDataURL(file);
  });
}

/** Create object URL (for preview thumbs) */
export function makeObjectUrl(file) {
  return URL.createObjectURL(file);
}

/** Revoke object URL */
export function revokeObjectUrl(url) {
  if (url && url.startsWith('blob:')) URL.revokeObjectURL(url);
}

export const MAX_PHOTOS = 20;
export const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB
