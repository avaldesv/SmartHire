import {
  CANDIDATES_FORM_ACTIVE,
  CANDIDATES_FORM_COUNTRY,
  CANDIDATES_FORM_CURP,
  CANDIDATES_FORM_EMAIL,
  CANDIDATES_FORM_FIRST_NAME,
  CANDIDATES_FORM_LAST_NAME,
  CANDIDATES_FORM_NSS,
  CANDIDATES_FORM_PHONE,
  CANDIDATES_FORM_RFC,
  CANDIDATES_FORM_SALARY,
  CANDIDATES_FORM_SOURCE,
  CANDIDATES_FORM_STATE,
  CANDIDATES_LIST_COL_CITY,
  CANDIDATES_LIST_NO,
  CANDIDATES_LIST_YES,
  candidatesSourceLabel,
} from './candidates-labels';

export const CANDIDATE_BLOCK_COL_STATUS = $localize`:@@candidates.block.col.status:Estatus de bloqueo`;
export const CANDIDATE_BLOCK_BLOCKED = $localize`:@@candidates.block.blocked:Bloqueado`;
export const CANDIDATE_BLOCK_RELEASED = $localize`:@@candidates.block.released:Liberado`;
export const CANDIDATE_BLOCK_UPDATE_ERROR = $localize`:@@candidates.block.updateError:No se pudo actualizar el estatus de bloqueo`;

export const CANDIDATE_CHANGE_LOG_ACTION = $localize`:@@candidates.changeLog.action:Historial de modificaciones`;
export const CANDIDATE_CHANGE_LOG_TITLE = CANDIDATE_CHANGE_LOG_ACTION;
export const CANDIDATE_CHANGE_LOG_COL_DATE = $localize`:@@candidates.changeLog.col.date:Fecha y hora`;
export const CANDIDATE_CHANGE_LOG_COL_USER = $localize`:@@candidates.changeLog.col.user:Usuario`;
export const CANDIDATE_CHANGE_LOG_COL_FIELD = $localize`:@@candidates.changeLog.col.field:Campo`;
export const CANDIDATE_CHANGE_LOG_COL_OLD = $localize`:@@candidates.changeLog.col.oldValue:Valor anterior`;
export const CANDIDATE_CHANGE_LOG_COL_NEW = $localize`:@@candidates.changeLog.col.newValue:Valor nuevo`;
export const CANDIDATE_CHANGE_LOG_EMPTY = $localize`:@@candidates.changeLog.empty:Este candidato no tiene modificaciones registradas.`;
export const CANDIDATE_CHANGE_LOG_LOAD_ERROR = $localize`:@@candidates.changeLog.loadError:No se pudo cargar el historial de modificaciones`;
export const CANDIDATE_CHANGE_LOG_CLOSE = $localize`:@@common.close:Cerrar`;

const FIELD_PHONE_PREFIX = $localize`:@@candidates.changeLog.field.phonePrefix:Prefijo telefónico`;
const EMPTY_VALUE = '—';

/** Translated label for a change-log `fieldKey`; unknown keys are shown as received. */
export function candidateChangeLogFieldLabel(fieldKey: string | null | undefined): string {
  switch ((fieldKey ?? '').trim()) {
    case 'firstName':
      return CANDIDATES_FORM_FIRST_NAME;
    case 'lastName':
      return CANDIDATES_FORM_LAST_NAME;
    case 'email':
      return CANDIDATES_FORM_EMAIL;
    case 'phonePrefix':
      return FIELD_PHONE_PREFIX;
    case 'phone':
      return CANDIDATES_FORM_PHONE;
    case 'curp':
      return CANDIDATES_FORM_CURP;
    case 'rfc':
      return CANDIDATES_FORM_RFC;
    case 'nss':
      return CANDIDATES_FORM_NSS;
    case 'countryId':
      return CANDIDATES_FORM_COUNTRY;
    case 'stateId':
      return CANDIDATES_FORM_STATE;
    case 'city':
      return CANDIDATES_LIST_COL_CITY;
    case 'desiredSalary':
      return CANDIDATES_FORM_SALARY;
    case 'source':
      return CANDIDATES_FORM_SOURCE;
    case 'isActive':
      return CANDIDATES_FORM_ACTIVE;
    case 'blockOverride':
      return CANDIDATE_BLOCK_COL_STATUS;
    default:
      return fieldKey?.trim() || EMPTY_VALUE;
  }
}

/**
 * Translated value for a change-log row. Catalog fields (country/state) use the display
 * name returned by the API; enum-like fields are translated; the rest pass through.
 */
export function candidateChangeLogValueLabel(
  fieldKey: string | null | undefined,
  rawValue: string | null | undefined,
  displayValue?: string | null,
): string {
  const raw = rawValue?.trim() ?? '';
  const display = displayValue?.trim() ?? '';
  if (!raw && !display) {
    return EMPTY_VALUE;
  }
  switch ((fieldKey ?? '').trim()) {
    case 'countryId':
    case 'stateId':
      return display || raw;
    case 'source':
      return candidatesSourceLabel(raw) || EMPTY_VALUE;
    case 'isActive': {
      const normalized = raw.toLowerCase();
      if (normalized === 'true' || normalized === '1') {
        return CANDIDATES_LIST_YES;
      }
      if (normalized === 'false' || normalized === '0') {
        return CANDIDATES_LIST_NO;
      }
      return raw;
    }
    case 'blockOverride': {
      const normalized = raw.toUpperCase();
      if (normalized === 'FORCED_BLOCKED') {
        return CANDIDATE_BLOCK_BLOCKED;
      }
      if (normalized === 'FORCED_RELEASED') {
        return CANDIDATE_BLOCK_RELEASED;
      }
      return raw;
    }
    default:
      return display || raw;
  }
}
