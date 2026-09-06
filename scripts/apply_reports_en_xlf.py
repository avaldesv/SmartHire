#!/usr/bin/env python3
"""Patch reports.* targets in messages.en-US.xlf and append missing nav units."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from reports_en_targets import REPORTS_EN_BY_ID  # noqa: E402

XLF = ROOT / "src/locale/messages.en-US.xlf"
ES_MX = ROOT / "src/locale/messages.es-MX.xlf"
ES_ES = ROOT / "src/locale/messages.es-ES.xlf"
UNIT_RE = re.compile(
    r'(<trans-unit id="(reports\.[^"]+)"[^>]*>\s*<source>(.*?)</source>\s*<target>)(.*?)(</target>)',
    re.S,
)
X_TAG_RE = re.compile(r'<x id="([^"]+)"[^/]*/>')

NAV_SOURCES: dict[str, str] = {
    "reports.pageTitle": "Reportes",
    "reports.nav.category.general": "Generales",
    "reports.nav.category.coverage": "Cubrimiento",
    "reports.nav.category.vacancies": "Vacantes",
    "reports.nav.mmr": "MMR",
    "reports.nav.statusByRequisition": "Estatus por requisición",
    "reports.nav.processFunnel": "Funnel del proceso",
    "reports.nav.consolidated": "Consolidado",
    "reports.nav.segmentedSummary": "Resumen segmentado",
    "reports.nav.topIncidents": "Tops incidencias",
    "reports.nav.metrics": "Métricas",
    "reports.nav.positionsInProcess": "Posiciones en proceso",
    "reports.nav.behavior": "Comportamiento",
    "reports.nav.requisitionsBySource": "Requisiciones por fuente",
    "reports.filter.businessUnitShort": "U. Negocio",
    "reports.filter.requisition": "Requisición",
    "reports.filter.status": "Estado",
    "reports.filter.startDate": "Fecha inicial",
    "reports.filter.endDate": "Fecha final",
    "reports.filter.client": "Cliente",
    "reports.filter.clientPlaceholder": "Buscar cliente",
    "reports.filter.clientClear": "Limpiar cliente",
    "reports.filter.orderNumber": "Orden #<x id=\"id\"/>",
    "reports.sbr.subtitle": "Agregado por estado de la requisición",
    "reports.sbr.loadError": "No se pudo cargar el reporte Estatus por requisición. Intenta de nuevo.",
    "reports.sbr.chartTitle": "Requisiciones por estatus",
    "reports.sbr.empty": "No hay información",
    "reports.sbr.col.status": "Estado",
    "reports.sbr.col.requisitions": "Requisiciones",
    "reports.sbr.col.positions": "Número de posiciones",
    "reports.sbr.col.applicants": "Postulados",
    "reports.sbr.col.preselected": "Preseleccionados",
    "reports.sbr.col.selected": "Seleccionados",
    "reports.sbr.col.evaluated": "Evaluados",
    "reports.sbr.col.interviewed": "Entrevistados",
    "reports.sbr.col.prehired": "Precontratados",
    "reports.sbr.col.hired": "Contratados",
    "reports.sbr.col.uncovered": "Sin cubrir",
    "reports.sbr.col.compliance": "% cumplimiento",
    "reports.sbr.col.digitalDocs": "Doc. digitales",
    "reports.sbr.status.covered": "Cubierta",
    "reports.sbr.status.partiallyCovered": "Parcialmente cubierta",
    "reports.sbr.status.inAnalysis": "En análisis",
    "reports.sbr.status.inSelection": "En selección",
    "reports.sbr.status.cancelled": "Cancelada",
    "reports.sbr.status.cancellationRequested": "Cancelación solicitada",
    "reports.sbr.status.inProcess": "En proceso",
    "reports.pf.subtitle": "Embudo de candidatos por requisición",
    "reports.pf.loadError": "No se pudo cargar el reporte Funnel del proceso. Intenta de nuevo.",
    "reports.pf.chart.totalCoverage": "Cubrimiento Total",
    "reports.pf.chart.coverageByBrand": "Cubrimiento por Marca",
    "reports.pf.empty.brands": "No hay marcas para mostrar",
    "reports.pf.empty.noBrand": "Sin marca",
}


def apply_template(source: str, template: str) -> str:
    tags = {m.group(1): m.group(0) for m in X_TAG_RE.finditer(source)}
    out = template
    for xid, tag in tags.items():
        out = out.replace("{" + xid + "}", tag)
    leftover = re.findall(r"\{([a-zA-Z0-9_]+)\}", out)
    if leftover:
        raise ValueError(f"Unresolved placeholders {leftover} in: {template}")
    return out


def append_missing(path: Path, *, with_en_target: bool, spanish_target: bool) -> int:
    text = path.read_text(encoding="utf-8")
    added = 0
    blocks: list[str] = []
    for uid, source in NAV_SOURCES.items():
        if f'id="{uid}"' in text:
            continue
        en = REPORTS_EN_BY_ID[uid]
        target = apply_template(source, en)
        if with_en_target:
            unit = (
                f'      <trans-unit id="{uid}" datatype="html">\n'
                f"        <source>{source}</source>\n"
                f"        <target>{target}</target>\n"
                f"      </trans-unit>\n"
            )
        elif spanish_target:
            unit = (
                f'      <trans-unit id="{uid}" datatype="html">\n'
                f"        <source>{source}</source>\n"
                f"        <target>{source}</target>\n"
                f"      </trans-unit>\n"
            )
        else:
            unit = (
                f'      <trans-unit id="{uid}" datatype="html">\n'
                f"        <source>{source}</source>\n"
                f"      </trans-unit>\n"
            )
        blocks.append(unit)
        added += 1
    if not blocks:
        return 0
    insert = "".join(blocks)
    marker = "    </body>"
    if marker not in text:
        raise SystemExit(f"No {marker!r} in {path}")
    path.write_text(text.replace(marker, insert + marker, 1), encoding="utf-8")
    return added


def patch_en_targets() -> int:
    text = XLF.read_text(encoding="utf-8")
    updated = 0
    missing: list[str] = []

    def repl(match: re.Match[str]) -> str:
        nonlocal updated
        prefix, uid, source, _old, suffix = match.groups()
        template = REPORTS_EN_BY_ID.get(uid)
        if template is None:
            missing.append(uid)
            return match.group(0)
        target = apply_template(source, template)
        if target != match.group(4):
            updated += 1
        return prefix + target + suffix

    new_text = UNIT_RE.sub(repl, text)
    XLF.write_text(new_text, encoding="utf-8")
    if missing:
        print("Existing reports.* without dict:", missing)
    print(f"Updated {updated} existing reports.* targets")
    return 1 if missing else 0


def main() -> int:
    rc = patch_en_targets()
    n_en = append_missing(XLF, with_en_target=True, spanish_target=False)
    n_mx = append_missing(ES_MX, with_en_target=False, spanish_target=False)
    n_es = append_missing(ES_ES, with_en_target=False, spanish_target=True)
    print(f"Appended nav units en-US={n_en} es-MX={n_mx} es-ES={n_es}")
    return rc


if __name__ == "__main__":
    raise SystemExit(main())
