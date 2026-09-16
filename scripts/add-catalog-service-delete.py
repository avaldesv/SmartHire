#!/usr/bin/env python3
"""Add delete() to catalog Angular services that expose update()."""
import glob
import re

for path in glob.glob("src/app/core/services/catalog-*.service.ts"):
    content = open(path, encoding="utf-8").read()
    if re.search(r"\bdelete\s*\(\s*id\s*:", content):
        continue
    match = re.search(r"apiUrl\(`(/api/v1/[^`]+)/\$\{id\}`\)", content)
    if not match:
        print("SKIP no update path", path)
        continue
    base_path = match.group(1)
    delete_method = f"""
  delete(id: number): Observable<void> {{
    return this.http.delete<void>(this.api.apiUrl(`{base_path}/${{id}}`), {{
      headers: this.api.buildHeaders(),
    }});
  }}
"""
    content = content.rstrip()
    if not content.endswith("}"):
        print("SKIP bad file", path)
        continue
    content = content[:-1].rstrip() + delete_method + "\n}\n"
    open(path, "w", encoding="utf-8").write(content)
    print("OK", path)

print("done")
