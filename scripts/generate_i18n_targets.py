#!/usr/bin/env python3
"""Generate es-ES and en-US XLF targets from messages.es-MX.xlf source."""
from __future__ import annotations

import json
import xml.etree.ElementTree as ET
from pathlib import Path

NS = {"x": "urn:oasis:names:tc:xliff:document:1.2"}
ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src/locale/messages.es-MX.xlf"
ERROR_CATALOG_EN = ROOT / "scripts/error_catalog_en.json"


def load_error_catalog_en() -> dict[str, str]:
    if not ERROR_CATALOG_EN.exists():
        return {}
    return json.loads(ERROR_CATALOG_EN.read_text(encoding="utf-8"))


EN_BY_SOURCE: dict[str, str] = {
    "No se pudo iniciar sesión. Intente de nuevo.": "Sign-in failed. Please try again.",
    "No se pudo completar el inicio de sesión con SSO. Intente de nuevo o use usuario y contraseña.": (
        "SSO sign-in could not be completed. Try again or use username and password."
    ),
    "Inicio": "Home",
    "Posiciones": "Positions",
    "Candidatos": "Candidates",
    "Cuestionarios": "Questionnaires",
    "Seguimiento": "Tracking",
    "Reportes": "Reports",
    "Configuraciones": "Settings",
    "Usuarios": "Users",
    "Grupos": "Groups",
    "Catálogos": "Catalogs",
    "Notificaciones": "Notifications",
    "Documentos": "Documents",
    "Prompts IA": "AI Prompts",
    "CVs": "CVs",
    "Entrevistas": "Interviews",
    "Etapas": "Stages",
    "Sistema": "System",
    "Bitácoras": "Audit logs",
    "Cerrar": "Close",
    "Cancelar": "Cancel",
    "Entendido": "Got it",
    "Continuar": "Continue",
    "Confirmar": "Confirm",
    "Ocurrió un error": "An error occurred",
    "Intente de nuevo. Si el problema continúa, contacte al administrador.": (
        "Please try again. If the problem persists, contact your administrator."
    ),
    "Operación completada": "Operation completed",
    "Información": "Information",
    "Atención": "Attention",
    "No se pudo cargar el contexto del tenant": "Could not load tenant context",
    "No se pudieron cargar los códigos telefónicos": "Could not load phone dial codes",
    "No se pudieron cargar los roles": "Could not load roles",
    "No se pudieron cargar los usuarios": "Could not load users",
    "No se pudo guardar el usuario": "Could not save user",
    "No se pudo eliminar el usuario": "Could not delete user",
    "Usuario guardado": "User saved",
    "Usuario eliminado": "User deleted",
    "Sí": "Yes",
    "No": "No",
    "Guardando...": "Saving...",
    "Guardar": "Save",
    "Smart Hire": "Smart Hire",
    "Ayuda": "Help",
    "Idioma": "Language",
    "Cerrar sesión": "Sign out",
    "Usuario no encontrado": "User not found",
    "País no encontrado": "Country not found",
    "No puede acceder a esta compañía": "You cannot access this company",
    "No tiene permiso para acceder a este tenant": "You are not allowed to access this tenant",
    "Compañía no encontrada": "Company not found",
    "Idioma no encontrado": "Language not found",
    "Debe iniciar sesión": "You must sign in",
    "El nombre de usuario ya existe": "Username already exists",
    "El correo ya está registrado": "Email is already registered",
    "Supervisor no encontrado": "Supervisor not found",
    "El supervisor no pertenece al tenant": "Supervisor does not belong to the tenant",
    "Un usuario no puede ser su propio supervisor": "A user cannot be their own supervisor",
    "Catálogo no encontrado": "Catalog not found",
    "El catálogo no pertenece al tenant": "Catalog does not belong to the tenant",
    "La sucursal no corresponde al país del tenant": "Branch does not match tenant country",
    "No autorizado": "Unauthorized",
    "Ocurrió un error. Intente de nuevo.": "An error occurred. Please try again.",
    "Portal de Reclutamiento": "Recruitment Portal",
    "Usuario": "Username",
    "El usuario es obligatorio": "Username is required",
    "Contraseña": "Password",
    "La contraseña es obligatoria": "Password is required",
    "Iniciar sesión": "Sign in",
    "o": "or",
    "Iniciar sesión con SSO corporativo": "Sign in with corporate SSO",
    "Buscar usuario": "Search user",
    "Nuevo usuario": "New user",
    "Correo": "Email",
    "Nombre": "First name",
    "Apellidos": "Last name",
    "Cód. tel.": "Phone code",
    "Teléfono": "Phone",
    "País (tenant)": "Country (tenant)",
    "Supervisor": "Supervisor",
    "Quitar supervisor": "Remove supervisor",
    "Sucursal": "Branch",
    "Área": "Area",
    "Departamento": "Department",
    "Usuario R3": "R3 user",
    "Perfil Appian": "Appian profile",
    "Puesto Manpower": "Manpower position",
    "Dirección": "Address",
    "Roles": "Roles",
    "Activo": "Active",
    "Editar usuario": "Edit user",
    # Catalog categories (3rd-level tabs)
    "Generales": "General",
    "Cuestionario": "Questionnaire",
    "Empresas": "Companies",
    "Portal": "Portal",
    "Datos MP": "MP Data",
    "SmartHire / Operación": "SmartHire / Operations",
    # Catalog entries
    "Género": "Gender",
    "Carrera": "Career",
    "Moneda": "Currency",
    "Turno": "Shift",
    "Prestación": "Benefit",
    "Tipo contratación": "Contract type",
    "Escolaridad": "Education level",
    "Nivel de idioma": "Language level",
    "Entidad federativa": "State",
    "Delegación municipio": "Municipality",
    "Cliente": "Client",
    "C Categoría cubrimiento": "Coverage category (C)",
    "Características": "Characteristics",
    "Categoría": "Category",
    "Estado civil": "Marital status",
    "Experiencia": "Experience",
    "Herramienta": "Tool",
    "Horario de trabajo": "Work schedule",
    "Lugar de trabajo": "Workplace",
    "Requisitos": "Requirements",
    "Nivel de responsabilidad": "Responsibility level",
    "Tipo de discapacidad": "Disability type",
    "Unidades de negocio": "Business units",
    "Puesto": "Position",
    "Grupo reclutadores": "Recruiter group",
    "Categoría cuestionario": "Questionnaire category",
    "Pregunta": "Question",
    "Mensajes": "Messages",
    "Sucursales": "Branches",
    "Portales de publicación": "Job posting portals",
    "Tipo cubrimiento": "Coverage type",
    "Parentesco": "Kinship",
    "Marca": "Brand",
    "Tipo documento": "Document type",
    "Tipo requisición": "Requisition type",
    "Colonia": "Neighborhood",
    # Catalog UI — Datos MP (country + coverage type)
    "Nuevo tipo de cobertura": "New coverage type",
    "Editar tipo de cobertura": "Edit coverage type",
    "Ámbito del registro:": "Record scope:",
    "Tenant actual": "Current tenant",
    "Global": "Global",
    "Todos los países": "All countries",
    "Clave": "Code",
    "Descripción": "Description",
    "Ámbito": "Scope",
    "Nuevo país": "New country",
    "Editar país": "Edit country",
    "Clave 1": "Primary code",
    "Clave 2": "Secondary code",
    "Id Manpower": "Manpower ID",
    "Región": "Region",
    "Portal empleo": "Job portal",
    "Id MP": "MP ID",
    "País": "Country",
    "Áreas": "Areas",
    "Departamentos": "Departments",
    "Valor": "Value",
    "Catálogo pendiente de implementación. Ver plan ": "Catalog not yet implemented. See plan ",
    # Catalog panel UI
    "Nuevo género": "New gender",
    "Editar género": "Edit gender",
    "Nuevo parentesco": "New kinship",
    "Editar parentesco": "Edit kinship",
    "Nueva empresa": "New company",
    "Editar empresa": "Edit company",
    "Nueva moneda": "New currency",
    "Editar moneda": "Edit currency",
    "Nueva carrera": "New career",
    "Editar carrera": "Edit career",
    "Nuevo idioma": "New language",
    "Editar idioma": "Edit language",
    "Nuevo turno": "New shift",
    "Editar turno": "Edit shift",
    "Nueva prestación": "New benefit",
    "Editar prestación": "Edit benefit",
    "Nuevo tipo": "New type",
    "Editar tipo de documento": "Edit document type",
    "Nuevo tipo de documento": "New document type",
    "Nueva marca": "New brand",
    "Editar marca": "Edit brand",
    "Nuevo tipo de contrato": "New contract type",
    "Editar tipo de contrato": "Edit contract type",
    "Nuevo nivel de educación": "New education level",
    "Editar nivel de educación": "Edit education level",
    "Nuevo nivel de idioma": "New language level",
    "Editar nivel de idioma": "Edit language level",
    "Nuevo tipo de requisición": "New requisition type",
    "Editar tipo de requisición": "Edit requisition type",
    "Nuevo áreas": "New area",
    "Editar áreas": "Edit area",
    "Nuevo departamentos": "New department",
    "Editar departamentos": "Edit department",
    "Nueva sucursales": "New branch",
    "Editar sucursales": "Edit branch",
    "Nueva categoría": "New category",
    "Editar categoría": "Edit category",
    "Nuevo categoría": "New category",
    "Nueva pregunta": "New question",
    "Editar pregunta": "Edit question",
    "Nuevo grupo": "New group",
    "Editar grupo": "Edit group",
    "Nuevo portal": "New portal",
    "Editar portal": "Edit portal",
    "Nueva entidad": "New state",
    "Editar entidad": "Edit state",
    "Nueva entidad federativa": "New state",
    "Nuevo municipio": "New municipality",
    "Editar municipio": "Edit municipality",
    "Nueva colonia": "New neighborhood",
    "Editar colonia": "Edit neighborhood",
    "Nuevo c categoría cubrimiento": "New coverage category (C)",
    "Editar c categoría cubrimiento": "Edit coverage category (C)",
    "Nuevo características": "New characteristic",
    "Editar características": "Edit characteristic",
    "Nuevo estado civil": "New marital status",
    "Editar estado civil": "Edit marital status",
    "Nuevo experiencia": "New experience level",
    "Editar experiencia": "Edit experience level",
    "Nuevo herramienta": "New tool",
    "Editar herramienta": "Edit tool",
    "Nuevo horario trabajo": "New work schedule",
    "Editar horario trabajo": "Edit work schedule",
    "Nuevo lugar trabajo": "New workplace",
    "Editar lugar trabajo": "Edit workplace",
    "Nuevo requisitos": "New requirement",
    "Editar requisitos": "Edit requirement",
    "Nuevo responsabilidad": "New responsibility level",
    "Editar responsabilidad": "Edit responsibility level",
    "Nuevo tipo discapacidad": "New disability type",
    "Editar tipo discapacidad": "Edit disability type",
    "Nuevo unidad de negocio": "New business unit",
    "Editar unidad de negocio": "Edit business unit",
    "Nuevo puesto": "New position",
    "Editar puesto": "Edit position",
    "Nuevo cliente": "New client",
    "Editar cliente": "Edit client",
    # Catalog column labels
    "Nombre comercial": "Trade name",
    "RFC": "Tax ID",
    "Símbolo": "Symbol",
    "Denominación": "Denomination",
    "Tipo": "Type",
    "IA": "AI",
    "Requiere carrera": "Requires career",
    "Aplica a carrera": "Applies to career",
    "Core ATS": "Core ATS",
    "Core Appian": "Core Appian",
    "CP": "ZIP code",
    "Razón social": "Legal name",
    "Empresa / área": "Company / area",
    "Contacto": "Contact",
    # Catalog form fields + company grid
    "Idioma portal": "Portal language",
    "Idioma default del portal": "Default portal language",
    "Mensaje facturación": "Billing message",
    "Código ATS": "ATS code",
    "Calle": "Street",
    "Municipio": "Municipality",
    "Estado": "State",
    "URL logo": "Logo URL",
    "URL banner": "Banner URL",
    "Sin orden de compra": "No purchase order",
    "Interfaz R3": "R3 interface",
    "Firma WS": "WS signature",
    "Empresa (opcional)": "Company (optional)",
    "Empresa": "Company",
    "Descripción corta": "Short description",
    "Código postal": "Postal code",
    "ID Manpower": "Manpower ID",
    "Valida con IA": "AI validation",
    "Teléfono": "Phone",
    "Correo": "Email",
    # Groups module
    "Grupos de usuarios": "User groups",
    "Permisos de módulo": "Module permissions",
    "Grupo": "Group",
    "Permisos": "Permissions",
    # Notifications module
    "Nueva plantilla": "New template",
    "Editar plantilla": "Edit template",
    "Acción del sistema": "System action",
    "Canales": "Channels",
    "ID plantilla externa": "External template ID",
    "Mensaje": "Message",
    "Activa": "Active",
    "Publicada": "Published",
    "Cancelada": "Cancelled",
    "Cancelación autorizada": "Cancellation authorized",
    "Modalidad de trabajo": "Work modality",
    "Publicar en portal candidatos": "Publish on candidate portal",
    "Acción": "Action",
    "Plantilla": "Template",
    "No se pudieron cargar las plantillas de notificación": "Could not load notification templates",
    "Selecciona al menos un canal": "Select at least one channel",
    "Plantilla guardada": "Template saved",
    "No se pudo guardar la plantilla": "Could not save template",
    "No se pudo actualizar la plantilla": "Could not update template",
    "Plantilla eliminada": "Template deleted",
    "No se pudo eliminar la plantilla": "Could not delete template",
    "activada": "activated",
    "desactivada": "deactivated",
    # Catalog CSV import/export
    "Descargue la plantilla, complete los datos y suba el archivo CSV.": (
        "Download the template, fill in the data, and upload the CSV file."
    ),
    "Descargar plantilla": "Download template",
    "Descargar reporte de errores": "Download error report",
    "Validar": "Validate",
    "Importar": "Import",
    "Exportar CSV": "Export CSV",
    "Importar CSV": "Import CSV",
    "No se pudo descargar la plantilla.": "Could not download template.",
    "Seleccione un archivo CSV.": "Select a CSV file.",
    "No se pudo validar el archivo.": "Could not validate file.",
    "No se pudo importar el archivo.": "Could not import file.",
    "No se pudo exportar el catálogo": "Could not export catalog",
    "Importación completada": "Import completed",
    # Pipeline stages module
    "Etapas del pipeline": "Pipeline stages",
    "Nueva etapa": "New stage",
    "Editar etapa": "Edit stage",
    "Etapa": "Stage",
    "Orden": "Order",
    "Color": "Color",
    "Reordenar": "Reorder",
    "Subir": "Move up",
    "Bajar": "Move down",
    "No se pudieron cargar las etapas del pipeline": "Could not load pipeline stages",
    "Etapa guardada": "Stage saved",
    "No se pudo guardar la etapa": "Could not save stage",
    "Etapa eliminada": "Stage deleted",
    "No se pudo eliminar la etapa": "Could not delete stage",
    "No se pudo reordenar las etapas": "Could not reorder stages",
    # Audit logs
    "Bitácoras de auditoría": "Audit logs",
    "Entidad": "Entity",
    "Detalle": "Details",
    # Settings mock config — documents
    "Documentos requeridos": "Required documents",
    "INE obligatorio": "INE required",
    "CURP obligatorio": "CURP required",
    "RFC obligatorio": "RFC required",
    "Comprobante de domicilio": "Proof of address",
    "Días para entrega": "Days to submit",
    "Configuración de documentos guardada": "Documents configuration saved",
    # Prompts (AVV-438)
    "Texto del prompt": "Prompt text",
    "Nuevo prompt": "New prompt",
    "Editar prompt": "Edit prompt",
    "Prompt": "Prompt",
    "No hay prompts configurados": "No prompts configured",
    "No se pudieron cargar los prompts": "Could not load prompts",
    "No se pudo guardar el prompt": "Could not save prompt",
    "No se pudo eliminar el prompt": "Could not delete prompt",
    "No se pudo actualizar el prompt": "Could not update prompt",
    "Prompt guardado": "Prompt saved",
    "Prompt eliminado": "Prompt deleted",
    "La clave no se puede modificar después de crear el registro": "Key cannot be changed after the record is created",
    "mostrar más": "show more",
    # CVs
    "Configuración de CVs": "CV configuration",
    "Formato aceptado": "Accepted format",
    "Tamaño máximo (MB)": "Maximum size (MB)",
    "Parseo automático con IA": "Automatic AI parsing",
    "Requerir fotografía": "Require photo",
    "Configuración de CVs guardada": "CV configuration saved",
    # Interviews
    "Configuración de entrevistas": "Interview configuration",
    "Duración default (min)": "Default duration (min)",
    "Modalidad": "Modality",
    "Recordatorio (horas antes)": "Reminder (hours before)",
    "Presencial": "In person",
    "Virtual": "Virtual",
    "Mixta": "Hybrid",
    "Configuración de entrevistas guardada": "Interview configuration saved",
    # System
    "Configuración del sistema": "System configuration",
    "Nombre de la instancia": "Instance name",
    "Zona horaria": "Timezone",
    "Idioma default": "Default language",
    "Español (México)": "Spanish (Mexico)",
    "Modo mantenimiento": "Maintenance mode",
    "Logs de depuración": "Debug logs",
    "Guardar configuración": "Save configuration",
    "Configuración del sistema guardada": "System configuration saved",
    # Catalog admin messages (TS snacks)
    "No se pudieron cargar entidades para el selector": "Could not load states for selector",
    "No se pudieron cargar municipios para el selector": "Could not load municipalities for selector",
    "No se pudieron cargar categorías para el formulario": "Could not load categories for form",
    "No se pudieron cargar los idiomas del portal": "Could not load portal languages",
    "No se pudo cargar la compañía": "Could not load company",
    "Registro eliminado": "Record deleted",
    "No se pudo eliminar el registro": "Could not delete record",
    # Groups snacks
    "No se pudieron cargar los permisos": "Could not load permissions",
    "No se pudieron cargar los grupos": "Could not load groups",
    "Grupo guardado": "Group saved",
    "No se pudo guardar el grupo": "Could not save group",
    "Grupo eliminado": "Group deleted",
    "No se pudo eliminar el grupo": "Could not delete group",
    # Dashboard home
    "Bienvenido,": "Welcome,",
    "Resumen general de tu actividad como reclutador": "Overview of your recruiting activity",
    "Total Posiciones": "Total positions",
    "Posiciones registradas en el tenant": "Positions registered in the tenant",
    "Candidatos Preseleccionados": "Preselected candidates",
    "Postulaciones en preselección": "Applications in preselection",
    "Candidatos Interesados": "Interested candidates",
    "Postulaciones marcadas interesadas": "Applications marked as interested",
    "Solicitudes": "Requests",
    "Nueva Requisición": "New requisition",
    "Buscar requisición": "Search requisition",
    "REQ, puesto, cliente, OT…": "REQ, position, client, WO…",
    "Usuario creador": "Creator user",
    "Fecha inicio": "Start date",
    "Fecha fin": "End date",
    "Limpiar filtros": "Clear filters",
    "Requisición": "Requisition",
    "Clave Cliente": "Client code",
    "# Pos.": "# Pos.",
    "Ciudad": "City",
    "Primer Día": "First day",
    "Estatus": "Status",
    "Fecha Creación": "Created date",
    "Ir a selección": "Go to selection",
    "Postular candidatos": "Apply candidates",
    "Ver postulados": "View applicants",
    "Duplicar": "Duplicate",
    "Solicitar cancelación": "Request cancellation",
    "Aprobar cancelación": "Approve cancellation",
    "Rechazar solicitud": "Reject request",
    "Cancelar directamente": "Cancel directly",
    "Paginación de solicitudes": "Requests pagination",
    "No se pudieron cargar los KPIs": "Could not load KPIs",
    "No se pudieron cargar las solicitudes": "Could not load requests",
    "Filtros limpiados": "Filters cleared",
    "No se pudo duplicar la posición": "Could not duplicate position",
    "Requisición cancelada": "Requisition cancelled",
    "No se pudo cancelar la requisición": "Could not cancel requisition",
    "Solicitud de cancelación enviada": "Cancellation request sent",
    "No se pudo solicitar la cancelación": "Could not request cancellation",
    "Cancelación aprobada": "Cancellation approved",
    "No se pudo aprobar la cancelación": "Could not approve cancellation",
    "Solicitud de cancelación rechazada": "Cancellation request rejected",
    "No se pudo rechazar la solicitud": "Could not reject request",
    # Common actions & status
    "Ver": "View",
    "Editar": "Edit",
    "Eliminar": "Delete",
    "Otros": "Others",
    "Borrador": "Draft",
    "Cancelación pendiente": "Pending cancellation",
    # Notifications placeholders & channels
    "ASIGNACION, CANCELACION, POSTULADO...": "ASSIGNMENT, CANCELLATION, APPLIED...",
    "WhatsApp / SendGrid template ID": "WhatsApp / SendGrid template ID",
    # Positions list (phase 2)
    "Gestión de requisiciones y posiciones abiertas": "Open requisition and position management",
    "Nueva posición": "New position",
    "Buscar posición": "Search position",
    "Cliente, puesto, OT, clave…": "Client, position, WO, code…",
    "No se pudieron cargar las posiciones": "Could not load positions",
    "Creación": "Created",
    "Más acciones": "More actions",
    # Remaining en-US gaps (single words / segments)
    "Fecha": "Date",
    "Reclutador": "Recruiter",
    "Todos": "All",
    "guardado": "saved",
    "Creados: ": "Created: ",
    " · Actualizados: ": " · Updated: ",
    " · Fallidos: ": " · Failed: ",
    "Notificación ": "Notification ",
    " candidato(s) postulado(s) a ": " candidate(s) applied to ",
    "¿Eliminar \"": "Delete \"",
    "\"? Esta acción no se puede deshacer.": "\"? This action cannot be undone.",
    " Catálogo pendiente de implementación. Ver plan ": " Catalog not yet implemented. See plan ",
    " y issues AVV-380+. ": " and issues AVV-380+. ",
    " guardado": " saved",
    "? Esta acción no se puede deshacer.": "? This action cannot be undone.",
    "? Quedará pendiente de aprobación.": "? It will be pending approval.",
    "? La requisición será eliminada.": "? The requisition will be deleted.",
    "? Volverá a borrador.": "? It will return to draft.",
    "¿Cancelar directamente la requisición ": "Cancel requisition ",
    "¿Solicitar cancelación de ": "Request cancellation of ",
    "¿Aprobar cancelación de ": "Approve cancellation of ",
    "¿Rechazar solicitud de cancelación de ": "Reject cancellation request for ",
    # Requisition wizard + form config (FE-03)
    "Formulario requisición": "Requisition form",
    "Configuración del formulario de requisición": "Requisition form configuration",
    "Cargar borrador": "Load draft",
    "Versión": "Version",
    "Publicado": "Published",
    "Pasos del wizard": "Wizard steps",
    "Campos del paso": "Step fields",
    "Clave del paso": "Step key",
    "Clave i18n de etiqueta": "Label i18n key",
    "Campo": "Field",
    "Visible": "Visible",
    "Obligatorio": "Required",
    "Agregar paso": "Add step",
    "Agregar campo": "Add field",
    "Quitar": "Remove",
    "Guardar borrador": "Save draft",
    "Publicar": "Publish",
    "Publicando...": "Publishing...",
    "Seleccione un paso para editar sus campos": "Select a step to edit its fields",
    "Reglas condicionales": "Conditional rules",
    'Visible cuando "Tiene personas a cargo" está activo': 'Visible when "Has people in charge" is enabled',
    'Obligatorio cuando "Tiene personas a cargo" está activo': 'Required when "Has people in charge" is enabled',
    "Al seleccionar un cliente, autollenar los campos relacionados del catálogo": (
        "When a client is selected, auto-fill related catalog fields"
    ),
    "Solo lectura mientras hay un cliente seleccionado": "Read-only while a client is selected",
    "Seleccione país y tipo de cobertura para cargar o crear el borrador de configuración": (
        "Select country and coverage type to load or create the configuration draft"
    ),
    "No se pudo cargar la configuración": "Could not load configuration",
    "Borrador guardado": "Draft saved",
    "No se pudo guardar el borrador": "Could not save draft",
    "Configuración publicada": "Configuration published",
    "No se pudo publicar la configuración": "Could not publish configuration",
    "Seleccione país y tipo de cobertura": "Select country and coverage type",
    "Datos Cliente": "Client data",
    "Datos cliente": "Client data",
    "Datos Manpower": "Manpower data",
    "Desc. cliente": "Client desc.",
    "Beneficios": "Benefits",
    "Contratación": "Hiring",
    "Reclutamiento": "Recruitment",
    "Descripción del cliente": "Client description",
    "Beneficios adicionales": "Additional benefits",
    "Preselección": "Preselection",
    "Nueva requisición": "New requisition",
    "Editar requisición": "Edit requisition",
    "Anterior": "Previous",
    "Creando...": "Creating...",
    "Cargando formulario de requisición…": "Loading requisition form…",
    "Selecciona el país y el tipo de cobertura para cargar el formulario correspondiente.": (
        "Select the country and coverage type to load the corresponding form."
    ),
    "Seleccione un tipo de cobertura": "Select a coverage type",
    "Cargando...": "Loading...",
    "No se pudieron cargar los países": "Could not load countries",
    "No se pudieron cargar los idiomas": "Could not load languages",
    "No se pudieron cargar los estados": "Could not load states",
    "No se pudieron cargar los municipios": "Could not load municipalities",
    "No se pudieron cargar las colonias": "Could not load neighborhoods",
    "Sin colonias para ese código postal": "No neighborhoods for that postal code",
    "No se pudo cargar la requisición": "Could not load the requisition",
    "Error al cargar catálogos de la requisición": "Error loading requisition catalogs",
    "Complete los campos obligatorios": "Please complete the required fields",
    "Requisición creada correctamente": "Requisition created successfully",
    "Requisición actualizada correctamente": "Requisition updated successfully",
    "No se pudo crear la requisición": "Could not create the requisition",
    "No se pudo actualizar la requisición": "Could not update the requisition",
    "JSON exportado a consola": "JSON exported to console",
    "Enviado a ATS (simulado)": "Sent to ATS (simulated)",
    "No se pudieron cargar los tipos de cobertura": "Could not load coverage types",
    "Cuentas de candidatos": "Candidate accounts",
    "Clave cliente": "Client code",
    "Nombre de contacto": "Contact name",
    "Teléfono de contacto": "Contact phone",
    "Correo de contacto": "Contact email",
    "Puesto del contacto": "Contact position",
    "Clave puesto cliente": "Client position code",
    "Nombre del puesto": "Position name",
    "Número de servicio": "Service number",
    "Experiencia en": "Experience in",
    "Nivel de experiencia": "Experience level",
    "Edad mínima": "Minimum age",
    "Edad máxima": "Maximum age",
    "Tiene personas a cargo": "Has people in charge",
    "Total personas a cargo": "Total people in charge",
    "Disponibilidad para viajar": "Willing to travel",
    "Disponibilidad para reubicación": "Willing to relocate",
    "Requisitos obligatorios": "Mandatory requirements",
    "Requisitos opcionales": "Optional requirements",
    "Requisitos deseables": "Desirable requirements",
    "Tarifa de servicio": "Service fee",
    "Anticipo": "Advance payment",
    "Hora inicio jornada": "Workday start time",
    "Hora fin jornada": "Workday end time",
    "Hora inicio comida": "Lunch start time",
    "Hora fin comida": "Lunch end time",
    "Turnos rotativos": "Rotating shifts",
    "Fecha compromiso": "Commitment date",
    "Fecha de contratación": "Hiring date",
    "Requisitos de contratación": "Hiring requirements",
    "Grupo reclutador": "Recruiter group",
    "Responsable CARE": "CARE responsible",
    "ATS responsable CARE": "CARE responsible ATS",
    "Vinculación": "Linkage",
    "Adulto mayor": "Senior citizen",
    "Subregión": "Subregion",
    "Correo del reclutador": "Recruiter email",
    "Categoría general": "General category",
    "Descripción del puesto": "Job description",
    "Salario mínimo publicado": "Published minimum salary",
    "Salario máximo publicado": "Published maximum salary",
    "Comisión": "Commission",
    "Ocultar salario": "Hide salary",
    "Portal de empleo": "Job portal",
    "Incluir habilidades blandas": "Include soft skills",
    "Incluir beneficios adicionales": "Include additional benefits",
    "Incluir desarrollo profesional": "Include professional development",
    "Incluir palabras clave": "Include keywords",
    "Descripción expansión cliente": "Client expansion description",
    "Texto beneficios adicionales": "Additional benefits text",
    # Publication templates / generate (Compartir QR)
    "Plantillas de publicación": "Publication templates",
    "Nueva plantilla": "New template",
    "Editar plantilla": "Edit template",
    "Predeterminada": "Default",
    "No hay plantillas de publicación configuradas": "No publication templates configured",
    "El idioma identifica esta plantilla; para otro idioma cree una plantilla nueva.": (
        "The language identifies this template; to use another language, create a new template."
    ),
    "Solo se listan idiomas sin plantilla. Si el idioma ya existe, edite esa plantilla.": (
        "Only languages without a template are listed. If the language already exists, edit that template."
    ),
    "Ya existen plantillas para todos los idiomas. Edite una plantilla existente.": (
        "Templates already exist for all languages. Edit an existing template."
    ),
    "No hay idiomas disponibles para crear una plantilla": "No languages available to create a template",
    "Plantilla de publicación requerida": "Publication template required",
    "No hay plantilla de publicación para el idioma seleccionado. Cree una plantilla en Configuración para poder generar el anuncio.": (
        "There is no publication template for the selected language. Create a template in Settings to generate the announcement."
    ),
    "Crear publicación": "Create publication",
    "No se pudo verificar si existen plantillas de publicación": (
        "Could not verify whether publication templates exist"
    ),
    "No se pudieron cargar los prefijos telefónicos": "Could not load phone country prefixes",
    "No se pudo verificar las plantillas de publicación": "Could not verify publication templates",
    "Português": "Portuguese",
    "No se pudieron cargar las plantillas": "Could not load templates",
    "No se pudo guardar la plantilla": "Could not save the template",
    "No se pudo eliminar la plantilla": "Could not delete the template",
    "No se pudo cargar la plantilla": "Could not load the template",
    "No se pudo generar la vista previa": "Could not generate the preview",
    "Plantilla guardada": "Template saved",
    "Plantilla eliminada": "Template deleted",
    "Contenido HTML": "HTML content",
    "Plantilla predeterminada": "Default template",
    "Nueva plantilla de publicación": "New publication template",
    "Editar plantilla de publicación": "Edit publication template",
    "Español": "Spanish",
    "Inglés": "English",
    "Portugués": "Portuguese",
    "Vista previa": "Preview",
    "Vista previa de la plantilla": "Template preview",
    "Genera la vista previa para ver el resultado aquí": "Generate the preview to see the result here",
    "Generando vista previa...": "Generating preview...",
    "Cerrar vista previa": "Close preview",
    "Configurar publicación": "Configure publication",
    "Anuncio": "Announcement",
    "Tipo de documento": "Document type",
    "Aceptar": "Accept",
    "Descargar": "Download",
    "Compartir / Enviar": "Share / Send",
    "Prefijo país": "Country prefix",
    "Teléfono destino": "Destination phone",
    "Correo destino": "Destination email",
    "Compartir": "Share",
    "Enviar": "Send",
    "WhatsApp solo envía JPG; cambia el tipo de documento a JPG": (
        "WhatsApp only sends JPG; change the document type to JPG"
    ),
    "El envío por correo estará disponible pronto": "Email send will be available soon",
    "Publicación enviada por WhatsApp": "Publication sent via WhatsApp",
    "No se pudo compartir por WhatsApp": "Could not share via WhatsApp",
    "Enviando por WhatsApp…": "Sending via WhatsApp…",
    "Publicación enviada por correo": "Publication sent by email",
    "No se pudo enviar la publicación por correo": "Could not send the publication by email",
    "Enviando por correo…": "Sending by email…",
    "Generando la vista previa…": "Generating preview…",
    "Generando anuncio…": "Generating announcement…",
    "No se pudo obtener la información de contacto de la posición": (
        "Could not load the position contact information"
    ),
    "No se pudo generar el anuncio": "Could not generate the announcement",
    "Generar publicación": "Generate publication",
    "Contacto en el anuncio": "Contact on the announcement",
    # Requisition form config (list / create)
    "Nombre de configuración": "Configuration name",
    "Ámbito": "Scope",
    "Esta configuración aplica a la siguiente combinación de país y cobertura:": (
        "This configuration applies to the following country and coverage combination:"
    ),
    "Ingrese el nombre de la configuración": "Enter the configuration name",
    "Nueva configuración": "New configuration",
    "Crear": "Create",
    "Crear borrador": "Create draft",
    "Actualizar listado": "Refresh list",
    "No hay configuraciones para los filtros seleccionados.": (
        "There are no configurations for the selected filters."
    ),
    "No se pudo cargar el listado de configuraciones. Verifique permisos y conexión con el API.": (
        "Could not load the configuration list. Check permissions and API connectivity."
    ),
    "Cobertura": "Coverage",
    "Versión": "Version",
    "Acciones": "Actions",
    "Configuración publicada o deprecada (solo lectura). Use el icono de copiar para crear un borrador desde plantilla.": (
        "Published or deprecated configuration (read-only). Use the copy icon to create a draft from the template."
    ),
    "Configuración eliminada": "Configuration deleted",
    "No se pudo eliminar la configuración": "Could not delete the configuration",
    # Position applications dialog
    "Candidatos postulados": "Applied candidates",
    "Posición": "Position",
    "No hay candidatos postulados a esta posición.": "No candidates have applied to this position.",
    "Compat.": "Compat.",
    "Postulación": "Application",
    "Acciones del candidato": "Candidate actions",
    "Ver perfil completo": "View full profile",
    "Ver documentos": "View documents",
    "Preseleccionar": "Preselect",
    "Candidato preseleccionado": "Candidate preselected",
    "No se pudo preseleccionar al candidato": "Could not preselect the candidate",
    "No se pudieron cargar las postulaciones": "Could not load applications",
    # Candidate profile view
    "Perfil completo del candidato": "Candidate full profile",
    "Volver a preselección": "Back to preselection",
    "Beneficiarios": "Beneficiaries",
    "Contactos emergencia": "Emergency contacts",
    "Datos generales": "General information",
    "Correo": "Email",
    "Teléfono": "Phone",
    "Género": "Gender",
    "Alta": "Registered",
    "Experiencia": "Experience",
    "Salario deseado": "Desired salary",
    "Identificación oficial": "Official identification",
    "No registrado": "Not registered",
    "Ubicación": "Location",
    "Estatus": "Status",
    "Activo": "Active",
    "Inactivo": "Inactive",
    "Experiencia laboral": "Work experience",
    "Estudios": "Education",
    "Cursos / Certificaciones": "Courses / Certifications",
    "Idiomas": "Languages",
    "Habilidades": "Skills",
    "Sin experiencia registrada.": "No experience recorded.",
    "Sin estudios registrados.": "No education recorded.",
    "Sin cursos o certificaciones registradas.": "No courses or certifications recorded.",
    "Sin idiomas registrados.": "No languages recorded.",
    "Sin habilidades registradas.": "No skills recorded.",
    "Candidato no encontrado.": "Candidate not found.",
    "Actual": "Present",
    "Titulado": "Graduate",
    "Promedio": "Average",
    "Vence": "Expires",
    "año": "year",
    "años": "years",
    "No se pudo cargar el candidato": "Could not load the candidate",
    "No se pudieron cargar las secciones del perfil": "Could not load profile sections",
    "Curso": "Course",
    "Certificación": "Certification",
    "Otro": "Other",
    "Básico": "Basic",
    "Intermedio": "Intermediate",
    "Avanzado": "Advanced",
    "Experto": "Expert",
    # Candidate documents dialog
    "Documentos del candidato": "Candidate documents",
    "No hay documentos registrados.": "No documents recorded.",
    "Tipo": "Type",
    "Archivo": "File",
    "Tamaño": "Size",
    "Validación": "Validation",
    "Fecha": "Date",
    "Validar documento": "Validate document",
    "Marcar validado": "Mark validated",
    "Marcar no validado": "Mark not validated",
    "pendiente": "Pending",
    "validado": "Validated",
    "no valido": "Not valid",
    "Marcar como validado": "Mark as validated",
    "Marcar como no valido": "Mark as not valid",
    "Documento no validado": "Invalid document",
    "Motivo": "Reason",
    "No se pudieron cargar los documentos": "Could not load documents",
    "No se pudo descargar el documento": "Could not download the document",
    "No se pudo actualizar la validación del documento": "Could not update document validation",
    "Validación del documento actualizada": "Document validation updated",
    # Requisition wizard — field labels and UI (en-US targets)
    "Orden de trabajo (OT)": "Work order (OT)",
    "Id de Orden": "Order ID",
    "Puesto Cliente": "Client position",
    "Salario": "Salary",
    "Días de trabajo": "Work days",
    "Número de posiciones": "Number of positions",
    "Prestaciones": "Benefits",
    "FEE de servicio": "Service fee",
    "¿Lleva anticipo?": "Has advance payment?",
    "Herramientas": "Tools",
    "Requerimientos": "Requirements",
    "Idioma principal": "Primary language",
    "Idioma secundario": "Secondary language",
    "Nivel requerido": "Required level",
    "Años experiencia": "Years of experience",
    "Notas generales": "General notes",
    "Headcount": "Headcount",
    "Fecha inicio": "Start date",
    "Días prueba": "Probation days",
    "Modalidad": "Modality",
    "Ninguno": "None",
    "Nivel": "Level",
    "Agregar idioma": "Add language",
    "Tipo evaluación": "Evaluation type",
    "Porcentaje": "Percentage",
    "Puntaje": "Score",
    "% aceptación": "Acceptance %",
    "Documento": "Document",
    "Cargando tipos de documento...": "Loading document types...",
    "Sin tipos de documento para el país seleccionado.": "No document types for the selected country.",
    "Seleccione el país del cliente en el paso anterior para cargar la geografía.": (
        "Select the client country in the previous step to load geography."
    ),
    "Seleccione el país del cliente para cargar tipos de documento.": (
        "Select the client country to load document types."
    ),
    "Abrir selector de hora": "Open time picker",
    "País cliente": "Client country",
    "Tipo reclutamiento": "Recruitment type",
    "Categoría cobertura": "Coverage category",
    "Generales": "General",
    "Días laborales": "Work days",
    "# Posiciones": "# Positions",
    "Lunes": "Monday",
    "Martes": "Tuesday",
    "Miércoles": "Wednesday",
    "Jueves": "Thursday",
    "Viernes": "Friday",
    "Sábado": "Saturday",
    "Domingo": "Sunday",
    "Configuración de calendario": "Calendar settings",
    "Entrevista por videoconferencia": "Video conference interview",
    "Entrevista presencial": "In-person interview",
    "Videoconferencia": "Video conference",
    "Presencial": "In person",
    "Tiempo de duración": "Duration",
    "Días laborales máximos": "Max working days",
    "Horario laboral": "Working hours",
    "Hora inicio": "Start time",
    "Hora término": "End time",
    "Recordatorio de cita": "Appointment reminder",
    "15 minutos antes": "15 minutes before",
    "1 hora antes": "1 hour before",
    "Descuenta días inhábiles": "Exclude non-working days",
    "Calendario de disponibilidad": "Availability calendar",
    "Dirección": "Address",
    "Instrucciones": "Instructions",
    "Referencias": "References",
    "Mapa": "Map",
    "URL calendario externo (stub)": "External calendar URL (stub)",
    "Configuración de calendario guardada": "Calendar settings saved",
    "No se pudo cargar la configuración de calendario": "Could not load calendar settings",
    "No se pudo guardar la configuración de calendario": "Could not save calendar settings",
    "Agendar entrevista": "Schedule interview",
    "Fecha y hora": "Date and time",
    "Fecha y hora propuesta": "Proposed date and time",
    "Link de reunión": "Meeting link",
    "Agendar": "Schedule",
    "Entrevista agendada": "Interview scheduled",
    "Propuesta de entrevista enviada al candidato": "Interview proposal sent to the candidate",
    "Calculando horario disponible…": "Calculating available time slot…",
    "No hay horarios disponibles para esta modalidad": "No available time slots for this modality",
    "No se pudo agendar la entrevista": "Could not schedule the interview",
    "Seleccione un solo candidato para agendar la entrevista": (
        "Select a single candidate to schedule the interview"
    ),
    "Antelación mínima (horas)": "Minimum lead time (hours)",
    "Expiración de propuesta (horas)": "Proposal expiration (hours)",
    "OpenStreetMap — arrastra el pin o haz clic para ubicar.": (
        "OpenStreetMap — drag the pin or click to set the location."
    ),
    "Ubicar en mapa": "Locate on map",
    "Ingrese una dirección": "Enter an address",
    "No se pudo ubicar la dirección en el mapa": "Could not locate the address on the map",
    "Ingresa la dirección del lugar": "Enter the venue address",
    "Ingresa instrucciones adicionales": "Enter additional instructions",
    "Ingresa referencias para llegar al lugar": "Enter directions to reach the venue",
    "Cerrar": "Close",
    "GUARDAR": "SAVE",
    "CANCELAR": "CANCEL",
    "15 minutos": "15 minutes",
    "30 minutos": "30 minutes",
    "45 minutos": "45 minutes",
    "60 minutos": "60 minutes",
}

