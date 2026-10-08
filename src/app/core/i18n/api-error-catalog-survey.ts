import { ApiErrorI18nEntry } from './api-error-catalog';

/** Survey (WhatsApp) module error codes. */
export const API_ERROR_CATALOG_SURVEY: Record<string, ApiErrorI18nEntry> = {
  SURVEY_NOT_FOUND: {
    title: $localize`:@@errors.SURVEY_NOT_FOUND.title:Encuesta no encontrada`,
    message: $localize`:@@errors.SURVEY_NOT_FOUND.message:La encuesta solicitada no existe.`,
  },
  SURVEY_INVALID_ANSWER_TYPE: {
    title: $localize`:@@errors.SURVEY_INVALID_ANSWER_TYPE.title:Tipo de respuesta inválido`,
    message: $localize`:@@errors.SURVEY_INVALID_ANSWER_TYPE.message:Use TEXT, NUMBER, DATE, IMAGE o FILE.`,
  },
  POSITION_SURVEY_NOT_ASSIGNED: {
    title: $localize`:@@errors.POSITION_SURVEY_NOT_ASSIGNED.title:Encuesta no asignada`,
    message: $localize`:@@errors.POSITION_SURVEY_NOT_ASSIGNED.message:La posición no tiene una encuesta asignada.`,
  },
  SURVEY_INACTIVE: {
    title: $localize`:@@errors.SURVEY_INACTIVE.title:Encuesta inactiva`,
    message: $localize`:@@errors.SURVEY_INACTIVE.message:La encuesta no está activa.`,
  },
  SURVEY_NO_QUESTIONS: {
    title: $localize`:@@errors.SURVEY_NO_QUESTIONS.title:Sin preguntas`,
    message: $localize`:@@errors.SURVEY_NO_QUESTIONS.message:La encuesta no tiene preguntas.`,
  },
  SURVEY_OPEN_SESSION: {
    title: $localize`:@@errors.SURVEY_OPEN_SESSION.title:Sesión abierta`,
    message: $localize`:@@errors.SURVEY_OPEN_SESSION.message:Ya existe una encuesta abierta para este candidato en la posición.`,
  },
  SURVEY_PHONE_BUSY: {
    title: $localize`:@@errors.SURVEY_PHONE_BUSY.title:Teléfono ocupado`,
    message: $localize`:@@errors.SURVEY_PHONE_BUSY.message:El candidato tiene una encuesta incompleta y no puede participar en otra.`,
  },
  SURVEY_SESSION_NOT_FOUND: {
    title: $localize`:@@errors.SURVEY_SESSION_NOT_FOUND.title:Sesión no encontrada`,
    message: $localize`:@@errors.SURVEY_SESSION_NOT_FOUND.message:Sesión de encuesta no encontrada.`,
  },
  SURVEY_TARGET_INCOMPLETE: {
    title: $localize`:@@errors.SURVEY_TARGET_INCOMPLETE.title:Mapeo incompleto`,
    message: $localize`:@@errors.SURVEY_TARGET_INCOMPLETE.message:Debe indicar tabla y campo destino juntos, o ninguno.`,
  },
  SURVEY_TARGET_INVALID: {
    title: $localize`:@@errors.SURVEY_TARGET_INVALID.title:Mapeo inválido`,
    message: $localize`:@@errors.SURVEY_TARGET_INVALID.message:El campo destino seleccionado no está permitido.`,
  },
  SURVEY_TARGET_ANSWER_TYPE: {
    title: $localize`:@@errors.SURVEY_TARGET_ANSWER_TYPE.title:Tipo no mapeable`,
    message: $localize`:@@errors.SURVEY_TARGET_ANSWER_TYPE.message:Solo TEXT, NUMBER o DATE admiten mapeo a campo de BD.`,
  },
  SURVEY_AI_PROMPT_NOT_CONFIGURED: {
    title: $localize`:@@errors.SURVEY_AI_PROMPT_NOT_CONFIGURED.title:Prompt IA no configurado`,
    message: $localize`:@@errors.SURVEY_AI_PROMPT_NOT_CONFIGURED.message:No hay prompt de validación de respuestas configurado para esta compañía.`,
  },
  SURVEY_AI_VALIDATION_FAILED: {
    title: $localize`:@@errors.SURVEY_AI_VALIDATION_FAILED.title:Validación IA fallida`,
    message: $localize`:@@errors.SURVEY_AI_VALIDATION_FAILED.message:No se pudo validar la respuesta con IA.`,
  },
  SURVEY_SEND_FAILED: {
    title: $localize`:@@errors.SURVEY_SEND_FAILED.title:Envío fallido`,
    message: $localize`:@@errors.SURVEY_SEND_FAILED.message:No se pudo enviar la encuesta por WhatsApp.`,
  },
};
