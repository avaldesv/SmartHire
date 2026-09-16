#!/usr/bin/env python3
"""Apply i18n to catalogs-admin snack/confirm messages."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TS = ROOT / "src/app/features/settings/catalogs/catalogs-admin.component.ts"

# Maps exact Spanish snack message -> TypeScript expression (without quotes)
MESSAGE_MAP: dict[str, str] = {
    "No se pudieron cargar los países": "catalogLoadListError(getCatalogEntryLabel('country'))",
    "No se pudieron cargar entidades para el selector": "CATALOG_MSG_LOAD_STATES_SELECTOR",
    "No se pudieron cargar municipios para el selector": "CATALOG_MSG_LOAD_MUNICIPALITIES_SELECTOR",
    "No se pudieron cargar los géneros": "catalogLoadListError(getCatalogEntryLabel('gender'))",
    "No se pudieron cargar los parentescos": "catalogLoadListError(getCatalogEntryLabel('kinship'))",
    "No se pudieron cargar las monedas": "catalogLoadListError(getCatalogEntryLabel('currency'))",
    "No se pudieron cargar c categoría cubrimiento": "catalogLoadListError(getCatalogEntryLabel('coverageCategory'))",
    "No se pudieron cargar características": "catalogLoadListError(getCatalogEntryLabel('characteristic'))",
    "No se pudieron cargar categoría": "catalogLoadListError(getCatalogEntryLabel('category'))",
    "No se pudieron cargar estado civil": "catalogLoadListError(getCatalogEntryLabel('maritalStatus'))",
    "No se pudieron cargar experiencia": "catalogLoadListError(getCatalogEntryLabel('experienceLevel'))",
    "No se pudieron cargar herramienta": "catalogLoadListError(getCatalogEntryLabel('tool'))",
    "No se pudieron cargar horario trabajo": "catalogLoadListError(getCatalogEntryLabel('workSchedule'))",
    "No se pudieron cargar lugar trabajo": "catalogLoadListError(getCatalogEntryLabel('workplace'))",
    "No se pudieron cargar requisitos": "catalogLoadListError(getCatalogEntryLabel('requirement'))",
    "No se pudieron cargar responsabilidad": "catalogLoadListError(getCatalogEntryLabel('responsibilityLevel'))",
    "No se pudieron cargar tipo discapacidad": "catalogLoadListError(getCatalogEntryLabel('disabilityType'))",
    "No se pudieron cargar unidad de negocio": "catalogLoadListError(getCatalogEntryLabel('businessUnit'))",
    "No se pudieron cargar puesto": "catalogLoadListError(getCatalogEntryLabel('positionType'))",
    "No se pudieron cargar los clientes": "catalogLoadListError(getCatalogEntryLabel('client'))",
    "No se pudieron cargar las compañías": "catalogLoadListError(getCatalogEntryLabel('company'))",
    "No se pudieron cargar los idiomas del portal": "CATALOG_MSG_LOAD_PORTAL_LANGUAGES",
    "No se pudieron cargar las carreras": "catalogLoadListError(getCatalogEntryLabel('career'))",
    "No se pudieron cargar los idiomas": "catalogLoadListError(getCatalogEntryLabel('language'))",
    "No se pudieron cargar los turnos": "catalogLoadListError(getCatalogEntryLabel('shift'))",
    "No se pudieron cargar las prestaciones": "catalogLoadListError(getCatalogEntryLabel('benefit'))",
    "No se pudieron cargar los tipos de documento": "catalogLoadListError(getCatalogEntryLabel('documentType'))",
    "No se pudieron cargar las marcas": "catalogLoadListError(getCatalogEntryLabel('brand'))",
    "No se pudieron cargar los tipos de contrato": "catalogLoadListError(getCatalogEntryLabel('contractType'))",
    "No se pudieron cargar los tipos de cobertura": "catalogLoadListError(getCatalogEntryLabel('mpCoverageType'))",
    "No se pudieron cargar los niveles de educación": "catalogLoadListError(getCatalogEntryLabel('educationLevel'))",
    "No se pudieron cargar los niveles de idioma": "catalogLoadListError(getCatalogEntryLabel('languageLevel'))",
    "No se pudieron cargar los tipos de requisición": "catalogLoadListError(getCatalogEntryLabel('requisitionType'))",
    "No se pudieron cargar áreas": "catalogLoadListError(getCatalogEntryLabel('companyArea'))",
    "No se pudieron cargar departamentos": "catalogLoadListError(getCatalogEntryLabel('companyDepartment'))",
    "No se pudieron cargar sucursales": "catalogLoadListError(getCatalogEntryLabel('branch'))",
    "No se pudieron cargar grupos reclutadores": "catalogLoadListError(getCatalogEntryLabel('recruiterGroup'))",
    "No se pudieron cargar portales": "catalogLoadListError(getCatalogEntryLabel('jobPortal'))",
    "No se pudieron cargar categorías de cuestionario": "catalogLoadListError(getCatalogEntryLabel('questionnaireCategory'))",
    "No se pudieron cargar categorías para el formulario": "CATALOG_MSG_LOAD_FORM_CATEGORIES",
    "No se pudieron cargar las preguntas": "catalogLoadListError(getCatalogEntryLabel('questionnaireQuestion'))",
    "No se pudieron cargar las entidades federativas": "catalogLoadListError(getCatalogEntryLabel('state'))",
    "No se pudieron cargar los municipios": "catalogLoadListError(getCatalogEntryLabel('municipality'))",
    "No se pudieron cargar las colonias": "catalogLoadListError(getCatalogEntryLabel('neighborhood'))",
    "No se pudo cargar la compañía": "CATALOG_MSG_LOAD_SINGLE_COMPANY",
    "Género guardado": "catalogSaveSuccess(getCatalogEntryLabel('gender'))",
    "No se pudo guardar el género": "catalogSaveError(getCatalogEntryLabel('gender'))",
    "Parentesco guardado": "catalogSaveSuccess(getCatalogEntryLabel('kinship'))",
    "No se pudo guardar el parentesco": "catalogSaveError(getCatalogEntryLabel('kinship'))",
    "C Categoría cubrimiento guardado": "catalogSaveSuccess(getCatalogEntryLabel('coverageCategory'))",
    "No se pudo guardar c categoría cubrimiento": "catalogSaveError(getCatalogEntryLabel('coverageCategory'))",
    "Características guardado": "catalogSaveSuccess(getCatalogEntryLabel('characteristic'))",
    "No se pudo guardar características": "catalogSaveError(getCatalogEntryLabel('characteristic'))",
    "Categoría guardado": "catalogSaveSuccess(getCatalogEntryLabel('category'))",
    "No se pudo guardar categoría": "catalogSaveError(getCatalogEntryLabel('category'))",
    "Estado civil guardado": "catalogSaveSuccess(getCatalogEntryLabel('maritalStatus'))",
    "No se pudo guardar estado civil": "catalogSaveError(getCatalogEntryLabel('maritalStatus'))",
    "Experiencia guardado": "catalogSaveSuccess(getCatalogEntryLabel('experienceLevel'))",
    "No se pudo guardar experiencia": "catalogSaveError(getCatalogEntryLabel('experienceLevel'))",
    "Herramienta guardado": "catalogSaveSuccess(getCatalogEntryLabel('tool'))",
    "No se pudo guardar herramienta": "catalogSaveError(getCatalogEntryLabel('tool'))",
    "Horario trabajo guardado": "catalogSaveSuccess(getCatalogEntryLabel('workSchedule'))",
    "No se pudo guardar horario trabajo": "catalogSaveError(getCatalogEntryLabel('workSchedule'))",
    "Lugar trabajo guardado": "catalogSaveSuccess(getCatalogEntryLabel('workplace'))",
    "No se pudo guardar lugar trabajo": "catalogSaveError(getCatalogEntryLabel('workplace'))",
    "Requisitos guardado": "catalogSaveSuccess(getCatalogEntryLabel('requirement'))",
    "No se pudo guardar requisitos": "catalogSaveError(getCatalogEntryLabel('requirement'))",
    "Responsabilidad guardado": "catalogSaveSuccess(getCatalogEntryLabel('responsibilityLevel'))",
    "No se pudo guardar responsabilidad": "catalogSaveError(getCatalogEntryLabel('responsibilityLevel'))",
    "Tipo discapacidad guardado": "catalogSaveSuccess(getCatalogEntryLabel('disabilityType'))",
    "No se pudo guardar tipo discapacidad": "catalogSaveError(getCatalogEntryLabel('disabilityType'))",
    "Unidad de negocio guardado": "catalogSaveSuccess(getCatalogEntryLabel('businessUnit'))",
    "No se pudo guardar unidad de negocio": "catalogSaveError(getCatalogEntryLabel('businessUnit'))",
    "Puesto guardado": "catalogSaveSuccess(getCatalogEntryLabel('positionType'))",
    "No se pudo guardar puesto": "catalogSaveError(getCatalogEntryLabel('positionType'))",
    "Cliente guardado": "catalogSaveSuccess(getCatalogEntryLabel('client'))",
    "No se pudo guardar el cliente": "catalogSaveError(getCatalogEntryLabel('client'))",
    "Compañía guardada": "catalogSaveSuccess(getCatalogEntryLabel('company'))",
    "No se pudo guardar la compañía": "catalogSaveError(getCatalogEntryLabel('company'))",
    "Carrera guardada": "catalogSaveSuccess(getCatalogEntryLabel('career'))",
    "No se pudo guardar la carrera": "catalogSaveError(getCatalogEntryLabel('career'))",
    "Idioma guardado": "catalogSaveSuccess(getCatalogEntryLabel('language'))",
    "No se pudo guardar el idioma": "catalogSaveError(getCatalogEntryLabel('language'))",
    "Turno guardado": "catalogSaveSuccess(getCatalogEntryLabel('shift'))",
    "No se pudo guardar el turno": "catalogSaveError(getCatalogEntryLabel('shift'))",
    "Prestación guardada": "catalogSaveSuccess(getCatalogEntryLabel('benefit'))",
    "No se pudo guardar la prestación": "catalogSaveError(getCatalogEntryLabel('benefit'))",
    "Tipo de documento guardado": "catalogSaveSuccess(getCatalogEntryLabel('documentType'))",
    "No se pudo guardar el tipo de documento": "catalogSaveError(getCatalogEntryLabel('documentType'))",
    "Marca guardada": "catalogSaveSuccess(getCatalogEntryLabel('brand'))",
    "No se pudo guardar la marca": "catalogSaveError(getCatalogEntryLabel('brand'))",
    "Tipo de contrato guardado": "catalogSaveSuccess(getCatalogEntryLabel('contractType'))",
    "No se pudo guardar el tipo de contrato": "catalogSaveError(getCatalogEntryLabel('contractType'))",
    "Tipo de cobertura guardado": "catalogSaveSuccess(getCatalogEntryLabel('mpCoverageType'))",
    "No se pudo guardar el tipo de cobertura": "catalogSaveError(getCatalogEntryLabel('mpCoverageType'))",
    "Nivel de educación guardado": "catalogSaveSuccess(getCatalogEntryLabel('educationLevel'))",
    "No se pudo guardar el nivel de educación": "catalogSaveError(getCatalogEntryLabel('educationLevel'))",
    "Nivel de idioma guardado": "catalogSaveSuccess(getCatalogEntryLabel('languageLevel'))",
    "No se pudo guardar el nivel de idioma": "catalogSaveError(getCatalogEntryLabel('languageLevel'))",
    "Tipo de requisición guardado": "catalogSaveSuccess(getCatalogEntryLabel('requisitionType'))",
    "No se pudo guardar el tipo de requisición": "catalogSaveError(getCatalogEntryLabel('requisitionType'))",
    "Áreas guardado": "catalogSaveSuccess(getCatalogEntryLabel('companyArea'))",
    "No se pudo guardar áreas": "catalogSaveError(getCatalogEntryLabel('companyArea'))",
    "Departamentos guardado": "catalogSaveSuccess(getCatalogEntryLabel('companyDepartment'))",
    "No se pudo guardar departamentos": "catalogSaveError(getCatalogEntryLabel('companyDepartment'))",
    "Sucursales guardado": "catalogSaveSuccess(getCatalogEntryLabel('branch'))",
    "No se pudo guardar sucursales": "catalogSaveError(getCatalogEntryLabel('branch'))",
    "Grupo guardado": "catalogSaveSuccess(getCatalogEntryLabel('recruiterGroup'))",
    "No se pudo guardar el grupo": "catalogSaveError(getCatalogEntryLabel('recruiterGroup'))",
    "Portal guardado": "catalogSaveSuccess(getCatalogEntryLabel('jobPortal'))",
    "No se pudo guardar el portal": "catalogSaveError(getCatalogEntryLabel('jobPortal'))",
    "Categoría guardada": "catalogSaveSuccess(getCatalogEntryLabel('questionnaireCategory'))",
    "No se pudo guardar la categoría": "catalogSaveError(getCatalogEntryLabel('questionnaireCategory'))",
    "Pregunta guardada": "catalogSaveSuccess(getCatalogEntryLabel('questionnaireQuestion'))",
    "No se pudo guardar la pregunta": "catalogSaveError(getCatalogEntryLabel('questionnaireQuestion'))",
    "Entidad federativa guardada": "catalogSaveSuccess(getCatalogEntryLabel('state'))",
    "No se pudo guardar la entidad federativa": "catalogSaveError(getCatalogEntryLabel('state'))",
    "Municipio guardado": "catalogSaveSuccess(getCatalogEntryLabel('municipality'))",
    "No se pudo guardar el municipio": "catalogSaveError(getCatalogEntryLabel('municipality'))",
    "Colonia guardada": "catalogSaveSuccess(getCatalogEntryLabel('neighborhood'))",
    "No se pudo guardar la colonia": "catalogSaveError(getCatalogEntryLabel('neighborhood'))",
    "Moneda guardada": "catalogSaveSuccess(getCatalogEntryLabel('currency'))",
    "No se pudo guardar la moneda": "catalogSaveError(getCatalogEntryLabel('currency'))",
    "País guardado": "catalogSaveSuccess(getCatalogEntryLabel('mpCountry'))",
    "No se pudo guardar el país": "catalogSaveError(getCatalogEntryLabel('mpCountry'))",
    "Registro eliminado": "CATALOG_MSG_DELETE_SUCCESS",
    "No se pudo eliminar el registro": "CATALOG_MSG_DELETE_ERROR",
}

IMPORT_BLOCK = """import {
  CATALOG_MSG_DELETE_ERROR,
  CATALOG_MSG_DELETE_SUCCESS,
  CATALOG_MSG_LOAD_FORM_CATEGORIES,
  CATALOG_MSG_LOAD_MUNICIPALITIES_SELECTOR,
  CATALOG_MSG_LOAD_PORTAL_LANGUAGES,
  CATALOG_MSG_LOAD_SINGLE_COMPANY,
  CATALOG_MSG_LOAD_STATES_SELECTOR,
  CATALOG_MSG_SNACK_CLOSE,
  catalogDeleteConfirm,
  catalogLoadListError,
  catalogSaveError,
  catalogSaveSuccess,
} from '../../../core/i18n/catalog-messages-labels';
import { getCatalogEntryLabel } from '../../../core/i18n/catalog-i18n-labels';
"""


def main() -> None:
    text = TS.read_text(encoding="utf-8")
    if "catalog-messages-labels" not in text:
        anchor = "} from '../../../core/i18n/catalog-i18n-labels';"
        if anchor not in text:
            raise SystemExit("catalog-i18n-labels import anchor not found")
        text = text.replace(anchor, "} from '../../../core/i18n/catalog-i18n-labels';\n" + IMPORT_BLOCK)

    for msg, expr in MESSAGE_MAP.items():
        text = text.replace(f"this.snack.open('{msg}', 'Cerrar'", f"this.snack.open({expr}, CATALOG_MSG_SNACK_CLOSE")

    text = text.replace(
        "if (!confirm(`¿Eliminar \"${display}\"? Esta acción no se puede deshacer.`)) {",
        "if (!confirm(catalogDeleteConfirm(display))) {",
    )

    TS.write_text(text, encoding="utf-8")
    print(f"Updated {TS}")


if __name__ == "__main__":
    main()
