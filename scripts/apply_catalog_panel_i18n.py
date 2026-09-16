#!/usr/bin/env python3
"""Wire catalog panel UI labels into catalogs-admin.component.html."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "src/app/features/settings/catalogs/catalogs-admin.component.html"

PANELS: list[tuple[str, str, str, str, str]] = [
    ("gender", "Nuevo género", "Editar género", "Nuevo género", "editingGenderId"),
    ("kinship", "Nuevo parentesco", "Editar parentesco", "Nuevo parentesco", "editingKinshipId"),
    ("company", "Nueva empresa", "Editar empresa", "Nueva empresa", "editingCompanyId"),
    ("currency", "Nueva moneda", "Editar moneda", "Nueva moneda", "editingCurrencyId"),
    ("career", "Nueva carrera", "Editar carrera", "Nueva carrera", "editingCareerId"),
    ("language", "Nuevo idioma", "Editar idioma", "Nuevo idioma", "editingLanguageId"),
    ("shift", "Nuevo turno", "Editar turno", "Nuevo turno", "editingShiftId"),
    ("benefit", "Nueva prestación", "Editar prestación", "Nueva prestación", "editingBenefitId"),
    ("documentType", "Nuevo tipo", "Editar tipo de documento", "Nuevo tipo de documento", "editingDocumentTypeId"),
    ("brand", "Nueva marca", "Editar marca", "Nueva marca", "editingBrandId"),
    ("contractType", "Nuevo tipo de contrato", "Editar tipo de contrato", "Nuevo tipo de contrato", "editingContractTypeId"),
    ("educationLevel", "Nuevo nivel de educación", "Editar nivel de educación", "Nuevo nivel de educación", "editingEducationLevelId"),
    ("languageLevel", "Nuevo nivel de idioma", "Editar nivel de idioma", "Nuevo nivel de idioma", "editingLanguageLevelId"),
    ("requisitionType", "Nuevo tipo de requisición", "Editar tipo de requisición", "Nuevo tipo de requisición", "editingRequisitionTypeId"),
    ("companyArea", "Nuevo áreas", "Editar áreas", "Nuevo áreas", "editingCompanyAreaId"),
    ("companyDepartment", "Nuevo departamentos", "Editar departamentos", "Nuevo departamentos", "editingCompanyDepartmentId"),
    ("branch", "Nueva sucursales", "Editar sucursales", "Nueva sucursales", "editingBranchId"),
    ("questionnaireCategory", "Nueva categoría", "Editar categoría", "Nueva categoría", "editingQuestionnaireCategoryId"),
    ("questionnaireQuestion", "Nueva pregunta", "Editar pregunta", "Nueva pregunta", "editingQuestionnaireQuestionId"),
    ("recruiterGroup", "Nuevo grupo", "Editar grupo", "Nuevo grupo", "editingRecruiterGroupId"),
    ("jobPortal", "Nuevo portal", "Editar portal", "Nuevo portal", "editingJobPortalId"),
    ("state", "Nueva entidad", "Editar entidad", "Nueva entidad federativa", "editingStateId"),
    ("municipality", "Nuevo municipio", "Editar municipio", "Nuevo municipio", "editingMunicipalityId"),
    ("neighborhood", "Nueva colonia", "Editar colonia", "Nueva colonia", "editingNeighborhoodId"),
    ("coverageCategory", "Nuevo c categoría cubrimiento", "Editar c categoría cubrimiento", "Nuevo c categoría cubrimiento", "editingCoverageCategoryId"),
    ("characteristic", "Nuevo características", "Editar características", "Nuevo características", "editingCharacteristicId"),
    ("category", "Nuevo categoría", "Editar categoría", "Nuevo categoría", "editingCategoryId"),
    ("maritalStatus", "Nuevo estado civil", "Editar estado civil", "Nuevo estado civil", "editingMaritalStatusId"),
    ("experienceLevel", "Nuevo experiencia", "Editar experiencia", "Nuevo experiencia", "editingExperienceLevelId"),
    ("tool", "Nuevo herramienta", "Editar herramienta", "Nuevo herramienta", "editingToolId"),
    ("workSchedule", "Nuevo horario trabajo", "Editar horario trabajo", "Nuevo horario trabajo", "editingWorkScheduleId"),
    ("workplace", "Nuevo lugar trabajo", "Editar lugar trabajo", "Nuevo lugar trabajo", "editingWorkplaceId"),
    ("requirement", "Nuevo requisitos", "Editar requisitos", "Nuevo requisitos", "editingRequirementId"),
    ("responsibilityLevel", "Nuevo responsabilidad", "Editar responsabilidad", "Nuevo responsabilidad", "editingResponsibilityLevelId"),
    ("disabilityType", "Nuevo tipo discapacidad", "Editar tipo discapacidad", "Nuevo tipo discapacidad", "editingDisabilityTypeId"),
    ("businessUnit", "Nuevo unidad de negocio", "Editar unidad de negocio", "Nuevo unidad de negocio", "editingBusinessUnitId"),
    ("positionType", "Nuevo puesto", "Editar puesto", "Nuevo puesto", "editingPositionTypeId"),
    ("client", "Nuevo cliente", "Editar cliente", "Nuevo cliente", "editingClientId"),
]

COLUMN_REPLACEMENTS = [
    ('<th mat-header-cell *matHeaderCellDef>Nombre comercial</th>', '<th mat-header-cell *matHeaderCellDef>{{ colTradeName }}</th>'),
    ('<th mat-header-cell *matHeaderCellDef>RFC</th>', '<th mat-header-cell *matHeaderCellDef>{{ colTaxId }}</th>'),
    ('<th mat-header-cell *matHeaderCellDef>Símbolo</th>', '<th mat-header-cell *matHeaderCellDef>{{ colSymbol }}</th>'),
    ('<th mat-header-cell *matHeaderCellDef>Denominación</th>', '<th mat-header-cell *matHeaderCellDef>{{ colDenomination }}</th>'),
    ('<th mat-header-cell *matHeaderCellDef>Tipo</th>', '<th mat-header-cell *matHeaderCellDef>{{ colType }}</th>'),
    ('<th mat-header-cell *matHeaderCellDef>IA</th>', '<th mat-header-cell *matHeaderCellDef>{{ colAi }}</th>'),
    ('<th mat-header-cell *matHeaderCellDef>Requiere carrera</th>', '<th mat-header-cell *matHeaderCellDef>{{ colRequiresCareer }}</th>'),
    ('<th mat-header-cell *matHeaderCellDef>Aplica a carrera</th>', '<th mat-header-cell *matHeaderCellDef>{{ colAppliesToCareer }}</th>'),
    ('<th mat-header-cell *matHeaderCellDef>Categoría</th>', '<th mat-header-cell *matHeaderCellDef>{{ colCategory }}</th>'),
    ('<th mat-header-cell *matHeaderCellDef>Pregunta</th>', '<th mat-header-cell *matHeaderCellDef>{{ colQuestion }}</th>'),
    ('<th mat-header-cell *matHeaderCellDef>Id MP</th>', '<th mat-header-cell *matHeaderCellDef i18n="@@catalogs.field.manpowerIdShort">Id MP</th>'),
    ('<th mat-header-cell *matHeaderCellDef>Core ATS</th>', '<th mat-header-cell *matHeaderCellDef>{{ colCoreAts }}</th>'),
    ('<th mat-header-cell *matHeaderCellDef>Core Appian</th>', '<th mat-header-cell *matHeaderCellDef>{{ colCoreAppian }}</th>'),
    ('<th mat-header-cell *matHeaderCellDef>CP</th>', '<th mat-header-cell *matHeaderCellDef>{{ colPostalCode }}</th>'),
    ('<th mat-header-cell *matHeaderCellDef>Razón social</th>', '<th mat-header-cell *matHeaderCellDef>{{ colLegalName }}</th>'),
    ('<th mat-header-cell *matHeaderCellDef>Empresa / área</th>', '<th mat-header-cell *matHeaderCellDef>{{ colCompanyArea }}</th>'),
    ('<th mat-header-cell *matHeaderCellDef>Contacto</th>', '<th mat-header-cell *matHeaderCellDef>{{ colContact }}</th>'),
    ('<th mat-header-cell *matHeaderCellDef>País</th>', '<th mat-header-cell *matHeaderCellDef i18n="@@catalogs.field.country">País</th>'),
]


def main() -> None:
    text = HTML.read_text(encoding="utf-8")

    for key, new_btn, edit_title, new_title, editing_var in PANELS:
        text = text.replace(
            f"<mat-icon>add</mat-icon> {new_btn}",
            f"<mat-icon>add</mat-icon> {{{{ panelUi('{key}').newButton }}}}",
        )
        text = text.replace(
            f"<h4>{{{{ {editing_var} ? '{edit_title}' : '{new_title}' }}}}</h4>",
            f"<h4>{{{{ {editing_var} ? panelUi('{key}').editTitle : panelUi('{key}').newTitle }}}}</h4>",
        )

    # Unify country/coverageType buttons and titles to panelUi
    text = text.replace(
        '<span i18n="@@catalogs.coverageType.newButton">Nuevo tipo de cobertura</span>',
        "{{ panelUi('coverageType').newButton }}",
    )
    text = text.replace(
        '<span i18n="@@catalogs.coverageType.editTitle">Editar tipo de cobertura</span>',
        "{{ panelUi('coverageType').editTitle }}",
    )
    text = text.replace(
        '<span i18n="@@catalogs.coverageType.newTitle">Nuevo tipo de cobertura</span>',
        "{{ panelUi('coverageType').newTitle }}",
    )
    text = text.replace(
        '<span i18n="@@catalogs.country.newButton">Nuevo país</span>',
        "{{ panelUi('country').newButton }}",
    )
    text = text.replace(
        '<span i18n="@@catalogs.country.editTitle">Editar país</span>',
        "{{ panelUi('country').editTitle }}",
    )
    text = text.replace(
        '<span i18n="@@catalogs.country.newTitle">Nuevo país</span>',
        "{{ panelUi('country').newTitle }}",
    )

    for old, new in COLUMN_REPLACEMENTS:
        text = text.replace(old, new)

    HTML.write_text(text, encoding="utf-8")
    print(f"Updated {HTML}")


if __name__ == "__main__":
    main()
