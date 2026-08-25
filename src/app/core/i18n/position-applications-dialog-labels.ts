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
export const APP_DIALOG_COL_CONTACT = $localize`:@@applicationsDialog.col.contact:Contactar`;
export const APP_DIALOG_COL_EVALUATION = $localize`:@@applicationsDialog.col.evaluation:Evaluación`;
export const APP_DIALOG_COL_APPOINTMENT = $localize`:@@applicationsDialog.col.appointment:Cita`;
export const APP_DIALOG_ACTIONS_MENU = $localize`:@@applicationsDialog.actions.menu:Acciones del candidato`;
export const APP_DIALOG_ACTION_VIEW_PROFILE = $localize`:@@applicationsDialog.actions.viewProfile:Ver perfil completo`;
export const APP_DIALOG_ACTION_VIEW_DOCUMENTS = $localize`:@@applicationsDialog.actions.viewDocuments:Ver documentos`;
export const APP_DIALOG_ACTION_PRESELECT = $localize`:@@applicationsDialog.actions.preselect:Preseleccionar`;
export const APP_DIALOG_CONTACT_TOOLTIP = $localize`:@@applicationsDialog.contact.tooltip:Enviar cuestionario de contacto`;
export const APP_DIALOG_CONTACT_SUCCESS = $localize`:@@applicationsDialog.contact.success:Cuestionario de contacto enviado`;
export const APP_DIALOG_CONTACT_ERROR = $localize`:@@applicationsDialog.contact.error:No se pudo enviar el cuestionario de contacto`;
export const APP_DIALOG_EVALUATION_TOOLTIP = $localize`:@@applicationsDialog.evaluation.tooltip:Evaluación del cuestionario`;
export const APP_DIALOG_EVALUATION_PENDING_TITLE = $localize`:@@applicationsDialog.evaluation.pendingTitle:Evaluación pendiente`;
export const APP_DIALOG_EVALUATION_PENDING_MSG = $localize`:@@applicationsDialog.evaluation.pendingMessage:Disponible cuando el candidato responda`;
export const APP_DIALOG_APPOINTMENT_TOOLTIP = $localize`:@@applicationsDialog.appointment.tooltip:Agendar entrevista`;
export const APP_DIALOG_APPOINTMENT_SCHEDULED_TOOLTIP = $localize`:@@applicationsDialog.appointment.scheduledTooltip:Entrevista agendada — reprogramar`;
export const APP_DIALOG_PRESELECT_SUCCESS = $localize`:@@applicationsDialog.preselect.success:Candidato preseleccionado`;
export const APP_DIALOG_ERRORS_PRESELECT = $localize`:@@applicationsDialog.errors.preselect:No se pudo preseleccionar al candidato`;
export const APP_DIALOG_ERRORS_LIST = $localize`:@@applicationsDialog.errors.list:No se pudieron cargar las postulaciones`;

export function applicationsDialogCandidateFallback(id: number): string {
  return $localize`:@@applicationsDialog.candidateFallback:Candidato #${id}:id:`;
}

export const APP_DIALOG_EM_DASH = $localize`:@@common.emDash:—`;
