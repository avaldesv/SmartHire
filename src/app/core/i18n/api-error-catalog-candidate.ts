import { ApiErrorI18nEntry } from './api-error-catalog';

/** Candidate application / selection error codes. */
export const API_ERROR_CATALOG_CANDIDATE: Record<string, ApiErrorI18nEntry> = {
  CANDIDATE_ALREADY_PRESELECTED: {
    title: $localize`:@@errors.CANDIDATE_ALREADY_PRESELECTED.title:Candidato ya preseleccionado`,
    // Keep {0}/{1} as literals — raw braces inside $localize are stripped by Angular i18n.
    message: $localize`:@@errors.CANDIDATE_ALREADY_PRESELECTED.message:El candidato ya está preseleccionado en ${'{0}'}:p0: (${'{1}'}:p1:).`,
  },
  CANDIDATE_BLOCKED_MANUAL: {
    title: $localize`:@@errors.CANDIDATE_BLOCKED_MANUAL.title:Candidato bloqueado`,
    message: $localize`:@@errors.CANDIDATE_BLOCKED_MANUAL.message:El candidato está bloqueado. Libéralo en el listado de Candidatos para poder preseleccionarlo.`,
  },
  CANDIDATE_ALREADY_IN_PROCESS: {
    title: $localize`:@@errors.CANDIDATE_ALREADY_IN_PROCESS.title:Candidato en proceso`,
    // {0} status, {1} position, {2} requisition number.
    message: $localize`:@@errors.CANDIDATE_ALREADY_IN_PROCESS.message:El candidato ya está en ${'{0}'}:p0: en ${'{1}'}:p1: (${'{2}'}:p2:).`,
  },
  CANDIDATE_HIRED_BLOCK_ACTIVE: {
    title: $localize`:@@errors.CANDIDATE_HIRED_BLOCK_ACTIVE.title:Candidato contratado bloqueado`,
    // {0} hire date, {1} block end, {2} status, {3} position, {4} requisition number.
    message: $localize`:@@errors.CANDIDATE_HIRED_BLOCK_ACTIVE.message:El candidato fue contratado el ${'{0}'}:p0: y permanece bloqueado hasta el ${'{1}'}:p1:. El candidato ya está en ${'{2}'}:p2: en ${'{3}'}:p3: (${'{4}'}:p4:).`,
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
  APPLICATION_INVALID_STATUS: {
    title: $localize`:@@errors.APPLICATION_INVALID_STATUS.title:Etapa no válida`,
    message: $localize`:@@errors.APPLICATION_INVALID_STATUS.message:La etapa indicada no es válida para la postulación.`,
  },
};
