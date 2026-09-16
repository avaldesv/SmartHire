import { ApiErrorI18nEntry } from './api-error-catalog';

/** Security and recruiter-group error codes (Phase 3). */
export const API_ERROR_CATALOG_SECURITY: Record<string, ApiErrorI18nEntry> = {
  RECRUITER_GROUP_NOT_FOUND: {
    title: $localize`:@@errors.RECRUITER_GROUP_NOT_FOUND.title:Grupo no encontrado`,
    message: $localize`:@@errors.RECRUITER_GROUP_NOT_FOUND.message:Grupo reclutador no encontrado`,
  },
  RECRUITER_GROUP_MANAGER_REQUIRED: {
    title: $localize`:@@errors.RECRUITER_GROUP_MANAGER_REQUIRED.title:Gerente requerido`,
    message: $localize`:@@errors.RECRUITER_GROUP_MANAGER_REQUIRED.message:El gerente responsable es obligatorio`,
  },
  RECRUITER_GROUP_MANAGER_NOT_FOUND: {
    title: $localize`:@@errors.RECRUITER_GROUP_MANAGER_NOT_FOUND.title:Gerente no encontrado`,
    message: $localize`:@@errors.RECRUITER_GROUP_MANAGER_NOT_FOUND.message:No se encontró el usuario gerente responsable`,
  },
  RECRUITER_GROUP_MANAGER_INACTIVE: {
    title: $localize`:@@errors.RECRUITER_GROUP_MANAGER_INACTIVE.title:Gerente inactivo`,
    message: $localize`:@@errors.RECRUITER_GROUP_MANAGER_INACTIVE.message:El gerente responsable debe ser un usuario activo`,
  },
  RECRUITER_GROUP_MANAGER_TENANT_MISMATCH: {
    title: $localize`:@@errors.RECRUITER_GROUP_MANAGER_TENANT_MISMATCH.title:Gerente inválido`,
    message: $localize`:@@errors.RECRUITER_GROUP_MANAGER_TENANT_MISMATCH.message:El gerente responsable debe pertenecer al tenant actual`,
  },
  RECRUITER_GROUP_RECRUITER_NOT_FOUND: {
    title: $localize`:@@errors.RECRUITER_GROUP_RECRUITER_NOT_FOUND.title:Reclutador no encontrado`,
    message: $localize`:@@errors.RECRUITER_GROUP_RECRUITER_NOT_FOUND.message:No se encontró reclutador para el correo {0}`,
  },
  RECRUITER_GROUP_RECRUITER_INACTIVE: {
    title: $localize`:@@errors.RECRUITER_GROUP_RECRUITER_INACTIVE.title:Reclutador inactivo`,
    message: $localize`:@@errors.RECRUITER_GROUP_RECRUITER_INACTIVE.message:El reclutador debe ser un usuario activo: {0}`,
  },
  RECRUITER_GROUP_RECRUITER_TENANT_MISMATCH: {
    title: $localize`:@@errors.RECRUITER_GROUP_RECRUITER_TENANT_MISMATCH.title:Reclutador inválido`,
    message: $localize`:@@errors.RECRUITER_GROUP_RECRUITER_TENANT_MISMATCH.message:El reclutador debe pertenecer al tenant actual: {0}`,
  },
  RECRUITER_GROUP_MANAGER_IS_RECRUITER: {
    title: $localize`:@@errors.RECRUITER_GROUP_MANAGER_IS_RECRUITER.title:Gerente inválido`,
    message: $localize`:@@errors.RECRUITER_GROUP_MANAGER_IS_RECRUITER.message:El gerente responsable no puede ser reclutador del mismo grupo`,
  },
  RECRUITER_GROUP_DUPLICATE_RECRUITER: {
    title: $localize`:@@errors.RECRUITER_GROUP_DUPLICATE_RECRUITER.title:Reclutador duplicado`,
    message: $localize`:@@errors.RECRUITER_GROUP_DUPLICATE_RECRUITER.message:No se permiten reclutadores duplicados en el mismo grupo`,
  },
  RECRUITER_GROUP_IMPORT_MANAGER_EMAIL_REQUIRED: {
    title: $localize`:@@errors.RECRUITER_GROUP_IMPORT_MANAGER_EMAIL_REQUIRED.title:Correo requerido`,
    message: $localize`:@@errors.RECRUITER_GROUP_IMPORT_MANAGER_EMAIL_REQUIRED.message:El correo del gerente es obligatorio en la fila CSV`,
  },
  RECRUITER_GROUP_IMPORT_MANAGER_EMAIL_NOT_FOUND: {
    title: $localize`:@@errors.RECRUITER_GROUP_IMPORT_MANAGER_EMAIL_NOT_FOUND.title:Gerente no encontrado`,
    message: $localize`:@@errors.RECRUITER_GROUP_IMPORT_MANAGER_EMAIL_NOT_FOUND.message:No se encontró usuario activo del tenant para el correo del gerente: {0}`,
  },
  ERROR_USER_USERNAME_ALREADY_EXISTS: {
    title: $localize`:@@errors.ERROR_USER_USERNAME_ALREADY_EXISTS.title:Usuario duplicado`,
    message: $localize`:@@errors.ERROR_USER_USERNAME_ALREADY_EXISTS.message:El nombre de usuario ya está registrado en el sistema`,
  },
  ROLE_NOT_FOUND: {
    title: $localize`:@@errors.ROLE_NOT_FOUND.title:Rol no encontrado`,
    message: $localize`:@@errors.ROLE_NOT_FOUND.message:Rol no encontrado`,
  },
  ERROR_ROLE_NOT_FOUND: {
    title: $localize`:@@errors.ERROR_ROLE_NOT_FOUND.title:Rol no encontrado`,
    message: $localize`:@@errors.ERROR_ROLE_NOT_FOUND.message:Rol no encontrado`,
  },
  ERROR_ROLE_TENANT_MISMATCH: {
    title: $localize`:@@errors.ERROR_ROLE_TENANT_MISMATCH.title:Rol inválido`,
    message: $localize`:@@errors.ERROR_ROLE_TENANT_MISMATCH.message:El rol no pertenece a la compañía del usuario`,
  },
  ERROR_INVALID_GLOBAL_ADMIN_ROLES: {
    title: $localize`:@@errors.ERROR_INVALID_GLOBAL_ADMIN_ROLES.title:Roles inválidos`,
    message: $localize`:@@errors.ERROR_INVALID_GLOBAL_ADMIN_ROLES.message:Usuario global admin debe tener únicamente el rol GLOBAL_ADMIN`,
  },
  ERROR_GLOBAL_ADMIN_ROLE_NOT_ALLOWED: {
    title: $localize`:@@errors.ERROR_GLOBAL_ADMIN_ROLE_NOT_ALLOWED.title:Rol no permitido`,
    message: $localize`:@@errors.ERROR_GLOBAL_ADMIN_ROLE_NOT_ALLOWED.message:Usuarios tenant no pueden tener el rol GLOBAL_ADMIN`,
  },
  ERROR_GLOBAL_ADMIN_FORBIDDEN: {
    title: $localize`:@@errors.ERROR_GLOBAL_ADMIN_FORBIDDEN.title:Operación no permitida`,
    message: $localize`:@@errors.ERROR_GLOBAL_ADMIN_FORBIDDEN.message:Solo un administrador global puede crear usuarios global admin`,
  },
  ROLE_DELETE_FORBIDDEN: {
    title: $localize`:@@errors.ROLE_DELETE_FORBIDDEN.title:Eliminación no permitida`,
    message: $localize`:@@errors.ROLE_DELETE_FORBIDDEN.message:El rol GLOBAL_ADMIN no puede eliminarse`,
  },
  USER_CONTEXT_REQUIRED: {
    title: $localize`:@@errors.USER_CONTEXT_REQUIRED.title:Sesión requerida`,
    message: $localize`:@@errors.USER_CONTEXT_REQUIRED.message:Usuario autenticado requerido`,
  },
  COMPANY_COUNTRY_NOT_CONFIGURED: {
    title: $localize`:@@errors.COMPANY_COUNTRY_NOT_CONFIGURED.title:País no configurado`,
    message: $localize`:@@errors.COMPANY_COUNTRY_NOT_CONFIGURED.message:La empresa no tiene país configurado`,
  },
  INVALID_PHONE_COUNTRY_CODE: {
    title: $localize`:@@errors.INVALID_PHONE_COUNTRY_CODE.title:Código telefónico inválido`,
    message: $localize`:@@errors.INVALID_PHONE_COUNTRY_CODE.message:El código telefónico debe iniciar con + y contener de 1 a 4 dígitos`,
  },
  USER_HEADER_TENANT_MISMATCH: {
    title: $localize`:@@errors.USER_HEADER_TENANT_MISMATCH.title:Tenant incorrecto`,
    message: $localize`:@@errors.USER_HEADER_TENANT_MISMATCH.message:Cambie la empresa activa en el header para editar este usuario`,
  },
  FUNCTIONALITY_NOT_FOUND: {
    title: $localize`:@@errors.FUNCTIONALITY_NOT_FOUND.title:Funcionalidad no encontrada`,
    message: $localize`:@@errors.FUNCTIONALITY_NOT_FOUND.message:No encontrado`,
  },
};
