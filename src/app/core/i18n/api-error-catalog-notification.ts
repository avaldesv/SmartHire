import { ApiErrorI18nEntry } from './api-error-catalog';

/** Notification module error codes (Phase 3). */
export const API_ERROR_CATALOG_NOTIFICATION: Record<string, ApiErrorI18nEntry> = {
  NOTIFICATION_TEMPLATE_NOT_FOUND: {
    title: $localize`:@@errors.NOTIFICATION_TEMPLATE_NOT_FOUND.title:Plantilla no encontrada`,
    message: $localize`:@@errors.NOTIFICATION_TEMPLATE_NOT_FOUND.message:Plantilla de notificación no encontrada`,
  },
  NOTIFICATION_TEMPLATE_CHANNELS_REQUIRED: {
    title: $localize`:@@errors.NOTIFICATION_TEMPLATE_CHANNELS_REQUIRED.title:Canales requeridos`,
    message: $localize`:@@errors.NOTIFICATION_TEMPLATE_CHANNELS_REQUIRED.message:Debe seleccionar al menos un canal`,
  },
  NOTIFICATION_TEMPLATE_CHANNEL_EXISTS: {
    title: $localize`:@@errors.NOTIFICATION_TEMPLATE_CHANNEL_EXISTS.title:Canal en conflicto`,
    message: $localize`:@@errors.NOTIFICATION_TEMPLATE_CHANNEL_EXISTS.message:Ya existe una plantilla para la acción {0} en el canal: {1}`,
  },
  NOTIFICATION_OUTBOX_INVALID_STATUS: {
    title: $localize`:@@errors.NOTIFICATION_OUTBOX_INVALID_STATUS.title:Estado inválido`,
    message: $localize`:@@errors.NOTIFICATION_OUTBOX_INVALID_STATUS.message:Estado de outbox no válido`,
  },
  NOTIFICATION_OUTBOX_NOT_FOUND: {
    title: $localize`:@@errors.NOTIFICATION_OUTBOX_NOT_FOUND.title:Outbox no encontrado`,
    message: $localize`:@@errors.NOTIFICATION_OUTBOX_NOT_FOUND.message:Registro de outbox no encontrado`,
  },
  NOTIFICATION_OUTBOX_NOT_FAILED: {
    title: $localize`:@@errors.NOTIFICATION_OUTBOX_NOT_FAILED.title:Reintento no permitido`,
    message: $localize`:@@errors.NOTIFICATION_OUTBOX_NOT_FAILED.message:Solo se puede reintentar un envío en estado FAILED`,
  },
  NOTIFICATION_ACTION_NOT_FOUND: {
    title: $localize`:@@errors.NOTIFICATION_ACTION_NOT_FOUND.title:Acción no encontrada`,
    message: $localize`:@@errors.NOTIFICATION_ACTION_NOT_FOUND.message:Acción de notificación no encontrada`,
  },
  NOTIFICATION_INBOX_OWNER_REQUIRED: {
    title: $localize`:@@errors.NOTIFICATION_INBOX_OWNER_REQUIRED.title:Sesión requerida`,
    message: $localize`:@@errors.NOTIFICATION_INBOX_OWNER_REQUIRED.message:Se requiere usuario autenticado`,
  },
  USER_NOTIFICATION_NOT_FOUND: {
    title: $localize`:@@errors.USER_NOTIFICATION_NOT_FOUND.title:Notificación no encontrada`,
    message: $localize`:@@errors.USER_NOTIFICATION_NOT_FOUND.message:Notificación no encontrada`,
  },
  USER_NOTIFICATION_ACCESS_DENIED: {
    title: $localize`:@@errors.USER_NOTIFICATION_ACCESS_DENIED.title:Acceso denegado`,
    message: $localize`:@@errors.USER_NOTIFICATION_ACCESS_DENIED.message:No tiene permiso para acceder a esta notificación`,
  },
};