ERROR_CATALOG_EN_MAP = load_error_catalog_en()


def translate_en(source: str) -> str:
    if source in ERROR_CATALOG_EN_MAP:
        return ERROR_CATALOG_EN_MAP[source]
    if source in EN_BY_SOURCE:
        return EN_BY_SOURCE[source]
    if "Eliminar el usuario" in source:
        return source.replace("¿Eliminar el usuario", "Delete user").replace(
            "Esta acción no se puede deshacer.", "This action cannot be undone."
        )
    if "Eliminar la plantilla" in source:
        return source.replace("¿Eliminar la plantilla", "Delete template").replace(
            "Esta acción no se puede deshacer.", "This action cannot be undone."
        )
    if "Eliminar la configuración v" in source:
        return source.replace("¿Eliminar la configuración v", "Delete configuration v").replace(
            "Esta acción no se puede deshacer.", "This action cannot be undone."
        )
    if "Eliminar la etapa" in source:
        return source.replace("¿Eliminar la etapa", "Delete stage")
    if source.startswith("Importar "):
        return "Import " + source[len("Importar ") :]
    if "Estructura válida. Filas detectadas:" in source:
        return source.replace("Estructura válida. Filas detectadas:", "Valid structure. Rows detected:").replace(
            "Filas detectadas:", "Rows detected:"
        )
    if "Creados:" in source and "Actualizados:" in source:
        return (
            source.replace("Creados:", "Created:")
            .replace("Actualizados:", "Updated:")
            .replace("Fallidos:", "Failed:")
        )
    if "Notificación " in source and ("activada" in source or "desactivada" in source):
        return (
            source.replace("Notificación ", "Notification ")
            .replace("activada", "activated")
            .replace("desactivada", "deactivated")
        )
    if source.startswith("No se pudieron cargar "):
        return "Could not load " + source[len("No se pudieron cargar ") :]
    if source.endswith(" guardado") and not source.startswith("No "):
        return source[: -len(" guardado")] + " saved"
    if source.startswith("No se pudo guardar "):
        return "Could not save " + source[len("No se pudo guardar ") :]
    if "Eliminar \"" in source and "Esta acción no se puede deshacer" in source:
        return source.replace("¿Eliminar", "Delete").replace(
            "Esta acción no se puede deshacer.", "This action cannot be undone."
        )
    if source.startswith("Posición duplicada: REQ-"):
        return source.replace("Posición duplicada:", "Position duplicated:")
    if "candidato(s) postulado(s) a" in source:
        return source.replace("candidato(s) postulado(s) a", "candidate(s) applied to")
    if source.startswith("¿Cancelar directamente la requisición"):
        return source.replace("¿Cancelar directamente la requisición", "Cancel requisition").replace(
            "Esta acción no se puede deshacer.", "This action cannot be undone."
        )
    if source.startswith("¿Solicitar cancelación de"):
        return source.replace("¿Solicitar cancelación de", "Request cancellation of").replace(
            "Quedará pendiente de aprobación.", "It will be pending approval."
        )
    if source.startswith("¿Aprobar cancelación de"):
        return source.replace("¿Aprobar cancelación de", "Approve cancellation of").replace(
            "La requisición será eliminada.", "The requisition will be deleted."
        )
    if source.startswith("¿Rechazar solicitud de cancelación de"):
        return source.replace("¿Rechazar solicitud de cancelación de", "Reject cancellation request for").replace(
            "Volverá a borrador.", "It will return to draft."
        )
    if source.startswith("¿Eliminar el grupo"):
        return source.replace("¿Eliminar el grupo", "Delete group").replace(
            "Esta acción no se puede deshacer.", "This action cannot be undone."
        )
    if source.startswith("¿Eliminar la plantilla \""):
        return source.replace("¿Eliminar la plantilla", "Delete template").replace(
            "Esta acción no se puede deshacer.", "This action cannot be undone."
        )
    if source.startswith("¿Eliminar la etapa \""):
        return source.replace("¿Eliminar la etapa", "Delete stage")
    if source.startswith("¿Eliminar el prompt"):
        return source.replace("¿Eliminar el prompt", "Delete prompt").replace(
            "Esta acción no se puede deshacer.", "This action cannot be undone."
        )
    if source.startswith("No se pudo cargar la configuración"):
        return "Could not load configuration"
    if source.startswith("No se pudo guardar el borrador"):
        return "Could not save draft"
    if source.startswith("No se pudo publicar la configuración"):
        return "Could not publish configuration"
    if source.startswith("Seleccione país y tipo de cobertura para"):
        return "Select country and coverage type to load or create the configuration draft"
    if source.startswith("Seleccione país y tipo de cobertura"):
        return "Select country and coverage type"
    if source.startswith("Seleccione un paso para editar"):
        return "Select a step to edit its fields"
    if source.startswith("Visible cuando"):
        return 'Visible when "Has people in charge" is enabled'
    if source.startswith("Obligatorio cuando"):
        return 'Required when "Has people in charge" is enabled'
    if source.startswith("Configuración del formulario"):
        return "Requisition form configuration"
    if source.startswith("Pasos del wizard"):
        return "Wizard steps"
    if source.startswith("Campos del paso"):
        return "Step fields"
    if source.startswith("Clave i18n de etiqueta"):
        return "Label i18n key"
    if source.startswith("Clave del paso"):
        return "Step key"
    if source.startswith("Guardar borrador"):
        return "Save draft"
    if source.startswith("Cargar borrador"):
        return "Load draft"
    if source.startswith("Publicando..."):
        return "Publishing..."
    if source.startswith("Borrador guardado"):
        return "Draft saved"
    if source.startswith("Configuración publicada"):
        return "Configuration published"
    if source.startswith("Reglas condicionales"):
        return "Conditional rules"
    if source.startswith("Formulario requisición"):
        return "Requisition form"
    if source.startswith("Datos Cliente") or source.startswith("Datos cliente"):
        return "Client data"
    if source.startswith("Datos Manpower"):
        return "Manpower data"
    if source.startswith("Desc. cliente"):
        return "Client desc."
    if source == "Beneficios":
        return "Benefits"
    if source.startswith("Nueva requisición"):
        return "New requisition"
    if source.startswith("Editar requisición"):
        return "Edit requisition"
    if source == "Anterior":
        return "Previous"
    if source.startswith("Creando..."):
        return "Creating..."
    if source.startswith("Cargando formulario de requisición"):
        return "Loading requisition form…"
    if source.startswith("Selecciona el país y el tipo de cobertura"):
        return "Select the country and coverage type to load the corresponding form."
    if source.startswith("Seleccione un tipo de cobertura"):
        return "Select a coverage type"
    if source.startswith("Sin colonias para ese código postal"):
        return "No neighborhoods for that postal code"
    if source.startswith("No se pudo cargar la requisición"):
        return "Could not load the requisition"
    if source.startswith("Error al cargar catálogos"):
        return "Error loading requisition catalogs"
    if source.startswith("Complete los campos obligatorios"):
        return "Please complete the required fields"
    if source.startswith("Requisición creada correctamente"):
        return "Requisition created successfully"
    if source.startswith("Requisición actualizada correctamente"):
        return "Requisition updated successfully"
    if source.startswith("No se pudo crear la requisición"):
        return "Could not create the requisition"
    if source.startswith("No se pudo actualizar la requisición"):
        return "Could not update the requisition"
    if source.startswith("JSON exportado a consola"):
        return "JSON exported to console"
    if source.startswith("Enviado a ATS"):
        return "Sent to ATS (simulated)"
    if source.startswith("Cuentas de candidatos"):
        return "Candidate accounts"
    if source.startswith("Contratación"):
        return "Hiring"
    if source.startswith("Reclutamiento"):
        return "Recruitment"
    if source.startswith("Descripción del cliente"):
        return "Client description"
    if source.startswith("Beneficios adicionales"):
        return "Additional benefits"
    if source.startswith("Preselección"):
        return "Preselection"
    if source.startswith("Tipo de requisición"):
        return "Requisition type"
    if source.startswith("Tipo de cobertura"):
        return "Coverage type"
    if source.startswith("Clave cliente"):
        return "Client code"
    if source.startswith("Nombre de contacto"):
        return "Contact name"
    if source.startswith("Teléfono de contacto"):
        return "Contact phone"
    if source.startswith("Correo de contacto"):
        return "Contact email"
    if source.startswith("Puesto del contacto"):
        return "Contact position"
    if source.startswith("Clave puesto cliente"):
        return "Client position code"
    if source.startswith("Nombre del puesto"):
        return "Position name"
    if source.startswith("Número de servicio"):
        return "Service number"
    if source.startswith("Experiencia en"):
        return "Experience in"
    if source.startswith("Nivel de experiencia"):
        return "Experience level"
    if source.startswith("Edad mínima"):
        return "Minimum age"
    if source.startswith("Edad máxima"):
        return "Maximum age"
    if source.startswith("Tiene personas a cargo"):
        return "Has people in charge"
    if source.startswith("Total personas a cargo"):
        return "Total people in charge"
    if source.startswith("Disponibilidad para viajar"):
        return "Willing to travel"
    if source.startswith("Disponibilidad para reubicación"):
        return "Willing to relocate"
    if source.startswith("Requisitos obligatorios"):
        return "Mandatory requirements"
    if source.startswith("Requisitos opcionales"):
        return "Optional requirements"
    if source.startswith("Requisitos deseables"):
        return "Desirable requirements"
    if source.startswith("Tipo de contrato"):
        return "Contract type"
    if source.startswith("Tarifa de servicio"):
        return "Service fee"
    if source.startswith("Hora inicio jornada"):
        return "Workday start time"
    if source.startswith("Hora fin jornada"):
        return "Workday end time"
    if source.startswith("Hora inicio comida"):
        return "Lunch start time"
    if source.startswith("Hora fin comida"):
        return "Lunch end time"
    if source.startswith("Turnos rotativos"):
        return "Rotating shifts"
    if source.startswith("Fecha compromiso"):
        return "Commitment date"
    if source.startswith("Fecha de contratación"):
        return "Hiring date"
    if source.startswith("Requisitos de contratación"):
        return "Hiring requirements"
    if source.startswith("Grupo reclutador"):
        return "Recruiter group"
    if source.startswith("Responsable CARE"):
        return "CARE responsible"
    if source.startswith("ATS responsable CARE"):
        return "CARE responsible ATS"
    if source.startswith("Adulto mayor"):
        return "Senior citizen"
    if source.startswith("Entidad federativa"):
        return "State"
    if source.startswith("Correo del reclutador"):
        return "Recruiter email"
    if source.startswith("Categoría general"):
        return "General category"
    if source.startswith("Descripción del puesto"):
        return "Job description"
    if source.startswith("Salario mínimo publicado"):
        return "Published minimum salary"
    if source.startswith("Salario máximo publicado"):
        return "Published maximum salary"
    if source.startswith("Ocultar salario"):
        return "Hide salary"
    if source.startswith("Portal de empleo"):
        return "Job portal"
    if source.startswith("Incluir habilidades blandas"):
        return "Include soft skills"
    if source.startswith("Incluir beneficios adicionales"):
        return "Include additional benefits"
    if source.startswith("Incluir desarrollo profesional"):
        return "Include professional development"
    if source.startswith("Incluir palabras clave"):
        return "Include keywords"
    if source.startswith("Descripción expansión cliente"):
        return "Client expansion description"
    if source.startswith("Texto beneficios adicionales"):
        return "Additional benefits text"
    if source.startswith("Documentos requeridos"):
        return "Required documents"
    if source.startswith("Orden de trabajo"):
        return "Work order (OT)"
    if source.startswith("Id de Orden"):
        return "Order ID"
    if source.startswith("Puesto Cliente"):
        return "Client position"
    if source == "Salario":
        return "Salary"
    if source.startswith("Días de trabajo"):
        return "Work days"
    if source.startswith("Número de posiciones"):
        return "Number of positions"
    if source == "Prestaciones":
        return "Benefits"
    if source.startswith("FEE de servicio"):
        return "Service fee"
    if source.startswith("¿Lleva anticipo?"):
        return "Has advance payment?"
    if source == "Herramientas":
        return "Tools"
    if source.startswith("Agregar idioma"):
        return "Add language"
    if source.startswith("Tipo evaluación"):
        return "Evaluation type"
    if source == "Porcentaje":
        return "Percentage"
    if source == "Puntaje":
        return "Score"
    if source.startswith("% aceptación"):
        return "Acceptance %"
    if source == "Documento":
        return "Document"
    if source.startswith("Cargando tipos de documento"):
        return "Loading document types..."
    if source.startswith("Sin tipos de documento"):
        return "No document types for the selected country."
    if source.startswith("Seleccione el país del cliente en el paso anterior"):
        return "Select the client country in the previous step to load geography."
    if source.startswith("Seleccione el país del cliente para cargar tipos"):
        return "Select the client country to load document types."
    if source.startswith("Abrir selector de hora"):
        return "Open time picker"
    if source == "Lunes":
        return "Monday"
    if source == "Martes":
        return "Tuesday"
    if source == "Miércoles":
        return "Wednesday"
    if source == "Jueves":
        return "Thursday"
    if source == "Viernes":
        return "Friday"
    if source == "Sábado":
        return "Saturday"
    if source == "Domingo":
        return "Sunday"
    if source == "Publicada":
        return "Published"
    if source == "Cancelada":
        return "Cancelled"
    if source.startswith("Cancelación autorizada"):
        return "Cancellation authorized"
    if source.startswith("Modalidad de trabajo"):
        return "Work modality"
    if source.startswith("Publicar en portal candidatos"):
        return "Publish on candidate portal"
    if source == "Ninguno":
        return "None"
    if source == "Nivel":
        return "Level"
    return source


