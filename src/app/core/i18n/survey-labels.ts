/** i18n labels for WhatsApp surveys (Encuestas) admin and send actions. */

export const SURVEYS_PAGE_TITLE = $localize`:@@surveys.pageTitle:Encuestas WhatsApp`;
export const SURVEYS_NEW_BUTTON = $localize`:@@surveys.newButton:Nueva encuesta`;
export const SURVEYS_SEARCH = $localize`:@@surveys.search:Buscar encuesta`;
export const SURVEYS_EMPTY = $localize`:@@surveys.empty:No hay encuestas registradas`;
export const SURVEYS_COL_NAME = $localize`:@@surveys.col.name:Nombre`;
export const SURVEYS_COL_DESCRIPTION = $localize`:@@surveys.col.description:Descripción`;
export const SURVEYS_COL_QUESTIONS = $localize`:@@surveys.col.questions:Preguntas`;
export const SURVEYS_COL_ACTIVE = $localize`:@@surveys.col.active:Activa`;

export const SURVEYS_DIALOG_NEW = $localize`:@@surveys.dialog.new:Nueva encuesta`;
export const SURVEYS_DIALOG_EDIT = $localize`:@@surveys.dialog.edit:Editar encuesta`;
export const SURVEYS_FIELD_NAME = $localize`:@@surveys.field.name:Nombre`;
export const SURVEYS_FIELD_DESCRIPTION = $localize`:@@surveys.field.description:Texto de descripción`;
export const SURVEYS_FIELD_ACTIVE = $localize`:@@surveys.field.active:Activa`;
export const SURVEYS_FIELD_QUESTIONS = $localize`:@@surveys.field.questions:Preguntas`;
export const SURVEYS_ADD_QUESTION = $localize`:@@surveys.questions.add:Agregar pregunta`;
export const SURVEYS_REMOVE_QUESTION = $localize`:@@surveys.questions.remove:Quitar`;
export const SURVEYS_QUESTION_TEXT = $localize`:@@surveys.questions.text:Texto de la pregunta`;
export const SURVEYS_QUESTION_TYPE = $localize`:@@surveys.questions.answerType:Tipo de respuesta`;
export const SURVEYS_QUESTION_REQUIRED = $localize`:@@surveys.questions.required:Obligatoria`;
export const SURVEYS_QUESTION_ORDER = $localize`:@@surveys.questions.sortOrder:Orden`;
export const SURVEYS_QUESTIONS_EMPTY = $localize`:@@surveys.questions.empty:Agregue al menos una pregunta`;

export const SURVEYS_ANSWER_TYPE_TEXT = $localize`:@@surveys.answerType.text:Texto`;
export const SURVEYS_ANSWER_TYPE_NUMBER = $localize`:@@surveys.answerType.number:Número`;
export const SURVEYS_ANSWER_TYPE_DATE = $localize`:@@surveys.answerType.date:Fecha`;
export const SURVEYS_ANSWER_TYPE_IMAGE = $localize`:@@surveys.answerType.image:Imagen`;
export const SURVEYS_ANSWER_TYPE_FILE = $localize`:@@surveys.answerType.file:Archivo`;

export const SURVEYS_SAVE = $localize`:@@surveys.save:Guardar`;
export const SURVEYS_SAVING = $localize`:@@surveys.saving:Guardando…`;
export const SURVEYS_CANCEL = $localize`:@@surveys.cancel:Cancelar`;

export const SURVEYS_SUCCESS_SAVED = $localize`:@@surveys.success.saved:Encuesta guardada`;
export const SURVEYS_SUCCESS_DELETED = $localize`:@@surveys.success.deleted:Encuesta eliminada`;
export const SURVEYS_ERRORS_LIST = $localize`:@@surveys.errors.list:No se pudieron cargar las encuestas`;
export const SURVEYS_ERRORS_LOAD = $localize`:@@surveys.errors.load:No se pudo cargar la encuesta`;
export const SURVEYS_ERRORS_SAVE = $localize`:@@surveys.errors.save:No se pudo guardar la encuesta`;
export const SURVEYS_ERRORS_DELETE = $localize`:@@surveys.errors.delete:No se pudo eliminar la encuesta`;
export const SURVEYS_ERRORS_SEND = $localize`:@@surveys.errors.send:No se pudo enviar la encuesta por WhatsApp`;

