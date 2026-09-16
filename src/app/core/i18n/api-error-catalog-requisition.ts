import { ApiErrorI18nEntry } from './api-error-catalog';

/** Requisition, position and publication error codes (Phase 2). */
export const API_ERROR_CATALOG_REQUISITION: Record<string, ApiErrorI18nEntry> = {
  POSITION_NOT_FOUND: {
    title: $localize`:@@errors.POSITION_NOT_FOUND.title:Posición no encontrada`,
    message: $localize`:@@errors.POSITION_NOT_FOUND.message:La requisición solicitada no existe.`,
  },
  POSITION_ALREADY_CANCELLED: {
    title: $localize`:@@errors.POSITION_ALREADY_CANCELLED.title:Requisición cancelada`,
    message: $localize`:@@errors.POSITION_ALREADY_CANCELLED.message:La requisición ya está cancelada.`,
  },
  POSITION_RECRUITER_GROUP_REQUIRED: {
    title: $localize`:@@errors.POSITION_RECRUITER_GROUP_REQUIRED.title:Grupo requerido`,
    message: $localize`:@@errors.POSITION_RECRUITER_GROUP_REQUIRED.message:Debe seleccionar un grupo de reclutadores.`,
  },
  POSITION_RECRUITER_GROUP_MANAGER_REQUIRED: {
    title: $localize`:@@errors.POSITION_RECRUITER_GROUP_MANAGER_REQUIRED.title:Grupo sin gerente`,
    message: $localize`:@@errors.POSITION_RECRUITER_GROUP_MANAGER_REQUIRED.message:El grupo de reclutadores seleccionado no tiene gerente responsable.`,
  },
  POSITION_ASSIGNED_USER_REQUIRED: {
    title: $localize`:@@errors.POSITION_ASSIGNED_USER_REQUIRED.title:Reclutador requerido`,
    message: $localize`:@@errors.POSITION_ASSIGNED_USER_REQUIRED.message:Debe indicar el reclutador asignado.`,
  },
  POSITION_CANCELLATION_ALREADY_REQUESTED: {
    title: $localize`:@@errors.POSITION_CANCELLATION_ALREADY_REQUESTED.title:Cancelación solicitada`,
    message: $localize`:@@errors.POSITION_CANCELLATION_ALREADY_REQUESTED.message:La cancelación ya fue solicitada.`,
  },
  POSITION_INVALID_STATUS_FOR_CANCELLATION: {
    title: $localize`:@@errors.POSITION_INVALID_STATUS_FOR_CANCELLATION.title:Estado inválido`,
    message: $localize`:@@errors.POSITION_INVALID_STATUS_FOR_CANCELLATION.message:Solo se puede solicitar cancelación en posiciones en borrador o activas.`,
  },
  POSITION_CANCELLATION_NOT_PENDING: {
    title: $localize`:@@errors.POSITION_CANCELLATION_NOT_PENDING.title:Sin solicitud pendiente`,
    message: $localize`:@@errors.POSITION_CANCELLATION_NOT_PENDING.message:No hay solicitud de cancelación pendiente.`,
  },
  POSITION_CANCELLATION_NOT_AUTHORIZED: {
    title: $localize`:@@errors.POSITION_CANCELLATION_NOT_AUTHORIZED.title:Cancelación no autorizada`,
    message: $localize`:@@errors.POSITION_CANCELLATION_NOT_AUTHORIZED.message:La cancelación no está autorizada.`,
  },
  POSITION_CANCELLATION_REQUEST_FORBIDDEN: {
    title: $localize`:@@errors.POSITION_CANCELLATION_REQUEST_FORBIDDEN.title:Solicitud no permitida`,
    message: $localize`:@@errors.POSITION_CANCELLATION_REQUEST_FORBIDDEN.message:Solo el reclutador asignado o el gerente del grupo pueden solicitar cancelación.`,
  },
  POSITION_CANCELLATION_AUTHORIZE_FORBIDDEN: {
    title: $localize`:@@errors.POSITION_CANCELLATION_AUTHORIZE_FORBIDDEN.title:Autorización denegada`,
    message: $localize`:@@errors.POSITION_CANCELLATION_AUTHORIZE_FORBIDDEN.message:No tiene permiso para autorizar esta cancelación.`,
  },
  POSITION_CANCELLATION_SUPERVISOR_REQUIRED: {
    title: $localize`:@@errors.POSITION_CANCELLATION_SUPERVISOR_REQUIRED.title:Supervisor requerido`,
    message: $localize`:@@errors.POSITION_CANCELLATION_SUPERVISOR_REQUIRED.message:El gerente debe tener supervisor asignado para solicitar cancelación.`,
  },
  POSITION_CANCELLATION_REASON_REQUIRED: {
    title: $localize`:@@errors.POSITION_CANCELLATION_REASON_REQUIRED.title:Motivo requerido`,
    message: $localize`:@@errors.POSITION_CANCELLATION_REASON_REQUIRED.message:El motivo de cancelación es obligatorio.`,
  },
  POSITION_CANCELLATION_TYPE_REASON_REQUIRED: {
    title: $localize`:@@errors.POSITION_CANCELLATION_TYPE_REASON_REQUIRED.title:Datos requeridos`,
    message: $localize`:@@errors.POSITION_CANCELLATION_TYPE_REASON_REQUIRED.message:El tipo y el motivo de cancelación son obligatorios.`,
  },
  POSITION_CANCELLATION_TYPE_INVALID: {
    title: $localize`:@@errors.POSITION_CANCELLATION_TYPE_INVALID.title:Tipo inválido`,
    message: $localize`:@@errors.POSITION_CANCELLATION_TYPE_INVALID.message:El tipo de cancelación no existe o no está activo.`,
  },
  POSITION_CANCELLATION_REASON_INVALID: {
    title: $localize`:@@errors.POSITION_CANCELLATION_REASON_INVALID.title:Motivo inválido`,
    message: $localize`:@@errors.POSITION_CANCELLATION_REASON_INVALID.message:El motivo de cancelación no existe o no está activo.`,
  },
  POSITION_CANCELLATION_REASON_TYPE_MISMATCH: {
    title: $localize`:@@errors.POSITION_CANCELLATION_REASON_TYPE_MISMATCH.title:Motivo incompatible`,
    message: $localize`:@@errors.POSITION_CANCELLATION_REASON_TYPE_MISMATCH.message:El motivo no pertenece al tipo de cancelación seleccionado.`,
  },
  POSITION_CANCELLATION_EVIDENCE_REQUIRED: {
    title: $localize`:@@errors.POSITION_CANCELLATION_EVIDENCE_REQUIRED.title:Evidencia requerida`,
    message: $localize`:@@errors.POSITION_CANCELLATION_EVIDENCE_REQUIRED.message:El archivo de evidencia es obligatorio.`,
  },
  POSITION_CANCELLATION_EVIDENCE_TOO_LARGE: {
    title: $localize`:@@errors.POSITION_CANCELLATION_EVIDENCE_TOO_LARGE.title:Archivo demasiado grande`,
    message: $localize`:@@errors.POSITION_CANCELLATION_EVIDENCE_TOO_LARGE.message:El archivo de evidencia supera el máximo de 10 MB.`,
  },
  POSITION_CANCELLATION_EVIDENCE_TYPE_NOT_ALLOWED: {
    title: $localize`:@@errors.POSITION_CANCELLATION_EVIDENCE_TYPE_NOT_ALLOWED.title:Tipo no permitido`,
    message: $localize`:@@errors.POSITION_CANCELLATION_EVIDENCE_TYPE_NOT_ALLOWED.message:Tipo de archivo no permitido. Use PDF, JPG, PNG, DOC, DOCX, XLS o XLSX.`,
  },
  POSITION_CANCELLATION_EVIDENCE_READ_FAILED: {
    title: $localize`:@@errors.POSITION_CANCELLATION_EVIDENCE_READ_FAILED.title:Error de lectura`,
    message: $localize`:@@errors.POSITION_CANCELLATION_EVIDENCE_READ_FAILED.message:No se pudo leer el archivo de evidencia.`,
  },
  WRONG_TENANT: {
    title: $localize`:@@errors.WRONG_TENANT.title:Acceso denegado`,
    message: $localize`:@@errors.WRONG_TENANT.message:No puede acceder a esta compañía.`,
  },
  ACCESS_DENIED: {
    title: $localize`:@@errors.ACCESS_DENIED.title:Acceso denegado`,
    message: $localize`:@@errors.ACCESS_DENIED.message:No tiene permiso para realizar esta acción.`,
  },
  VALIDATION_ERROR: {
    title: $localize`:@@errors.VALIDATION_ERROR.title:Error de validación`,
    message: $localize`:@@errors.VALIDATION_ERROR.message:Revise los campos marcados e intente de nuevo.`,
    severity: 'warning',
  },
  PORTAL_DOCUMENT_TOO_LARGE: {
    title: $localize`:@@errors.PORTAL_DOCUMENT_TOO_LARGE.title:Archivo demasiado grande`,
    message: $localize`:@@errors.PORTAL_DOCUMENT_TOO_LARGE.message:El archivo supera el tamaño máximo permitido.`,
  },
  REQUISITION_FORM_FIELD_NOT_FOUND: {
    title: $localize`:@@errors.REQUISITION_FORM_FIELD_NOT_FOUND.title:Campo no encontrado`,
    message: $localize`:@@errors.REQUISITION_FORM_FIELD_NOT_FOUND.message:Definición de campo no encontrada.`,
  },
  REQUISITION_FORM_FIELD_KEY_EXISTS: {
    title: $localize`:@@errors.REQUISITION_FORM_FIELD_KEY_EXISTS.title:Clave duplicada`,
    message: $localize`:@@errors.REQUISITION_FORM_FIELD_KEY_EXISTS.message:La clave de campo ya existe para el tenant.`,
  },
  REQUISITION_FORM_INVALID_DATA_SOURCE: {
    title: $localize`:@@errors.REQUISITION_FORM_INVALID_DATA_SOURCE.title:Fuente inválida`,
    message: $localize`:@@errors.REQUISITION_FORM_INVALID_DATA_SOURCE.message:Fuente de datos no permitida.`,
  },
  REQUISITION_FORM_BUILTIN_LOCKED: {
    title: $localize`:@@errors.REQUISITION_FORM_BUILTIN_LOCKED.title:Campo built-in`,
    message: $localize`:@@errors.REQUISITION_FORM_BUILTIN_LOCKED.message:Campo built-in: solo se permiten etiquetas y validadores.`,
  },
  REQUISITION_FORM_BUILTIN_DELETE: {
    title: $localize`:@@errors.REQUISITION_FORM_BUILTIN_DELETE.title:Eliminación no permitida`,
    message: $localize`:@@errors.REQUISITION_FORM_BUILTIN_DELETE.message:No se puede eliminar un campo built-in.`,
  },
  REQUISITION_FORM_CONFIG_NOT_FOUND: {
    title: $localize`:@@errors.REQUISITION_FORM_CONFIG_NOT_FOUND.title:Configuración no encontrada`,
    message: $localize`:@@errors.REQUISITION_FORM_CONFIG_NOT_FOUND.message:Configuración de formulario no encontrada.`,
  },
  REQUISITION_FORM_CONFIG_NOT_PUBLISHED: {
    title: $localize`:@@errors.REQUISITION_FORM_CONFIG_NOT_PUBLISHED.title:Sin configuración publicada`,
    message: $localize`:@@errors.REQUISITION_FORM_CONFIG_NOT_PUBLISHED.message:No hay configuración publicada para el alcance solicitado.`,
  },
  REQUISITION_FORM_CONFIG_NOT_DRAFT: {
    title: $localize`:@@errors.REQUISITION_FORM_CONFIG_NOT_DRAFT.title:Solo borrador editable`,
    message: $localize`:@@errors.REQUISITION_FORM_CONFIG_NOT_DRAFT.message:Solo se pueden editar configuraciones en borrador.`,
  },
  REQUISITION_FORM_CONFIG_PUBLISHED_DELETE: {
    title: $localize`:@@errors.REQUISITION_FORM_CONFIG_PUBLISHED_DELETE.title:Eliminación no permitida`,
    message: $localize`:@@errors.REQUISITION_FORM_CONFIG_PUBLISHED_DELETE.message:Solo se pueden eliminar configuraciones en borrador.`,
  },
  REQUISITION_FORM_CONFIG_CLONE_INVALID: {
    title: $localize`:@@errors.REQUISITION_FORM_CONFIG_CLONE_INVALID.title:Clonación no permitida`,
    message: $localize`:@@errors.REQUISITION_FORM_CONFIG_CLONE_INVALID.message:Solo se pueden clonar configuraciones publicadas o deprecadas.`,
  },
  REQUISITION_FORM_PUBLISH_INVALID: {
    title: $localize`:@@errors.REQUISITION_FORM_PUBLISH_INVALID.title:Publicación inválida`,
    message: $localize`:@@errors.REQUISITION_FORM_PUBLISH_INVALID.message:Validación de publicación fallida: {0}.`,
  },
  REQUISITION_FORM_WRONG_TENANT: {
    title: $localize`:@@errors.REQUISITION_FORM_WRONG_TENANT.title:Tenant inválido`,
    message: $localize`:@@errors.REQUISITION_FORM_WRONG_TENANT.message:Tenant inválido.`,
  },
  REQUISITION_FORM_REQUIRED_FIELD_MISSING: {
    title: $localize`:@@errors.REQUISITION_FORM_REQUIRED_FIELD_MISSING.title:Campo obligatorio`,
    message: $localize`:@@errors.REQUISITION_FORM_REQUIRED_FIELD_MISSING.message:Campo obligatorio faltante: {0}.`,
  },
  REQUISITION_FORM_READ_ONLY_FIELD_CHANGED: {
    title: $localize`:@@errors.REQUISITION_FORM_READ_ONLY_FIELD_CHANGED.title:Campo de solo lectura`,
    message: $localize`:@@errors.REQUISITION_FORM_READ_ONLY_FIELD_CHANGED.message:Campo de solo lectura no puede modificarse: {0}.`,
  },
  PUBLICATION_POSITION_NOT_FOUND: {
    title: $localize`:@@errors.PUBLICATION_POSITION_NOT_FOUND.title:Posición no encontrada`,
    message: $localize`:@@errors.PUBLICATION_POSITION_NOT_FOUND.message:Posición no encontrada.`,
  },
  PUBLICATION_POSITION_NOT_PUBLISHED: {
    title: $localize`:@@errors.PUBLICATION_POSITION_NOT_PUBLISHED.title:Posición no publicada`,
    message: $localize`:@@errors.PUBLICATION_POSITION_NOT_PUBLISHED.message:La posición debe estar publicada para generar el anuncio.`,
  },
  PUBLICATION_POSITION_NOT_ACTIVE: {
    title: $localize`:@@errors.PUBLICATION_POSITION_NOT_ACTIVE.title:Posición no publicada`,
    message: $localize`:@@errors.PUBLICATION_POSITION_NOT_ACTIVE.message:La posición debe estar publicada para generar el anuncio.`,
  },
  PUBLICATION_INVALID_FORMAT: {
    title: $localize`:@@errors.PUBLICATION_INVALID_FORMAT.title:Formato inválido`,
    message: $localize`:@@errors.PUBLICATION_INVALID_FORMAT.message:Formato de publicación inválido; use JPG o PDF.`,
  },
  PUBLICATION_BROWSERLESS_ERROR: {
    title: $localize`:@@errors.PUBLICATION_BROWSERLESS_ERROR.title:Error de generación`,
    message: $localize`:@@errors.PUBLICATION_BROWSERLESS_ERROR.message:No se pudo generar el archivo de publicación en este momento.`,
  },
  PUBLICATION_WHATSAPP_INVALID_PHONE: {
    title: $localize`:@@errors.PUBLICATION_WHATSAPP_INVALID_PHONE.title:Número inválido`,
    message: $localize`:@@errors.PUBLICATION_WHATSAPP_INVALID_PHONE.message:Número de WhatsApp inválido; use prefijo de país sin + y solo dígitos.`,
  },
  PUBLICATION_MEDIA_URL_UNREACHABLE: {
    title: $localize`:@@errors.PUBLICATION_MEDIA_URL_UNREACHABLE.title:URL no alcanzable`,
    message: $localize`:@@errors.PUBLICATION_MEDIA_URL_UNREACHABLE.message:No hay una URL HTTP alcanzable para la imagen; configure storage S3 (no local).`,
  },
  PUBLICATION_MAIL_NOT_CONFIGURED: {
    title: $localize`:@@errors.PUBLICATION_MAIL_NOT_CONFIGURED.title:Correo no configurado`,
    message: $localize`:@@errors.PUBLICATION_MAIL_NOT_CONFIGURED.message:El envío por correo no está configurado o está deshabilitado.`,
  },
  PUBLICATION_MAIL_SEND_ERROR: {
    title: $localize`:@@errors.PUBLICATION_MAIL_SEND_ERROR.title:Error de envío`,
    message: $localize`:@@errors.PUBLICATION_MAIL_SEND_ERROR.message:No se pudo enviar la publicación por correo en este momento.`,
  },
};
