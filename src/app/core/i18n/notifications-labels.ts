export const NOTIFICATIONS_PAGE_TITLE = $localize`:@@notifications.pageTitle:Notificaciones`;
export const NOTIFICATIONS_NEW_BUTTON = $localize`:@@notifications.newButton:Nueva plantilla`;
export const NOTIFICATIONS_EDIT_TITLE = $localize`:@@notifications.editTitle:Editar plantilla`;
export const NOTIFICATIONS_NEW_TITLE = $localize`:@@notifications.newTitle:Nueva plantilla`;
export const NOTIFICATIONS_FIELD_SYSTEM_ACTION = $localize`:@@notifications.field.systemAction:Acción del sistema`;
export const NOTIFICATIONS_FIELD_CHANNELS = $localize`:@@notifications.field.channels:Canales`;
export const NOTIFICATIONS_FIELD_EXTERNAL_TEMPLATE_ID = $localize`:@@notifications.field.externalTemplateId:ID plantilla externa`;
export const NOTIFICATIONS_FIELD_MESSAGE = $localize`:@@notifications.field.message:Mensaje`;
export const NOTIFICATIONS_FIELD_ACTIVE = $localize`:@@notifications.field.active:Activa`;
export const NOTIFICATIONS_PLACEHOLDER_ACTION = $localize`:@@notifications.placeholder.action:ASIGNACION, CANCELACION, POSTULADO...`;
export const NOTIFICATIONS_PLACEHOLDER_TEMPLATE_ID = $localize`:@@notifications.placeholder.templateId:WhatsApp / SendGrid template ID`;
export const NOTIFICATIONS_CHANNEL_EMAIL = $localize`:@@notifications.channel.email:Correo`;
export const NOTIFICATIONS_CHANNEL_WHATSAPP = $localize`:@@notifications.channel.whatsapp:WhatsApp`;
export const NOTIFICATIONS_CHANNEL_EMAIL_VALUE = 'Correo';
export const NOTIFICATIONS_CHANNEL_WHATSAPP_VALUE = 'WhatsApp';

export const NOTIFICATION_CHANNEL_OPTIONS = [
  { value: NOTIFICATIONS_CHANNEL_EMAIL_VALUE, label: NOTIFICATIONS_CHANNEL_EMAIL },
  { value: NOTIFICATIONS_CHANNEL_WHATSAPP_VALUE, label: NOTIFICATIONS_CHANNEL_WHATSAPP },
] as const;

export function notificationChannelLabel(value: string): string {
  if (value === NOTIFICATIONS_CHANNEL_EMAIL_VALUE) {
    return NOTIFICATIONS_CHANNEL_EMAIL;
  }
  if (value === NOTIFICATIONS_CHANNEL_WHATSAPP_VALUE) {
    return NOTIFICATIONS_CHANNEL_WHATSAPP;
  }
  return value;
}

export const NOTIFICATIONS_COLUMN_ACTION = $localize`:@@notifications.column.action:Acción`;
export const NOTIFICATIONS_COLUMN_CHANNELS = $localize`:@@notifications.column.channels:Canales`;
export const NOTIFICATIONS_COLUMN_TEMPLATE = $localize`:@@notifications.column.template:Plantilla`;
export const NOTIFICATIONS_COLUMN_MESSAGE = $localize`:@@notifications.column.message:Mensaje`;
export const NOTIFICATIONS_COLUMN_ACTIVE = $localize`:@@notifications.column.active:Activo`;
export const NOTIFICATIONS_CANCEL = $localize`:@@common.cancel:Cancelar`;
export const NOTIFICATIONS_SAVING = $localize`:@@catalogs.common.saving:Guardando...`;
export const NOTIFICATIONS_SAVE = $localize`:@@catalogs.common.save:Guardar`;
export const NOTIFICATIONS_SNACK_CLOSE = $localize`:@@common.close:Cerrar`;

export const NOTIFICATIONS_LOAD_ERROR = $localize`:@@notifications.errors.load:No se pudieron cargar las plantillas de notificación`;
export const NOTIFICATIONS_CHANNELS_REQUIRED = $localize`:@@notifications.errors.channelsRequired:Selecciona al menos un canal`;
export const NOTIFICATIONS_SAVE_SUCCESS = $localize`:@@notifications.success.saved:Plantilla guardada`;
export const NOTIFICATIONS_SAVE_ERROR = $localize`:@@notifications.errors.save:No se pudo guardar la plantilla`;
export const NOTIFICATIONS_UPDATE_ERROR = $localize`:@@notifications.errors.update:No se pudo actualizar la plantilla`;
export const NOTIFICATIONS_DELETE_SUCCESS = $localize`:@@notifications.success.deleted:Plantilla eliminada`;
export const NOTIFICATIONS_DELETE_ERROR = $localize`:@@notifications.errors.delete:No se pudo eliminar la plantilla`;

export function notificationsToggleMessage(action: string, active: boolean): string {
  const state = active
    ? $localize`:@@notifications.state.active:activada`
    : $localize`:@@notifications.state.inactive:desactivada`;
  return $localize`:@@notifications.success.toggled:Notificación ${action}:action: ${state}:state:`;
}

export function notificationsDeleteConfirm(action: string): string {
  return $localize`:@@notifications.confirm.delete:¿Eliminar la plantilla "${action}:action:"? Esta acción no se puede deshacer.`;
}
