import { PortalLanguage } from '../../shared/models/portal-language.model';
import { resolvePortalLanguage } from './resolve-portal-language';

const LANGUAGES: PortalLanguage[] = [
  { id: 1, code: 'ES_MX', locale: 'es-MX', name: 'Español (México)', sortOrder: 1 },
  { id: 2, code: 'ES_ES', locale: 'es-ES', name: 'Español (España)', sortOrder: 2 },
  { id: 3, code: 'EN_US', locale: 'en-US', name: 'English (US)', sortOrder: 3 },
  { id: 4, code: 'PT_BR', locale: 'pt-BR', name: 'Português (Brasil)', sortOrder: 4 },
];

describe('resolvePortalLanguage', () => {
  it('uses the authenticated profile language id', () => {
    expect(resolvePortalLanguage(LANGUAGES, { portalLanguageId: 3, locale: 'es-MX' })?.code).toBe(
      'EN_US',
    );
  });

  it('matches locale when the profile id is absent or not in the catalog', () => {
    expect(resolvePortalLanguage(LANGUAGES, { locale: 'pt-BR' })?.name).toBe('Português (Brasil)');
    expect(resolvePortalLanguage(LANGUAGES, { portalLanguageId: 99, locale: 'es-ES' })?.code).toBe(
      'ES_ES',
    );
  });

  it('falls back to ES_MX when the profile language is not in the catalog', () => {
    expect(resolvePortalLanguage(LANGUAGES, { portalLanguageId: 99, locale: 'fr-FR' })?.code).toBe(
      'ES_MX',
    );
  });

  it('returns null when the catalog is empty or has no ES_MX fallback', () => {
    expect(resolvePortalLanguage([], { locale: 'es-MX' })).toBeNull();
    expect(
      resolvePortalLanguage(
        [{ id: 4, code: 'PT_BR', locale: 'pt-BR', name: 'Português (Brasil)', sortOrder: 4 }],
        { locale: 'fr-FR' },
      ),
    ).toBeNull();
  });
});
