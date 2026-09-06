#!/usr/bin/env python3
"""Patch documentTemplates.* EN targets and append missing units."""
from __future__ import annotations

import re
from pathlib import Path

from document_templates_en_targets import APPEND_SOURCES, DOCUMENT_TEMPLATES_EN_BY_ID

ROOT = Path(__file__).resolve().parents[1]
XLF = ROOT / "src/locale/messages.en-US.xlf"
ES_MX = ROOT / "src/locale/messages.es-MX.xlf"
ES_ES = ROOT / "src/locale/messages.es-ES.xlf"
X_TAG_RE = re.compile(r'<x id="([^"]+)"[^/]*/>')


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
    for uid, template in DOCUMENT_TEMPLATES_EN_BY_ID.items():
        pattern = re.compile(
            rf'(<trans-unit id="{re.escape(uid)}"[^>]*>\s*<source>(.*?)</source>\s*<target>)(.*?)(</target>)',
            re.S,
        )

        def repl(match: re.Match[str], tmpl: str = template) -> str:
            nonlocal updated
            prefix, source, old, suffix = match.group(1), match.group(2), match.group(3), match.group(4)
            target = apply_template(source, tmpl)
            if target != old:
                updated += 1
            return prefix + target + suffix

        text, _n = pattern.subn(repl, text, count=1)
    path.write_text(text, encoding="utf-8")
    return updated


def append_missing(path: Path, *, with_en_target: bool, spanish_target: bool) -> int:
    text = path.read_text(encoding="utf-8")
    blocks: list[str] = []
    for uid, source in APPEND_SOURCES.items():
        if f'id="{uid}"' in text:
            continue
        en = DOCUMENT_TEMPLATES_EN_BY_ID[uid]
        if with_en_target:
            target = apply_template(source, en)
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
    if not blocks:
        return 0
    marker = "    </body>"
    if marker not in text:
        raise SystemExit(f"No {marker!r} in {path}")
    path.write_text(text.replace(marker, "".join(blocks) + marker, 1), encoding="utf-8")
    return len(blocks)


def main() -> int:
    n_patch = patch_existing(XLF)
    n_en = append_missing(XLF, with_en_target=True, spanish_target=False)
    n_mx = append_missing(ES_MX, with_en_target=False, spanish_target=False)
    n_es = append_missing(ES_ES, with_en_target=False, spanish_target=True)
    print(f"Patched {n_patch} targets; appended en-US={n_en} es-MX={n_mx} es-ES={n_es}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
