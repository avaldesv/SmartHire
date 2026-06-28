export const CATALOG_MSG_SNACK_CLOSE = $localize`:@@common.close:Cerrar`;

export const CATALOG_MSG_LOAD_STATES_SELECTOR = $localize`:@@catalogs.errors.loadStatesSelector:No se pudieron cargar entidades para el selector`;
export const CATALOG_MSG_LOAD_MUNICIPALITIES_SELECTOR = $localize`:@@catalogs.errors.loadMunicipalitiesSelector:No se pudieron cargar municipios para el selector`;
export const CATALOG_MSG_LOAD_FORM_CATEGORIES = $localize`:@@catalogs.errors.loadFormCategories:No se pudieron cargar categorías para el formulario`;
export const CATALOG_MSG_LOAD_PORTAL_LANGUAGES = $localize`:@@catalogs.errors.loadPortalLanguages:No se pudieron cargar los idiomas del portal`;
export const CATALOG_MSG_LOAD_SINGLE_COMPANY = $localize`:@@catalogs.errors.loadSingleCompany:No se pudo cargar la compañía`;

export const CATALOG_MSG_DELETE_SUCCESS = $localize`:@@catalogs.success.deleted:Registro eliminado`;
export const CATALOG_MSG_DELETE_ERROR = $localize`:@@catalogs.errors.delete:No se pudo eliminar el registro`;

export function catalogLoadListError(catalogName: string): string {
  return $localize`:@@catalogs.errors.loadList:No se pudieron cargar ${catalogName}:catalogName:`;
}

export function catalogSaveSuccess(catalogName: string): string {
  return $localize`:@@catalogs.success.saved:${catalogName}:catalogName: guardado`;
}

export function catalogSaveError(catalogName: string): string {
  return $localize`:@@catalogs.errors.save:No se pudo guardar ${catalogName}:catalogName:`;
}

export function catalogDeleteConfirm(display: string): string {
  return $localize`:@@catalogs.confirm.delete:¿Eliminar "${display}:display:"? Esta acción no se puede deshacer.`;
}
