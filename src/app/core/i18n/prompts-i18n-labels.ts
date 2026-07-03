export const PROMPTS_PAGE_TITLE = $localize`:@@prompts.pageTitle:Prompts IA`;
export const PROMPTS_FIELD_CLAVE = $localize`:@@prompts.field.clave:Clave`;
export const PROMPTS_FIELD_PROMPT_TEXT = $localize`:@@prompts.field.promptText:Texto del prompt`;
export const PROMPTS_FIELD_DESCRIPTION = $localize`:@@prompts.field.description:Descripción`;
export const PROMPTS_NEW_BUTTON = $localize`:@@prompts.newButton:Nuevo prompt`;
export const PROMPTS_EDIT_TITLE = $localize`:@@prompts.editTitle:Editar prompt`;
export const PROMPTS_NEW_TITLE = $localize`:@@prompts.newTitle:Nuevo prompt`;
export const PROMPTS_COL_CLAVE = $localize`:@@prompts.col.clave:Clave`;
export const PROMPTS_COL_PROMPT = $localize`:@@prompts.col.prompt:Prompt`;
export const PROMPTS_COL_SCOPE = $localize`:@@prompts.col.scope:Ámbito`;
export const PROMPTS_EMPTY = $localize`:@@prompts.empty:No hay prompts configurados`;
export const PROMPTS_ERRORS_LIST = $localize`:@@prompts.errors.list:No se pudieron cargar los prompts`;
export const PROMPTS_ERRORS_SAVE = $localize`:@@prompts.errors.save:No se pudo guardar el prompt`;
export const PROMPTS_ERRORS_DELETE = $localize`:@@prompts.errors.delete:No se pudo eliminar el prompt`;
export const PROMPTS_ERRORS_UPDATE = $localize`:@@prompts.errors.update:No se pudo actualizar el prompt`;
export const PROMPTS_SUCCESS_SAVED = $localize`:@@prompts.success.saved:Prompt guardado`;
export const PROMPTS_SUCCESS_DELETED = $localize`:@@prompts.success.deleted:Prompt eliminado`;
export const PROMPTS_CLAVE_READONLY_HINT = $localize`:@@prompts.claveReadonlyHint:La clave no se puede modificar después de crear el registro`;
export const PROMPTS_SHOW_MORE = $localize`:@@prompts.showMore:mostrar más`;
export const PROMPTS_CANCEL = $localize`:@@prompts.cancel:Cancelar`;
export const PROMPTS_SNACK_CLOSE = $localize`:@@common.close:Cerrar`;

export const PROMPTS_RECORD_SCOPE = $localize`:@@catalogs.common.recordScope:Ámbito del registro:`;
export const PROMPTS_SCOPE_TENANT = $localize`:@@catalogs.common.scopeTenant:Tenant actual`;
export const PROMPTS_SCOPE_GLOBAL = $localize`:@@catalogs.common.scopeGlobal:Global`;
export const PROMPTS_FIELD_ACTIVE = $localize`:@@catalogs.field.active:Activo`;
export const PROMPTS_SAVING = $localize`:@@catalogs.common.saving:Guardando...`;
export const PROMPTS_SAVE = $localize`:@@catalogs.common.save:Guardar`;

export function promptsDeleteConfirm(clave: string): string {
  return $localize`:@@prompts.deleteConfirm:¿Eliminar el prompt "${clave}:clave:"? Esta acción no se puede deshacer.`;
}
