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
}


def translate_en(source: str) -> str:
    if source in EN_BY_SOURCE:
        return EN_BY_SOURCE[source]
    if "Eliminar el usuario" in source:
        return source.replace("¿Eliminar el usuario", "Delete user").replace(
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
