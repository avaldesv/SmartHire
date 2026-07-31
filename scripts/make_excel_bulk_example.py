#!/usr/bin/env python3
"""Genera un Excel de ejemplo con todas las combinaciones de validación Excel bulk.

Salida (portal):
  public/templates/Ejemplo_Carga_Masiva_Excel_casos.xlsx

También se mantiene una copia de trabajo en:
  requerimientos/Carga Masiva de Cvs/ (workspace docs)

Columna H (Caso esperado) es solo documentación: el BE lee A–G.

Reglas vigentes:
- Obligatorios: Nombres, Apellido Paterno, Correo válido
- Prefijo+Teléfono: par opcional (ambos vacíos OK; ambos informados OK;
  solo uno → inválido). Prefijo informado ∈ ref_country_dial_code.
- Género opcional; si viene, ∈ catalog_gender.code
- Duplicado email en archivo: primera gana (DUPLICATE_IN_FILE)

Ajusta VALID_GENDER_* a los codes reales (Settings → Catálogos → Género).
En stage companyId=1 se observó code X (F/M no existen).
"""
from __future__ import annotations

import os
import zipfile

VALID_GENDER = "X"
INVALID_GENDER = "ZZZ_NO_EXISTE"
LEGACY_BAD_GENDER = "F"  # F/M típicos de plantillas viejas → GENDER_NOT_FOUND en stage

HEADER = [
    "Nombres",
    "Apellido Paterno",
    "Apellido Materno",
    "Correo",
    "Prefijo",
    "Teléfono",
    "Género",
    "Caso esperado (no lo lee el BE)",
]

