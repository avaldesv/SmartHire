import { ApiErrorI18nEntry } from './api-error-catalog';

/** Catalog, document type, AI prompt and import/export error codes (Phase 3). */
export const API_ERROR_CATALOG_CATALOG: Record<string, ApiErrorI18nEntry> = {
  CATALOG_NOT_FOUND: {
    title: $localize`:@@errors.CATALOG_NOT_FOUND.title:Catálogo no encontrado`,
    message: $localize`:@@errors.CATALOG_NOT_FOUND.message:Registro de catálogo no encontrado`,
  },
  CATALOG_TENANT_MISMATCH: {
    title: $localize`:@@errors.CATALOG_TENANT_MISMATCH.title:Catálogo inválido`,
    message: $localize`:@@errors.CATALOG_TENANT_MISMATCH.message:El registro no pertenece al tenant actual`,
  },
  ERROR_CATALOG_NOT_FOUND: {
    title: $localize`:@@errors.ERROR_CATALOG_NOT_FOUND.title:Catálogo no encontrado`,
    message: $localize`:@@errors.ERROR_CATALOG_NOT_FOUND.message:Registro de catálogo no encontrado`,
  },
  ERROR_CATALOG_TENANT_MISMATCH: {
    title: $localize`:@@errors.ERROR_CATALOG_TENANT_MISMATCH.title:Catálogo inválido`,
    message: $localize`:@@errors.ERROR_CATALOG_TENANT_MISMATCH.message:El registro de catálogo no pertenece a la compañía activa`,
  },
  BRANCH_COUNTRY_MISMATCH: {
    title: $localize`:@@errors.BRANCH_COUNTRY_MISMATCH.title:Sucursal inválida`,
    message: $localize`:@@errors.BRANCH_COUNTRY_MISMATCH.message:La sucursal no corresponde al país de la empresa activa`,
  },
  ERROR_BRANCH_COUNTRY_MISMATCH: {
    title: $localize`:@@errors.ERROR_BRANCH_COUNTRY_MISMATCH.title:Sucursal inválida`,
    message: $localize`:@@errors.ERROR_BRANCH_COUNTRY_MISMATCH.message:La sucursal no corresponde al país de la empresa activa`,
  },
  DOCUMENT_TYPE_NOT_FOUND: {
    title: $localize`:@@errors.DOCUMENT_TYPE_NOT_FOUND.title:Tipo no encontrado`,
    message: $localize`:@@errors.DOCUMENT_TYPE_NOT_FOUND.message:Tipo de documento no encontrado`,
  },
  DOCUMENT_TYPE_INVALID_DEFAULT_SERVICE: {
    title: $localize`:@@errors.DOCUMENT_TYPE_INVALID_DEFAULT_SERVICE.title:Servicio inválido`,
    message: $localize`:@@errors.DOCUMENT_TYPE_INVALID_DEFAULT_SERVICE.message:El servicio predeterminado debe estar entre los servicios seleccionados`,
  },
  DOCUMENT_TYPE_DEFAULT_SERVICE_REQUIRED: {
    title: $localize`:@@errors.DOCUMENT_TYPE_DEFAULT_SERVICE_REQUIRED.title:Servicio requerido`,
    message: $localize`:@@errors.DOCUMENT_TYPE_DEFAULT_SERVICE_REQUIRED.message:Debe indicar el servicio de procesamiento predeterminado`,
  },
  DOCUMENT_TYPE_EXTENSION_INVALID: {
    title: $localize`:@@errors.DOCUMENT_TYPE_EXTENSION_INVALID.title:Extensión inválida`,
    message: $localize`:@@errors.DOCUMENT_TYPE_EXTENSION_INVALID.message:Extensión de archivo no válida o no accesible: {0}`,
  },
  DOCUMENT_TYPE_PROCESSING_SERVICE_INVALID: {
    title: $localize`:@@errors.DOCUMENT_TYPE_PROCESSING_SERVICE_INVALID.title:Servicio inválido`,
    message: $localize`:@@errors.DOCUMENT_TYPE_PROCESSING_SERVICE_INVALID.message:Servicio de procesamiento no válido o no accesible: {0}`,
  },
  FILE_EXTENSION_NOT_FOUND: {
    title: $localize`:@@errors.FILE_EXTENSION_NOT_FOUND.title:Extensión no encontrada`,
    message: $localize`:@@errors.FILE_EXTENSION_NOT_FOUND.message:Extensión de archivo no encontrada`,
  },
  FILE_EXTENSION_IN_USE: {
    title: $localize`:@@errors.FILE_EXTENSION_IN_USE.title:Extensión en uso`,
    message: $localize`:@@errors.FILE_EXTENSION_IN_USE.message:La extensión está en uso por tipos de documento`,
  },
  AI_PROMPT_NOT_FOUND: {
    title: $localize`:@@errors.AI_PROMPT_NOT_FOUND.title:Prompt no encontrado`,
    message: $localize`:@@errors.AI_PROMPT_NOT_FOUND.message:Prompt IA no encontrado`,
  },
  AI_PROMPT_CLAVE_DUPLICATE: {
    title: $localize`:@@errors.AI_PROMPT_CLAVE_DUPLICATE.title:Clave duplicada`,
    message: $localize`:@@errors.AI_PROMPT_CLAVE_DUPLICATE.message:La clave del prompt ya existe globalmente`,
  },
  AI_PROMPT_CLAVE_IMMUTABLE: {
    title: $localize`:@@errors.AI_PROMPT_CLAVE_IMMUTABLE.title:Clave inmutable`,
    message: $localize`:@@errors.AI_PROMPT_CLAVE_IMMUTABLE.message:La clave del prompt no se puede modificar`,
  },
  AI_PROMPT_TENANT_READ_DENIED: {
    title: $localize`:@@errors.AI_PROMPT_TENANT_READ_DENIED.title:Lectura denegada`,
    message: $localize`:@@errors.AI_PROMPT_TENANT_READ_DENIED.message:No puede leer este prompt`,
  },
  AI_PROMPT_TENANT_WRITE_DENIED: {
    title: $localize`:@@errors.AI_PROMPT_TENANT_WRITE_DENIED.title:Escritura denegada`,
    message: $localize`:@@errors.AI_PROMPT_TENANT_WRITE_DENIED.message:No puede modificar este prompt`,
  },
  AI_PROMPT_GLOBAL_SCOPE_DENIED: {
    title: $localize`:@@errors.AI_PROMPT_GLOBAL_SCOPE_DENIED.title:Alcance global denegado`,
    message: $localize`:@@errors.AI_PROMPT_GLOBAL_SCOPE_DENIED.message:Solo administradores globales pueden crear prompts globales`,
  },
  AI_PROMPT_IMPORT_CLAVE_REQUIRED: {
    title: $localize`:@@errors.AI_PROMPT_IMPORT_CLAVE_REQUIRED.title:Clave requerida`,
    message: $localize`:@@errors.AI_PROMPT_IMPORT_CLAVE_REQUIRED.message:La clave es obligatoria en la fila CSV`,
  },
  AI_PROMPT_IMPORT_INVALID_SCOPE: {
    title: $localize`:@@errors.AI_PROMPT_IMPORT_INVALID_SCOPE.title:Ámbito inválido`,
    message: $localize`:@@errors.AI_PROMPT_IMPORT_INVALID_SCOPE.message:Ámbito inválido en CSV (use GLOBAL o TENANT)`,
  },
  PIPELINE_STAGE_NOT_FOUND: {
    title: $localize`:@@errors.PIPELINE_STAGE_NOT_FOUND.title:Etapa no encontrada`,
    message: $localize`:@@errors.PIPELINE_STAGE_NOT_FOUND.message:Etapa de pipeline no encontrada`,
  },
  PIPELINE_STAGE_SORT_ORDER_REQUIRED: {
    title: $localize`:@@errors.PIPELINE_STAGE_SORT_ORDER_REQUIRED.title:Orden requerido`,
    message: $localize`:@@errors.PIPELINE_STAGE_SORT_ORDER_REQUIRED.message:El orden es obligatorio`,
  },
  PIPELINE_STAGE_SORT_ORDER_DUPLICATE: {
    title: $localize`:@@errors.PIPELINE_STAGE_SORT_ORDER_DUPLICATE.title:Orden duplicado`,
    message: $localize`:@@errors.PIPELINE_STAGE_SORT_ORDER_DUPLICATE.message:Ya existe una etapa con ese orden en el mismo alcance`,
  },
  PIPELINE_STAGE_REORDER_SCOPE_MISMATCH: {
    title: $localize`:@@errors.PIPELINE_STAGE_REORDER_SCOPE_MISMATCH.title:Alcance inválido`,
    message: $localize`:@@errors.PIPELINE_STAGE_REORDER_SCOPE_MISMATCH.message:Todas las etapas del reorder deben pertenecer al mismo alcance`,
  },
  CATALOG_CSV_INVALID_STRUCTURE: {
    title: $localize`:@@errors.CATALOG_CSV_INVALID_STRUCTURE.title:CSV inválido`,
    message: $localize`:@@errors.CATALOG_CSV_INVALID_STRUCTURE.message:Estructura CSV inválida: {0}`,
  },
  CATALOG_CSV_FILE_REQUIRED: {
    title: $localize`:@@errors.CATALOG_CSV_FILE_REQUIRED.title:Archivo requerido`,
    message: $localize`:@@errors.CATALOG_CSV_FILE_REQUIRED.message:El archivo CSV es obligatorio`,
  },
  CATALOG_CSV_READ_ERROR: {
    title: $localize`:@@errors.CATALOG_CSV_READ_ERROR.title:Error de lectura`,
    message: $localize`:@@errors.CATALOG_CSV_READ_ERROR.message:No se pudo leer el archivo CSV`,
  },
  CATALOG_CSV_UNSUPPORTED: {
    title: $localize`:@@errors.CATALOG_CSV_UNSUPPORTED.title:Catálogo no soportado`,
    message: $localize`:@@errors.CATALOG_CSV_UNSUPPORTED.message:Import/export CSV no soportado para el catálogo: {0}`,
  },
  CANCELLATION_TYPE_NOT_FOUND: {
    title: $localize`:@@errors.CANCELLATION_TYPE_NOT_FOUND.title:Tipo no encontrado`,
    message: $localize`:@@errors.CANCELLATION_TYPE_NOT_FOUND.message:Tipo de cancelación no encontrado`,
  },
  CANCELLATION_TYPE_CODE_DUPLICATE: {
    title: $localize`:@@errors.CANCELLATION_TYPE_CODE_DUPLICATE.title:Código duplicado`,
    message: $localize`:@@errors.CANCELLATION_TYPE_CODE_DUPLICATE.message:Ya existe un tipo de cancelación con ese código`,
  },
  CANCELLATION_REASON_NOT_FOUND: {
    title: $localize`:@@errors.CANCELLATION_REASON_NOT_FOUND.title:Motivo no encontrado`,
    message: $localize`:@@errors.CANCELLATION_REASON_NOT_FOUND.message:Motivo de cancelación no encontrado`,
  },
  CANCELLATION_REASON_CODE_DUPLICATE: {
    title: $localize`:@@errors.CANCELLATION_REASON_CODE_DUPLICATE.title:Código duplicado`,
    message: $localize`:@@errors.CANCELLATION_REASON_CODE_DUPLICATE.message:Ya existe un motivo de cancelación con ese código para el tipo indicado`,
  },
  NEIGHBORHOOD_FILTER_REQUIRED: {
    title: $localize`:@@errors.NEIGHBORHOOD_FILTER_REQUIRED.title:Filtro requerido`,
    message: $localize`:@@errors.NEIGHBORHOOD_FILTER_REQUIRED.message:Se requiere postalCode o municipalityId`,
  },
  COMPANY_NOT_FOUND: {
    title: $localize`:@@errors.COMPANY_NOT_FOUND.title:Compañía no encontrada`,
    message: $localize`:@@errors.COMPANY_NOT_FOUND.message:Compañía no encontrada`,
  },
  ATS_CONFIG_NOT_FOUND: {
    title: $localize`:@@errors.ATS_CONFIG_NOT_FOUND.title:Configuración no encontrada`,
    message: $localize`:@@errors.ATS_CONFIG_NOT_FOUND.message:Configuración ATS no encontrada`,
  },
  BENEFIT_NOT_FOUND: {
    title: $localize`:@@errors.BENEFIT_NOT_FOUND.title:Beneficio no encontrado`,
    message: $localize`:@@errors.BENEFIT_NOT_FOUND.message:Beneficio no encontrado`,
  },
  BRAND_NOT_FOUND: {
    title: $localize`:@@errors.BRAND_NOT_FOUND.title:Marca no encontrada`,
    message: $localize`:@@errors.BRAND_NOT_FOUND.message:Marca no encontrada`,
  },
  BUSINESSUNIT_NOT_FOUND: {
    title: $localize`:@@errors.BUSINESSUNIT_NOT_FOUND.title:Unidad no encontrada`,
    message: $localize`:@@errors.BUSINESSUNIT_NOT_FOUND.message:Tipo de contrato no encontrado`,
  },
  CAREER_NOT_FOUND: {
    title: $localize`:@@errors.CAREER_NOT_FOUND.title:Carrera no encontrada`,
    message: $localize`:@@errors.CAREER_NOT_FOUND.message:Carrera no encontrada`,
  },
  CATEGORY_NOT_FOUND: {
    title: $localize`:@@errors.CATEGORY_NOT_FOUND.title:Categoría no encontrada`,
    message: $localize`:@@errors.CATEGORY_NOT_FOUND.message:Tipo de contrato no encontrado`,
  },
  CHARACTERISTIC_NOT_FOUND: {
    title: $localize`:@@errors.CHARACTERISTIC_NOT_FOUND.title:Característica no encontrada`,
    message: $localize`:@@errors.CHARACTERISTIC_NOT_FOUND.message:Tipo de contrato no encontrado`,
  },
  CLIENT_NOT_FOUND: {
    title: $localize`:@@errors.CLIENT_NOT_FOUND.title:Cliente no encontrado`,
    message: $localize`:@@errors.CLIENT_NOT_FOUND.message:Cliente no encontrado`,
  },
  CONTRACT_TYPE_NOT_FOUND: {
    title: $localize`:@@errors.CONTRACT_TYPE_NOT_FOUND.title:Tipo no encontrado`,
    message: $localize`:@@errors.CONTRACT_TYPE_NOT_FOUND.message:Tipo de contrato no encontrado`,
  },
  COUNTRY_NOT_FOUND: {
    title: $localize`:@@errors.COUNTRY_NOT_FOUND.title:País no encontrado`,
    message: $localize`:@@errors.COUNTRY_NOT_FOUND.message:País no encontrado`,
  },
  COVERAGECATEGORY_NOT_FOUND: {
    title: $localize`:@@errors.COVERAGECATEGORY_NOT_FOUND.title:Categoría no encontrada`,
    message: $localize`:@@errors.COVERAGECATEGORY_NOT_FOUND.message:Tipo de contrato no encontrado`,
  },
  COVERAGE_TYPE_NOT_FOUND: {
    title: $localize`:@@errors.COVERAGE_TYPE_NOT_FOUND.title:Tipo no encontrado`,
    message: $localize`:@@errors.COVERAGE_TYPE_NOT_FOUND.message:Tipo de cobertura no encontrado`,
  },
  CURRENCY_NOT_FOUND: {
    title: $localize`:@@errors.CURRENCY_NOT_FOUND.title:Moneda no encontrada`,
    message: $localize`:@@errors.CURRENCY_NOT_FOUND.message:Moneda no encontrada`,
  },
  DISABILITYTYPE_NOT_FOUND: {
    title: $localize`:@@errors.DISABILITYTYPE_NOT_FOUND.title:Tipo no encontrado`,
    message: $localize`:@@errors.DISABILITYTYPE_NOT_FOUND.message:Tipo de contrato no encontrado`,
  },
  EDUCATION_LEVEL_NOT_FOUND: {
    title: $localize`:@@errors.EDUCATION_LEVEL_NOT_FOUND.title:Nivel no encontrado`,
    message: $localize`:@@errors.EDUCATION_LEVEL_NOT_FOUND.message:Nivel educativo no encontrado`,
  },
  EXPERIENCELEVEL_NOT_FOUND: {
    title: $localize`:@@errors.EXPERIENCELEVEL_NOT_FOUND.title:Nivel no encontrado`,
    message: $localize`:@@errors.EXPERIENCELEVEL_NOT_FOUND.message:Tipo de contrato no encontrado`,
  },
  GENDER_NOT_FOUND: {
    title: $localize`:@@errors.GENDER_NOT_FOUND.title:Género no encontrado`,
    message: $localize`:@@errors.GENDER_NOT_FOUND.message:Género no encontrado`,
  },
  GENERAL_CATEGORY_NOT_FOUND: {
    title: $localize`:@@errors.GENERAL_CATEGORY_NOT_FOUND.title:Categoría no encontrada`,
    message: $localize`:@@errors.GENERAL_CATEGORY_NOT_FOUND.message:Categoría general no encontrada`,
  },
  JOB_PORTAL_NOT_FOUND: {
    title: $localize`:@@errors.JOB_PORTAL_NOT_FOUND.title:Portal no encontrado`,
    message: $localize`:@@errors.JOB_PORTAL_NOT_FOUND.message:Portal de publicación no encontrado`,
  },
  KINSHIP_NOT_FOUND: {
    title: $localize`:@@errors.KINSHIP_NOT_FOUND.title:Parentesco no encontrado`,
    message: $localize`:@@errors.KINSHIP_NOT_FOUND.message:Parentesco no encontrado`,
  },
  LANGUAGE_NOT_FOUND: {
    title: $localize`:@@errors.LANGUAGE_NOT_FOUND.title:Idioma no encontrado`,
    message: $localize`:@@errors.LANGUAGE_NOT_FOUND.message:Idioma no encontrado`,
  },
  LANGUAGE_LEVEL_NOT_FOUND: {
    title: $localize`:@@errors.LANGUAGE_LEVEL_NOT_FOUND.title:Nivel no encontrado`,
    message: $localize`:@@errors.LANGUAGE_LEVEL_NOT_FOUND.message:Nivel de idioma no encontrado`,
  },
  MARITALSTATUS_NOT_FOUND: {
    title: $localize`:@@errors.MARITALSTATUS_NOT_FOUND.title:Estado no encontrado`,
    message: $localize`:@@errors.MARITALSTATUS_NOT_FOUND.message:Tipo de contrato no encontrado`,
  },
  MUNICIPALITY_NOT_FOUND: {
    title: $localize`:@@errors.MUNICIPALITY_NOT_FOUND.title:Municipio no encontrado`,
    message: $localize`:@@errors.MUNICIPALITY_NOT_FOUND.message:Municipio no encontrado`,
  },
  NEIGHBORHOOD_NOT_FOUND: {
    title: $localize`:@@errors.NEIGHBORHOOD_NOT_FOUND.title:Colonia no encontrada`,
    message: $localize`:@@errors.NEIGHBORHOOD_NOT_FOUND.message:Colonia no encontrada`,
  },
  POSITIONTYPE_NOT_FOUND: {
    title: $localize`:@@errors.POSITIONTYPE_NOT_FOUND.title:Tipo no encontrado`,
    message: $localize`:@@errors.POSITIONTYPE_NOT_FOUND.message:Tipo de contrato no encontrado`,
  },
  REJECTION_REASON_NOT_FOUND: {
    title: $localize`:@@errors.REJECTION_REASON_NOT_FOUND.title:Motivo no encontrado`,
    message: $localize`:@@errors.REJECTION_REASON_NOT_FOUND.message:Motivo de rechazo no encontrado`,
  },
  REQUIREMENT_NOT_FOUND: {
    title: $localize`:@@errors.REQUIREMENT_NOT_FOUND.title:Requisito no encontrado`,
    message: $localize`:@@errors.REQUIREMENT_NOT_FOUND.message:Tipo de contrato no encontrado`,
  },
  REQUISITION_TYPE_NOT_FOUND: {
    title: $localize`:@@errors.REQUISITION_TYPE_NOT_FOUND.title:Tipo no encontrado`,
    message: $localize`:@@errors.REQUISITION_TYPE_NOT_FOUND.message:Tipo de requisición no encontrado`,
  },
  RESPONSIBILITYLEVEL_NOT_FOUND: {
    title: $localize`:@@errors.RESPONSIBILITYLEVEL_NOT_FOUND.title:Nivel no encontrado`,
    message: $localize`:@@errors.RESPONSIBILITYLEVEL_NOT_FOUND.message:Tipo de contrato no encontrado`,
  },
  SHIFT_NOT_FOUND: {
    title: $localize`:@@errors.SHIFT_NOT_FOUND.title:Turno no encontrado`,
    message: $localize`:@@errors.SHIFT_NOT_FOUND.message:Turno no encontrado`,
  },
  STATE_NOT_FOUND: {
    title: $localize`:@@errors.STATE_NOT_FOUND.title:Estado no encontrado`,
    message: $localize`:@@errors.STATE_NOT_FOUND.message:Estado no encontrado`,
  },
  TOOL_NOT_FOUND: {
    title: $localize`:@@errors.TOOL_NOT_FOUND.title:Herramienta no encontrada`,
    message: $localize`:@@errors.TOOL_NOT_FOUND.message:Tipo de contrato no encontrado`,
  },
  WORKPLACE_NOT_FOUND: {
    title: $localize`:@@errors.WORKPLACE_NOT_FOUND.title:Lugar no encontrado`,
    message: $localize`:@@errors.WORKPLACE_NOT_FOUND.message:Tipo de contrato no encontrado`,
  },
  WORKSCHEDULE_NOT_FOUND: {
    title: $localize`:@@errors.WORKSCHEDULE_NOT_FOUND.title:Horario no encontrado`,
    message: $localize`:@@errors.WORKSCHEDULE_NOT_FOUND.message:Tipo de contrato no encontrado`,
  },
};
