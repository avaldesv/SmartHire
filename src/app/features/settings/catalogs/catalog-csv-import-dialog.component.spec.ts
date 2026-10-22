import '@angular/localize/init';
import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { CatalogImportExportService } from '../../../core/services/catalog-import-export.service';
import { localizeSharedCsvIssue } from '../../../core/i18n/catalog-import-labels';
import {
  CatalogCsvImportDialogComponent,
  genderCsvFileShape,
} from './catalog-csv-import-dialog.component';
import { sharedCsvDownloadName, usesSharedCsvDialog } from './shared-csv-dialog-catalogs';

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

describe('shared CSV dialog membership', () => {
  it('keeps genders and the first wave on the shared dialog', () => {
    expect(usesSharedCsvDialog('genders')).toBeTrue();
    expect(usesSharedCsvDialog('marital-statuses')).toBeTrue();
    expect(usesSharedCsvDialog('states')).toBeTrue();
    expect(sharedCsvDownloadName('genders', 'invalid')).toBe('genders-invalid.csv');
    expect(sharedCsvDownloadName('marital-statuses', 'valid')).toBe('marital-statuses-valid.csv');
  });

  it('leaves a later-wave catalog on the previous dialog', () => {
    expect(usesSharedCsvDialog('countries')).toBeFalse();
    expect(usesSharedCsvDialog('companies')).toBeFalse();
    expect(usesSharedCsvDialog('questionnaire-questionnaires')).toBeFalse();
  });

  it('names the visible catalog without changing the gender phrase', () => {
    expect(localizeSharedCsvIssue('legacy-id-conflict', 'genders', 'Género')).toContain('otro género');
    expect(localizeSharedCsvIssue('legacy-id-conflict', 'marital-statuses', 'Estados civiles')).toContain(
      'Estados civiles',
    );
    expect(localizeSharedCsvIssue('tenant-not-writable', 'marital-statuses', 'Estados civiles')).toContain(
      'Estados civiles',
    );
    expect(localizeSharedCsvIssue('missing-column', 'marital-statuses', 'Estados civiles')).toContain(
      'columnas obligatorias',
    );
  });
});

describe('CatalogCsvImportDialogComponent first wave', () => {
  function setup(catalogKey: string, importRows: jasmine.Spy = jasmine.createSpy('importRows')) {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [CatalogCsvImportDialogComponent],
      providers: [
        provideNoopAnimations(),
        { provide: MatDialogRef, useValue: { updateSize: () => undefined, close: () => undefined } },
        { provide: MAT_DIALOG_DATA, useValue: { catalogKey, catalogLabel: catalogKey } },
        { provide: CatalogImportExportService, useValue: { importRows } },
      ],
    });
    const fixture = TestBed.createComponent(CatalogCsvImportDialogComponent);
    fixture.detectChanges();
    return { fixture, component: fixture.componentInstance, importRows };
  }

  it('shows the four-column summary for a first-wave catalog', () => {
    const { fixture, component } = setup('marital-statuses');
    component.validation = {
      structureValid: true,
      delimiter: ';',
      expectedColumns: [],
      actualColumns: [],
      totalRows: 1,
      structureErrors: [],
      validCount: 1,
      invalidCount: 0,
      validRowsCsvBase64: 'YQ==',
    };
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.gender-summary')).not.toBeNull();
    expect(component.sharedDownload('invalid')).toBe('marital-statuses-invalid.csv');
    expect(component.sharedDownload('valid')).toBe('marital-statuses-valid.csv');
  });

  it('keeps the previous dialog for a second-wave catalog', () => {
    const { fixture } = setup('countries');
    expect(fixture.nativeElement.querySelector('.gender-summary')).toBeNull();
    expect(fixture.nativeElement.querySelector('.preview-summary-table')).not.toBeNull();
  });

  it('does not call import/rows when there are no valid rows', () => {
    const importRows = jasmine.createSpy('importRows');
    const { component } = setup('marital-statuses', importRows);
    component.selectedFile = new File(['legacyId;code\n'], 'marital-statuses.csv', { type: 'text/csv' });
    component.validation = {
      structureValid: true,
      delimiter: ';',
      expectedColumns: [],
      actualColumns: [],
      totalRows: 1,
      structureErrors: [],
      validCount: 0,
      invalidCount: 1,
      validRows: [],
    };
    component.importCsv();
    expect(importRows).not.toHaveBeenCalled();
  });
});
