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
