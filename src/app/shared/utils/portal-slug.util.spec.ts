import {
  DEFAULT_PORTAL_ACCENT_COLOR,
  DEFAULT_PORTAL_PRIMARY_COLOR,
  isValidPortalHexColor,
  isValidPortalSlug,
  slugifyCompanyName,
} from './portal-slug.util';

describe('slugifyCompanyName', () => {
  it('strips accents and uses kebab-case', () => {
    expect(slugifyCompanyName('Manpower Group México')).toBe('manpower-group-mexico');
    expect(slugifyCompanyName('  Ñandú  ')).toBe('nandu');
  });

  it('returns empty when no alphanumeric remains', () => {
    expect(slugifyCompanyName('@@@')).toBe('');
    expect(slugifyCompanyName('   ')).toBe('');
  });
});

describe('portal branding validators', () => {
  it('accepts kebab-case slugs and #RRGGBB colors', () => {
    expect(isValidPortalSlug('acme-mx')).toBe(true);
    expect(isValidPortalSlug('Acme')).toBe(false);
    expect(isValidPortalHexColor(DEFAULT_PORTAL_PRIMARY_COLOR)).toBe(true);
    expect(isValidPortalHexColor(DEFAULT_PORTAL_ACCENT_COLOR)).toBe(true);
    expect(isValidPortalHexColor('#FFF')).toBe(false);
  });
});
