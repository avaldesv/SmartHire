/** Shared empty-cell formatting for report screens (null / undefined → ""). */
export function formatReportCell(value: number | null | undefined, defined = true): string {
  if (!defined || value == null || Number.isNaN(value)) {
    return '';
  }
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function formatReportPercent(value: number | null | undefined, defined = true): string {
  if (!defined || value == null || Number.isNaN(value)) {
    return '';
  }
  return `${value.toFixed(1)}%`;
}
