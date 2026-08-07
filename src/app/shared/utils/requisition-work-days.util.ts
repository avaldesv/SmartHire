import { WizardFieldOption } from '../models/requisition-wizard.model';

/** Stable weekday ids (Mon=1 … Sun=7) for workDays multiselect. */
export const WEEKDAY_OPTIONS: WizardFieldOption[] = [
  { id: 1, label: 'Lunes' },
  { id: 2, label: 'Martes' },
  { id: 3, label: 'Miércoles' },
  { id: 4, label: 'Jueves' },
  { id: 5, label: 'Viernes' },
  { id: 6, label: 'Sábado' },
  { id: 7, label: 'Domingo' },
];

const WEEKDAY_LABEL_BY_ID = new Map(WEEKDAY_OPTIONS.map((option) => [option.id, option.label]));
const WEEKDAY_ID_BY_LABEL = new Map(
  WEEKDAY_OPTIONS.map((option) => [option.label.toLowerCase(), option.id]),
);

/** Legacy shorthand Mon–Fri. */
const LEGACY_WEEKDAY_IDS = [1, 2, 3, 4, 5];

export function serializeWorkDaysFromIds(ids: number[] | null | undefined): string | null {
  if (ids == null || ids.length === 0) {
    return null;
  }
  const unique = [...new Set(ids.filter((id) => id > 0))].sort((a, b) => a - b);
  const labels = unique
    .map((id) => WEEKDAY_LABEL_BY_ID.get(id))
    .filter((label): label is string => !!label);
  return labels.length > 0 ? labels.join(', ') : null;
}

export function parseWorkDaysToIds(value: string | null | undefined): number[] {
  if (!value?.trim()) {
    return [];
  }
  const normalized = value.trim();
  if (normalized.toUpperCase() === 'L-V') {
    return [...LEGACY_WEEKDAY_IDS];
  }
  return normalized
    .split(',')
    .map((part) => part.trim())
    .map((label) => WEEKDAY_ID_BY_LABEL.get(label.toLowerCase()))
    .filter((id): id is number => id != null);
}