def clone_source_content(parent: ET.Element, source_el: ET.Element, *, translate: bool) -> None:
    """Copy source inner content into parent, optionally translating text segments."""
    fn = translate_en if translate else (lambda value: value)
    if source_el.text is not None:
        parent.text = fn(source_el.text)
    for child in source_el:
        placeholder = ET.SubElement(parent, "x", dict(child.attrib))
        if child.tail is not None:
            placeholder.tail = fn(child.tail)


def build(file_locale: str, target_lang: str) -> None:
    tree = ET.parse(SRC)
    file_el = tree.getroot().find("x:file", NS)
    body = file_el.find("x:body", NS)

    out = ET.Element("xliff", {"version": "1.2", "xmlns": "urn:oasis:names:tc:xliff:document:1.2"})
    out_file = ET.SubElement(
        out,
        "file",
        {
            "source-language": "es-MX",
            "target-language": target_lang,
            "datatype": "plaintext",
            "original": "ng2.template",
        },
    )
    out_body = ET.SubElement(out_file, "body")

    for unit in body.findall("x:trans-unit", NS):
        uid = unit.get("id")
        source_el = unit.find("x:source", NS)
        new_unit = ET.SubElement(out_body, "trans-unit", {"id": uid, "datatype": unit.get("datatype", "html")})

        new_source = ET.SubElement(new_unit, "source")
        clone_source_content(new_source, source_el, translate=False)

        new_target = ET.SubElement(new_unit, "target")
        clone_source_content(new_target, source_el, translate=target_lang.startswith("en"))

    ET.indent(out, space="  ")
    path = ROOT / f"src/locale/messages.{file_locale}.xlf"
    path.write_text(
        '<?xml version="1.0" encoding="UTF-8" ?>\n' + ET.tostring(out, encoding="unicode") + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {path}")


if __name__ == "__main__":
    build("es-ES", "es")
    build("en-US", "en")