export function surveysDeleteConfirm(name: string): string {
  return $localize`:@@surveys.deleteConfirm:¿Eliminar la encuesta "${name}:name:"?`;
}

export const SURVEYS_SEND_ACTION = $localize`:@@surveys.send.action:Enviar encuesta WhatsApp`;
export const SURVEYS_SEND_CONFIRM = $localize`:@@surveys.send.confirm:¿Enviar la encuesta WhatsApp a los candidatos seleccionados?`;
export const SURVEYS_SEND_SUCCESS = $localize`:@@surveys.send.success:Encuesta WhatsApp enviada`;
export const SURVEYS_SEND_PARTIAL = $localize`:@@surveys.send.partial:Algunas encuestas no se enviaron`;
export const SURVEYS_SEND_NONE_ELIGIBLE = $localize`:@@surveys.send.noneEligible:Ningún candidato seleccionado está en PRESELECTED o un estado posterior`;
export const SURVEYS_SEND_SENT = $localize`:@@surveys.send.sent:enviados`;
export const SURVEYS_SEND_FAILED = $localize`:@@surveys.send.failed:fallaron`;

export function surveysSendPhoneBusy(surveyName: string): string {
  return $localize`:@@surveys.send.phoneBusy:Teléfono ocupado con la encuesta "${surveyName}:name:"`;
}

export const SURVEYS_RESULTS_TITLE = $localize`:@@surveys.results.title:Resultados de encuestas`;
export const SURVEYS_RESULTS_EMPTY = $localize`:@@surveys.results.empty:No hay sesiones de encuesta`;
export const SURVEYS_RESULTS_ERRORS_LIST = $localize`:@@surveys.results.errors.list:No se pudieron cargar los resultados`;
export const SURVEYS_RESULTS_ERRORS_DETAIL = $localize`:@@surveys.results.errors.detail:No se pudo cargar el detalle de la sesión`;
export const SURVEYS_RESULTS_FILTER_PHONE = $localize`:@@surveys.results.filter.phone:Teléfono`;
export const SURVEYS_RESULTS_FILTER_COMPLETED = $localize`:@@surveys.results.filter.completed:Completada`;
export const SURVEYS_RESULTS_FILTER_ALL = $localize`:@@surveys.results.filter.all:Todas`;
export const SURVEYS_RESULTS_FILTER_YES = $localize`:@@surveys.results.filter.yes:Sí`;
export const SURVEYS_RESULTS_FILTER_NO = $localize`:@@surveys.results.filter.no:No`;

export const SURVEYS_RESULTS_COL_CANDIDATE = $localize`:@@surveys.results.col.candidate:Candidato`;
export const SURVEYS_RESULTS_COL_SURVEY = $localize`:@@surveys.results.col.survey:Encuesta`;
export const SURVEYS_RESULTS_COL_POSITION = $localize`:@@surveys.results.col.position:Posición`;
export const SURVEYS_RESULTS_COL_PHONE = $localize`:@@surveys.results.col.phone:Teléfono`;
export const SURVEYS_RESULTS_COL_PROGRESS = $localize`:@@surveys.results.col.progress:Progreso`;
export const SURVEYS_RESULTS_COL_COMPLETED = $localize`:@@surveys.results.col.completed:Completada`;
export const SURVEYS_RESULTS_COL_DATE = $localize`:@@surveys.results.col.date:Fecha`;

