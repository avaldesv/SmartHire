import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface ApiErrorBody {
  errorCode?: string;
  code?: string;
  params?: unknown[];
}

const ERROR_MESSAGES: Record<string, string> = {
  ERROR_USER_NOT_FOUND: $localize`:@@errors.ERROR_USER_NOT_FOUND:Usuario no encontrado`,
  ERROR_COUNTRY_NOT_FOUND: $localize`:@@errors.ERROR_COUNTRY_NOT_FOUND:País no encontrado`,
  ERROR_WRONG_TENANT: $localize`:@@errors.ERROR_WRONG_TENANT:No puede acceder a esta compañía`,
  ERROR_WRONG_TENANT_ACCESS: $localize`:@@errors.ERROR_WRONG_TENANT_ACCESS:No tiene permiso para acceder a este tenant`,
  COMPANY_NOT_FOUND: $localize`:@@errors.COMPANY_NOT_FOUND:Compañía no encontrada`,
  PORTAL_LANGUAGE_NOT_FOUND: $localize`:@@errors.PORTAL_LANGUAGE_NOT_FOUND:Idioma no encontrado`,
  USER_NOT_AUTHENTICATED: $localize`:@@errors.USER_NOT_AUTHENTICATED:Debe iniciar sesión`,
  USERNAME_ALREADY_EXISTS: $localize`:@@errors.USERNAME_ALREADY_EXISTS:El nombre de usuario ya existe`,
  EMAIL_ALREADY_EXISTS: $localize`:@@errors.EMAIL_ALREADY_EXISTS:El correo ya está registrado`,
  SUPERVISOR_NOT_FOUND: $localize`:@@errors.SUPERVISOR_NOT_FOUND:Supervisor no encontrado`,
  SUPERVISOR_TENANT_MISMATCH: $localize`:@@errors.SUPERVISOR_TENANT_MISMATCH:El supervisor no pertenece al tenant`,
  SUPERVISOR_SELF_REFERENCE: $localize`:@@errors.SUPERVISOR_SELF_REFERENCE:Un usuario no puede ser su propio supervisor`,
  CATALOG_NOT_FOUND: $localize`:@@errors.CATALOG_NOT_FOUND:Catálogo no encontrado`,
  CATALOG_TENANT_MISMATCH: $localize`:@@errors.CATALOG_TENANT_MISMATCH:El catálogo no pertenece al tenant`,
  BRANCH_COUNTRY_MISMATCH: $localize`:@@errors.BRANCH_COUNTRY_MISMATCH:La sucursal no corresponde al país del tenant`,
  UNAUTHORIZED: $localize`:@@errors.UNAUTHORIZED:No autorizado`,
};

const GENERIC_ERROR = $localize`:@@errors.generic:Ocurrió un error. Intente de nuevo.`;

@Injectable({ providedIn: 'root' })
export class ApiErrorTranslationService {
  translate(error: unknown): string {
    const body = this.extractBody(error);
    const code = body?.errorCode ?? body?.code;
    if (code && ERROR_MESSAGES[code]) {
      return ERROR_MESSAGES[code];
    }
    return GENERIC_ERROR;
  }

  private extractBody(error: unknown): ApiErrorBody | null {
    if (error instanceof HttpErrorResponse) {
      const payload = error.error;
      if (payload && typeof payload === 'object') {
        return payload as ApiErrorBody;
      }
    }
    return null;
  }
}
