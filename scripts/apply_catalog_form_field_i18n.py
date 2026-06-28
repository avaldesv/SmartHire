#!/usr/bin/env python3
"""Bind remaining catalog form field labels via component properties."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "src/app/features/settings/catalogs/catalogs-admin.component.html"

REPLACEMENTS = [
    ("<mat-label>Valor</mat-label>", "<mat-label>{{ catalogsValue }}</mat-label>"),
    ("<mat-label>Nombre comercial</mat-label>", "<mat-label>{{ colTradeName }}</mat-label>"),
    ("<mat-label>RFC</mat-label>", "<mat-label>{{ colTaxId }}</mat-label>"),
    ("<mat-label>Idioma default del portal</mat-label>", "<mat-label>{{ fieldDefaultPortalLanguage }}</mat-label>"),
    ("<mat-label>Mensaje facturación</mat-label>", "<mat-label>{{ fieldBillingMessage }}</mat-label>"),
    ("<mat-label>Código ATS</mat-label>", "<mat-label>{{ fieldAtsCode }}</mat-label>"),
    ("<mat-label>Calle</mat-label>", "<mat-label>{{ fieldStreet }}</mat-label>"),
    ("<mat-label>Colonia</mat-label>", "<mat-label>{{ fieldNeighborhood }}</mat-label>"),
    ("<mat-label>Municipio</mat-label>", "<mat-label>{{ fieldMunicipality }}</mat-label>"),
    ("<mat-label>Estado</mat-label>", "<mat-label>{{ fieldState }}</mat-label>"),
    ("<mat-label>URL logo</mat-label>", "<mat-label>{{ fieldLogoUrl }}</mat-label>"),
    ("<mat-label>URL banner</mat-label>", "<mat-label>{{ fieldBannerUrl }}</mat-label>"),
    ("<mat-label>Símbolo</mat-label>", "<mat-label>{{ colSymbol }}</mat-label>"),
    ("<mat-label>Denominación</mat-label>", "<mat-label>{{ colDenomination }}</mat-label>"),
    ("<mat-label>Tipo documento</mat-label>", "<mat-label>{{ fieldDocumentType }}</mat-label>"),
    ("<mat-label>Empresa (opcional)</mat-label>", "<mat-label>{{ fieldCompanyOptional }}</mat-label>"),
    ("<mat-label>Empresa</mat-label>", "<mat-label>{{ fieldCompany }}</mat-label>"),
    ("<mat-label>Categoría</mat-label>", "<mat-label>{{ colCategory }}</mat-label>"),
    ("<mat-label>Tipo</mat-label>", "<mat-label>{{ colType }}</mat-label>"),
    ("<mat-label>Pregunta</mat-label>", "<mat-label>{{ colQuestion }}</mat-label>"),
    ("<mat-label>Id MP</mat-label>", '<mat-label i18n="@@catalogs.field.manpowerIdShort">Id MP</mat-label>'),
    ("<mat-label>ID Manpower</mat-label>", "<mat-label>{{ fieldManpowerId }}</mat-label>"),
    ("<mat-label>Core ATS</mat-label>", "<mat-label>{{ colCoreAts }}</mat-label>"),
    ("<mat-label>Core Appian</mat-label>", "<mat-label>{{ colCoreAppian }}</mat-label>"),
    ("<mat-label>Descripción corta</mat-label>", "<mat-label>{{ fieldShortDescription }}</mat-label>"),
    ("<mat-label>Entidad federativa</mat-label>", "<mat-label>{{ fieldFederalState }}</mat-label>"),
    ("<mat-label>Código postal</mat-label>", "<mat-label>{{ fieldPostalCode }}</mat-label>"),
    ("<mat-label>Empresa / área</mat-label>", "<mat-label>{{ colCompanyArea }}</mat-label>"),
    ("<mat-label>Contacto</mat-label>", "<mat-label>{{ colContact }}</mat-label>"),
    ("<mat-label>Puesto</mat-label>", "<mat-label>{{ colPosition }}</mat-label>"),
    ("<mat-label>Teléfono</mat-label>", "<mat-label>{{ colPhone }}</mat-label>"),
    ("<mat-label>Correo</mat-label>", "<mat-label>{{ colEmail }}</mat-label>"),
    ("<mat-label>Razón social</mat-label>", "<mat-label>{{ colLegalName }}</mat-label>"),
    ('formControlName="noPurchaseOrder">Sin orden de compra</mat-checkbox>', 'formControlName="noPurchaseOrder">{{ fieldNoPurchaseOrder }}</mat-checkbox>'),
    ('formControlName="r3Interface">Interfaz R3</mat-checkbox>', 'formControlName="r3Interface">{{ fieldR3Interface }}</mat-checkbox>'),
    ('formControlName="wsSignature">Firma WS</mat-checkbox>', 'formControlName="wsSignature">{{ fieldWsSignature }}</mat-checkbox>'),
    ('formControlName="validatesWithAi">Valida con IA</mat-checkbox>', 'formControlName="validatesWithAi">{{ fieldValidatesWithAi }}</mat-checkbox>'),
    ('formControlName="requiresCareer">Requiere carrera</mat-checkbox>', 'formControlName="requiresCareer">{{ colRequiresCareer }}</mat-checkbox>'),
    ('formControlName="appliesToCareer">Aplica a carrera</mat-checkbox>', 'formControlName="appliesToCareer">{{ colAppliesToCareer }}</mat-checkbox>'),
]


def main() -> None:
    text = HTML.read_text(encoding="utf-8")
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    HTML.write_text(text, encoding="utf-8")
    print(f"Updated {HTML}")


if __name__ == "__main__":
    main()
