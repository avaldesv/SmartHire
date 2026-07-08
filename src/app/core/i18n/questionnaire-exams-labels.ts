export const QEXAM_NEW_BUTTON = $localize`:@@questionnaires.exams.newButton:Nuevo examen`;
export const QEXAM_EMPTY = $localize`:@@questionnaires.exams.empty:No hay exámenes registrados`;
export const QEXAM_FILTER_NAME = $localize`:@@questionnaires.exams.filter.name:Buscar por nombre`;
export const QEXAM_FILTER_QUESTIONNAIRE = $localize`:@@questionnaires.exams.filter.questionnaire:Cuestionario`;
export const QEXAM_FILTER_STATUS = $localize`:@@questionnaires.exams.filter.status:Estado`;
export const QEXAM_FILTER_ALL = $localize`:@@questionnaires.exams.filter.all:Todos`;
export const QEXAM_FILTER_APPLY = $localize`:@@questionnaires.exams.filter.apply:Buscar`;
export const QEXAM_FILTER_CLEAR = $localize`:@@questionnaires.exams.filter.clear:Limpiar`;

export const QEXAM_COL_NAME = $localize`:@@questionnaires.exams.col.name:Nombre`;
export const QEXAM_COL_QUESTIONNAIRE = $localize`:@@questionnaires.exams.col.questionnaire:Cuestionario`;
export const QEXAM_COL_STATUS = $localize`:@@questionnaires.exams.col.status:Estado`;
export const QEXAM_COL_QUESTIONS = $localize`:@@questionnaires.exams.col.questions:Nº preguntas`;
export const QEXAM_COL_ATTEMPTS = $localize`:@@questionnaires.exams.col.attempts:Intentos máx.`;
export const QEXAM_ATTEMPTS_UNLIMITED = $localize`:@@questionnaires.exams.attemptsUnlimited:Ilimitado`;

export const QEXAM_STATUS_DRAFT = $localize`:@@questionnaires.exams.status.draft:Borrador`;
export const QEXAM_STATUS_PUBLISHED = $localize`:@@questionnaires.exams.status.published:Publicado`;
export const QEXAM_STATUS_ARCHIVED = $localize`:@@questionnaires.exams.status.archived:Archivado`;

export const QEXAM_DIALOG_NEW = $localize`:@@questionnaires.exams.dialog.newTitle:Nuevo examen`;
export const QEXAM_DIALOG_EDIT = $localize`:@@questionnaires.exams.dialog.editTitle:Editar examen`;
export const QEXAM_FIELD_QUESTIONNAIRE = $localize`:@@questionnaires.exams.field.questionnaire:Cuestionario publicado`;
export const QEXAM_FIELD_NAME = $localize`:@@questionnaires.exams.field.name:Nombre`;
export const QEXAM_FIELD_DESCRIPTION = $localize`:@@questionnaires.exams.field.description:Descripción`;
export const QEXAM_FIELD_NUMBER_OF_QUESTIONS = $localize`:@@questionnaires.exams.field.numberOfQuestions:Número de preguntas`;
export const QEXAM_FIELD_DEFAULT_WEIGHT = $localize`:@@questionnaires.exams.field.defaultWeight:Peso por defecto`;
export const QEXAM_FIELD_TIME_LIMIT = $localize`:@@questionnaires.exams.field.timeLimitSeconds:Tiempo límite por pregunta (seg)`;
export const QEXAM_FIELD_TOTAL_TIME = $localize`:@@questionnaires.exams.field.totalTimeMinutes:Tiempo total (min)`;
export const QEXAM_FIELD_ACCEPTANCE = $localize`:@@questionnaires.exams.field.acceptancePercent:Umbral aprobación (%)`;
export const QEXAM_FIELD_MAX_ATTEMPTS = $localize`:@@questionnaires.exams.field.maxAttempts:Intentos máximos`;
export const QEXAM_FIELD_MAX_ATTEMPTS_HINT = $localize`:@@questionnaires.exams.field.maxAttemptsHint:Vacío = ilimitado. Mínimo 1 si se indica.`;
export const QEXAM_FIELD_RETRY_DELAY = $localize`:@@questionnaires.exams.field.retryDelayDays:Días entre reintentos`;
export const QEXAM_FIELD_START_DATE = $localize`:@@questionnaires.exams.field.startDate:Inicio ventana`;
export const QEXAM_FIELD_END_DATE = $localize`:@@questionnaires.exams.field.endDate:Fin ventana`;
export const QEXAM_FIELD_GENERATION_CONFIG = $localize`:@@questionnaires.exams.field.generationConfig:Config. generación (JSON)`;
export const QEXAM_FIELD_RANDOM_SEED = $localize`:@@questionnaires.exams.field.randomSeed:Semilla aleatoria`;
export const QEXAM_FIELD_STATUS = $localize`:@@questionnaires.exams.field.status:Estado`;
export const QEXAM_QUESTIONS_AVAILABLE = $localize`:@@questionnaires.exams.questionsAvailable:Preguntas disponibles en cuestionario:`;
export const QEXAM_NO_PUBLISHED_QUESTIONNAIRES = $localize`:@@questionnaires.exams.noPublishedQuestionnaires:No hay cuestionarios publicados disponibles`;

export const QEXAM_ERRORS_LIST = $localize`:@@questionnaires.exams.errors.list:No se pudieron cargar los exámenes`;
export const QEXAM_ERRORS_LOAD = $localize`:@@questionnaires.exams.errors.load:No se pudo cargar el examen`;
export const QEXAM_ERRORS_SAVE = $localize`:@@questionnaires.exams.errors.save:No se pudo guardar el examen`;
export const QEXAM_ERRORS_DELETE = $localize`:@@questionnaires.exams.errors.delete:No se pudo eliminar el examen`;
export const QEXAM_ERRORS_MAX_ATTEMPTS = $localize`:@@questionnaires.exams.errors.maxAttempts:Los intentos máximos deben ser al menos 1 o dejarse vacío`;
export const QEXAM_SUCCESS_SAVED = $localize`:@@questionnaires.exams.success.saved:Examen guardado`;
export const QEXAM_SUCCESS_DELETED = $localize`:@@questionnaires.exams.success.deleted:Examen eliminado`;

export function qexamDeleteConfirm(name: string): string {
  return $localize`:@@questionnaires.exams.deleteConfirm:¿Eliminar el examen "${name}:name:"? Esta acción no se puede deshacer.`;
}

export function qexamStatusLabel(status: string): string {
  switch (status) {
    case 'published':
      return QEXAM_STATUS_PUBLISHED;
    case 'archived':
      return QEXAM_STATUS_ARCHIVED;
    default:
      return QEXAM_STATUS_DRAFT;
  }
}

export const QEXAM_COL_SCOPE = $localize`:@@questionnaires.common.col.scope:Ámbito`;
export const QEXAM_FIELD_ACTIVE = $localize`:@@catalogs.field.active:Activo`;
export const QEXAM_SAVING = $localize`:@@catalogs.common.saving:Guardando...`;
export const QEXAM_SAVE = $localize`:@@catalogs.common.save:Guardar`;
export const QEXAM_CANCEL = $localize`:@@common.cancel:Cancelar`;
export const QEXAM_CLOSE = $localize`:@@common.close:Cerrar`;
export const QEXAM_SNACK_CLOSE = QEXAM_CLOSE;