# (first, last, maternal, email, dial, phone, gender, expected)
ROWS: list[tuple[str, str, str, str, str, str, str, str]] = [
    # ========== VÁLIDAS ==========
    # --- Contacto: ambos vacíos ---
    (
        "Sofía",
        "Martínez",
        "",
        "ok.solo.obligatorios@example.com",
        "",
        "",
        "",
        "VÁLIDA — solo obligatorios (sin materno / sin contacto / sin género)",
    ),
    (
        "Carlos",
        "Hernández",
        "Díaz",
        "ok.con.materno@example.com",
        "",
        "",
        "",
        "VÁLIDA — obligatorios + materno; sin prefijo ni teléfono",
    ),
    (
        "Nora",
        "Salas",
        "",
        "ok.sin.contacto.con.genero@example.com",
        "",
        "",
        VALID_GENDER,
        "VÁLIDA — sin contacto + género en catálogo",
    ),
    # --- Contacto: ambos informados (par completo) ---
    (
        "Ana",
        "Pérez",
        "López",
        "ok.completa@example.com",
        "+52",
        "5512345678",
        VALID_GENDER,
        "VÁLIDA — todos los campos (+52 + tel + género)",
    ),
    (
        "Elena",
        "Ramírez",
        "",
        "ok.prefijo.52@example.com",
        "52",
        "5511111111",
        VALID_GENDER,
        "VÁLIDA — prefijo 52 se normaliza a +52 + teléfono",
    ),
    (
        "Diego",
        "Torres",
        "",
        "ok.prefijo.0052@example.com",
        "0052",
        "5522222222",
        VALID_GENDER,
        "VÁLIDA — prefijo 0052 se normaliza a +52 + teléfono",
    ),
    (
        "María",
        "Flores",
        "",
        "ok.genero.lower@example.com",
        "+52",
        "5533333333",
        VALID_GENDER.lower(),
        "VÁLIDA — género en minúscula (normaliza a mayúsculas)",
    ),
    (
        "Pedro",
        "Jiménez",
        "",
        "  OK.EMAIL.TRIM@Example.COM  ",
        "+52",
        "5544444444",
        VALID_GENDER,
        "VÁLIDA — email con espacios/mayúsculas (trim + lowercase)",
    ),
    (
        "Camila",
        "Castro",
        "Núñez",
        "ok.dial.usa@example.com",
        "+1",
        "2025550199",
        VALID_GENDER,
        "VÁLIDA — prefijo +1 + teléfono (si +1 activo en catálogo)",
    ),
    (
        "José",
        "Reyes",
        "",
        "ok.dial.cuba@example.com",
        "+53",
        "51234567",
        VALID_GENDER,
        "VÁLIDA — prefijo +53 + teléfono (si +53 activo en catálogo)",
    ),
    (
        "Luis",
        "García",
        "",
        "ok.contacto.sin.genero@example.com",
        "+52",
        "5587654321",
        "",
        "VÁLIDA — prefijo+tel sin género (género opcional)",
    ),
    # ========== INVÁLIDAS: par prefijo/teléfono ==========
    (
        "Andrés",
        "Vargas",
        "",
        "bad.solo.prefijo@example.com",
        "+52",
        "",
        "",
        "INVÁLIDA — PHONE_REQUIRED_WITH_DIAL (prefijo sin teléfono)",
    ),
    (
        "Laura",
        "Morales",
        "",
        "bad.solo.telefono@example.com",
        "",
        "5555555555",
        "",
        "INVÁLIDA — DIAL_REQUIRED_WITH_PHONE (teléfono sin prefijo)",
    ),
    (
        "Solo",
        "PrefijoGen",
        "",
        "bad.solo.prefijo.con.genero@example.com",
        "+52",
        "",
        VALID_GENDER,
        "INVÁLIDA — PHONE_REQUIRED_WITH_DIAL (aunque género sea válido)",
    ),
    (
        "Solo",
        "TelGen",
        "",
        "bad.solo.tel.con.genero@example.com",
        "",
        "5566666666",
        VALID_GENDER,
        "INVÁLIDA — DIAL_REQUIRED_WITH_PHONE (aunque género sea válido)",
    ),
    # ========== INVÁLIDAS: catálogo prefijo / género ==========
    (
        "Prefijo",
        "Invalido",
        "",
        "bad.prefijo@example.com",
        "+999",
        "5512345678",
        VALID_GENDER,
        "INVÁLIDA — DIAL_CODE_NOT_FOUND (par completo pero prefijo no catalogado)",
    ),
    (
        "Genero",
        "Invalido",
        "",
        "bad.genero@example.com",
        "+52",
        "5512345678",
        INVALID_GENDER,
        "INVÁLIDA — GENDER_NOT_FOUND",
    ),
    (
        "Genero",
        "LegacyFM",
        "",
        "bad.genero.fm@example.com",
        "+52",
        "5510101010",
        LEGACY_BAD_GENDER,
        "INVÁLIDA — GENDER_NOT_FOUND (F/M no son codes típicos de catalog_gender)",
    ),
    (
        "PrefijoY",
        "GeneroMal",
        "",
        "bad.prefijo.y.genero@example.com",
        "+888",
        "5512345678",
        INVALID_GENDER,
        "INVÁLIDA — DIAL_CODE_NOT_FOUND + GENDER_NOT_FOUND",
    ),
    (
        "PrefijoMal",
        "SinTel",
        "",
        "bad.prefijo.sin.tel@example.com",
        "+999",
        "",
        "",
        "INVÁLIDA — DIAL_CODE_NOT_FOUND + PHONE_REQUIRED_WITH_DIAL",
    ),
    # ========== INVÁLIDAS: obligatorios / formato ==========
    (
        "Sin",
        "Correo",
        "",
        "",
        "+52",
        "5577777777",
        VALID_GENDER,
        "INVÁLIDA — EMAIL_REQUIRED",
    ),
    (
        "Email",
        "Malo",
        "",
        "no-es-un-correo",
        "",
        "",
        "",
        "INVÁLIDA — EMAIL_INVALID",
    ),
    (
        "Email",
        "Largo",
        "",
        ("a" * 250) + "@x.com",
        "",
        "",
        "",
        "INVÁLIDA — EMAIL_TOO_LONG (>255)",
    ),
    (
        "",
        "SinNombre",
        "",
        "bad.sin.nombre@example.com",
        "",
        "",
        "",
        "INVÁLIDA — FIRST_NAME_REQUIRED",
    ),
    (
        "Sin",
        "",
        "",
        "bad.sin.paterno@example.com",
        "",
        "",
        "",
        "INVÁLIDA — LAST_NAME_REQUIRED",
    ),
    (
        "   ",
        "   ",
        "",
        "bad.solo.espacios@example.com",
        "",
        "",
        "",
        "INVÁLIDA — FIRST_NAME_REQUIRED + LAST_NAME_REQUIRED (espacios = vacío)",
    ),
    (
        "",
        "",
        "",
        "",
        "",
        "",
        VALID_GENDER,
        "INVÁLIDA — EMAIL_REQUIRED + FIRST_NAME_REQUIRED + LAST_NAME_REQUIRED",
    ),
    # ========== INVÁLIDAS: longitudes ==========
    (
        "A" * 129,
        "Largo",
        "",
        "bad.nombre.largo@example.com",
        "",
        "",
        "",
        "INVÁLIDA — FIRST_NAME_TOO_LONG (>128)",
    ),
    (
        "Apellido",
        "B" * 129,
        "",
        "bad.paterno.largo@example.com",
        "",
        "",
        "",
        "INVÁLIDA — LAST_NAME_TOO_LONG (>128)",
    ),
    (
        "Materno",
        "Largo",
        "C" * 129,
        "bad.materno.largo@example.com",
        "",
        "",
        "",
        "INVÁLIDA — MATERNAL_LAST_NAME_TOO_LONG (>128)",
    ),
    (
        "Tel",
        "Largo",
        "",
        "bad.tel.largo@example.com",
        "+52",
        "9" * 65,
        VALID_GENDER,
        "INVÁLIDA — PHONE_TOO_LONG (>64) con par completo",
    ),
    # ========== INVÁLIDAS: duplicado + combo ==========
    (
        "Dup",
        "Segunda",
        "",
        "ok.completa@example.com",
        "+52",
        "5588888888",
        VALID_GENDER,
        "INVÁLIDA — DUPLICATE_IN_FILE (mismo correo que ok.completa; la primera gana)",
    ),
    (
        "Combo",
        "",
        "",
        "correo(at)malo",
        "+999",
        "8" * 65,
        INVALID_GENDER,
        "INVÁLIDA — EMAIL_INVALID + LAST_NAME_REQUIRED + DIAL + PHONE_TOO_LONG + GENDER",
    ),
]

