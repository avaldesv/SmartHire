import { ApiErrorI18nEntry } from './api-error-catalog';

/** Candidate application / selection error codes. */
export const API_ERROR_CATALOG_CANDIDATE: Record<string, ApiErrorI18nEntry> = {
  CANDIDATE_ALREADY_PRESELECTED: {
    title: $localize`:@@errors.CANDIDATE_ALREADY_PRESELECTED.title:Candidato ya preseleccionado`,
    message: $localize`:@@errors.CANDIDATE_ALREADY_PRESELECTED.message:El candidato ya está preseleccionado en {0} ({1}).`,
  },
  DOCUMENT_VALIDATION_STATUS_REQUIRED: {
    title: $localize`:@@errors.DOCUMENT_VALIDATION_STATUS_REQUIRED.title:Validación requerida`,
    message: $localize`:@@errors.DOCUMENT_VALIDATION_STATUS_REQUIRED.message:Debe indicar si el documento está validado o no.`,
  },
  DOCUMENT_REJECTION_REASON_REQUIRED: {
    title: $localize`:@@errors.DOCUMENT_REJECTION_REASON_REQUIRED.title:Motivo requerido`,
    message: $localize`:@@errors.DOCUMENT_REJECTION_REASON_REQUIRED.message:Debe indicar el motivo al marcar el documento como no validado.`,
  },
  DOCUMENT_NOT_FOUND_FOR_APPLICATION: {
    title: $localize`:@@errors.DOCUMENT_NOT_FOUND_FOR_APPLICATION.title:Documento no encontrado`,
    message: $localize`:@@errors.DOCUMENT_NOT_FOUND_FOR_APPLICATION.message:El documento no pertenece a esta postulación.`,
  },
};
