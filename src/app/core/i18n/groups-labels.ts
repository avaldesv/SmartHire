export const GROUPS_PAGE_TITLE = $localize`:@@groups.pageTitle:Grupos de usuarios`;
export const GROUPS_NEW_BUTTON = $localize`:@@groups.newButton:Nuevo grupo`;
export const GROUPS_EDIT_TITLE = $localize`:@@groups.editTitle:Editar grupo`;
export const GROUPS_NEW_TITLE = $localize`:@@groups.newTitle:Nuevo grupo`;
export const GROUPS_COLUMN_GROUP = $localize`:@@groups.column.group:Grupo`;
export const GROUPS_COLUMN_PERMISSIONS = $localize`:@@groups.column.permissions:Permisos`;
export const GROUPS_FIELD_MODULE_PERMISSIONS = $localize`:@@groups.field.modulePermissions:Permisos de módulo`;

export const GROUPS_RECORD_SCOPE = $localize`:@@catalogs.common.recordScope:Ámbito del registro:`;
export const GROUPS_SCOPE_TENANT = $localize`:@@catalogs.common.scopeTenant:Tenant actual`;
export const GROUPS_SCOPE_GLOBAL = $localize`:@@catalogs.common.scopeGlobal:Global`;
export const GROUPS_FIELD_NAME = $localize`:@@catalogs.field.name:Nombre`;
export const GROUPS_FIELD_DESCRIPTION = $localize`:@@catalogs.field.description:Descripción`;
export const GROUPS_FIELD_ACTIVE = $localize`:@@catalogs.field.active:Activo`;
export const GROUPS_FIELD_SCOPE = $localize`:@@catalogs.field.scope:Ámbito`;
export const GROUPS_CANCEL = $localize`:@@common.cancel:Cancelar`;
export const GROUPS_SAVING = $localize`:@@catalogs.common.saving:Guardando...`;
export const GROUPS_SAVE = $localize`:@@catalogs.common.save:Guardar`;
export const GROUPS_YES = $localize`:@@common.yes:Sí`;
export const GROUPS_NO = $localize`:@@common.no:No`;
export const GROUPS_SNACK_CLOSE = $localize`:@@common.close:Cerrar`;

export const GROUPS_LOAD_PERMISSIONS_ERROR = $localize`:@@groups.errors.loadPermissions:No se pudieron cargar los permisos`;
export const GROUPS_LOAD_ERROR = $localize`:@@groups.errors.load:No se pudieron cargar los grupos`;
export const GROUPS_SAVE_SUCCESS = $localize`:@@groups.success.saved:Grupo guardado`;
export const GROUPS_SAVE_ERROR = $localize`:@@groups.errors.save:No se pudo guardar el grupo`;
export const GROUPS_DELETE_SUCCESS = $localize`:@@groups.success.deleted:Grupo eliminado`;
export const GROUPS_DELETE_ERROR = $localize`:@@groups.errors.delete:No se pudo eliminar el grupo`;

export function groupsDeleteConfirm(name: string): string {
  return $localize`:@@groups.confirm.delete:¿Eliminar el grupo "${name}:name:"? Esta acción no se puede deshacer.`;
}
