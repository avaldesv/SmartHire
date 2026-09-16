#!/usr/bin/env python3
"""Extract snack/confirm strings from catalogs-admin.component.ts."""
import re
from pathlib import Path

path = Path(__file__).resolve().parents[1] / "src/app/features/settings/catalogs/catalogs-admin.component.ts"
text = path.read_text(encoding="utf-8")
snacks = re.findall(r"snack\.open\('([^']+)'", text)
confirms = re.findall(r'confirm\(`([^`]+)`\)', text)
confirms += re.findall(r"confirm\('([^']+)'\)", text)
print(f"snacks: {len(snacks)} unique: {len(set(snacks))}")
for m in sorted(set(snacks)):
    print(f"  {m!r}")
print(f"\nconfirms: {len(confirms)} unique: {len(set(confirms))}")
for m in sorted(set(confirms)):
    print(f"  {m!r}")
