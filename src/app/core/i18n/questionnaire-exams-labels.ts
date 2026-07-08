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
export const QEXAM_TAB_GENERAL = $localize`:@@questionnaires.exams.tab.general:Datos generales`;
export const QEXAM_TAB_QUESTION_SELECTION = $localize`:@@questionnaires.exams.tab.questionSelection:Selección de preguntas`;
export const QEXAM_TAB_DESCRIPTION = $localize`:@@questionnaires.exams.tab.description:Descripción`;
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
export const QEXAM_MAX_ATTEMPTS_HINT_TITLE = $localize`:@@questionnaires.exams.maxAttempts.hintTitle:¿Qué son los intentos máximos?`;
export const QEXAM_MAX_ATTEMPTS_HINT_BODY = $localize`:@@questionnaires.exams.maxAttempts.hintBody:Indica cuántas veces puede presentar el examen cada candidato. Si lo deja vacío, los intentos son ilimitados. Si indica un número, debe ser al menos 1.`;
export const QEXAM_MAX_ATTEMPTS_HINT_EXAMPLE_TITLE = $localize`:@@questionnaires.exams.maxAttempts.exampleTitle:Ejemplos`;
export const QEXAM_MAX_ATTEMPTS_EXAMPLE_EMPTY = $localize`:@@questionnaires.exams.maxAttempts.exampleEmpty:Vacío — intentos ilimitados`;
export const QEXAM_MAX_ATTEMPTS_EXAMPLE_ONE = $localize`:@@questionnaires.exams.maxAttempts.exampleOne:1 — una sola oportunidad por candidato`;
export const QEXAM_MAX_ATTEMPTS_EXAMPLE_THREE = $localize`:@@questionnaires.exams.maxAttempts.exampleThree:3 — hasta tres presentaciones`;
export const QEXAM_FIELD_HELP_LINK = $localize`:@@questionnaires.exams.field.helpLink:Ayuda`;
export const QEXAM_FIELD_RETRY_DELAY = $localize`:@@questionnaires.exams.field.retryDelayDays:Días entre reintentos`;
export const QEXAM_FIELD_START_DATE = $localize`:@@questionnaires.exams.field.startDate:Inicio ventana`;
export const QEXAM_FIELD_END_DATE = $localize`:@@questionnaires.exams.field.endDate:Fin ventana`;
export const QEXAM_FIELD_GENERATION_CONFIG = $localize`:@@questionnaires.exams.field.generationConfig:Reglas de selección de preguntas`;
export const QEXAM_FIELD_RANDOM_SEED = $localize`:@@questionnaires.exams.field.randomSeed:Semilla aleatoria`;

export const QEXAM_RANDOM_SEED_HINT_TITLE = $localize`:@@questionnaires.exams.randomSeed.hintTitle:¿Qué es la semilla aleatoria?`;
export const QEXAM_RANDOM_SEED_HELP_LINK = QEXAM_FIELD_HELP_LINK;
export const QEXAM_RANDOM_SEED_HINT_BODY = $localize`:@@questionnaires.exams.randomSeed.hintBody:Opcional. Si la deja vacía, cada intento puede obtener un subconjunto distinto de preguntas. Si indica un número (ej. 42), la selección será reproducible para pruebas o auditoría.`;
export const QEXAM_RANDOM_SEED_HINT_EXAMPLE_TITLE = $localize`:@@questionnaires.exams.randomSeed.exampleTitle:Ejemplos`;
export const QEXAM_RANDOM_SEED_EXAMPLE_EMPTY = $localize`:@@questionnaires.exams.randomSeed.exampleEmpty:Vacío — selección variable entre intentos`;
export const QEXAM_RANDOM_SEED_EXAMPLE_FIXED = $localize`:@@questionnaires.exams.randomSeed.exampleFixed:42 — misma selección de preguntas al repetir el examen`;

