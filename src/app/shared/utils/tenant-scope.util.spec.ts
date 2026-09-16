import { canEditScopedRecord, isGlobalScopedRecord } from './tenant-scope.util';

describe('tenant-scope.util', () => {
  describe('isGlobalScopedRecord', () => {
    it('returns true when companyId is null or undefined', () => {
      expect(isGlobalScopedRecord(null)).toBeTrue();
      expect(isGlobalScopedRecord(undefined)).toBeTrue();
    });

    it('returns false when companyId is set', () => {
      expect(isGlobalScopedRecord(1)).toBeFalse();
      expect(isGlobalScopedRecord(2)).toBeFalse();
    });
  });

  describe('canEditScopedRecord', () => {
    it('allows global admin to edit any record', () => {
      expect(canEditScopedRecord(null, true)).toBeTrue();
      expect(canEditScopedRecord(1, true)).toBeTrue();
    });

    it('allows tenant user only on tenant-scoped records', () => {
      expect(canEditScopedRecord(1, false)).toBeTrue();
      expect(canEditScopedRecord(null, false)).toBeFalse();
    });
  });
});
