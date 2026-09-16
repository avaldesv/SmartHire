export const PUBTEMPLATES_PAGE_TITLE = $localize`:@@publicationTemplates.pageTitle:Plantillas de publicación`;
export const PUBTEMPLATES_NEW_BUTTON = $localize`:@@publicationTemplates.newButton:Nueva plantilla`;
export const PUBTEMPLATES_EDIT_TITLE = $localize`:@@publicationTemplates.editTitle:Editar plantilla`;
export const PUBTEMPLATES_NEW_TITLE = $localize`:@@publicationTemplates.newTitle:Nueva plantilla`;
export const PUBTEMPLATES_COL_NAME = $localize`:@@publicationTemplates.col.name:Nombre`;
export const PUBTEMPLATES_COL_LOCALE = $localize`:@@publicationTemplates.col.locale:Idioma`;
export const PUBTEMPLATES_COL_DEFAULT = $localize`:@@publicationTemplates.col.default:Predeterminada`;
export const PUBTEMPLATES_COL_ACTIVE = $localize`:@@publicationTemplates.col.active:Activa`;
export const PUBTEMPLATES_EMPTY = $localize`:@@publicationTemplates.empty:No hay plantillas de publicación configuradas`;
export const PUBTEMPLATES_ERRORS_LIST = $localize`:@@publicationTemplates.errors.list:No se pudieron cargar las plantillas`;
export const PUBTEMPLATES_ERRORS_SAVE = $localize`:@@publicationTemplates.errors.save:No se pudo guardar la plantilla`;
export const PUBTEMPLATES_ERRORS_DELETE = $localize`:@@publicationTemplates.errors.delete:No se pudo eliminar la plantilla`;
export const PUBTEMPLATES_ERRORS_LOAD = $localize`:@@publicationTemplates.errors.load:No se pudo cargar la plantilla`;
export const PUBTEMPLATES_ERRORS_PREVIEW = $localize`:@@publicationTemplates.errors.preview:No se pudo generar la vista previa`;
export const PUBTEMPLATES_SUCCESS_SAVED = $localize`:@@publicationTemplates.success.saved:Plantilla guardada`;
export const PUBTEMPLATES_SUCCESS_DELETED = $localize`:@@publicationTemplates.success.deleted:Plantilla eliminada`;
export const PUBTEMPLATES_CANCEL = $localize`:@@publicationTemplates.cancel:Cancelar`;
export const PUBTEMPLATES_CLOSE = $localize`:@@publicationTemplates.close:Cerrar`;
export const PUBTEMPLATES_SAVE = $localize`:@@publicationTemplates.save:Guardar`;
export const PUBTEMPLATES_SAVING = $localize`:@@publicationTemplates.saving:Guardando...`;
export const PUBTEMPLATES_SNACK_CLOSE = $localize`:@@common.close:Cerrar`;

export const PUBTEMPLATES_FIELD_NAME = $localize`:@@publicationTemplates.field.name:Nombre`;
export const PUBTEMPLATES_FIELD_LOCALE = $localize`:@@publicationTemplates.field.locale:Idioma`;
export const PUBTEMPLATES_FIELD_HTML_BODY = $localize`:@@publicationTemplates.field.htmlBody:Contenido HTML`;
export const PUBTEMPLATES_FIELD_DEFAULT = $localize`:@@publicationTemplates.field.default:Plantilla predeterminada`;
export const PUBTEMPLATES_FIELD_ACTIVE = $localize`:@@publicationTemplates.field.active:Activa`;

export const PUBTEMPLATES_DIALOG_NEW = $localize`:@@publicationTemplates.dialog.new:Nueva plantilla de publicación`;
export const PUBTEMPLATES_DIALOG_EDIT = $localize`:@@publicationTemplates.dialog.edit:Editar plantilla de publicación`;
export const PUBTEMPLATES_LOCALE_HINT_EDIT = $localize`:@@publicationTemplates.locale.editHint:El idioma identifica esta plantilla; para otro idioma cree una plantilla nueva.`;
export const PUBTEMPLATES_LOCALE_HINT_CREATE = $localize`:@@publicationTemplates.locale.createHint:Solo se listan idiomas sin plantilla. Si el idioma ya existe, edite esa plantilla.`;
export const PUBTEMPLATES_ERRORS_ALL_LOCALES_USED = $localize`:@@publicationTemplates.errors.allLocalesUsed:Ya existen plantillas para todos los idiomas. Edite una plantilla existente.`;
export const PUBTEMPLATES_ERRORS_NO_LOCALES = $localize`:@@publicationTemplates.errors.noLocalesAvailable:No hay idiomas disponibles para crear una plantilla`;

export const PUBTEMPLATES_LOCALE_ES = $localize`:@@publicationTemplates.locale.es:Español`;
export const PUBTEMPLATES_LOCALE_EN = $localize`:@@publicationTemplates.locale.en:Inglés`;
export const PUBTEMPLATES_LOCALE_PT = $localize`:@@publicationTemplates.locale.pt:Portugués`;

export const PUBTEMPLATES_PREVIEW_BUTTON = $localize`:@@publicationTemplates.preview.button:Vista previa`;
export const PUBTEMPLATES_PREVIEW_TITLE = $localize`:@@publicationTemplates.preview.title:Vista previa de la plantilla`;
export const PUBTEMPLATES_PREVIEW_EMPTY = $localize`:@@publicationTemplates.preview.empty:Escribe el HTML para ver la vista previa aquí`;
export const PUBTEMPLATES_PREVIEW_LOADING = $localize`:@@publicationTemplates.preview.loading:Generando vista previa...`;
export const PUBTEMPLATES_PREVIEW_CLOSE = $localize`:@@publicationTemplates.preview.close:Cerrar vista previa`;

export function publicationTemplatesDeleteConfirm(name: string): string {
  return $localize`:@@publicationTemplates.deleteConfirm:¿Eliminar la plantilla "${name}:name:"? Esta acción no se puede deshacer.`;
}
