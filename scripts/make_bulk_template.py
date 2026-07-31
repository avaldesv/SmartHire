"""Generates the static MPIA bulk-upload template shipped in public/.

Run: python scripts/make_bulk_template.py
Produces public/templates/Plantilla_Carga_Masiva.xlsx with the header row only.
"""

import os
import zipfile

HEADERS = [
    "Nombres",
    "Apellido Paterno",
    "Apellido Materno",
    "Correo",
    "Prefijo",
    "Telefono",
    "Genero",
]

HEADER_LABELS = [
    "Nombres",
    "Apellido Paterno",
    "Apellido Materno",
    "Correo",
    "Prefijo",
    "Tel\u00e9fono",
    "G\u00e9nero",
]

SAMPLE_ROW = ["Ana", "Perez", "Lopez", "ana.perez@example.com", "+52", "5512345678", "F"]

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
<sheets><sheet name="Candidatos" sheetId="1" r:id="rId1"/></sheets>
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

COLUMNS = "ABCDEFG"


def escape(value):
    return (
        value.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def row_xml(index, values, style):
    cells = []
    for column, value in zip(COLUMNS, values):
        cells.append(
            '<c r="%s%d" s="%d" t="inlineStr"><is><t xml:space="preserve">%s</t></is></c>'
            % (column, index, style, escape(value))
        )
    return '<row r="%d">%s</row>' % (index, "".join(cells))


def sheet_xml():
    cols = "".join(
        '<col min="%d" max="%d" width="22" customWidth="1"/>' % (i + 1, i + 1)
        for i in range(len(HEADERS))
    )
    rows = row_xml(1, HEADER_LABELS, 1) + row_xml(2, SAMPLE_ROW, 0)
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
        '<dimension ref="A1:G2"/><sheetViews><sheetView workbookViewId="0"/></sheetViews>'
        '<sheetFormatPr defaultRowHeight="15"/>'
        "<cols>%s</cols><sheetData>%s</sheetData></worksheet>" % (cols, rows)
    )


def main():
    target = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "public",
        "templates",
        "Plantilla_Carga_Masiva.xlsx",
    )
    os.makedirs(os.path.dirname(target), exist_ok=True)
    with zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED) as book:
        book.writestr("[Content_Types].xml", CONTENT_TYPES)
        book.writestr("_rels/.rels", ROOT_RELS)
        book.writestr("xl/workbook.xml", WORKBOOK)
        book.writestr("xl/_rels/workbook.xml.rels", WORKBOOK_RELS)
        book.writestr("xl/styles.xml", STYLES)
        book.writestr("xl/worksheets/sheet1.xml", sheet_xml())
    print("written:", target)


if __name__ == "__main__":
    main()
