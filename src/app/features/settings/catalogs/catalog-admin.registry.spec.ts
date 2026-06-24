import {
  ensureValidCatalogSelection,
  getCategoryById,
  resolveVisibleCategories,
} from './catalog-admin.registry';

describe('catalog-admin.registry', () => {
  describe('resolveVisibleCategories', () => {
    it('hides global-admin-only Empresas catalog for tenant users', () => {
      const smarthireOps = resolveVisibleCategories(false).find((category) => category.id === 'smarthireOps');
      expect(smarthireOps?.catalogs.some((entry) => entry.id === 'company')).toBeFalse();
    });

    it('shows Empresas catalog under SmartHire/Ops for global admin', () => {
      const smarthireOps = resolveVisibleCategories(true).find((category) => category.id === 'smarthireOps');
      expect(smarthireOps?.catalogs.some((entry) => entry.id === 'company')).toBeTrue();
    });

    it('removes Empresas catalog from Empresas tab for all users', () => {
      for (const isGlobalAdmin of [false, true]) {
        const empresas = resolveVisibleCategories(isGlobalAdmin).find((category) => category.id === 'empresas');
        expect(empresas?.catalogs.some((entry) => entry.id === 'company')).toBeFalse();
      }
    });
  });

  describe('ensureValidCatalogSelection', () => {
    it('falls back when tenant user had company selected in Empresas tab', () => {
      const resolved = ensureValidCatalogSelection('empresas', 'company', false);
      expect(resolved).toBe('clientCompany');
    });

    it('keeps company selection for global admin in SmartHire/Ops', () => {
      const resolved = ensureValidCatalogSelection('smarthireOps', 'company', true);
      expect(resolved).toBe('company');
    });
  });

  it('keeps Empresas tab catalogs sorted by label', () => {
    const empresas = getCategoryById('empresas');
    const labels = empresas.catalogs.map((entry) => entry.label);
    expect(labels).toEqual([...labels].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' })));
  });
});
