import { ApiErrorI18nEntry } from './api-error-catalog';

/** Candidate application / selection error codes. */
export const API_ERROR_CATALOG_CANDIDATE: Record<string, ApiErrorI18nEntry> = {
  CANDIDATE_ALREADY_PRESELECTED: {
    title: $localize`:@@errors.CANDIDATE_ALREADY_PRESELECTED.title:Candidato ya preseleccionado`,
    message: $localize`:@@errors.CANDIDATE_ALREADY_PRESELECTED.message:El candidato ya está preseleccionado en {0} ({1}).`,
  },
};
