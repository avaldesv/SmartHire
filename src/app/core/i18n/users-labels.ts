export const USERS_TENANT_CONTEXT_ERROR = $localize`:@@users.errors.tenantContext:No se pudo cargar el contexto del tenant`;
export const USERS_DIAL_CODES_ERROR = $localize`:@@users.errors.dialCodes:No se pudieron cargar los códigos telefónicos`;
export const USERS_ROLES_ERROR = $localize`:@@users.errors.roles:No se pudieron cargar los roles`;
export const USERS_LIST_ERROR = $localize`:@@users.errors.list:No se pudieron cargar los usuarios`;
export const USERS_SAVE_ERROR = $localize`:@@users.errors.save:No se pudo guardar el usuario`;
export const USERS_DELETE_ERROR = $localize`:@@users.errors.delete:No se pudo eliminar el usuario`;
export const USERS_SAVE_SUCCESS = $localize`:@@users.success.saved:Usuario guardado`;
export const USERS_DELETE_SUCCESS = $localize`:@@users.success.deleted:Usuario eliminado`;

export function usersDeleteConfirm(label: string): string {
  return $localize`:@@users.confirm.delete:¿Eliminar el usuario "${label}"? Esta acción no se puede deshacer.`;
}

export const USERS_DELETE_CONFIRM_TITLE = $localize`:@@users.confirm.deleteTitle:Eliminar usuario`;

export const USERS_YES = $localize`:@@common.yes:Sí`;
export const USERS_NO = $localize`:@@common.no:No`;
export const USERS_SAVING = $localize`:@@users.form.saving:Guardando...`;
export const USERS_SAVE = $localize`:@@users.form.save:Guardar`;
export const USERS_USERNAME_REQUIRED = $localize`:@@users.errors.usernameRequired:El usuario es obligatorio`;
export const USERS_USERNAME_TAKEN = $localize`:@@users.errors.usernameTaken:Este usuario ya existe`;
export const USERS_EMAIL_REQUIRED = $localize`:@@users.errors.emailRequired:El correo es obligatorio`;
export const USERS_EMAIL_INVALID = $localize`:@@users.errors.emailInvalid:El correo no es válido`;
export const USERS_PASSWORD_REQUIRED = $localize`:@@users.errors.passwordRequired:La contraseña es obligatoria`;
export const USERS_NAME_REQUIRED = $localize`:@@users.errors.nameRequired:El nombre es obligatorio`;
export const USERS_LAST_NAME_REQUIRED = $localize`:@@users.errors.lastNameRequired:Los apellidos son obligatorios`;
