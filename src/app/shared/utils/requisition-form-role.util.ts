export function parseFormRoleIds(json?: string | null): number[] | null {
  if (!json?.trim()) {
    return null;
  }
  try {
    const parsed = JSON.parse(json) as unknown;
    if (!Array.isArray(parsed)) {
      return null;
    }
    return parsed.filter((value): value is number => typeof value === 'number' && value > 0);
  } catch {
    return null;
  }
}

export function serializeFormRoleIds(roleIds: number[] | null | undefined): string | null {
  if (roleIds == null || roleIds.length === 0) {
    return null;
  }
  const unique = [...new Set(roleIds.filter((id) => id > 0))];
  return unique.length > 0 ? JSON.stringify(unique) : null;
}