export const SURVEYS_RESULTS_DETAIL_TITLE = $localize`:@@surveys.results.detail.title:Detalle de encuesta`;
export const SURVEYS_RESULTS_DETAIL_CLOSE = $localize`:@@surveys.results.detail.close:Cerrar`;
export const SURVEYS_RESULTS_DETAIL_QUESTION = $localize`:@@surveys.results.detail.question:Pregunta`;
export const SURVEYS_RESULTS_DETAIL_ANSWER = $localize`:@@surveys.results.detail.answer:Respuesta`;
export const SURVEYS_RESULTS_DETAIL_TYPE = $localize`:@@surveys.results.detail.type:Tipo`;
export const SURVEYS_RESULTS_DETAIL_NO_ANSWERS = $localize`:@@surveys.results.detail.noAnswers:Sin respuestas registradas`;
export const SURVEYS_RESULTS_VIEW_ARIA = $localize`:@@surveys.results.viewAria:Ver detalle de la sesión`;

export const SURVEYS_KPI_TOTAL = $localize`:@@surveys.kpi.total:Total encuestas`;
export const SURVEYS_KPI_ACTIVE = $localize`:@@surveys.kpi.active:Activas`;
export const SURVEYS_KPI_AVG_QUESTIONS = $localize`:@@surveys.kpi.avgQuestions:Preguntas promedio`;
export const SURVEYS_PREVIEW_TITLE = $localize`:@@surveys.preview.title:Vista previa`;
export const SURVEYS_PREVIEW_EMPTY = $localize`:@@surveys.preview.empty:Seleccione una encuesta para ver sus preguntas`;
export const SURVEYS_PREVIEW_NO_QUESTIONS = $localize`:@@surveys.preview.noQuestions:Esta encuesta no tiene preguntas`;
export const SURVEYS_COL_STATUS = $localize`:@@surveys.col.status:Estado`;
export const SURVEYS_STATUS_ACTIVE = $localize`:@@surveys.status.active:Activa`;
export const SURVEYS_STATUS_INACTIVE = $localize`:@@surveys.status.inactive:Inactiva`;

export const SURVEYS_RESULTS_VIEW_SESSIONS = $localize`:@@surveys.results.view.sessions:Sesiones`;
export const SURVEYS_RESULTS_VIEW_BY_SURVEY = $localize`:@@surveys.results.view.bySurvey:Por encuesta`;
export const SURVEYS_RESULTS_KPI_SENT = $localize`:@@surveys.results.kpi.sent:Envíos`;
export const SURVEYS_RESULTS_KPI_COMPLETED = $localize`:@@surveys.results.kpi.completed:Completadas`;
export const SURVEYS_RESULTS_KPI_IN_PROGRESS = $localize`:@@surveys.results.kpi.inProgress:En curso`;
export const SURVEYS_RESULTS_KPI_RATE = $localize`:@@surveys.results.kpi.rate:Tasa de respuesta`;
export const SURVEYS_RESULTS_COL_SENT = $localize`:@@surveys.results.col.sent:Enviados`;
export const SURVEYS_RESULTS_COL_IN_PROGRESS = $localize`:@@surveys.results.col.inProgress:En curso`;
export const SURVEYS_RESULTS_COL_RATE = $localize`:@@surveys.results.col.rate:% respuesta`;
export const SURVEYS_RESULTS_COL_LAST_SENT = $localize`:@@surveys.results.col.lastSent:Último envío`;
export const SURVEYS_RESULTS_BY_SURVEY_EMPTY = $localize`:@@surveys.results.bySurvey.empty:No hay envíos de encuestas`;
export const SURVEYS_RESULTS_BY_SURVEY_ERRORS = $localize`:@@surveys.results.bySurvey.errors:No se pudo cargar el resumen por encuesta`;
export const SURVEYS_RESULTS_BACK = $localize`:@@surveys.results.back:Volver al resumen`;
export const SURVEYS_RESULTS_DRILL_TITLE = $localize`:@@surveys.results.drill.title:Candidatos de la encuesta`;
