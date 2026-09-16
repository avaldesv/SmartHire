#!/usr/bin/env python3
"""Patch positions.* targets in messages.en-US.xlf without regenerating the file."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from positions_en_targets import POSITIONS_EN_BY_ID  # noqa: E402

XLF = ROOT / "src/locale/messages.en-US.xlf"
UNIT_RE = re.compile(
    r'(<trans-unit id="((?:positions|dashboard\.filter\.dateFrom)[^"]*)"[^>]*>\s*<source>(.*?)</source>\s*<target>)(.*?)(</target>)',
    re.S,
)
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


def main() -> int:
    text = XLF.read_text(encoding="utf-8")
    updated = 0
    missing: list[str] = []

    def repl(match: re.Match[str]) -> str:
        nonlocal updated
        prefix, uid, source, _old, suffix = match.groups()
        template = POSITIONS_EN_BY_ID.get(uid)
        if template is None:
            missing.append(uid)
            return match.group(0)
        target = apply_template(source, template)
        if target != match.group(4):
            updated += 1
        return prefix + target + suffix

    new_text = UNIT_RE.sub(repl, text)
    found_ids = {m.group(2) for m in UNIT_RE.finditer(text)}
    unused = sorted(set(POSITIONS_EN_BY_ID) - found_ids)
    if missing:
        print("XLF keys without dictionary entry:", len(missing))
        for uid in missing:
            print("  ", uid)
    if unused:
        print("Dictionary keys not in XLF:", unused)
    XLF.write_text(new_text, encoding="utf-8")
    print(f"Updated {updated} targets in {XLF}")
    return 1 if missing else 0


if __name__ == "__main__":
    raise SystemExit(main())
