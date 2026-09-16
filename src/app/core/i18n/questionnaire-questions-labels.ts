export const QQUEST_TYPES = [
  { value: 'single_choice', labelKey: 'singleChoice' },
  { value: 'multiple_choice', labelKey: 'multipleChoice' },
  { value: 'yes_no', labelKey: 'yesNo' },
  { value: 'open', labelKey: 'open' },
] as const;

export type QuestionTypeValue = (typeof QQUEST_TYPES)[number]['value'];

export const QQUEST_NEW_BUTTON = $localize`:@@questionnaires.questions.newButton:Nueva pregunta`;
export const QQUEST_EMPTY = $localize`:@@questionnaires.questions.empty:No hay preguntas registradas`;
export const QQUEST_FILTER_TEXT = $localize`:@@questionnaires.questions.filter.text:Buscar`;
export const QQUEST_FILTER_CATEGORY = $localize`:@@questionnaires.questions.filter.category:Categoría`;
export const QQUEST_FILTER_TYPE = $localize`:@@questionnaires.questions.filter.type:Tipo`;
export const QQUEST_FILTER_ALL = $localize`:@@questionnaires.questions.filter.all:Todas`;
export const QQUEST_FILTER_APPLY = $localize`:@@questionnaires.questions.filter.apply:Buscar`;
export const QQUEST_FILTER_CLEAR = $localize`:@@questionnaires.questions.filter.clear:Limpiar`;

export const QQUEST_COL_TEXT = $localize`:@@questionnaires.questions.col.text:Enunciado`;
export const QQUEST_COL_TYPE = $localize`:@@questionnaires.questions.col.type:Tipo`;
export const QQUEST_COL_CATEGORY = $localize`:@@questionnaires.questions.col.category:Categoría`;
export const QQUEST_COL_DIFFICULTY = $localize`:@@questionnaires.questions.col.difficulty:Dificultad`;
export const QQUEST_COL_LOCKED = $localize`:@@questionnaires.questions.col.locked:Bloqueada`;

export const QQUEST_TYPE_SINGLE = $localize`:@@questionnaires.questions.type.singleChoice:Opción única`;
export const QQUEST_TYPE_MULTIPLE = $localize`:@@questionnaires.questions.type.multipleChoice:Opción múltiple`;
export const QQUEST_TYPE_YES_NO = $localize`:@@questionnaires.questions.type.yesNo:Sí/No`;
export const QQUEST_TYPE_OPEN = $localize`:@@questionnaires.questions.type.open:Abierta`;

export const QQUEST_TYPES_COL_CODE = $localize`:@@questionnaires.questionTypes.col.code:Código`;
export const QQUEST_TYPES_COL_LABEL = $localize`:@@questionnaires.questionTypes.col.label:Etiqueta`;
export const QQUEST_TYPES_COL_DESCRIPTION = $localize`:@@questionnaires.questionTypes.col.description:Descripción`;

export const QQUEST_TYPE_SINGLE_DESC = $localize`:@@questionnaires.questionTypes.desc.singleChoice:El candidato elige una sola opción correcta. Requiere al menos dos opciones.`;
export const QQUEST_TYPE_MULTIPLE_DESC = $localize`:@@questionnaires.questionTypes.desc.multipleChoice:El candidato puede marcar varias opciones correctas. Requiere al menos dos opciones.`;
export const QQUEST_TYPE_YES_NO_DESC = $localize`:@@questionnaires.questionTypes.desc.yesNo:Pregunta binaria con dos opciones y exactamente una respuesta correcta.`;
export const QQUEST_TYPE_OPEN_DESC = $localize`:@@questionnaires.questionTypes.desc.open:Respuesta libre en texto. No admite opciones predefinidas.`;

export interface QuestionTypeReferenceItem {
  value: QuestionTypeValue;
  label: string;
  description: string;
}

