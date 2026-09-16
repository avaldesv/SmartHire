export const PORTAL_SLUG_MAX_LENGTH = 64;
export const PORTAL_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const PORTAL_HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;
export const DEFAULT_PORTAL_PRIMARY_COLOR = '#003366';
export const DEFAULT_PORTAL_ACCENT_COLOR = '#FF6600';

/** Builds a unique-friendly kebab-case slug from a company name (accents stripped). */
export function slugifyCompanyName(name: string, maxLength = PORTAL_SLUG_MAX_LENGTH): string {
  const decomposed = (name ?? '').trim().normalize('NFD').replace(/\p{M}+/gu, '');
  const collapsed = decomposed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
  if (!collapsed) {
    return '';
  }
  return collapsed.slice(0, maxLength).replace(/-+$/, '');
}

export function isValidPortalSlug(slug: string | null | undefined): boolean {
  return !!slug && slug.length <= PORTAL_SLUG_MAX_LENGTH && PORTAL_SLUG_PATTERN.test(slug);
}

export function isValidPortalHexColor(color: string | null | undefined): boolean {
  return !!color && PORTAL_HEX_COLOR_PATTERN.test(color);
}

export function colorPickerValue(hex: string | null | undefined, fallback: string): string {
  return isValidPortalHexColor(hex) ? hex! : fallback;
}
