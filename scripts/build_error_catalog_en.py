#!/usr/bin/env python3
"""Build English translations for portal api-error-catalog strings (AVV-593)."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WORKSPACE = ROOT.parent
I18N_DIR = ROOT / "src/app/core/i18n"
BACKEND_EN = WORKSPACE / "smart_hire_api/src/main/resources/messages_en.properties"
OUT = ROOT / "scripts/error_catalog_en.json"

ENTRY_RE = re.compile(r"\$localize`:@@errors\.([^.]+)\.(title|message):([^`]+)`")

# Portal errorCode -> backend messages_en.properties key (when not inferrable).
CODE_TO_BACKEND: dict[str, str] = {
    "ERROR_USER_NOT_FOUND": "error.common.user_not_found",
    "ERROR_COUNTRY_NOT_FOUND": "error.common.country_not_found",
    "ERROR_WRONG_TENANT": "error.common.wrong_tenant",
    "ERROR_WRONG_TENANT_ACCESS": "error.common.wrong_tenant_access",
    "WRONG_TENANT": "error.common.wrong_tenant",
    "ACCESS_DENIED": "error.common.access_denied",
    "UNAUTHORIZED": "error.common.unauthorized",
    "VALIDATION_ERROR": "error.validation.message",
    "PORTAL_DOCUMENT_TOO_LARGE": "error.upload.too_large",
    "CATALOG_NOT_FOUND": "error.catalog.not_found",
    "ERROR_CATALOG_NOT_FOUND": "error.catalog.not_found",
    "COMPANY_PORTAL_SLUG_INVALID": "error.catalog.company.portal_slug_invalid",
    "COMPANY_PORTAL_SLUG_DUPLICATE": "error.catalog.company.portal_slug_duplicate",
    "COMPANY_PORTAL_COLOR_INVALID": "error.catalog.company.portal_color_invalid",
    "CATALOG_TENANT_MISMATCH": "error.catalog.tenant_mismatch",
    "ERROR_CATALOG_TENANT_MISMATCH": "error.catalog.tenant_mismatch",
    "BUSINESSUNIT_NOT_FOUND": "error.catalog.business_unit.not_found",
    "COVERAGECATEGORY_NOT_FOUND": "error.catalog.coverage_category.not_found",
    "DISABILITYTYPE_NOT_FOUND": "error.catalog.disability_type.not_found",
    "EXPERIENCELEVEL_NOT_FOUND": "error.catalog.experience_level.not_found",
    "MARITALSTATUS_NOT_FOUND": "error.catalog.marital_status.not_found",
    "POSITIONTYPE_NOT_FOUND": "error.catalog.position_type.not_found",
    "RESPONSIBILITYLEVEL_NOT_FOUND": "error.catalog.responsibility_level.not_found",
    "WORKSCHEDULE_NOT_FOUND": "error.catalog.work_schedule.not_found",
    "RECRUITER_GROUP_NOT_FOUND": "error.recruiter_group.manager_not_found",
    "QUESTIONNAIRE_KNOWLEDGE_CATEGORY_NOT_FOUND": "error.questionnaire.knowledge_category.not_found",
    "QUESTIONNAIRE_TAG_NOT_FOUND": "error.questionnaire.tag.not_found",
    "PUBLICATION_POSITION_NOT_FOUND": "error.publication.position.not_found",
    "PUBLICATION_POSITION_NOT_ACTIVE": "error.publication.position.not_active",
    "PUBLICATION_INVALID_FORMAT": "error.publication.invalid_format",
    "PUBLICATION_BROWSERLESS_ERROR": "error.publication.browserless_error",
    "PUBLICATION_WHATSAPP_INVALID_PHONE": "error.publication.whatsapp.invalid_phone",
    "PUBLICATION_MEDIA_URL_UNREACHABLE": "error.publication.whatsapp.media_url_unreachable",
    "PUBLICATION_MAIL_NOT_CONFIGURED": "error.publication.mail.not_configured",
    "PUBLICATION_MAIL_SEND_ERROR": "error.publication.mail.send_error",
    "NOTIFICATION_TEMPLATE_NOT_FOUND": "error.notification.template.not_found",
    "NOTIFICATION_OUTBOX_NOT_FOUND": "error.notification.outbox.not_found",
    "NOTIFICATION_ACTION_NOT_FOUND": "error.notification.action.not_found",
    "USER_NOTIFICATION_NOT_FOUND": "error.notification.user_notification.not_found",
    "USER_NOTIFICATION_ACCESS_DENIED": "error.notification.user_notification.access_denied",
    "ERROR_USER_USERNAME_ALREADY_EXISTS": "error.common.user_not_found",
}

# Short English titles keyed by portal errorCode (fallback when backend has only one line).
TITLE_BY_CODE: dict[str, str] = {
    "VALIDATION_ERROR": "Validation error",
    "PORTAL_DOCUMENT_TOO_LARGE": "File too large",
    "POSITION_CANCELLATION_EVIDENCE_TOO_LARGE": "File too large",
    "POSITION_CANCELLATION_EVIDENCE_TYPE_NOT_ALLOWED": "Type not allowed",
    "POSITION_CANCELLATION_EVIDENCE_READ_FAILED": "Read error",
    "CATALOG_CSV_READ_ERROR": "Read error",
    "CATALOG_CSV_INVALID_STRUCTURE": "Invalid CSV",
    "CATALOG_CSV_FILE_REQUIRED": "File required",
    "CATALOG_CSV_UNSUPPORTED": "Catalog not supported",
    "PIPELINE_STAGE_SORT_ORDER_REQUIRED": "Order required",
    "PIPELINE_STAGE_SORT_ORDER_DUPLICATE": "Duplicate order",
    "PIPELINE_STAGE_REORDER_SCOPE_MISMATCH": "Invalid scope",
    "NEIGHBORHOOD_FILTER_REQUIRED": "Filter required",
    "COMPANY_PORTAL_SLUG_INVALID": "Invalid slug",
    "COMPANY_PORTAL_SLUG_DUPLICATE": "Duplicate slug",
    "COMPANY_PORTAL_COLOR_INVALID": "Invalid color",
    "REQUISITION_FORM_PUBLISH_INVALID": "Invalid publication",
    "PUBLICATION_BROWSERLESS_ERROR": "Generation error",
    "PUBLICATION_MAIL_SEND_ERROR": "Send error",
    "NOTIFICATION_TEMPLATE_CHANNELS_REQUIRED": "Channels required",
    "NOTIFICATION_TEMPLATE_CHANNEL_EXISTS": "Channel conflict",
    "NOTIFICATION_OUTBOX_INVALID_STATUS": "Invalid status",
    "NOTIFICATION_OUTBOX_NOT_FAILED": "Retry not allowed",
    "NOTIFICATION_INBOX_OWNER_REQUIRED": "Session required",
    "USER_CONTEXT_REQUIRED": "Session required",
    "COMPANY_COUNTRY_NOT_CONFIGURED": "Country not configured",
    "INVALID_PHONE_COUNTRY_CODE": "Invalid phone country code",
    "USER_HEADER_TENANT_MISMATCH": "Incorrect tenant",
    "FUNCTIONALITY_NOT_FOUND": "Feature not found",
    "ROLE_DELETE_FORBIDDEN": "Deletion not allowed",
    "ERROR_INVALID_GLOBAL_ADMIN_ROLES": "Invalid roles",
    "ERROR_GLOBAL_ADMIN_ROLE_NOT_ALLOWED": "Role not allowed",
    "ERROR_GLOBAL_ADMIN_FORBIDDEN": "Operation not allowed",
    "QUESTIONNAIRE_EXAM_INVALID_MAX_ATTEMPTS": "Invalid max attempts",
    "QUESTIONNAIRE_EXAM_INVALID_NUMBER_OF_QUESTIONS": "Invalid number of questions",
    "QUESTIONNAIRE_EXAM_INSUFFICIENT_ELIGIBLE_QUESTIONS": "Insufficient questions",
    "QUESTIONNAIRE_EXAM_INVALID_GENERATION_CONFIG": "Invalid configuration",
    "QUESTIONNAIRE_EXAM_INVALID_DATE_RANGE": "Invalid date range",
    "QUESTIONNAIRE_QUESTIONNAIRE_PUBLISH_NO_QUESTIONS": "No questions",
    "QUESTIONNAIRE_QUESTIONNAIRE_PUBLISHED_LOCKED": "Published questionnaire",
    "QUESTIONNAIRE_QUESTIONNAIRE_ARCHIVED_LOCKED": "Archived questionnaire",
    "QUESTIONNAIRE_QUESTIONNAIRE_ARCHIVE_INVALID_STATUS": "Invalid status for archive",
    "QUESTIONNAIRE_EXAM_QUESTIONNAIRE_NOT_PUBLISHED": "Questionnaire not published",
    "QUESTIONNAIRE_EXAM_COMPANY_REQUIRED": "Company required",
    "AI_PROMPT_IMPORT_CLAVE_REQUIRED": "Key required",
    "AI_PROMPT_IMPORT_INVALID_SCOPE": "Invalid scope",
    "DOCUMENT_TYPE_EXTENSION_INVALID": "Invalid extension",
    "DOCUMENT_TYPE_PROCESSING_SERVICE_INVALID": "Invalid service",
    "DOCUMENT_TYPE_INVALID_DEFAULT_SERVICE": "Invalid service",
    "DOCUMENT_TYPE_DEFAULT_SERVICE_REQUIRED": "Service required",
    "FILE_EXTENSION_IN_USE": "Extension in use",
    "AI_PROMPT_CLAVE_DUPLICATE": "Duplicate key",
    "AI_PROMPT_CLAVE_IMMUTABLE": "Immutable key",
    "AI_PROMPT_TENANT_READ_DENIED": "Read denied",
    "AI_PROMPT_TENANT_WRITE_DENIED": "Write denied",
    "AI_PROMPT_GLOBAL_SCOPE_DENIED": "Global scope denied",
    "QUESTIONNAIRE_TENANT_READ_DENIED": "Read denied",
    "QUESTIONNAIRE_TENANT_WRITE_DENIED": "Write denied",
    "QUESTIONNAIRE_GLOBAL_SCOPE_DENIED": "Global scope denied",
    "QUESTIONNAIRE_QUESTIONNAIRE_PUBLISH_DENIED": "Publication denied",
    "QUESTIONNAIRE_QUESTIONNAIRE_ARCHIVE_DENIED": "Archive denied",
    "QUESTIONNAIRE_QUESTION_LOCKED": "Question locked",
    "QUESTIONNAIRE_QUESTION_INVALID_TYPE": "Invalid type",
    "QUESTIONNAIRE_QUESTION_INVALID_OPTIONS": "Invalid options",
    "QUESTIONNAIRE_KNOWLEDGE_CATEGORY_INVALID_PARENT": "Invalid parent category",
    "REQUISITION_FORM_CONFIG_NOT_PUBLISHED": "No published configuration",
    "REQUISITION_FORM_CONFIG_NOT_DRAFT": "Draft only editable",
    "REQUISITION_FORM_CONFIG_PUBLISHED_DELETE": "Deletion not allowed",
    "REQUISITION_FORM_CONFIG_CLONE_INVALID": "Cloning not allowed",
    "REQUISITION_FORM_BUILTIN_LOCKED": "Built-in field",
    "REQUISITION_FORM_BUILTIN_DELETE": "Deletion not allowed",
    "REQUISITION_FORM_REQUIRED_FIELD_MISSING": "Required field",
    "REQUISITION_FORM_READ_ONLY_FIELD_CHANGED": "Read-only field",
    "REQUISITION_FORM_FIELD_KEY_EXISTS": "Duplicate key",
    "REQUISITION_FORM_INVALID_DATA_SOURCE": "Invalid source",
    "POSITION_CANCELLATION_ALREADY_REQUESTED": "Cancellation requested",
    "POSITION_CANCELLATION_NOT_PENDING": "No pending request",
    "POSITION_CANCELLATION_NOT_AUTHORIZED": "Cancellation not authorized",
    "POSITION_CANCELLATION_REQUEST_FORBIDDEN": "Request not allowed",
    "POSITION_CANCELLATION_AUTHORIZE_FORBIDDEN": "Authorization denied",
    "POSITION_CANCELLATION_SUPERVISOR_REQUIRED": "Supervisor required",
    "POSITION_CANCELLATION_REASON_REQUIRED": "Reason required",
    "POSITION_CANCELLATION_TYPE_REASON_REQUIRED": "Data required",
    "POSITION_CANCELLATION_TYPE_INVALID": "Invalid type",
    "POSITION_CANCELLATION_REASON_INVALID": "Invalid reason",
    "POSITION_CANCELLATION_REASON_TYPE_MISMATCH": "Incompatible reason",
    "POSITION_CANCELLATION_EVIDENCE_REQUIRED": "Evidence required",
    "POSITION_INVALID_STATUS_FOR_CANCELLATION": "Invalid status",
    "POSITION_ALREADY_CANCELLED": "Requisition cancelled",
    "POSITION_RECRUITER_GROUP_REQUIRED": "Group required",
    "POSITION_RECRUITER_GROUP_MANAGER_REQUIRED": "Group without manager",
    "POSITION_ASSIGNED_USER_REQUIRED": "Recruiter required",
    "CANDIDATE_ALREADY_PRESELECTED": "Already preselected",
    "DOCUMENT_VALIDATION_STATUS_REQUIRED": "Validation status required",
    "DOCUMENT_REJECTION_REASON_REQUIRED": "Rejection reason required",
    "DOCUMENT_NOT_FOUND_FOR_APPLICATION": "Document not found",
    "PUBLICATION_WHATSAPP_INVALID_PHONE": "Invalid number",
    "PUBLICATION_MEDIA_URL_UNREACHABLE": "URL unreachable",
    "PUBLICATION_MAIL_NOT_CONFIGURED": "Email not configured",
    "PUBLICATION_INVALID_FORMAT": "Invalid format",
    "PUBLICATION_POSITION_NOT_ACTIVE": "Inactive position",
    "USERNAME_ALREADY_EXISTS": "Duplicate user",
    "EMAIL_ALREADY_EXISTS": "Duplicate email",
    "USER_NOT_AUTHENTICATED": "Session required",
    "PORTAL_LANGUAGE_NOT_FOUND": "Language not found",
    "SUPERVISOR_NOT_FOUND": "Supervisor not found",
    "SUPERVISOR_TENANT_MISMATCH": "Invalid supervisor",
    "SUPERVISOR_SELF_REFERENCE": "Invalid supervisor",
    "RECRUITER_GROUP_MANAGER_REQUIRED": "Manager required",
    "RECRUITER_GROUP_MANAGER_NOT_FOUND": "Manager not found",
    "RECRUITER_GROUP_MANAGER_INACTIVE": "Inactive manager",
    "RECRUITER_GROUP_MANAGER_TENANT_MISMATCH": "Invalid manager",
    "RECRUITER_GROUP_RECRUITER_NOT_FOUND": "Recruiter not found",
    "RECRUITER_GROUP_RECRUITER_INACTIVE": "Inactive recruiter",
    "RECRUITER_GROUP_RECRUITER_TENANT_MISMATCH": "Invalid recruiter",
    "RECRUITER_GROUP_MANAGER_IS_RECRUITER": "Invalid manager",
    "RECRUITER_GROUP_DUPLICATE_RECRUITER": "Duplicate recruiter",
    "RECRUITER_GROUP_IMPORT_MANAGER_EMAIL_REQUIRED": "Email required",
    "RECRUITER_GROUP_IMPORT_MANAGER_EMAIL_NOT_FOUND": "Manager not found",
    "CANCELLATION_TYPE_CODE_DUPLICATE": "Duplicate code",
    "CANCELLATION_REASON_CODE_DUPLICATE": "Duplicate code",
    "BRANCH_COUNTRY_MISMATCH": "Invalid branch",
    "ERROR_BRANCH_COUNTRY_MISMATCH": "Invalid branch",
    "ERROR_ROLE_TENANT_MISMATCH": "Invalid role",
    "ERROR_WRONG_TENANT": "Access denied",
    "ERROR_WRONG_TENANT_ACCESS": "Access denied",
    "WRONG_TENANT": "Access denied",
    "ACCESS_DENIED": "Access denied",
}

# Exact Spanish -> English for strings without backend mapping.
EXACT_ES_EN: dict[str, str] = {
    "Ocurrió un error. Intente de nuevo.": "An error occurred. Please try again.",
    "Cambie la empresa activa en el header para editar este usuario": (
        "Switch the active company in the header to edit this user"
    ),
    "El nombre de usuario ya está registrado en el sistema": "Username is already registered in the system",
    "Solo un administrador global puede crear usuarios global admin": (
        "Only a global administrator can create global admin users"
    ),
    "Usuario global admin debe tener únicamente el rol GLOBAL_ADMIN": (
        "Global admin users must have only the GLOBAL_ADMIN role"
    ),
    "Usuarios tenant no pueden tener el rol GLOBAL_ADMIN": (
        "Tenant users cannot have the GLOBAL_ADMIN role"
    ),
    "El rol GLOBAL_ADMIN no puede eliminarse": "The GLOBAL_ADMIN role cannot be deleted",
    "El rol no pertenece a la compañía del usuario": "The role does not belong to the user's company",
    "No encontrado": "Not found",
    "Motivo no encontrado": "Reason not found",
    "Grupo reclutador no encontrado": "Recruiter group not found",
    "Registro de outbox no encontrado": "Outbox entry not found",
    "Acción de notificación no encontrada": "Notification action not found",
    "Plantilla de notificación no encontrada": "Notification template not found",
    "Categoría de conocimiento no encontrada": "Knowledge category not found",
    "Etiqueta de cuestionario no encontrada": "Questionnaire tag not found",
    "Estado de cuestionario inválido": "Invalid questionnaire status",
    "Estado de outbox no válido": "Invalid outbox status",
    "Tipo de pregunta inválido": "Invalid question type",
    "Opciones inválidas para el tipo de pregunta": "Invalid options for question type",
    "Rol inválido": "Invalid role",
    "Ámbito inválido": "Invalid scope",
    "Ámbito inválido en CSV (use GLOBAL o TENANT)": "Invalid scope in CSV (use GLOBAL or TENANT)",
    "JSON de generation_config inválido": "Invalid generation_config JSON",
    "Usuario autenticado requerido": "Authenticated user required",
    "Se requiere usuario autenticado": "Authenticated user is required",
    "Se requiere permiso para publicar": "Publish permission required",
    "Se requiere permiso para archivar": "Archive permission required",
    "Se requiere postalCode o municipalityId": "postalCode or municipalityId is required",
    "Solo administradores globales pueden crear prompts globales": (
        "Only global administrators can create global prompts"
    ),
    "Solo administradores globales pueden crear registros globales": (
        "Only global administrators can create global records"
    ),
    "Solo se puede reintentar un envío en estado FAILED": "Only failed outbox entries can be retried",
    "Solo se puede solicitar cancelación en posiciones en borrador o activas.": (
        "Cancellation can only be requested for draft or active positions"
    ),
    "Solo se pueden clonar configuraciones publicadas o deprecadas.": (
        "Only published or deprecated configurations can be cloned"
    ),
    "Solo se pueden editar configuraciones en borrador.": "Only draft configurations can be edited",
    "Solo se pueden eliminar configuraciones en borrador.": "Only draft configurations can be deleted",
    "Solo el reclutador asignado o el gerente del grupo pueden solicitar cancelación.": (
        "Only the assigned recruiter or group manager can request cancellation"
    ),
    "Solo los cuestionarios publicados pueden archivarse": "Only published questionnaires can be archived",
    "Solo hay {0} preguntas elegibles tras los filtros; el examen solicita {1}": (
        "Only {0} eligible questions after filters; exam requests {1}"
    ),
    "Todas las etapas del reorder deben pertenecer al mismo alcance": (
        "All pipeline stages in the reorder must belong to the same scope"
    ),
    "Ya existe una etapa con ese orden en el mismo alcance": "Sort order already exists for this scope",
    "Ya existe un tipo de cancelación con ese código": "Cancellation type code already exists",
    "Ya existe un motivo de cancelación con ese código para el tipo indicado": (
        "Cancellation reason code already exists for this type"
    ),
    "No se permiten reclutadores duplicados en el mismo grupo": (
        "Duplicate recruiter users are not allowed in the same group"
    ),
    "No se encontró el usuario gerente responsable": "Responsible manager user was not found",
    "No se encontró reclutador para el correo {0}": "Recruiter user not found for email {0}",
    "El gerente responsable es obligatorio": "Responsible manager is required",
    "El gerente responsable debe ser un usuario activo": "Responsible manager must be an active user",
    "El gerente responsable debe pertenecer al tenant actual": (
        "Responsible manager must belong to the current tenant"
    ),
    "El gerente responsable no puede ser reclutador del mismo grupo": (
        "The responsible manager cannot also be a recruiter in the same group"
    ),
    "El correo del gerente es obligatorio en la fila CSV": "Manager email is required in the CSV row",
    "El companyId es obligatorio": "companyId is required",
    "El código telefónico debe iniciar con + y contener de 1 a 4 dígitos": (
        "Phone country code must start with + and contain 1 to 4 digits"
    ),
    "La empresa no tiene país configurado": "The company does not have a country configured",
    "Debe seleccionar al menos un canal": "At least one channel must be selected",
    "Debe indicar el servicio de procesamiento predeterminado": (
        "Default processing service is required when services are selected"
    ),
    "El servicio predeterminado debe estar entre los servicios seleccionados": (
        "Default processing service must be in processingServiceIds"
    ),
    "Extensión de archivo no válida o no accesible: {0}": "File extension not available: {0}",
    "Servicio de procesamiento no válido o no accesible: {0}": "Processing service not available: {0}",
    "La extensión está en uso por tipos de documento": "File extension is referenced by document types",
    "La clave del prompt ya existe globalmente": "Prompt key already exists globally",
    "La clave del prompt no se puede modificar": "Prompt key cannot be changed",
    "La clave es obligatoria en la fila CSV": "Prompt key is required in the CSV row",
    "No puede leer este prompt": "You cannot read this prompt",
    "No puede modificar este prompt": "You cannot modify this prompt",
    "No puede leer este registro de cuestionario": "You cannot read this questionnaire record",
    "No puede modificar este registro de cuestionario": "You cannot modify this questionnaire record",
    "El cuestionario debe estar publicado": "Questionnaire must be published",
    "El cuestionario debe tener al menos una pregunta para publicar": (
        "Questionnaire must have at least one question to publish"
    ),
    "El cuestionario publicado no puede modificarse": "Published questionnaire cannot be modified",
    "El cuestionario archivado no puede modificarse": "Archived questionnaire cannot be modified",
    "La pregunta está bloqueada y no puede modificarse": "Question is locked and cannot be modified",
    "El número de preguntas supera el banco del cuestionario": "Number of questions exceeds questionnaire pool",
    "Max intentos debe ser nulo o mayor que cero": "Max attempts must be null or greater than zero",
    "La fecha fin debe ser posterior a la fecha inicio": "End date must be after start date",
    "El orden es obligatorio": "Sort order is required",
    "El archivo CSV es obligatorio": "CSV file is required",
    "No se pudo leer el archivo CSV": "Failed to read CSV file",
    "Estructura CSV inválida: {0}": "Invalid CSV structure: {0}",
    "Import/export CSV no soportado para el catálogo: {0}": (
        "CSV import/export not supported for catalog: {0}"
    ),
    "El registro de catálogo no pertenece a la compañía activa": (
        "The catalog record does not belong to the active company"
    ),
    "La sucursal no corresponde al país de la empresa activa": (
        "The branch does not match the active company's country"
    ),
    "La clave de campo ya existe para el tenant.": "Field key already exists for this tenant",
    "Fuente de datos no permitida.": "Data source is not allowed",
    "Campo built-in: solo se permiten etiquetas y validadores.": (
        "Built-in field: only labels and validators can be changed"
    ),
    "No se puede eliminar un campo built-in.": "Built-in fields cannot be deleted",
    "No hay configuración publicada para el alcance solicitado.": (
        "No published configuration found for the requested scope"
    ),
    "Validación de publicación fallida: {0}.": "Publish validation failed: {0}",
    "Tenant inválido.": "Invalid tenant",
    "Campo obligatorio faltante: {0}.": "Required field missing: {0}",
    "Campo de solo lectura no puede modificarse: {0}.": "Read-only field cannot be changed: {0}",
    "La posición debe estar activa para generar la publicación.": (
        "Position must be active to generate the publication"
    ),
    "Formato de publicación inválido; use JPG o PDF.": "Invalid publication format; use JPG or PDF",
    "No se pudo generar el archivo de publicación en este momento.": (
        "Unable to generate the publication file at this time"
    ),
    "Número de WhatsApp inválido; use prefijo de país sin + y solo dígitos.": (
        "Invalid WhatsApp number; use country code without + and digits only"
    ),
    "No hay una URL HTTP alcanzable para la imagen; configure storage S3 (no local).": (
        "No reachable HTTP image URL; configure S3 storage (not local)"
    ),
    "El envío por correo no está configurado o está deshabilitado.": (
        "Email sending is not configured or is disabled"
    ),
    "No se pudo enviar la publicación por correo en este momento.": (
        "Unable to send the publication email at this time"
    ),
    "No tiene permiso para acceder a esta notificación": (
        "You do not have permission to access this notification"
    ),
    "Ya existe una plantilla para la acción {0} en el canal: {1}": (
        "A template already exists for action {0} on channel: {1}"
    ),
    "Tipo de archivo no permitido. Use PDF, JPG, PNG, DOC, DOCX, XLS o XLSX.": (
        "File type not allowed. Use PDF, JPG, PNG, DOC, DOCX, XLS or XLSX"
    ),
    "El archivo de evidencia es obligatorio.": "Evidence file is required",
    "El archivo de evidencia supera el máximo de 10 MB.": "Evidence file exceeds the 10 MB limit",
    "No se pudo leer el archivo de evidencia.": "Could not read the evidence file",
    "El archivo supera el tamaño máximo permitido.": "The file exceeds the maximum allowed size",
    "El motivo de cancelación es obligatorio.": "Cancellation reason is required",
    "El tipo y el motivo de cancelación son obligatorios.": "Cancellation type and reason are required",
    "El tipo de cancelación no existe o no está activo.": "The cancellation type does not exist or is inactive",
    "El motivo de cancelación no existe o no está activo.": (
        "The cancellation reason does not exist or is inactive"
    ),
    "El motivo no pertenece al tipo de cancelación seleccionado.": (
        "The reason does not belong to the selected cancellation type"
    ),
    "El gerente debe tener supervisor asignado para solicitar cancelación.": (
        "The manager must have a supervisor assigned to request cancellation"
    ),
    "No tiene permiso para autorizar esta cancelación.": (
        "You are not allowed to authorize this cancellation"
    ),
    "La requisición solicitada no existe.": "The requested requisition does not exist",
    "La requisición ya está cancelada.": "The requisition is already cancelled",
    "La cancelación ya fue solicitada.": "Cancellation has already been requested",
    "La cancelación no está autorizada.": "Cancellation is not authorized",
    "No hay solicitud de cancelación pendiente.": "There is no pending cancellation request",
    "Debe seleccionar un grupo de reclutadores.": "A recruiter group must be selected",
    "El grupo de reclutadores seleccionado no tiene gerente responsable.": (
        "The selected recruiter group has no responsible manager"
    ),
    "Debe indicar el reclutador asignado.": "An assigned recruiter must be specified",
    "El candidato ya está preseleccionado en {0} ({1}).": (
        "The candidate is already preselected for {0} ({1})."
    ),
    "El usuario solicitado no existe.": "The requested user does not exist",
    "El país seleccionado no existe.": "The selected country does not exist",
    "El idioma del portal no está disponible.": "The portal language is not available",
    "Debe iniciar sesión para continuar.": "You must sign in to continue",
    "El nombre de usuario ya existe.": "The username already exists",
    "El correo ya está registrado.": "The email is already registered",
    "El supervisor indicado no existe.": "The specified supervisor does not exist",
    "El supervisor no pertenece al tenant.": "The supervisor does not belong to the tenant",
    "Un usuario no puede ser su propio supervisor.": "A user cannot be their own supervisor",
    "No puede acceder a esta compañía.": "You cannot access this company",
    "No tiene permiso para acceder a este tenant.": "You do not have permission to access this tenant",
    "No tiene permiso para realizar esta acción.": "You are not allowed to perform this action",
    "Revise los campos marcados e intente de nuevo.": "Please review the highlighted fields and try again",
    "Registro de catálogo no encontrado": "Catalog entry not found",
    "El registro no pertenece al tenant actual": "The record does not belong to the current tenant",
    "Posición no encontrada.": "Position not found",
    "Configuración de formulario no encontrada.": "Form configuration not found",
    "Definición de campo no encontrada.": "Form field definition not found",
    "Portal de publicación no encontrado": "Job portal not found",
    "Motivo de rechazo no encontrado": "Rejection reason not found",
    "Motivo de cancelación no encontrado": "Cancellation reason not found",
    "Tipo de cancelación no encontrado": "Cancellation type not found",
    "Tipo de cobertura no encontrado": "Coverage type not found",
    "Nivel educativo no encontrado": "Education level not found",
    "Nivel de idioma no encontrado": "Language level not found",
    "Tipo de requisición no encontrado": "Requisition type not found",
    "Tipo de documento no encontrado": "Document type not found",
    "Extensión de archivo no encontrada": "File extension not found",
    "Prompt IA no encontrado": "AI prompt not found",
    "Etapa de pipeline no encontrada": "Pipeline stage not found",
    "Configuración ATS no encontrada": "ATS config not found",
    "Horario no encontrado": "Work schedule not found",
    "Lugar no encontrado": "Workplace not found",
    "Unidad no encontrada": "Business unit not found",
    "Tipo de contrato no encontrado": "Contract type not found",
}


def load_backend_en() -> dict[str, str]:
    props: dict[str, str] = {}
    if not BACKEND_EN.exists():
        return props
    for line in BACKEND_EN.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        props[key.strip()] = value.strip()
    return props


def infer_backend_key(code: str) -> str | None:
    if code in CODE_TO_BACKEND:
        return CODE_TO_BACKEND[code]
    if code.endswith("_NOT_FOUND"):
        slug = code[: -len("_NOT_FOUND")].lower()
        slug = slug.replace("businessunit", "business_unit")
        slug = slug.replace("coveragecategory", "coverage_category")
        slug = slug.replace("disabilitytype", "disability_type")
        slug = slug.replace("experiencelevel", "experience_level")
        slug = slug.replace("maritalstatus", "marital_status")
        slug = slug.replace("positiontype", "position_type")
        slug = slug.replace("responsibilitylevel", "responsibility_level")
        slug = slug.replace("workschedule", "work_schedule")
        slug = slug.replace("education_level", "education_level")
        slug = slug.replace("language_level", "language_level")
        slug = slug.replace("job_portal", "job_portal")
        slug = slug.replace("rejection_reason", "rejection_reason")
        slug = slug.replace("requisition_type", "requisition_type")
        slug = slug.replace("general_category", "general_category")
        slug = slug.replace("coverage_type", "coverage_type")
        slug = slug.replace("contract_type", "contract_type")
        slug = slug.replace("document_type", "document_type")
        slug = slug.replace("file_extension", "file_extension")
        slug = slug.replace("ai_prompt", "ai_prompt")
        slug = slug.replace("pipeline_stage", "pipeline_stage")
        slug = slug.replace("cancellation_type", "cancellation_type")
        slug = slug.replace("cancellation_reason", "cancellation_reason")
        slug = slug.replace("ats_config", "ats_config")
        candidate = f"error.catalog.{slug}.not_found"
        return candidate
    prefix_maps = [
        ("POSITION_CANCELLATION_", "error.position.cancellation."),
        ("POSITION_", "error.position."),
        ("REQUISITION_FORM_", "error.requisition_form."),
        ("QUESTIONNAIRE_EXAM_", "error.questionnaire.exam."),
        ("QUESTIONNAIRE_QUESTIONNAIRE_", "error.questionnaire.questionnaire."),
        ("QUESTIONNAIRE_QUESTION_", "error.questionnaire.question."),
        ("QUESTIONNAIRE_KNOWLEDGE_CATEGORY_", "error.questionnaire.knowledge_category."),
        ("QUESTIONNAIRE_TAG_", "error.questionnaire.tag."),
        ("QUESTIONNAIRE_", "error.questionnaire."),
        ("NOTIFICATION_TEMPLATE_", "error.notification.template."),
        ("NOTIFICATION_OUTBOX_", "error.notification.outbox."),
        ("NOTIFICATION_ACTION_", "error.notification.action."),
        ("NOTIFICATION_INBOX_", "error.notification.inbox."),
        ("USER_NOTIFICATION_", "error.notification.user_notification."),
        ("DOCUMENT_TYPE_", "error.document_type."),
        ("FILE_EXTENSION_", "error.file_extension."),
        ("AI_PROMPT_IMPORT_", "error.ai_prompt.import."),
        ("AI_PROMPT_", "error.ai_prompt."),
        ("CATALOG_CSV_", "error.catalog.csv."),
        ("PIPELINE_STAGE_", "error.catalog.pipeline_stage."),
        ("CANCELLATION_TYPE_", "error.catalog.cancellation_type."),
        ("CANCELLATION_REASON_", "error.catalog.cancellation_reason."),
        ("RECRUITER_GROUP_IMPORT_", "error.recruiter_group.import."),
        ("RECRUITER_GROUP_", "error.recruiter_group."),
        ("PUBLICATION_", "error.publication."),
    ]
    for prefix, backend_prefix in prefix_maps:
        if code.startswith(prefix):
            suffix = code[len(prefix) :].lower()
            return backend_prefix + suffix
    return None


def title_from_message(message_en: str) -> str:
    if len(message_en) <= 48 and message_en[0].isupper():
        return message_en.rstrip(".")
    lower = message_en.lower()
    if "not found" in lower:
        return "Not found"
    if "required" in lower:
        return "Required field"
    if "denied" in lower or "not allowed" in lower or "forbidden" in lower:
        return "Access denied"
    if "invalid" in lower:
        return "Invalid data"
    return message_en.split(".")[0][:48]


def translate_title(code: str, es_text: str, backend: dict[str, str]) -> str:
    if code in TITLE_BY_CODE:
        return TITLE_BY_CODE[code]
    key = infer_backend_key(code)
    if key and key in backend:
        return title_from_message(backend[key])
    if es_text in EXACT_ES_EN:
        return title_from_message(EXACT_ES_EN[es_text])
    if es_text.endswith(" no encontrado"):
        return es_text.replace(" no encontrado", " not found")
    if es_text.endswith(" no encontrada"):
        return es_text.replace(" no encontrada", " not found")
    if es_text.endswith(" inválido"):
        return "Invalid " + es_text.replace(" inválido", "").lower()
    if es_text.endswith(" inválida"):
        return "Invalid " + es_text.replace(" inválida", "").lower()
    if es_text.endswith(" requerido") or es_text.endswith(" requerida"):
        return es_text.split()[0] + " required"
    return EXACT_ES_EN.get(es_text, es_text)


def translate_message(code: str, es_text: str, backend: dict[str, str]) -> str:
    if es_text in EXACT_ES_EN:
        return EXACT_ES_EN[es_text]
    key = infer_backend_key(code)
    if key and key in backend:
        return backend[key]
    return translate_title(code, es_text, backend)


def collect_entries() -> list[tuple[str, str, str]]:
    entries: list[tuple[str, str, str]] = []
    for path in sorted(I18N_DIR.glob("api-error-catalog*.ts")):
        content = path.read_text(encoding="utf-8")
        for code, kind, text in ENTRY_RE.findall(content):
            entries.append((code, kind, text))
    return entries


def main() -> None:
    backend = load_backend_en()
    entries = collect_entries()
    mapping: dict[str, str] = {}
    for code, kind, es_text in entries:
        if kind == "title":
            en = translate_title(code, es_text, backend)
        else:
            en = translate_message(code, es_text, backend)
        mapping[es_text] = en
    OUT.write_text(json.dumps(dict(sorted(mapping.items())), ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    unchanged = [k for k, v in mapping.items() if k == v]
    print(f"Wrote {OUT} ({len(mapping)} entries, {len(unchanged)} unchanged)")
    if unchanged:
        print("Unchanged sample:", unchanged[:15])


if __name__ == "__main__":
    main()
