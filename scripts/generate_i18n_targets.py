#!/usr/bin/env python3
"""Generate es-ES and en-US XLF targets from messages.es-MX.xlf source."""
from __future__ import annotations

import xml.etree.ElementTree as ET
from pathlib import Path

NS = {"x": "urn:oasis:names:tc:xliff:document:1.2"}
ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src/locale/messages.es-MX.xlf"

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
    # Prompts
    "Prompt de preselección": "Preselection prompt",
    "Prompt de análisis": "Analysis prompt",
    "Prompt de entrevista": "Interview prompt",
    "Guardar prompts": "Save prompts",
    "Prompts IA actualizados": "AI prompts updated",
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
}


def translate_en(source: str) -> str:
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
    return source


def build(locale: str, target_lang: str) -> None:
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
        source = unit.find("x:source", NS).text or ""
        new_unit = ET.SubElement(out_body, "trans-unit", {"id": uid, "datatype": unit.get("datatype", "html")})
        ET.SubElement(new_unit, "source").text = source
        target = source if locale == "es-ES" else translate_en(source)
        ET.SubElement(new_unit, "target").text = target

    ET.indent(out, space="  ")
    path = ROOT / f"src/locale/messages.{locale}.xlf"
    path.write_text(
        '<?xml version="1.0" encoding="UTF-8" ?>\n' + ET.tostring(out, encoding="unicode") + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {path}")


if __name__ == "__main__":
    build("es-ES", "es-ES")
    build("en-US", "en-US")
