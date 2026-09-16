/** i18n labels for interview calendar config modal. */

export const INTERVIEW_CAL_MENU = $localize`:@@shell.interviewCalendar:Configuración de calendario`;
export const INTERVIEW_CAL_TITLE = $localize`:@@interviewCalendar.title:Configuración de calendario`;
export const INTERVIEW_CAL_TAB_VIDEO = $localize`:@@interviewCalendar.tab.video:Entrevista por videoconferencia`;
export const INTERVIEW_CAL_TAB_IN_PERSON = $localize`:@@interviewCalendar.tab.inPerson:Entrevista presencial`;
export const INTERVIEW_CAL_DURATION = $localize`:@@interviewCalendar.field.duration:Tiempo de duración`;
export const INTERVIEW_CAL_MAX_DAYS = $localize`:@@interviewCalendar.field.maxWorkingDays:Días laborales máximos`;
export const INTERVIEW_CAL_WORK_HOURS = $localize`:@@interviewCalendar.field.workHours:Horario laboral`;
export const INTERVIEW_CAL_START = $localize`:@@interviewCalendar.field.startTime:Hora inicio`;
export const INTERVIEW_CAL_END = $localize`:@@interviewCalendar.field.endTime:Hora término`;
export const INTERVIEW_CAL_REMINDER = $localize`:@@interviewCalendar.field.reminder:Recordatorio de cita`;
export const INTERVIEW_CAL_REMINDER_15 = $localize`:@@interviewCalendar.reminder.15min:15 minutos antes`;
export const INTERVIEW_CAL_REMINDER_1H = $localize`:@@interviewCalendar.reminder.1hour:1 hora antes`;
export const INTERVIEW_CAL_EXCLUDE_HOLIDAYS = $localize`:@@interviewCalendar.field.excludeNonWorking:Descuenta días inhábiles`;
export const INTERVIEW_CAL_YES = $localize`:@@common.yes:Sí`;
export const INTERVIEW_CAL_NO = $localize`:@@common.no:No`;
export const INTERVIEW_CAL_GRID = $localize`:@@interviewCalendar.availability:Calendario de disponibilidad`;
export const INTERVIEW_CAL_ADDRESS = $localize`:@@interviewCalendar.field.address:Dirección`;
export const INTERVIEW_CAL_INSTRUCTIONS = $localize`:@@interviewCalendar.field.instructions:Instrucciones`;
export const INTERVIEW_CAL_REFERENCES = $localize`:@@interviewCalendar.field.references:Referencias`;
export const INTERVIEW_CAL_MAP = $localize`:@@interviewCalendar.field.map:Mapa`;
export const INTERVIEW_CAL_ADDRESS_PLACEHOLDER = $localize`:@@interviewCalendar.placeholder.address:Ingresa la dirección del lugar`;
export const INTERVIEW_CAL_INSTRUCTIONS_PLACEHOLDER = $localize`:@@interviewCalendar.placeholder.instructions:Ingresa instrucciones adicionales`;
export const INTERVIEW_CAL_REFERENCES_PLACEHOLDER = $localize`:@@interviewCalendar.placeholder.references:Ingresa referencias para llegar al lugar`;
export const INTERVIEW_CAL_CLOSE = $localize`:@@interviewCalendar.close:Cerrar`;
export const INTERVIEW_CAL_SAVE = $localize`:@@interviewCalendar.action.save:GUARDAR`;
export const INTERVIEW_CAL_CANCEL = $localize`:@@interviewCalendar.action.cancel:CANCELAR`;
export const INTERVIEW_CAL_SAVE_SUCCESS = $localize`:@@interviewCalendar.success.save:Configuración de calendario guardada`;
export const INTERVIEW_CAL_LOAD_ERROR = $localize`:@@interviewCalendar.errors.load:No se pudo cargar la configuración de calendario`;
export const INTERVIEW_CAL_SAVE_ERROR = $localize`:@@interviewCalendar.errors.save:No se pudo guardar la configuración de calendario`;
export const INTERVIEW_CAL_DAY_MON = $localize`:@@interviewCalendar.day.mon:Lunes`;
export const INTERVIEW_CAL_DAY_TUE = $localize`:@@interviewCalendar.day.tue:Martes`;
export const INTERVIEW_CAL_DAY_WED = $localize`:@@interviewCalendar.day.wed:Miércoles`;
export const INTERVIEW_CAL_DAY_THU = $localize`:@@interviewCalendar.day.thu:Jueves`;
export const INTERVIEW_CAL_DAY_FRI = $localize`:@@interviewCalendar.day.fri:Viernes`;
export const INTERVIEW_CAL_MAP_HINT = $localize`:@@interviewCalendar.mapHint:OpenStreetMap — arrastra el pin o haz clic para ubicar.`;
export const INTERVIEW_CAL_LOCATE_ADDRESS = $localize`:@@interviewCalendar.locateAddress:Ubicar en mapa`;
export const INTERVIEW_CAL_ADDRESS_REQUIRED = $localize`:@@interviewCalendar.errors.addressRequired:Ingrese una dirección`;
export const INTERVIEW_CAL_GEOCODE_ERROR = $localize`:@@interviewCalendar.errors.geocode:No se pudo ubicar la dirección en el mapa`;
export const INTERVIEW_CAL_BUFFER = $localize`:@@interviewCalendar.field.buffer:Antelación mínima (horas)`;
export const INTERVIEW_CAL_EXPIRATION = $localize`:@@interviewCalendar.field.expiration:Expiración de propuesta (horas)`;

export function formatInterviewDurationMinutes(minutes: number): string {
  return $localize`:@@interviewCalendar.option.durationMinutes:${minutes} minutos`;
}

export const INTERVIEW_SCHEDULE_TITLE = $localize`:@@interviewSchedule.title:Agendar entrevista`;
export const INTERVIEW_SCHEDULE_MODALITY = $localize`:@@interviewSchedule.field.modality:Modalidad`;
export const INTERVIEW_SCHEDULE_START = $localize`:@@interviewSchedule.field.startAt:Fecha y hora`;
export const INTERVIEW_SCHEDULE_PROPOSED = $localize`:@@interviewSchedule.field.proposed:Fecha y hora propuesta`;
export const INTERVIEW_SCHEDULE_MEETING_LINK = $localize`:@@interviewSchedule.field.meetingLink:Link de reunión`;
export const INTERVIEW_SCHEDULE_CONFIRM = $localize`:@@interviewSchedule.confirm:Confirmar`;
export const INTERVIEW_SCHEDULE_SUCCESS = $localize`:@@interviewSchedule.success:Propuesta de entrevista enviada al candidato`;
export const INTERVIEW_SCHEDULE_LOADING_SLOT = $localize`:@@interviewSchedule.loadingSlot:Calculando horario disponible…`;
export const INTERVIEW_SCHEDULE_NO_SLOT = $localize`:@@interviewSchedule.noSlot:No hay horarios disponibles para esta modalidad`;
export const INTERVIEW_SCHEDULE_ERROR = $localize`:@@interviewSchedule.errors.save:No se pudo agendar la entrevista`;
export const INTERVIEW_SCHEDULE_SELECT_ONE = $localize`:@@interviewSchedule.selectOne:Seleccione un solo candidato para agendar la entrevista`;