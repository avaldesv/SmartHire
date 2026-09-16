"""Fix catalogs-admin HTML: panels outside category @for loop."""
from pathlib import Path

p = Path("src/app/features/settings/catalogs/catalogs-admin.component.html")
text = p.read_text(encoding="utf-8")

# Find panels start/end
start_marker = '@if (isPanelVisible("gender"))'
end_marker = "          </div>\n        }\n      </div>\n    </mat-tab>\n  }\n</mat-tab-group>"

start = text.find(start_marker)
end = text.find(end_marker)
if start == -1 or end == -1:
    raise SystemExit(f"markers not found start={start} end={end}")

panels = text[start:end].rstrip()

header = """<h3>Catálogos</h3>
<mat-tab-group [selectedIndex]="categoryTabIndex" (selectedIndexChange)="onCategoryTabChange($event)">
  @for (category of categories; track category.id) {
    <mat-tab [label]="category.label">
      <div class="category-shell">
        <mat-form-field appearance="outline" class="catalog-select">
          <mat-label>Catálogos</mat-label>
          <mat-select
            [value]="selectedCatalogIdByCategory[category.id]"
            (selectionChange)="onCatalogSelect(category.id, $event.value)"
          >
            @for (entry of category.catalogs; track entry.id) {
              <mat-option [value]="entry.id">{{ entry.label }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </div>
    </mat-tab>
  }
</mat-tab-group>

@if (!isActiveCatalogImplemented()) {
  <div class="sh-card pending-catalog">
    <mat-icon>info</mat-icon>
    <p>
      Catálogo pendiente de implementación. Ver plan
      <code>docs/technical/CATALOG-REFACTOR-PLAN-v1.md</code> y issues AVV-380+.
    </p>
  </div>
} @else {
  <div class="catalog-panels">
"""

footer = """
  </div>
}
"""

p.write_text(header + panels + footer, encoding="utf-8")
print("Fixed", p)
