import { FeedbackType } from '../feedback/feedback.types';

export interface ApiErrorI18nEntry {
  title: string;
  message: string;
  severity?: Exclude<FeedbackType, 'confirm'>;
}

/** Portal-side catalog keyed by backend errorCode. Grows per phase. */
export const API_ERROR_CATALOG: Record<string, ApiErrorI18nEntry> = {
  ERROR_USER_NOT_FOUND: {
    title: $localize`:@@errors.ERROR_USER_NOT_FOUND.title:Usuario no encontrado`,
    message: $localize`:@@errors.ERROR_USER_NOT_FOUND.message:El usuario solicitado no existe.`,
  },
  ERROR_COUNTRY_NOT_FOUND: {
    title: $localize`:@@errors.ERROR_COUNTRY_NOT_FOUND.title:País no encontrado`,
    message: $localize`:@@errors.ERROR_COUNTRY_NOT_FOUND.message:El país seleccionado no existe.`,
  },
  ERROR_WRONG_TENANT: {
    title: $localize`:@@errors.ERROR_WRONG_TENANT.title:Acceso denegado`,
    message: $localize`:@@errors.ERROR_WRONG_TENANT.message:No puede acceder a esta compañía.`,
  },
  ERROR_WRONG_TENANT_ACCESS: {
    title: $localize`:@@errors.ERROR_WRONG_TENANT_ACCESS.title:Acceso denegado`,
    message: $localize`:@@errors.ERROR_WRONG_TENANT_ACCESS.message:No tiene permiso para acceder a este tenant.`,
  },
  COMPANY_NOT_FOUND: {
    title: $localize`:@@errors.COMPANY_NOT_FOUND.title:Compañía no encontrada`,
    message: $localize`:@@errors.COMPANY_NOT_FOUND.message:La compañía solicitada no existe.`,
  },
  PORTAL_LANGUAGE_NOT_FOUND: {
    title: $localize`:@@errors.PORTAL_LANGUAGE_NOT_FOUND.title:Idioma no encontrado`,
    message: $localize`:@@errors.PORTAL_LANGUAGE_NOT_FOUND.message:El idioma del portal no está disponible.`,
  },
  USER_NOT_AUTHENTICATED: {
    title: $localize`:@@errors.USER_NOT_AUTHENTICATED.title:Sesión requerida`,
    message: $localize`:@@errors.USER_NOT_AUTHENTICATED.message:Debe iniciar sesión para continuar.`,
  },
  USERNAME_ALREADY_EXISTS: {
    title: $localize`:@@errors.USERNAME_ALREADY_EXISTS.title:Usuario duplicado`,
    message: $localize`:@@errors.USERNAME_ALREADY_EXISTS.message:El nombre de usuario ya existe.`,
  },
  EMAIL_ALREADY_EXISTS: {
    title: $localize`:@@errors.EMAIL_ALREADY_EXISTS.title:Correo duplicado`,
    message: $localize`:@@errors.EMAIL_ALREADY_EXISTS.message:El correo ya está registrado.`,
  },
  SUPERVISOR_NOT_FOUND: {
    title: $localize`:@@errors.SUPERVISOR_NOT_FOUND.title:Supervisor no encontrado`,
    message: $localize`:@@errors.SUPERVISOR_NOT_FOUND.message:El supervisor indicado no existe.`,
  },
  SUPERVISOR_TENANT_MISMATCH: {
    title: $localize`:@@errors.SUPERVISOR_TENANT_MISMATCH.title:Supervisor inválido`,
    message: $localize`:@@errors.SUPERVISOR_TENANT_MISMATCH.message:El supervisor no pertenece al tenant.`,
  },
  SUPERVISOR_SELF_REFERENCE: {
    title: $localize`:@@errors.SUPERVISOR_SELF_REFERENCE.title:Supervisor inválido`,
    message: $localize`:@@errors.SUPERVISOR_SELF_REFERENCE.message:Un usuario no puede ser su propio supervisor.`,
  },
  CATALOG_NOT_FOUND: {
    title: $localize`:@@errors.CATALOG_NOT_FOUND.title:Catálogo no encontrado`,
    message: $localize`:@@errors.CATALOG_NOT_FOUND.message:El registro de catálogo no existe.`,
  },
  CATALOG_TENANT_MISMATCH: {
    title: $localize`:@@errors.CATALOG_TENANT_MISMATCH.title:Catálogo inválido`,
    message: $localize`:@@errors.CATALOG_TENANT_MISMATCH.message:El catálogo no pertenece al tenant.`,
  },
  BRANCH_COUNTRY_MISMATCH: {
    title: $localize`:@@errors.BRANCH_COUNTRY_MISMATCH.title:Sucursal inválida`,
    message: $localize`:@@errors.BRANCH_COUNTRY_MISMATCH.message:La sucursal no corresponde al país del tenant.`,
  },
  UNAUTHORIZED: {
    title: $localize`:@@errors.UNAUTHORIZED.title:No autorizado`,
    message: $localize`:@@errors.UNAUTHORIZED.message:No tiene permiso para realizar esta acción.`,
    severity: 'warning',
  },
  DOCUMENT_TYPE_DEFAULT_SERVICE_REQUIRED: {
    title: $localize`:@@errors.DOCUMENT_TYPE_DEFAULT_SERVICE_REQUIRED.title:Servicio requerido`,
    message: $localize`:@@errors.DOCUMENT_TYPE_DEFAULT_SERVICE_REQUIRED.message:Debe seleccionar un servicio de procesamiento predeterminado.`,
  },
  DOCUMENT_TYPE_INVALID_DEFAULT_SERVICE: {
    title: $localize`:@@errors.DOCUMENT_TYPE_INVALID_DEFAULT_SERVICE.title:Servicio inválido`,
    message: $localize`:@@errors.DOCUMENT_TYPE_INVALID_DEFAULT_SERVICE.message:El servicio predeterminado debe estar entre los servicios seleccionados.`,
  },
  DOCUMENT_TYPE_EXTENSION_INVALID: {
    title: $localize`:@@errors.DOCUMENT_TYPE_EXTENSION_INVALID.title:Extensión inválida`,
    message: $localize`:@@errors.DOCUMENT_TYPE_EXTENSION_INVALID.message:La extensión de archivo seleccionada no es válida.`,
  },
  DOCUMENT_TYPE_PROCESSING_SERVICE_INVALID: {
    title: $localize`:@@errors.DOCUMENT_TYPE_PROCESSING_SERVICE_INVALID.title:Servicio inválido`,
    message: $localize`:@@errors.DOCUMENT_TYPE_PROCESSING_SERVICE_INVALID.message:El servicio de procesamiento seleccionado no es válido.`,
  },
};
