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
    "reports.filter.dimension": "Dimensión",
    "reports.filter.startDay": "Día inicial",
    "reports.filter.endDay": "Día final",
    "reports.pager.range": "<x id=\"from\"/> - <x id=\"to\"/> de <x id=\"total\"/>",
    "reports.month.january": "Enero",
    "reports.month.february": "Febrero",
    "reports.month.march": "Marzo",
    "reports.month.april": "Abril",
    "reports.month.may": "Mayo",
    "reports.month.june": "Junio",
    "reports.month.july": "Julio",
    "reports.month.august": "Agosto",
    "reports.month.september": "Septiembre",
    "reports.month.october": "Octubre",
    "reports.month.november": "Noviembre",
    "reports.month.december": "Diciembre",
    "reports.dim.none": "Resumen (sin dimensión)",
    "reports.cons.status.created": "Creada",
    "reports.cons.status.analysis": "Análisis",
    "reports.cons.status.selection": "Selección",
    "reports.cons.subtitle": "Resumen de requisiciones por estado y día del mes",
    "reports.cons.loadError": "No se pudo cargar el reporte Consolidado. Intenta de nuevo.",
    "reports.cons.kpi.totalRequisitions": "Total de requisiciones",
    "reports.cons.kpi.recruiters": "Reclutadores",
    "reports.cons.kpi.reqPerRecruiter": "Requis./Reclutadores",
    "reports.cons.chart.status": "Requisiciones por estado",
    "reports.cons.section.detail": "Detalle de las requisiciones por estado y días del mes",
    "reports.cons.col.statusDay": "Estado/Día",
    "reports.cons.section.byDimension": "Por dimensión",
    "reports.cons.col.entity": "Entidad",
    "reports.seg.subtitle": "Requisiciones por estado y totales por dimensión",
    "reports.seg.loadError": "No se pudo cargar el Resumen segmentado. Intenta de nuevo.",
    "reports.seg.section.daily": "Resumen diario de requisiciones por Grupo / Reclutador",
    "reports.seg.col.groupRecruiter": "Grupo/Reclutador",
    "reports.tops.subtitle": "Tops de incidencias (métricas pendientes de definición)",
    "reports.tops.dim.pendingAssignment": "Pendientes por asignar",
    "reports.tops.title": "Tops de incidencias - Requisiciones <x id=\"dim\"/>",
    "reports.tops.col.coordinator": "Coordinador",
    "reports.tops.col.requis": "Requis.",
    "reports.tops.col.businessUnit": "Unidad de negocio",
    "reports.tops.loadError": "No se pudo cargar el reporte Tops de incidencias. Intenta de nuevo.",
    "reports.met.subtitle": "Métricas de posiciones, postulados y contratados",
    "reports.met.titleBy": "Métricas de requisiciones cubiertas por <x id=\"dim\"/>",
    "reports.met.dim.byGroup": "Por grupo",
    "reports.met.dim.byRecruiter": "Por reclutador",
    "reports.met.dim.byClient": "Por cliente",
    "reports.met.dim.byBusinessUnit": "Por U. Negocio",
    "reports.met.emptyChart": "Sin datos para graficar",
    "reports.met.col.positions": "Posiciones",
    "reports.met.col.avgHireDays": "Promedio días contratación",
    "reports.met.loadError": "No se pudo cargar el reporte Métricas. Intenta de nuevo.",
    "reports.rip.subtitle": "En tiempo vs vencidas y detalle por cliente",
    "reports.rip.chart.onTimeVsExpired": "Requisiciones en proceso vs. vencidas",
    "reports.rip.aria.pie": "En tiempo vs vencidas",
    "reports.rip.onTime": "En tiempo",
    "reports.rip.expired": "Vencidas",
    "reports.rip.chart.byYear": "Requisiciones en proceso y cantidad de postulados por año",
    "reports.rip.emptyYear": "No hay información por año",
    "reports.rip.aria.yearBars": "Barras por año",
    "reports.rip.clients": "Clientes",
    "reports.rip.col.inProcess": "En proceso",
    "reports.rip.loadError": "No se pudo cargar el reporte Requisiciones en proceso. Intenta de nuevo.",
    "reports.beh.title": "Comportamiento del cubrimiento",
    "reports.beh.subtitle": "Fill rate, etapas y detalle por requisición",
    "reports.beh.chart.fillRate": "Fill rate",
    "reports.beh.chart.byType": "Por tipo de requisición",
    "reports.beh.chart.stages": "Métricas de candidatos por etapa",
    "reports.beh.noData": "No hay datos disponibles",
    "reports.beh.section.covered": "Comportamiento de las requisiciones cubiertas",
    "reports.beh.fill.positions": "Posiciones (<x id=\"pct\"/>)",
    "reports.beh.fill.hired": "Contratados (<x id=\"pct\"/>)",
    "reports.beh.fill.uncovered": "Sin cubrir (<x id=\"pct\"/>)",
    "reports.beh.col.createDate": "Fecha de creación",
    "reports.beh.col.commitmentDate": "Fecha de compromiso",
    "reports.beh.col.coverageDate": "Fecha de cobertura",
    "reports.beh.col.daysCreateCoverage": "Tiempo (días) Creación-Cobertura",
    "reports.beh.col.daysCoverageCommitment": "Tiempo (días) Cobertura-Compromiso",
    "reports.beh.col.positionsCount": "Número de posiciones",
    "reports.beh.col.qtyApplicants": "Cantidad de postulados",
    "reports.beh.col.qtyPreselected": "Cantidad de preseleccionados",
    "reports.beh.col.qtySelected": "Cantidad de seleccionados",
    "reports.beh.col.qtyEvaluated": "Cantidad de evaluados",
    "reports.beh.col.qtyInterviewed": "Cantidad de entrevistados",
    "reports.beh.col.qtyPrehired": "Cantidad de precontratados",
    "reports.beh.col.qtyHired": "Cantidad de contratados",
    "reports.beh.loadError": "No se pudo cargar el reporte Comportamiento. Intenta de nuevo.",
    "reports.rbs.subtitle": "Desempeño por fuente de candidatos",
    "reports.rbs.col.source": "Fuente de reclutamiento",
    "reports.rbs.col.hiredPct": "% de Contratados",
    "reports.rbs.col.notHired": "No contratados",
    "reports.rbs.col.notHiredPct": "% No Contratados",
    "reports.rbs.col.sourceCoverage": "% Cubrimiento fuentes",
    "reports.rbs.loadError": "No se pudo cargar el reporte Requisiciones por fuente de reclutamiento. Intenta de nuevo.",
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
