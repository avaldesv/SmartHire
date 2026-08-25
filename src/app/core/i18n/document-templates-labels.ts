export const DOCTEMPLATES_PAGE_TITLE = $localize`:@@documentTemplates.pageTitle:Plantillas de Documentos`;
export const DOCTEMPLATES_TAB_VARIABLES = $localize`:@@documentTemplates.tab.variables:Variables`;
export const DOCTEMPLATES_TAB_TEMPLATES = $localize`:@@documentTemplates.tab.templates:Plantillas`;

export const DOCTEMPLATES_VAR_NEW_BUTTON = $localize`:@@documentTemplates.variables.newButton:Nueva variable`;
export const DOCTEMPLATES_VAR_COL_CODE = $localize`:@@documentTemplates.variables.col.code:Código`;
export const DOCTEMPLATES_VAR_COL_LABEL = $localize`:@@documentTemplates.variables.col.label:Etiqueta`;
export const DOCTEMPLATES_VAR_COL_DESCRIPTION = $localize`:@@documentTemplates.variables.col.description:Descripción`;
export const DOCTEMPLATES_VAR_COL_ACTIVE = $localize`:@@documentTemplates.variables.col.active:Activa`;
export const DOCTEMPLATES_VAR_EMPTY = $localize`:@@documentTemplates.variables.empty:No hay variables configuradas`;
export const DOCTEMPLATES_VAR_DIALOG_NEW = $localize`:@@documentTemplates.variables.dialog.new:Nueva variable`;
export const DOCTEMPLATES_VAR_DIALOG_EDIT = $localize`:@@documentTemplates.variables.dialog.edit:Editar variable`;
export const DOCTEMPLATES_VAR_FIELD_CODE = $localize`:@@documentTemplates.variables.field.code:Código`;
export const DOCTEMPLATES_VAR_FIELD_LABEL = $localize`:@@documentTemplates.variables.field.label:Etiqueta`;
export const DOCTEMPLATES_VAR_FIELD_DESCRIPTION = $localize`:@@documentTemplates.variables.field.description:Descripción`;
export const DOCTEMPLATES_VAR_FIELD_ACTIVE = $localize`:@@documentTemplates.variables.field.active:Activa`;
export const DOCTEMPLATES_VAR_CODE_HINT = $localize`:@@documentTemplates.variables.codeHint:Solo letras, números y guion bajo; debe empezar con letra. No se puede cambiar al editar.`;
export const DOCTEMPLATES_VAR_ERRORS_LIST = $localize`:@@documentTemplates.variables.errors.list:No se pudieron cargar las variables`;
export const DOCTEMPLATES_VAR_ERRORS_SAVE = $localize`:@@documentTemplates.variables.errors.save:No se pudo guardar la variable`;
export const DOCTEMPLATES_VAR_SUCCESS_SAVED = $localize`:@@documentTemplates.variables.success.saved:Variable guardada`;

export const DOCTEMPLATES_TPL_NEW_BUTTON = $localize`:@@documentTemplates.templates.newButton:Nueva plantilla`;
export const DOCTEMPLATES_TPL_COL_NAME = $localize`:@@documentTemplates.templates.col.name:Nombre`;
export const DOCTEMPLATES_TPL_COL_FILENAME = $localize`:@@documentTemplates.templates.col.fileName:Archivo`;
export const DOCTEMPLATES_TPL_COL_ACTIVE = $localize`:@@documentTemplates.templates.col.active:Activa`;
export const DOCTEMPLATES_TPL_COL_VARIABLES = $localize`:@@documentTemplates.templates.col.variables:Variables usadas`;
export const DOCTEMPLATES_TPL_EMPTY = $localize`:@@documentTemplates.templates.empty:No hay plantillas de documentos configuradas`;
export const DOCTEMPLATES_TPL_DIALOG_NEW = $localize`:@@documentTemplates.templates.dialog.new:Nueva plantilla de documento`;
export const DOCTEMPLATES_TPL_DIALOG_EDIT = $localize`:@@documentTemplates.templates.dialog.edit:Editar plantilla de documento`;
export const DOCTEMPLATES_TPL_FIELD_NAME = $localize`:@@documentTemplates.templates.field.name:Nombre`;
export const DOCTEMPLATES_TPL_FIELD_FILE = $localize`:@@documentTemplates.templates.field.file:Archivo .docx`;
export const DOCTEMPLATES_TPL_FIELD_ACTIVE = $localize`:@@documentTemplates.templates.field.active:Activa`;
export const DOCTEMPLATES_TPL_FILE_HINT = $localize`:@@documentTemplates.templates.fileHint:Solo archivos .docx. Al seleccionar se validan las variables.`;
export const DOCTEMPLATES_TPL_FILE_CURRENT = $localize`:@@documentTemplates.templates.fileCurrent:Archivo actual`;
export const DOCTEMPLATES_TPL_VALID_VARS = $localize`:@@documentTemplates.templates.validVars:Variables válidas`;
export const DOCTEMPLATES_TPL_INVALID_VARS = $localize`:@@documentTemplates.templates.invalidVars:Variables no reconocidas`;
export const DOCTEMPLATES_TPL_VALIDATING = $localize`:@@documentTemplates.templates.validating:Validando archivo...`;
export const DOCTEMPLATES_TPL_DOWNLOAD = $localize`:@@documentTemplates.templates.download:Descargar`;
export const DOCTEMPLATES_TPL_ERRORS_LIST = $localize`:@@documentTemplates.templates.errors.list:No se pudieron cargar las plantillas`;
export const DOCTEMPLATES_TPL_ERRORS_SAVE = $localize`:@@documentTemplates.templates.errors.save:No se pudo guardar la plantilla`;
export const DOCTEMPLATES_TPL_ERRORS_LOAD = $localize`:@@documentTemplates.templates.errors.load:No se pudo cargar la plantilla`;
export const DOCTEMPLATES_TPL_ERRORS_VALIDATE = $localize`:@@documentTemplates.templates.errors.validate:No se pudo validar el archivo`;
export const DOCTEMPLATES_TPL_ERRORS_DOWNLOAD = $localize`:@@documentTemplates.templates.errors.download:No se pudo obtener el enlace de descarga`;
export const DOCTEMPLATES_TPL_ERRORS_DELETE = $localize`:@@documentTemplates.templates.errors.delete:No se pudo eliminar la plantilla`;
export const DOCTEMPLATES_TPL_ERRORS_FILE_TYPE = $localize`:@@documentTemplates.templates.errors.fileType:Solo se permiten archivos .docx`;
export const DOCTEMPLATES_TPL_SUCCESS_SAVED = $localize`:@@documentTemplates.templates.success.saved:Plantilla guardada`;
export const DOCTEMPLATES_TPL_SUCCESS_DELETED = $localize`:@@documentTemplates.templates.success.deleted:Plantilla eliminada`;

export const DOCTEMPLATES_CANCEL = $localize`:@@documentTemplates.cancel:Cancelar`;
export const DOCTEMPLATES_SAVE = $localize`:@@documentTemplates.save:Guardar`;
export const DOCTEMPLATES_SAVING = $localize`:@@documentTemplates.saving:Guardando...`;

export function documentTemplatesDeleteConfirm(name: string): string {
  return $localize`:@@documentTemplates.templates.deleteConfirm:¿Eliminar la plantilla "${name}:name:"? Esta acción no se puede deshacer.`;
}
