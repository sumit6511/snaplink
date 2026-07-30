export function getShortUrl(link: { shortCode: string; customAlias?: string }): string {
  const base = import.meta.env.VITE_BACKEND_URL ?? window.location.origin;
  return `${base}/${link.customAlias || link.shortCode}`;
}

/** Strips the protocol for compact display (e.g. "snaplink.io/abc123"). */
export function getShortUrlDisplay(link: { shortCode: string; customAlias?: string }): string {
  return getShortUrl(link).replace(/^https?:\/\//, '');
}
