/* =============================================================================
   engine/export.js — PNG download + clipboard
   ============================================================================= */

/** Download canvas as PNG with auto-timestamped filename */
export function downloadPNG(canvas, prefix = 'collage') {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error('export failed'));
      const url = URL.createObjectURL(blob);
      const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${prefix}-${ts}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      resolve(blob);
    }, 'image/png', 0.95);
  });
}

/** Copy canvas to clipboard (best effort) */
export async function copyToClipboard(canvas) {
  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('export failed'))), 'image/png');
  });
  if (!navigator.clipboard || !window.ClipboardItem) {
    throw new Error('clipboard not supported');
  }
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
}