CONTENT_TYPES = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>"""

ROOT_RELS = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>"""

WORKBOOK = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets><sheet name="Casos" sheetId="1" r:id="rId1"/></sheets>
</workbook>"""

WORKBOOK_RELS = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>"""

STYLES = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>
<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>
<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>"""

COLUMNS = "ABCDEFGH"


def escape(value: str) -> str:
    return (
        value.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def row_xml(index: int, values: list[str], style: int) -> str:
    cells = []
    for column, value in zip(COLUMNS, values):
        cells.append(
            '<c r="%s%d" s="%d" t="inlineStr"><is><t xml:space="preserve">%s</t></is></c>'
            % (column, index, style, escape(value))
        )
    return '<row r="%d">%s</row>' % (index, "".join(cells))


def sheet_xml() -> str:
    widths = [16, 18, 18, 40, 12, 16, 14, 78]
    cols = "".join(
        '<col min="%d" max="%d" width="%d" customWidth="1"/>' % (i + 1, i + 1, widths[i])
        for i in range(len(HEADER))
    )
    rows = [row_xml(1, HEADER, 1)]
    for i, row in enumerate(ROWS, start=2):
        rows.append(row_xml(i, list(row), 0))
    last = len(ROWS) + 1
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
        '<dimension ref="A1:H%d"/><sheetViews><sheetView workbookViewId="0"/></sheetViews>'
        '<sheetFormatPr defaultRowHeight="15"/>'
        "<cols>%s</cols><sheetData>%s</sheetData></worksheet>"
        % (last, cols, "".join(rows))
    )


def main() -> None:
    here = os.path.dirname(os.path.abspath(__file__))
    portal_root = os.path.dirname(here)
    target = os.path.join(portal_root, "public", "templates", "Ejemplo_Carga_Masiva_Excel_casos.xlsx")
    os.makedirs(os.path.dirname(target), exist_ok=True)
    try:
        with open(target, "ab"):
            pass
    except PermissionError:
        target = os.path.join(portal_root, "public", "templates", "Ejemplo_Carga_Masiva_Excel_casos_v2.xlsx")
        print("original locked; writing:", target)

    with zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED) as book:
        book.writestr("[Content_Types].xml", CONTENT_TYPES)
        book.writestr("_rels/.rels", ROOT_RELS)
        book.writestr("xl/workbook.xml", WORKBOOK)
        book.writestr("xl/_rels/workbook.xml.rels", WORKBOOK_RELS)
        book.writestr("xl/styles.xml", STYLES)
        book.writestr("xl/worksheets/sheet1.xml", sheet_xml())

    valid = sum(1 for r in ROWS if r[7].startswith("VÁLIDA"))
    invalid = len(ROWS) - valid
    print("written:", target)
    print("rows: %d (%d válidas, %d inválidas)" % (len(ROWS), valid, invalid))
    print("VALID_GENDER=%s INVALID_GENDER=%s" % (VALID_GENDER, INVALID_GENDER))


if __name__ == "__main__":
    main()
