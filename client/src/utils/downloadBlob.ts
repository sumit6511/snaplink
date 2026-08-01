// The access token lives in memory and is attached by an axios interceptor,
// not a cookie the browser sends automatically — so a plain `<a href>` to
// the API can't authenticate. Callers fetch the file via axios first and
// hand the resulting Blob here to trigger the actual save-as.
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
