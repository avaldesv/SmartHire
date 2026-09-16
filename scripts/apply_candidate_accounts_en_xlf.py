#!/usr/bin/env python3
"""Patch candidateAccounts.* EN targets in XLF catalogs."""
from __future__ import annotations

import re
from pathlib import Path

from candidate_accounts_en_targets import CANDIDATE_ACCOUNTS_EN_BY_ID

ROOT = Path(__file__).resolve().parents[1]
XLF = ROOT / "src/locale/messages.en-US.xlf"
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
    for uid, template in CANDIDATE_ACCOUNTS_EN_BY_ID.items():
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

        text, n = pattern.subn(repl, text, count=1)
        if n == 0:
            missing.append(uid)
    if missing:
        print("Missing in XLF:", missing)
    XLF.write_text(text, encoding="utf-8")
    print(f"Updated {updated} targets in {XLF}")
    return 1 if missing else 0


if __name__ == "__main__":
    raise SystemExit(main())
