// Revoking the object URL right after click() can cancel the download before the
// browser has read the blob (seen in Safari and Firefox, and intermittently in
// Chromium), so the URL is released only once the download has had time to start.
export const DOWNLOAD_URL_REVOKE_DELAY_MS = 30_000;

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), DOWNLOAD_URL_REVOKE_DELAY_MS);
}
