export function isGlobalScopedRecord(companyId?: number | null): boolean {
  return companyId == null;
}

export function canEditScopedRecord(companyId: number | null | undefined, isGlobalAdmin: boolean): boolean {
  if (isGlobalAdmin) {
    return true;
  }
  return companyId != null;
}
