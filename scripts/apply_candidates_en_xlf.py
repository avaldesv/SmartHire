#!/usr/bin/env python3
"""Patch candidates.* / paginator targets and append missing units to XLF catalogs."""
from __future__ import annotations

import re
from pathlib import Path

from candidates_en_targets import CANDIDATES_EN_BY_ID

ROOT = Path(__file__).resolve().parents[1]
XLF = ROOT / "src/locale/messages.en-US.xlf"
ES_MX = ROOT / "src/locale/messages.es-MX.xlf"
ES_ES = ROOT / "src/locale/messages.es-ES.xlf"
X_TAG_RE = re.compile(r'<x id="([^"]+)"[^/]*/>')

NAV_SOURCES: dict[str, str] = {
    "candidates.list.subtitle": "Administración de candidatos en el sistema",
    "candidates.list.new": "Nuevo candidato",
    "candidates.list.search": "Buscar candidato",
    "candidates.list.searchPlaceholder": "Nombre, correo…",
    "candidates.list.loadError": "No se pudieron cargar los candidatos",
    "candidates.list.col.id": "ID",
    "candidates.list.col.firstName": "Nombre",
    "candidates.list.col.lastName": "Apellidos",
    "candidates.list.col.email": "Correo",
    "candidates.list.col.phone": "Teléfono",
    "candidates.list.col.city": "Ciudad",
    "candidates.list.col.source": "Origen",
    "candidates.list.col.active": "Activo",
    "candidates.list.col.createdAt": "Alta",
    "candidates.source.portal": "Portal",
    "candidates.source.recruiterExcelBulk": "Carga Excel reclutador",
    "candidates.form.titleEdit": "Editar candidato",
    "candidates.form.subtitle": "Complete la información del candidato",
    "candidates.form.loading": "Cargando...",
    "candidates.form.gender.female": "Femenino",
    "candidates.form.gender.male": "Masculino",
    "candidates.form.source.manual": "Carga Manual",
    "candidates.form.source.jobboard": "Jobboard",
    "candidates.form.source.buc": "BUC",
    "candidates.form.created": "Candidato creado",
    "candidates.form.updated": "Candidato actualizado",
    "candidates.form.saveError": "No se pudo guardar el candidato",
    "candidates.form.loadError": "No se pudo cargar el candidato",
    "candidates.form.countriesError": "No se pudieron cargar los países",
    "candidates.form.statesError": "No se pudieron cargar los estados",
    "candidates.form.municipalitiesError": "No se pudieron cargar los municipios",
    "candidates.form.neighborhoodsError": "No se pudieron cargar las colonias",
    "candidates.form.noNeighborhoods": "Sin colonias para ese código postal",
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


def patch_existing(path: Path) -> int:
    text = path.read_text(encoding="utf-8")
    updated = 0
    for uid, template in CANDIDATES_EN_BY_ID.items():
        pattern = re.compile(
            rf'(<trans-unit id="{re.escape(uid)}"[^>]*>\s*<source>(.*?)</source>\s*<target>)(.*?)(</target>)',
            re.S,
        )

        def repl(match: re.Match[str], tmpl: str = template) -> str:
            nonlocal updated
            prefix, source, _old, suffix = match.group(1), match.group(2), match.group(3), match.group(4)
            target = apply_template(source, tmpl)
            if target != _old:
                updated += 1
            return prefix + target + suffix

        text, n = pattern.subn(repl, text, count=1)
        if n == 0 and uid in NAV_SOURCES:
            continue
    path.write_text(text, encoding="utf-8")
    return updated


def append_missing(path: Path, *, with_en_target: bool, spanish_target: bool) -> int:
    text = path.read_text(encoding="utf-8")
    added = 0
    blocks: list[str] = []
    for uid, source in NAV_SOURCES.items():
        if f'id="{uid}"' in text:
            continue
        en = CANDIDATES_EN_BY_ID[uid]
        target = apply_template(source, en)
        if with_en_target:
            inner_target = target
        elif spanish_target:
            inner_target = source
        else:
            unit = (
                f'      <trans-unit id="{uid}" datatype="html">\n'
                f"        <source>{source}</source>\n"
                f"      </trans-unit>\n"
            )
            blocks.append(unit)
            added += 1
            continue
        unit = (
            f'      <trans-unit id="{uid}" datatype="html">\n'
            f"        <source>{source}</source>\n"
            f"        <target>{inner_target}</target>\n"
            f"      </trans-unit>\n"
        )
        blocks.append(unit)
        added += 1
    if not blocks:
        return 0
    marker = "    </body>"
    if marker not in text:
        raise SystemExit(f"No {marker!r} in {path}")
    path.write_text(text.replace(marker, "".join(blocks) + marker, 1), encoding="utf-8")
    return added


def main() -> int:
    n_patch = patch_existing(XLF)
    n_en = append_missing(XLF, with_en_target=True, spanish_target=False)
    n_mx = append_missing(ES_MX, with_en_target=False, spanish_target=False)
    n_es = append_missing(ES_ES, with_en_target=False, spanish_target=True)
    print(f"Patched {n_patch} existing targets; appended en-US={n_en} es-MX={n_mx} es-ES={n_es}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
