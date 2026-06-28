#!/usr/bin/env python3
"""Apply shared i18n attributes across catalogs-admin.component.html."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "src/app/features/settings/catalogs/catalogs-admin.component.html"


def main() -> None:
    text = HTML.read_text(encoding="utf-8")
    replacements = [
        (
            '<span class="scope-label">Ámbito del registro:</span>',
            '<span class="scope-label" i18n="@@catalogs.common.recordScope">Ámbito del registro:</span>',
        ),
        (
            '<mat-radio-button value="TENANT">Tenant actual</mat-radio-button>',
            '<mat-radio-button value="TENANT" i18n="@@catalogs.common.scopeTenant">Tenant actual</mat-radio-button>',
        ),
        (
            '<mat-radio-button value="GLOBAL">Global</mat-radio-button>',
            '<mat-radio-button value="GLOBAL" i18n="@@catalogs.common.scopeGlobal">Global</mat-radio-button>',
        ),
        (
            '<mat-option [value]="null">Todos los países</mat-option>',
            '<mat-option [value]="null" i18n="@@catalogs.field.allCountries">Todos los países</mat-option>',
        ),
        ('<mat-label>País</mat-label>', '<mat-label i18n="@@catalogs.field.country">País</mat-label>'),
        ('<mat-label>Clave</mat-label>', '<mat-label i18n="@@catalogs.field.code">Clave</mat-label>'),
        ('<mat-label>Nombre</mat-label>', '<mat-label i18n="@@catalogs.field.name">Nombre</mat-label>'),
        (
            '<mat-label>Descripción</mat-label>',
            '<mat-label i18n="@@catalogs.field.description">Descripción</mat-label>',
        ),
        (
            '<mat-checkbox formControlName="isActive">Activo</mat-checkbox>',
            '<mat-checkbox formControlName="isActive" i18n="@@catalogs.field.active">Activo</mat-checkbox>',
        ),
        (
            '<th mat-header-cell *matHeaderCellDef>Clave</th>',
            '<th mat-header-cell *matHeaderCellDef i18n="@@catalogs.field.code">Clave</th>',
        ),
        (
            '<th mat-header-cell *matHeaderCellDef>Nombre</th>',
            '<th mat-header-cell *matHeaderCellDef i18n="@@catalogs.field.name">Nombre</th>',
        ),
        (
            '<th mat-header-cell *matHeaderCellDef>Descripción</th>',
            '<th mat-header-cell *matHeaderCellDef i18n="@@catalogs.field.description">Descripción</th>',
        ),
        (
            '<th mat-header-cell *matHeaderCellDef>Activo</th>',
            '<th mat-header-cell *matHeaderCellDef i18n="@@catalogs.field.active">Activo</th>',
        ),
        (
            '<th mat-header-cell *matHeaderCellDef>Ámbito</th>',
            '<th mat-header-cell *matHeaderCellDef i18n="@@catalogs.field.scope">Ámbito</th>',
        ),
        (
            '<th mat-header-cell *matHeaderCellDef>Valor</th>',
            '<th mat-header-cell *matHeaderCellDef i18n="@@catalogs.field.value">Valor</th>',
        ),
        ("{{ row.isActive ? 'Sí' : 'No' }}", "{{ row.isActive ? catalogsYes : catalogsNo }}"),
        ('>Cancelar</button>', ' i18n="@@common.cancel">Cancelar</button>'),
    ]
    for old, new in replacements:
        text = text.replace(old, new)
    text = re.sub(
        r"\{\{\s*saving(\w+)\s*\?\s*'Guardando\.\.\.'\s*:\s*'Guardar'\s*\}\}",
        r"{{ saving\1 ? catalogsSaving : catalogsSave }}",
        text,
    )
    text = text.replace(' i18n="@@common.cancel" i18n="@@common.cancel">', ' i18n="@@common.cancel">')
    HTML.write_text(text, encoding="utf-8")
    print(f"Updated {HTML}")


if __name__ == "__main__":
    main()
