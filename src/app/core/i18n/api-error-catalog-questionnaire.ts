import { ApiErrorI18nEntry } from './api-error-catalog';

/** Questionnaire module error codes (Phase 3). */
export const API_ERROR_CATALOG_QUESTIONNAIRE: Record<string, ApiErrorI18nEntry> = {
  QUESTIONNAIRE_KNOWLEDGE_CATEGORY_NOT_FOUND: {
    title: $localize`:@@errors.QUESTIONNAIRE_KNOWLEDGE_CATEGORY_NOT_FOUND.title:Categoría no encontrada`,
    message: $localize`:@@errors.QUESTIONNAIRE_KNOWLEDGE_CATEGORY_NOT_FOUND.message:Categoría de conocimiento no encontrada`,
  },
  QUESTIONNAIRE_TAG_NOT_FOUND: {
    title: $localize`:@@errors.QUESTIONNAIRE_TAG_NOT_FOUND.title:Etiqueta no encontrada`,
    message: $localize`:@@errors.QUESTIONNAIRE_TAG_NOT_FOUND.message:Etiqueta de cuestionario no encontrada`,
  },
  QUESTIONNAIRE_TENANT_READ_DENIED: {
    title: $localize`:@@errors.QUESTIONNAIRE_TENANT_READ_DENIED.title:Lectura denegada`,
    message: $localize`:@@errors.QUESTIONNAIRE_TENANT_READ_DENIED.message:No puede leer este registro de cuestionario`,
  },
  QUESTIONNAIRE_TENANT_WRITE_DENIED: {
    title: $localize`:@@errors.QUESTIONNAIRE_TENANT_WRITE_DENIED.title:Escritura denegada`,
    message: $localize`:@@errors.QUESTIONNAIRE_TENANT_WRITE_DENIED.message:No puede modificar este registro de cuestionario`,
  },
  QUESTIONNAIRE_GLOBAL_SCOPE_DENIED: {
    title: $localize`:@@errors.QUESTIONNAIRE_GLOBAL_SCOPE_DENIED.title:Alcance global denegado`,
    message: $localize`:@@errors.QUESTIONNAIRE_GLOBAL_SCOPE_DENIED.message:Solo administradores globales pueden crear registros globales`,
  },
  QUESTIONNAIRE_KNOWLEDGE_CATEGORY_INVALID_PARENT: {
    title: $localize`:@@errors.QUESTIONNAIRE_KNOWLEDGE_CATEGORY_INVALID_PARENT.title:Categoría padre inválida`,
    message: $localize`:@@errors.QUESTIONNAIRE_KNOWLEDGE_CATEGORY_INVALID_PARENT.message:Categoría padre inválida`,
  },
  QUESTIONNAIRE_QUESTION_NOT_FOUND: {
    title: $localize`:@@errors.QUESTIONNAIRE_QUESTION_NOT_FOUND.title:Pregunta no encontrada`,
    message: $localize`:@@errors.QUESTIONNAIRE_QUESTION_NOT_FOUND.message:Pregunta no encontrada`,
  },
  QUESTIONNAIRE_QUESTION_LOCKED: {
    title: $localize`:@@errors.QUESTIONNAIRE_QUESTION_LOCKED.title:Pregunta bloqueada`,
    message: $localize`:@@errors.QUESTIONNAIRE_QUESTION_LOCKED.message:La pregunta está bloqueada y no puede modificarse`,
  },
  QUESTIONNAIRE_QUESTION_INVALID_TYPE: {
    title: $localize`:@@errors.QUESTIONNAIRE_QUESTION_INVALID_TYPE.title:Tipo inválido`,
    message: $localize`:@@errors.QUESTIONNAIRE_QUESTION_INVALID_TYPE.message:Tipo de pregunta inválido`,
  },
  QUESTIONNAIRE_QUESTION_INVALID_OPTIONS: {
    title: $localize`:@@errors.QUESTIONNAIRE_QUESTION_INVALID_OPTIONS.title:Opciones inválidas`,
    message: $localize`:@@errors.QUESTIONNAIRE_QUESTION_INVALID_OPTIONS.message:Opciones inválidas para el tipo de pregunta`,
  },
  QUESTIONNAIRE_QUESTIONNAIRE_NOT_FOUND: {
    title: $localize`:@@errors.QUESTIONNAIRE_QUESTIONNAIRE_NOT_FOUND.title:Cuestionario no encontrado`,
    message: $localize`:@@errors.QUESTIONNAIRE_QUESTIONNAIRE_NOT_FOUND.message:Cuestionario no encontrado`,
  },
  QUESTIONNAIRE_QUESTIONNAIRE_INVALID_STATUS: {
    title: $localize`:@@errors.QUESTIONNAIRE_QUESTIONNAIRE_INVALID_STATUS.title:Estado inválido`,
    message: $localize`:@@errors.QUESTIONNAIRE_QUESTIONNAIRE_INVALID_STATUS.message:Estado de cuestionario inválido`,
  },
  QUESTIONNAIRE_QUESTIONNAIRE_PUBLISH_DENIED: {
    title: $localize`:@@errors.QUESTIONNAIRE_QUESTIONNAIRE_PUBLISH_DENIED.title:Publicación denegada`,
    message: $localize`:@@errors.QUESTIONNAIRE_QUESTIONNAIRE_PUBLISH_DENIED.message:Se requiere permiso para publicar`,
  },
  QUESTIONNAIRE_QUESTIONNAIRE_PUBLISH_NO_QUESTIONS: {
    title: $localize`:@@errors.QUESTIONNAIRE_QUESTIONNAIRE_PUBLISH_NO_QUESTIONS.title:Sin preguntas`,
    message: $localize`:@@errors.QUESTIONNAIRE_QUESTIONNAIRE_PUBLISH_NO_QUESTIONS.message:El cuestionario debe tener al menos una pregunta para publicar`,
  },
  QUESTIONNAIRE_QUESTIONNAIRE_PUBLISHED_LOCKED: {
    title: $localize`:@@errors.QUESTIONNAIRE_QUESTIONNAIRE_PUBLISHED_LOCKED.title:Cuestionario publicado`,
    message: $localize`:@@errors.QUESTIONNAIRE_QUESTIONNAIRE_PUBLISHED_LOCKED.message:El cuestionario publicado no puede modificarse`,
  },
  QUESTIONNAIRE_QUESTIONNAIRE_ARCHIVED_LOCKED: {
    title: $localize`:@@errors.QUESTIONNAIRE_QUESTIONNAIRE_ARCHIVED_LOCKED.title:Cuestionario archivado`,
    message: $localize`:@@errors.QUESTIONNAIRE_QUESTIONNAIRE_ARCHIVED_LOCKED.message:El cuestionario archivado no puede modificarse`,
  },
  QUESTIONNAIRE_QUESTIONNAIRE_ARCHIVE_DENIED: {
    title: $localize`:@@errors.QUESTIONNAIRE_QUESTIONNAIRE_ARCHIVE_DENIED.title:Archivo denegado`,
    message: $localize`:@@errors.QUESTIONNAIRE_QUESTIONNAIRE_ARCHIVE_DENIED.message:Se requiere permiso para archivar`,
  },
  QUESTIONNAIRE_QUESTIONNAIRE_ARCHIVE_INVALID_STATUS: {
    title: $localize`:@@errors.QUESTIONNAIRE_QUESTIONNAIRE_ARCHIVE_INVALID_STATUS.title:Estado inválido para archivar`,
    message: $localize`:@@errors.QUESTIONNAIRE_QUESTIONNAIRE_ARCHIVE_INVALID_STATUS.message:Solo los cuestionarios publicados pueden archivarse`,
  },
  QUESTIONNAIRE_EXAM_NOT_FOUND: {
    title: $localize`:@@errors.QUESTIONNAIRE_EXAM_NOT_FOUND.title:Examen no encontrado`,
    message: $localize`:@@errors.QUESTIONNAIRE_EXAM_NOT_FOUND.message:Examen no encontrado`,
  },
  QUESTIONNAIRE_EXAM_QUESTIONNAIRE_NOT_PUBLISHED: {
    title: $localize`:@@errors.QUESTIONNAIRE_EXAM_QUESTIONNAIRE_NOT_PUBLISHED.title:Cuestionario no publicado`,
    message: $localize`:@@errors.QUESTIONNAIRE_EXAM_QUESTIONNAIRE_NOT_PUBLISHED.message:El cuestionario debe estar publicado`,
  },
  QUESTIONNAIRE_EXAM_COMPANY_REQUIRED: {
    title: $localize`:@@errors.QUESTIONNAIRE_EXAM_COMPANY_REQUIRED.title:Compañía requerida`,
    message: $localize`:@@errors.QUESTIONNAIRE_EXAM_COMPANY_REQUIRED.message:El companyId es obligatorio`,
  },
  QUESTIONNAIRE_EXAM_INVALID_MAX_ATTEMPTS: {
    title: $localize`:@@errors.QUESTIONNAIRE_EXAM_INVALID_MAX_ATTEMPTS.title:Max intentos inválido`,
    message: $localize`:@@errors.QUESTIONNAIRE_EXAM_INVALID_MAX_ATTEMPTS.message:Max intentos debe ser nulo o mayor que cero`,
  },
  QUESTIONNAIRE_EXAM_INVALID_NUMBER_OF_QUESTIONS: {
    title: $localize`:@@errors.QUESTIONNAIRE_EXAM_INVALID_NUMBER_OF_QUESTIONS.title:Número de preguntas inválido`,
    message: $localize`:@@errors.QUESTIONNAIRE_EXAM_INVALID_NUMBER_OF_QUESTIONS.message:El número de preguntas supera el banco del cuestionario`,
  },
  QUESTIONNAIRE_EXAM_INSUFFICIENT_ELIGIBLE_QUESTIONS: {
    title: $localize`:@@errors.QUESTIONNAIRE_EXAM_INSUFFICIENT_ELIGIBLE_QUESTIONS.title:Preguntas insuficientes`,
    message: $localize`:@@errors.QUESTIONNAIRE_EXAM_INSUFFICIENT_ELIGIBLE_QUESTIONS.message:Solo hay {0} preguntas elegibles tras los filtros; el examen solicita {1}`,
  },
  QUESTIONNAIRE_EXAM_INVALID_GENERATION_CONFIG: {
    title: $localize`:@@errors.QUESTIONNAIRE_EXAM_INVALID_GENERATION_CONFIG.title:Configuración inválida`,
    message: $localize`:@@errors.QUESTIONNAIRE_EXAM_INVALID_GENERATION_CONFIG.message:JSON de generation_config inválido`,
  },
  QUESTIONNAIRE_EXAM_INVALID_DATE_RANGE: {
    title: $localize`:@@errors.QUESTIONNAIRE_EXAM_INVALID_DATE_RANGE.title:Rango de fechas inválido`,
    message: $localize`:@@errors.QUESTIONNAIRE_EXAM_INVALID_DATE_RANGE.message:La fecha fin debe ser posterior a la fecha inicio`,
  },
};
