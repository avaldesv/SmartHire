import '@angular/localize/init';
import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { CatalogImportExportService } from '../../../core/services/catalog-import-export.service';
import {
  CatalogCsvImportDialogComponent,
  genderCsvFileShape,
} from './catalog-csv-import-dialog.component';

const HEADER = 'legacyId;code;name;value;legacyCountryId;countryId;isActive;scope';

describe('genderCsvFileShape', () => {
  it('treats a blank file as empty', () => {
    expect(genderCsvFileShape('')).toBe('empty');
    expect(genderCsvFileShape('   \n')).toBe('empty');
  });

  it('treats a header made only of semicolons as empty', () => {
    expect(genderCsvFileShape(';')).toBe('empty');
    expect(genderCsvFileShape(';;;;;;;')).toBe('empty');
  });

  it('treats a contract header as header-only, including a trailing newline and a BOM', () => {
    expect(genderCsvFileShape(HEADER)).toBe('header-only');
    expect(genderCsvFileShape(`${HEADER}\n`)).toBe('header-only');
    expect(genderCsvFileShape(`\uFEFF${HEADER}\n`)).toBe('header-only');
  });

  it('treats a header plus a data row as data', () => {
    expect(genderCsvFileShape(`${HEADER}\n;M;Masculino;M;;;true;TENANT\n`)).toBe('data');
  });

  it('keeps an internal semicolon inside quotes in the same cell', () => {
    expect(genderCsvFileShape(`${HEADER}\n;M;"Ma;s";M;;;true;TENANT\n`)).toBe('data');
  });
});

describe('CatalogCsvImportDialogComponent gender summary', () => {
  it('shows counts and does not list translated row codes', () => {
    TestBed.configureTestingModule({
      imports: [CatalogCsvImportDialogComponent],
      providers: [
        provideNoopAnimations(),
        { provide: MatDialogRef, useValue: { updateSize: () => undefined, close: () => undefined } },
        { provide: MAT_DIALOG_DATA, useValue: { catalogKey: 'genders', catalogLabel: 'Género' } },
        { provide: CatalogImportExportService, useValue: {} },
      ],
    });
    const fixture = TestBed.createComponent(CatalogCsvImportDialogComponent);
    fixture.componentInstance.validation = {
      structureValid: true,
      delimiter: ';',
      expectedColumns: [],
      actualColumns: [],
      totalRows: 1,
      structureErrors: [],
      validCount: 0,
      invalidCount: 1,
      invalidRows: [
        {
          rowNumber: 2,
          values: { code: '' },
          errors: [{ code: 'code-required', message: 'code is required' }],
        },
      ],
      invalidRowsCsvBase64: btoa(`${HEADER};errors\n;M;;;;code-required`),
    };
    fixture.detectChanges();

    const summary = fixture.nativeElement.querySelector('.gender-summary') as HTMLElement;
    const text = summary.textContent ?? '';
    expect(text).toContain('Filas inválidas');
    expect(text).toContain('1');
    expect(text).toContain('Descargar ítems');
    expect(text).not.toContain('code-required');
    expect(text).not.toContain('code is required');
    expect(text).not.toContain('El código es obligatorio');
    expect(fixture.nativeElement.querySelector('.gender-summary tr.row-issue')).toBeNull();
  });
});
