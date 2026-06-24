"""Transform catalogs-admin flat tabs to panel @if blocks."""
from pathlib import Path
import re

p = Path("src/app/features/settings/catalogs/catalogs-admin.component.html")
text = p.read_text(encoding="utf-8")

mapping = {
    "Géneros": "gender",
    "Parentesco": "kinship",
    "Compañías": "company",
    "Monedas": "currency",
    "Carreras": "career",
    "Idiomas": "language",
    "Turnos": "shift",
    "Prestaciones": "benefit",
    "Tipos de documento": "documentType",
    "Marcas": "brand",
    "Tipos de contrato": "contractType",
    "Tipos de cobertura": "coverageType",
    "Niveles de educación": "educationLevel",
    "Niveles de idioma": "languageLevel",
    "Tipos de requisición": "requisitionType",
    "Empresas cliente": "clientCompany",
    "Países": "country",
    "Entidades federativas": "state",
    "Municipios": "municipality",
    "Colonias": "neighborhood",
}

header = '''<h3>Catálogos</h3>
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

        @if (!isCatalogImplemented(category.id, selectedCatalogIdByCategory[category.id])) {
          <div class="sh-card pending-catalog">
            <mat-icon>info</mat-icon>
            <p>
              Catálogo pendiente de implementación (AVV-380+). Campos documentados en
              <code>docs/technical/CATALOG-REFACTOR-PLAN-v1.md</code>.
            </p>
          </div>
        } @else {
          <div class="catalog-panels">
'''

footer = '''          </div>
        }
      </div>
    </mat-tab>
  }
</mat-tab-group>
'''

# Extract body between first mat-tab-group and last closing
start = text.find("<mat-tab-group>")
end = text.rfind("</mat-tab-group>")
body = text[start + len("<mat-tab-group>") : end]

for label, key in mapping.items():
    body = body.replace(
        f'<mat-tab label="{label}">',
        f'@if (isPanelVisible("{key}")) {{',
    )
body = body.replace("</mat-tab>", "}")

# mp duplicates: copy country panel block for mpCountry - done in TS by mapping panelKey

out = header + body + footer
p.write_text(out, encoding="utf-8")
print("Transformed", p)
