import { ApiErrorI18nEntry } from './api-error-catalog';

/** Company integrations (Email / WhatsApp / document processing). */
export const API_ERROR_CATALOG_INTEGRATION: Record<string, ApiErrorI18nEntry> = {
  COMPANY_INTEGRATION_DOC_TOKEN_REQUIRED: {
    title: $localize`:@@errors.COMPANY_INTEGRATION_DOC_TOKEN_REQUIRED.title:Token requerido`,
    message: $localize`:@@errors.COMPANY_INTEGRATION_DOC_TOKEN_REQUIRED.message:Servicio de documentos habilitado: la clave API (token) es obligatoria.`,
  },
  COMPANY_INTEGRATION_DOC_SERVICE_NOT_FOUND: {
    title: $localize`:@@errors.COMPANY_INTEGRATION_DOC_SERVICE_NOT_FOUND.title:Servicio no encontrado`,
    message: $localize`:@@errors.COMPANY_INTEGRATION_DOC_SERVICE_NOT_FOUND.message:El servicio de procesamiento de documentos no existe.`,
  },
  COMPANY_INTEGRATION_DOC_SERVICE_NOT_GLOBAL: {
    title: $localize`:@@errors.COMPANY_INTEGRATION_DOC_SERVICE_NOT_GLOBAL.title:Servicio no válido`,
    message: $localize`:@@errors.COMPANY_INTEGRATION_DOC_SERVICE_NOT_GLOBAL.message:Solo se pueden habilitar servicios globales del catálogo.`,
  },
  COMPANY_INTEGRATION_EMAIL_INCOMPLETE: {
    title: $localize`:@@errors.COMPANY_INTEGRATION_EMAIL_INCOMPLETE.title:Correo incompleto`,
    message: $localize`:@@errors.COMPANY_INTEGRATION_EMAIL_INCOMPLETE.message:Canal de correo habilitado: completa remitente, servidor, puerto, usuario y contraseña.`,
  },
  COMPANY_INTEGRATION_WHATSAPP_INCOMPLETE: {
    title: $localize`:@@errors.COMPANY_INTEGRATION_WHATSAPP_INCOMPLETE.title:WhatsApp incompleto`,
    message: $localize`:@@errors.COMPANY_INTEGRATION_WHATSAPP_INCOMPLETE.message:Canal WhatsApp habilitado: completa URL base, token Bearer, ID de instancia y token de instancia.`,
  },
};
