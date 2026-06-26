import {
  ensureValidCatalogSelection,
  getCategoryById,
  resolveVisibleCategories,
} from './catalog-admin.registry';

describe('catalog-admin.registry', () => {
  describe('resolveVisibleCategories', () => {
    it('hides global-admin-only Empresas catalog for tenant users', () => {
      const empresas = resolveVisibleCategories(false).find((category) => category.id === 'empresas');
      expect(empresas?.catalogs.some((entry) => entry.id === 'company')).toBeFalse();
    });

    it('shows Empresas catalog under Empresas tab for global admin', () => {
      const empresas = resolveVisibleCategories(true).find((category) => category.id === 'empresas');
      expect(empresas?.catalogs.some((entry) => entry.id === 'company')).toBeTrue();
    });

    it('removes Empresas catalog from SmartHire/Ops tab', () => {
      for (const isGlobalAdmin of [false, true]) {
        const smarthireOps = resolveVisibleCategories(isGlobalAdmin).find((category) => category.id === 'smarthireOps');
        expect(smarthireOps?.catalogs.some((entry) => entry.id === 'company')).toBeFalse();
      }
    });

    it('moves Colonia to SmartHire/Ops and removes duplicate Tipo cubrimiento from Generales', () => {
      const generales = resolveVisibleCategories(true).find((category) => category.id === 'generales');
      const smarthireOps = resolveVisibleCategories(true).find((category) => category.id === 'smarthireOps');
      expect(generales?.catalogs.some((entry) => entry.id === 'neighborhood')).toBeFalse();
      expect(generales?.catalogs.some((entry) => entry.id === 'coverageType')).toBeFalse();
      expect(smarthireOps?.catalogs.some((entry) => entry.id === 'neighborhood')).toBeTrue();
    });
  });

  describe('ensureValidCatalogSelection', () => {
    it('falls back when tenant user had company selected in Empresas tab', () => {
      const resolved = ensureValidCatalogSelection('empresas', 'company', false);
      expect(resolved).toBe('companyArea');
    });

    it('keeps company selection for global admin in Empresas tab', () => {
      const resolved = ensureValidCatalogSelection('empresas', 'company', true);
      expect(resolved).toBe('company');
    });
  });

  it('keeps Empresas tab catalogs sorted by label', () => {
    const empresas = getCategoryById('empresas');
    const labels = empresas.catalogs.map((entry) => entry.label);
    expect(labels).toEqual([...labels].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' })));
  });
});
