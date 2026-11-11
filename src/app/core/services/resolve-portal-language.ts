import { PortalLanguage } from '../../shared/models/portal-language.model';

/** Seeded default in config_portal_language when the profile language is missing. */
export const FALLBACK_PORTAL_LANGUAGE_CODE = 'ES_MX';

export interface PortalLanguageProfile {
  portalLanguageId?: number | null;
  locale?: string | null;
}

/**
 * Picks the selector value for Generar / Traducir.
 * Profile id wins, then locale, then ES_MX. Returns null when the catalog has no match.
 */
export function resolvePortalLanguage(
  languages: readonly PortalLanguage[],
  profile: PortalLanguageProfile,
): PortalLanguage | null {
  if (!languages.length) {
    return null;
  }
  const id = profile.portalLanguageId;
  if (id != null) {
    const byId = languages.find((language) => language.id === id);
    if (byId) {
      return byId;
    }
  }
  const locale = (profile.locale ?? '').trim().toLowerCase();
  if (locale) {
    const byLocale = languages.find((language) => language.locale.trim().toLowerCase() === locale);
    if (byLocale) {
      return byLocale;
    }
  }
  return (
    languages.find((language) => language.code === FALLBACK_PORTAL_LANGUAGE_CODE) ??
    languages.find((language) => language.locale.trim().toLowerCase() === 'es-mx') ??
    null
  );
}
