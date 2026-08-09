/** i18n labels for position applications dialog. */

export const APP_DIALOG_TITLE = $localize`:@@applicationsDialog.title:Candidatos postulados`;
export const APP_DIALOG_POSITION_PREFIX = $localize`:@@applicationsDialog.positionPrefix:Posición`;
export const APP_DIALOG_EMPTY = $localize`:@@applicationsDialog.empty:No hay candidatos postulados a esta posición.`;
export const APP_DIALOG_CLOSE = $localize`:@@common.close:Cerrar`;
export const APP_DIALOG_COL_CANDIDATE = $localize`:@@applicationsDialog.col.candidate:Candidato`;
export const APP_DIALOG_COL_EMAIL = $localize`:@@applicationsDialog.col.email:Email`;
export const APP_DIALOG_COL_STATUS = $localize`:@@applicationsDialog.col.status:Estado`;
export const APP_DIALOG_COL_SOURCE = $localize`:@@applicationsDialog.col.source:Origen`;
export const APP_DIALOG_COL_COMPAT = $localize`:@@applicationsDialog.col.compatibility:Compat.`;
export const APP_DIALOG_COL_CREATED = $localize`:@@applicationsDialog.col.createdAt:Postulación`;
export const APP_DIALOG_COL_ACTIONS = $localize`:@@applicationsDialog.col.actions:Acciones`;
export const APP_DIALOG_ACTIONS_MENU = $localize`:@@applicationsDialog.actions.menu:Acciones del candidato`;
export const APP_DIALOG_ACTION_VIEW_PROFILE = $localize`:@@applicationsDialog.actions.viewProfile:Ver perfil completo`;
export const APP_DIALOG_ACTION_VIEW_DOCUMENTS = $localize`:@@applicationsDialog.actions.viewDocuments:Ver documentos`;
export const APP_DIALOG_ERRORS_LIST = $localize`:@@applicationsDialog.errors.list:No se pudieron cargar las postulaciones`;

export function applicationsDialogCandidateFallback(id: number): string {
  return $localize`:@@applicationsDialog.candidateFallback:Candidato #${id}:id:`;
}

export const APP_DIALOG_EM_DASH = $localize`:@@common.emDash:—`;