export const QQUEST_DIALOG_NEW = $localize`:@@questionnaires.questions.dialog.newTitle:Nueva pregunta`;
export const QQUEST_DIALOG_EDIT = $localize`:@@questionnaires.questions.dialog.editTitle:Editar pregunta`;
export const QQUEST_DIALOG_VIEW = $localize`:@@questionnaires.questions.dialog.viewTitle:Ver pregunta`;
export const QQUEST_FIELD_TEXT = $localize`:@@questionnaires.questions.field.text:Enunciado`;
export const QQUEST_FIELD_TYPE = $localize`:@@questionnaires.questions.field.type:Tipo`;
export const QQUEST_FIELD_CATEGORY = $localize`:@@questionnaires.questions.field.category:Categoría`;
export const QQUEST_FIELD_DIFFICULTY = $localize`:@@questionnaires.questions.field.difficulty:Dificultad (1-5)`;
export const QQUEST_FIELD_EXPLANATION = $localize`:@@questionnaires.questions.field.explanation:Explicación`;
export const QQUEST_FIELD_CORRECT_ANSWER = $localize`:@@questionnaires.questions.field.correctAnswer:Respuesta correcta`;
export const QQUEST_FIELD_TAGS = $localize`:@@questionnaires.questions.field.tags:Tags`;
export const QQUEST_FIELD_NO_TAGS = $localize`:@@questionnaires.questions.field.noTags:Sin tags`;
export const QQUEST_OPTIONS_TITLE = $localize`:@@questionnaires.questions.options.title:Opciones`;
export const QQUEST_OPTION_TEXT = $localize`:@@questionnaires.questions.options.text:Texto de la opción`;
export const QQUEST_OPTION_CORRECT = $localize`:@@questionnaires.questions.options.correct:Correcta`;
export const QQUEST_OPTION_ADD = $localize`:@@questionnaires.questions.options.add:Agregar opción`;
export const QQUEST_LOCKED_HINT = $localize`:@@questionnaires.questions.lockedHint:Esta pregunta está bloqueada y no puede editarse.`;

export const QQUEST_ERRORS_LIST = $localize`:@@questionnaires.questions.errors.list:No se pudieron cargar las preguntas`;
export const QQUEST_ERRORS_LOAD = $localize`:@@questionnaires.questions.errors.load:No se pudo cargar la pregunta`;
export const QQUEST_ERRORS_SAVE = $localize`:@@questionnaires.questions.errors.save:No se pudo guardar la pregunta`;
export const QQUEST_ERRORS_DELETE = $localize`:@@questionnaires.questions.errors.delete:No se pudo eliminar la pregunta`;
export const QQUEST_ERRORS_OPTIONS = $localize`:@@questionnaires.questions.errors.options:Las opciones no son válidas para el tipo seleccionado`;
export const QQUEST_SUCCESS_SAVED = $localize`:@@questionnaires.questions.success.saved:Pregunta guardada`;
export const QQUEST_SUCCESS_DELETED = $localize`:@@questionnaires.questions.success.deleted:Pregunta eliminada`;

export function qquestDeleteConfirm(text: string): string {
  return $localize`:@@questionnaires.questions.deleteConfirm:¿Eliminar la pregunta "${text}:text:"? Esta acción no se puede deshacer.`;
}

export function qquestTypeLabel(type: string): string {
  switch (type) {
    case 'single_choice':
      return QQUEST_TYPE_SINGLE;
    case 'multiple_choice':
      return QQUEST_TYPE_MULTIPLE;
    case 'yes_no':
      return QQUEST_TYPE_YES_NO;
    case 'open':
      return QQUEST_TYPE_OPEN;
    default:
      return type;
  }
}

export function qquestTypeDescription(type: QuestionTypeValue): string {
  switch (type) {
    case 'single_choice':
      return QQUEST_TYPE_SINGLE_DESC;
    case 'multiple_choice':
      return QQUEST_TYPE_MULTIPLE_DESC;
    case 'yes_no':
      return QQUEST_TYPE_YES_NO_DESC;
    case 'open':
      return QQUEST_TYPE_OPEN_DESC;
  }
}

export const QQUEST_TYPE_REFERENCE: QuestionTypeReferenceItem[] = QQUEST_TYPES.map((type) => ({
  value: type.value,
  label: qquestTypeLabel(type.value),
  description: qquestTypeDescription(type.value),
}));

export const QQUEST_COL_SCOPE = $localize`:@@questionnaires.common.col.scope:Ámbito`;
export const QQUEST_FIELD_ACTIVE = $localize`:@@catalogs.field.active:Activo`;
export const QQUEST_RECORD_SCOPE = $localize`:@@catalogs.common.recordScope:Ámbito del registro:`;
export const QQUEST_SCOPE_TENANT = $localize`:@@catalogs.common.scopeTenant:Tenant actual`;
export const QQUEST_SCOPE_GLOBAL = $localize`:@@catalogs.common.scopeGlobal:Global`;
export const QQUEST_SAVING = $localize`:@@catalogs.common.saving:Guardando...`;
export const QQUEST_SAVE = $localize`:@@catalogs.common.save:Guardar`;
export const QQUEST_CANCEL = $localize`:@@common.cancel:Cancelar`;
export const QQUEST_CLOSE = $localize`:@@common.close:Cerrar`;
export const QQUEST_SNACK_CLOSE = QQUEST_CLOSE;
