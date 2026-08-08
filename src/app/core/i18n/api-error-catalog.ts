import { FeedbackType } from '../feedback/feedback.types';
import { API_ERROR_CATALOG_CATALOG } from './api-error-catalog-catalog';
import { API_ERROR_CATALOG_NOTIFICATION } from './api-error-catalog-notification';
import { API_ERROR_CATALOG_QUESTIONNAIRE } from './api-error-catalog-questionnaire';
import { API_ERROR_CATALOG_REQUISITION } from './api-error-catalog-requisition';
import { API_ERROR_CATALOG_SECURITY } from './api-error-catalog-security';

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
  UNAUTHORIZED: {
    title: $localize`:@@errors.UNAUTHORIZED.title:No autorizado`,
    message: $localize`:@@errors.UNAUTHORIZED.message:No tiene permiso para realizar esta acción.`,
    severity: 'warning',
  },
  ...API_ERROR_CATALOG_SECURITY,
  ...API_ERROR_CATALOG_CATALOG,
  ...API_ERROR_CATALOG_NOTIFICATION,
  ...API_ERROR_CATALOG_QUESTIONNAIRE,
  ...API_ERROR_CATALOG_REQUISITION,
};
