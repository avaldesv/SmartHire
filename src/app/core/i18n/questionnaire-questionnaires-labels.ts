export const QQN_NEW_BUTTON = $localize`:@@questionnaires.questionnaires.newButton:Nuevo cuestionario`;
export const QQN_EMPTY = $localize`:@@questionnaires.questionnaires.empty:No hay cuestionarios registrados`;
export const QQN_FILTER_NAME = $localize`:@@questionnaires.questionnaires.filter.name:Buscar por nombre`;
export const QQN_FILTER_CATEGORY = $localize`:@@questionnaires.questionnaires.filter.category:Categoría`;
export const QQN_FILTER_STATUS = $localize`:@@questionnaires.questionnaires.filter.status:Estado`;
export const QQN_FILTER_ALL = $localize`:@@questionnaires.questionnaires.filter.all:Todos`;
export const QQN_FILTER_APPLY = $localize`:@@questionnaires.questionnaires.filter.apply:Buscar`;
export const QQN_FILTER_CLEAR = $localize`:@@questionnaires.questionnaires.filter.clear:Limpiar`;

export const QQN_COL_NAME = $localize`:@@questionnaires.questionnaires.col.name:Nombre`;
export const QQN_COL_CATEGORY = $localize`:@@questionnaires.questionnaires.col.category:Categoría`;
export const QQN_COL_STATUS = $localize`:@@questionnaires.questionnaires.col.status:Estado`;
export const QQN_COL_QUESTIONS = $localize`:@@questionnaires.questionnaires.col.questions:Preguntas`;

export const QQN_STATUS_DRAFT = $localize`:@@questionnaires.questionnaires.status.draft:Borrador`;
export const QQN_STATUS_PUBLISHED = $localize`:@@questionnaires.questionnaires.status.published:Publicado`;
export const QQN_STATUS_ARCHIVED = $localize`:@@questionnaires.questionnaires.status.archived:Archivado`;

export const QQN_PUBLISH_BUTTON = $localize`:@@questionnaires.questionnaires.publishButton:Publicar`;
export const QQN_PUBLISH_CONFIRM = $localize`:@@questionnaires.questionnaires.publishConfirm:¿Publicar este cuestionario? No podrá editarse después.`;
export const QQN_PUBLISH_SUCCESS = $localize`:@@questionnaires.questionnaires.publishSuccess:Cuestionario publicado`;
export const QQN_PUBLISH_ERROR = $localize`:@@questionnaires.questionnaires.publishError:No se pudo publicar el cuestionario`;

export const QQN_DIALOG_NEW = $localize`:@@questionnaires.questionnaires.dialog.newTitle:Nuevo cuestionario`;
export const QQN_DIALOG_EDIT = $localize`:@@questionnaires.questionnaires.dialog.editTitle:Editar cuestionario`;
export const QQN_DIALOG_VIEW = $localize`:@@questionnaires.questionnaires.dialog.viewTitle:Ver cuestionario`;
export const QQN_FIELD_NAME = $localize`:@@questionnaires.questionnaires.field.name:Nombre`;
export const QQN_FIELD_DESCRIPTION = $localize`:@@questionnaires.questionnaires.field.description:Descripción`;
export const QQN_FIELD_CATEGORY = $localize`:@@questionnaires.questionnaires.field.category:Categoría (opcional)`;
export const QQN_FIELD_NO_CATEGORY = $localize`:@@questionnaires.questionnaires.field.noCategory:Sin categoría`;
export const QQN_QUESTIONS_TITLE = $localize`:@@questionnaires.questionnaires.questions.title:Preguntas asignadas`;
export const QQN_QUESTIONS_ADD = $localize`:@@questionnaires.questionnaires.questions.add:Agregar pregunta`;
export const QQN_QUESTIONS_SELECT = $localize`:@@questionnaires.questionnaires.questions.select:Seleccionar pregunta`;
export const QQN_QUESTIONS_EMPTY = $localize`:@@questionnaires.questionnaires.questions.empty:No hay preguntas asignadas`;
export const QQN_QUESTIONS_WEIGHT = $localize`:@@questionnaires.questionnaires.questions.weight:Peso`;
export const QQN_QUESTIONS_MOVE_UP = $localize`:@@questionnaires.questionnaires.questions.moveUp:Subir`;
export const QQN_QUESTIONS_MOVE_DOWN = $localize`:@@questionnaires.questionnaires.questions.moveDown:Bajar`;
export const QQN_CATEGORY_MISMATCH = $localize`:@@questionnaires.questionnaires.categoryMismatch:Algunas preguntas pertenecen a otra categoría distinta a la del cuestionario.`;
export const QQN_PUBLISHED_LOCKED = $localize`:@@questionnaires.questionnaires.publishedLocked:Este cuestionario está publicado y no puede editarse.`;

export const QQN_ERRORS_LIST = $localize`:@@questionnaires.questionnaires.errors.list:No se pudieron cargar los cuestionarios`;
export const QQN_ERRORS_LOAD = $localize`:@@questionnaires.questionnaires.errors.load:No se pudo cargar el cuestionario`;
export const QQN_ERRORS_SAVE = $localize`:@@questionnaires.questionnaires.errors.save:No se pudo guardar el cuestionario`;
export const QQN_ERRORS_DELETE = $localize`:@@questionnaires.questionnaires.errors.delete:No se pudo eliminar el cuestionario`;
export const QQN_SUCCESS_SAVED = $localize`:@@questionnaires.questionnaires.success.saved:Cuestionario guardado`;
export const QQN_SUCCESS_DELETED = $localize`:@@questionnaires.questionnaires.success.deleted:Cuestionario eliminado`;

export function qqnDeleteConfirm(name: string): string {
  return $localize`:@@questionnaires.questionnaires.deleteConfirm:¿Eliminar el cuestionario "${name}:name:"? Esta acción no se puede deshacer.`;
}

export function qqnStatusLabel(status: string): string {
  switch (status) {
    case 'published':
      return QQN_STATUS_PUBLISHED;
    case 'archived':
      return QQN_STATUS_ARCHIVED;
    default:
      return QQN_STATUS_DRAFT;
  }
}

export const QQN_COL_SCOPE = $localize`:@@questionnaires.common.col.scope:Ámbito`;
export const QQN_FIELD_ACTIVE = $localize`:@@catalogs.field.active:Activo`;
export const QQN_RECORD_SCOPE = $localize`:@@catalogs.common.recordScope:Ámbito del registro:`;
export const QQN_SCOPE_TENANT = $localize`:@@catalogs.common.scopeTenant:Tenant actual`;
export const QQN_SCOPE_GLOBAL = $localize`:@@catalogs.common.scopeGlobal:Global`;
export const QQN_SAVING = $localize`:@@catalogs.common.saving:Guardando...`;
export const QQN_SAVE = $localize`:@@catalogs.common.save:Guardar`;
export const QQN_CANCEL = $localize`:@@common.cancel:Cancelar`;
export const QQN_CLOSE = $localize`:@@common.close:Cerrar`;
export const QQN_SNACK_CLOSE = QQN_CLOSE;