export const QEXAM_GEN_INTRO = $localize`:@@questionnaires.exams.generation.intro:Defina cómo se eligen las preguntas del cuestionario al iniciar un intento. Si no aplica filtros, se usarán todas las preguntas vinculadas.`;
export const QEXAM_GEN_QUESTION_TYPES = $localize`:@@questionnaires.exams.generation.questionTypes:Tipos de pregunta permitidos`;
export const QEXAM_GEN_QUESTION_TYPES_HINT = $localize`:@@questionnaires.exams.generation.questionTypesHint:Sin marcar ninguno = todos los tipos del cuestionario.`;
export const QEXAM_GEN_DIFFICULTY_FILTER = $localize`:@@questionnaires.exams.generation.difficultyFilter:Filtrar por dificultad`;
export const QEXAM_GEN_DIFFICULTY_MIN = $localize`:@@questionnaires.exams.generation.difficultyMin:Dificultad mínima (1-5)`;
export const QEXAM_GEN_DIFFICULTY_MAX = $localize`:@@questionnaires.exams.generation.difficultyMax:Dificultad máxima (1-5)`;
export const QEXAM_GEN_SELECT_CATEGORIES = $localize`:@@questionnaires.exams.generation.categories:Categorías de conocimiento (opcional)`;
export const QEXAM_GEN_SELECT_TAGS = $localize`:@@questionnaires.exams.generation.tags:Etiquetas (opcional)`;
export const QEXAM_GEN_TAGS_HINT = $localize`:@@questionnaires.exams.generation.tagsHint:Sin marcar ninguna = no filtra por etiquetas. Con varias, la pregunta debe tener al menos una.`;
export const QEXAM_GEN_EXCLUDE_QUESTIONS = $localize`:@@questionnaires.exams.generation.excludeQuestions:Excluir preguntas del cuestionario`;
export const QEXAM_GEN_JSON_PREVIEW = $localize`:@@questionnaires.exams.generation.jsonPreview:Vista previa técnica (JSON)`;
export const QEXAM_GEN_ADVANCED_JSON = $localize`:@@questionnaires.exams.generation.advancedJson:Edición avanzada JSON`;
export const QEXAM_GEN_USE_ADVANCED_JSON = $localize`:@@questionnaires.exams.generation.useAdvancedJson:Usar JSON manual (solo usuarios avanzados)`;
export const QEXAM_GEN_UNSUPPORTED_JSON = $localize`:@@questionnaires.exams.generation.unsupportedJson:Este examen tiene un JSON con campos no editables en el formulario. Revise la edición avanzada.`;
export const QEXAM_GEN_EXCLUDE_HINT = $localize`:@@questionnaires.exams.generation.excludeHint:Seleccione un cuestionario para excluir preguntas concretas.`;

export const QEXAM_FIELD_STATUS = $localize`:@@questionnaires.exams.field.status:Estado`;
export const QEXAM_QUESTIONS_AVAILABLE = $localize`:@@questionnaires.exams.questionsAvailable:Preguntas disponibles en cuestionario:`;
export const QEXAM_ELIGIBLE_QUESTIONS = $localize`:@@questionnaires.exams.eligibleQuestions:Preguntas elegibles tras filtros:`;
export const QEXAM_NO_PUBLISHED_QUESTIONNAIRES = $localize`:@@questionnaires.exams.noPublishedQuestionnaires:No hay cuestionarios publicados disponibles`;

export function qexamInsufficientEligibleError(eligible: number, requested: number, available: number): string {
  if (eligible === 1) {
    return $localize`:@@questionnaires.exams.errors.insufficientEligibleOne:Solo hay 1 pregunta elegible tras los filtros; el examen solicita ${requested}:requested:. El cuestionario dispone de ${available}:available:.`;
  }
  return $localize`:@@questionnaires.exams.errors.insufficientEligibleMany:Solo hay ${eligible}:eligible: preguntas elegibles tras los filtros; el examen solicita ${requested}:requested:. El cuestionario dispone de ${available}:available:.`;
}

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
