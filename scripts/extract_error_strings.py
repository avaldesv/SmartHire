#!/usr/bin/env python3
import re
from pathlib import Path

pat = re.compile(r"\$localize`:@@errors\.([^.]+)\.(title|message):([^`]+)`")
root = Path(__file__).resolve().parents[1] / "src/app/core/i18n"
items = []
for f in sorted(root.glob("api-error-catalog*.ts")):
    for m in pat.finditer(f.read_text(encoding="utf-8")):
        items.append((m.group(1), m.group(2), m.group(3)))
print("entries", len(items))
strings = sorted({t for _, _, t in items})
print("unique strings", len(strings))
for s in strings:
    print(s)
