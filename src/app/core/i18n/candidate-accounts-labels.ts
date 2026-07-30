export const CANDIDATE_ACCOUNTS_PAGE_TITLE = $localize`:@@candidateAccounts.pageTitle:Cuentas de candidatos`;
export const CANDIDATE_ACCOUNTS_NEW_BUTTON = $localize`:@@candidateAccounts.new:Nueva cuenta`;
export const CANDIDATE_ACCOUNTS_EMPTY = $localize`:@@candidateAccounts.empty:No hay cuentas de candidatos`;
export const CANDIDATE_ACCOUNTS_FILTER_EMAIL = $localize`:@@candidateAccounts.filter.email:Buscar email`;
export const CANDIDATE_ACCOUNTS_COL_EMAIL = $localize`:@@candidateAccounts.col.email:Email`;
export const CANDIDATE_ACCOUNTS_COL_CANDIDATE = $localize`:@@candidateAccounts.col.candidate:Candidato`;
export const CANDIDATE_ACCOUNTS_COL_STATUS = $localize`:@@candidateAccounts.col.status:Estado registro`;
export const CANDIDATE_ACCOUNTS_COL_ACTIVE = $localize`:@@candidateAccounts.col.active:Activo`;
export const CANDIDATE_ACCOUNTS_COL_LAST_LOGIN = $localize`:@@candidateAccounts.col.lastLogin:Último acceso`;
export const CANDIDATE_ACCOUNTS_DIALOG_CREATE = $localize`:@@candidateAccounts.dialog.create:Crear cuenta`;
export const CANDIDATE_ACCOUNTS_DIALOG_EDIT = $localize`:@@candidateAccounts.dialog.edit:Editar cuenta`;
export const CANDIDATE_ACCOUNTS_FIELD_EMAIL = $localize`:@@candidateAccounts.field.email:Email del candidato`;
export const CANDIDATE_ACCOUNTS_FIELD_SEND_MAIL = $localize`:@@candidateAccounts.field.sendMail:Enviar email de registro`;
export const CANDIDATE_ACCOUNTS_FIELD_MUST_CHANGE = $localize`:@@candidateAccounts.field.mustChange:Debe cambiar contraseña`;
export const CANDIDATE_ACCOUNTS_FIELD_REGISTER_STATUS = $localize`:@@candidateAccounts.field.registerStatus:Estado de registro`;
export const CANDIDATE_ACCOUNTS_STATUS_PENDING = $localize`:@@candidateAccounts.status.pending:Pendiente email`;
export const CANDIDATE_ACCOUNTS_STATUS_EMAIL = $localize`:@@candidateAccounts.status.email:Email validado`;
export const CANDIDATE_ACCOUNTS_STATUS_PHONE = $localize`:@@candidateAccounts.status.phone:Teléfono validado`;
export const CANDIDATE_ACCOUNTS_HARD_TITLE = $localize`:@@candidateAccounts.hard.title:Eliminar permanentemente`;
export const CANDIDATE_ACCOUNTS_HARD_HINT = $localize`:@@candidateAccounts.hard.hint:Escribe el email de la cuenta para confirmar el borrado irreversible.`;
export const CANDIDATE_ACCOUNTS_HARD_CONFIRM = $localize`:@@candidateAccounts.hard.confirm:Eliminar definitivamente`;
export const CANDIDATE_ACCOUNTS_HARD_BUTTON = $localize`:@@candidateAccounts.hard.button:Borrar permanente`;
export const CANDIDATE_ACCOUNTS_CANCEL = $localize`:@@common.cancel:Cancelar`;
export const CANDIDATE_ACCOUNTS_SAVE = $localize`:@@candidateAccounts.save:Guardar`;
export const CANDIDATE_ACCOUNTS_SAVING = $localize`:@@candidateAccounts.saving:Guardando…`;
export const CANDIDATE_ACCOUNTS_SNACK_CLOSE = $localize`:@@common.close:Cerrar`;
export const CANDIDATE_ACCOUNTS_ERRORS_LIST = $localize`:@@candidateAccounts.errors.list:No se pudo cargar el listado`;
export const CANDIDATE_ACCOUNTS_ERRORS_SAVE = $localize`:@@candidateAccounts.errors.save:No se pudo guardar la cuenta`;
export const CANDIDATE_ACCOUNTS_ERRORS_ACTIVE = $localize`:@@candidateAccounts.errors.active:No se pudo actualizar el estado activo`;
export const CANDIDATE_ACCOUNTS_ERRORS_DELETE = $localize`:@@candidateAccounts.errors.delete:No se pudo eliminar la cuenta`;
export const CANDIDATE_ACCOUNTS_ERRORS_HARD = $localize`:@@candidateAccounts.errors.hard:No se pudo eliminar permanentemente`;
export const CANDIDATE_ACCOUNTS_SUCCESS_SAVED = $localize`:@@candidateAccounts.success.saved:Cuenta guardada`;
export const CANDIDATE_ACCOUNTS_SUCCESS_DELETED = $localize`:@@candidateAccounts.success.deleted:Cuenta eliminada (soft)`;
export const CANDIDATE_ACCOUNTS_SUCCESS_HARD = $localize`:@@candidateAccounts.success.hard:Cuenta eliminada permanentemente`;

export function candidateAccountsSoftDeleteConfirm(email: string): string {
  return $localize`:@@candidateAccounts.confirm.soft:¿Eliminar (soft) la cuenta ${email}:email:?`;
}

export function candidateAccountsRegisterStatusLabel(statusId: number): string {
  switch (statusId) {
    case 2:
      return CANDIDATE_ACCOUNTS_STATUS_EMAIL;
    case 3:
      return CANDIDATE_ACCOUNTS_STATUS_PHONE;
    default:
      return CANDIDATE_ACCOUNTS_STATUS_PENDING;
  }
}
