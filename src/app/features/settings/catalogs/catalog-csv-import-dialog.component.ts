import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  CatalogCsvImportResponse,
  CatalogCsvStructureValidationResponse,
  CatalogImportExportService,
  downloadBase64Csv,
  downloadBlob,
} from '../../../core/services/catalog-import-export.service';
import {
  CATALOG_IMPORT_CLOSE,
  CATALOG_IMPORT_DOWNLOAD_ERRORS,
  CATALOG_IMPORT_DOWNLOAD_TEMPLATE,
  CATALOG_IMPORT_HINT,
  CATALOG_IMPORT_IMPORT,
  CATALOG_IMPORT_IMPORT_ERROR,
  CATALOG_IMPORT_SELECT_FILE,
  CATALOG_IMPORT_TEMPLATE_ERROR,
  CATALOG_IMPORT_VALIDATE,
  CATALOG_IMPORT_VALIDATE_ERROR,
  catalogImportResultSummary,
  catalogImportStructureValid,
  catalogImportTitle,
} from '../../../core/i18n/catalog-import-labels';

export interface CatalogCsvImportDialogData {
  catalogKey: string;
  catalogLabel: string;
}

@Component({
  selector: 'sh-catalog-csv-import-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './catalog-csv-import-dialog.component.html',
  styleUrl: './catalog-csv-import-dialog.component.scss',
})
export class CatalogCsvImportDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CatalogCsvImportDialogComponent, boolean>);
  readonly data = inject<CatalogCsvImportDialogData>(MAT_DIALOG_DATA);
  private readonly catalogImportExport = inject(CatalogImportExportService);

  selectedFile: File | null = null;
  validating = false;
  importing = false;
  validation: CatalogCsvStructureValidationResponse | null = null;
  importResult: CatalogCsvImportResponse | null = null;
  errorMessage = '';

  readonly importTitle = catalogImportTitle(this.data.catalogLabel);
  readonly hint = CATALOG_IMPORT_HINT;
  readonly downloadTemplateLabel = CATALOG_IMPORT_DOWNLOAD_TEMPLATE;
  readonly downloadErrorsLabel = CATALOG_IMPORT_DOWNLOAD_ERRORS;
  readonly closeLabel = CATALOG_IMPORT_CLOSE;
  readonly validateLabel = CATALOG_IMPORT_VALIDATE;
  readonly importLabel = CATALOG_IMPORT_IMPORT;
  readonly structureValidMessage = catalogImportStructureValid;
  readonly resultSummary = catalogImportResultSummary;

  get isValidated(): boolean {
    return this.validation?.structureValid === true;
  }

  get isImportDone(): boolean {
    return this.importResult !== null;
  }

  get showValidateAction(): boolean {
    return !!this.selectedFile && !this.isImportDone && !this.isValidated;
  }

  get showImportAction(): boolean {
    return this.isValidated && !this.isImportDone;
  }

  get isBusy(): boolean {
    return this.validating || this.importing;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
    this.validation = null;
    this.importResult = null;
    this.errorMessage = '';
    this.validating = false;
    this.importing = false;
  }

  downloadTemplate(): void {
    this.catalogImportExport.downloadTemplate(this.data.catalogKey).subscribe({
      next: (blob) => downloadBlob(blob, `${this.data.catalogKey}-template.csv`),
      error: () => {
        this.errorMessage = CATALOG_IMPORT_TEMPLATE_ERROR;
      },
    });
  }

  validateStructure(): void {
    if (!this.selectedFile) {
      this.errorMessage = CATALOG_IMPORT_SELECT_FILE;
      return;
    }
    this.validating = true;
    this.errorMessage = '';
    this.catalogImportExport.validateImport(this.data.catalogKey, this.selectedFile).subscribe({
      next: (response) => {
        this.validation = response;
        this.validating = false;
        if (!response.structureValid) {
          this.errorMessage = response.structureErrors.join(' ');
        }
      },
      error: () => {
        this.validating = false;
        this.errorMessage = CATALOG_IMPORT_VALIDATE_ERROR;
      },
    });
  }

  importCsv(): void {
    if (!this.selectedFile || !this.validation?.structureValid) {
      return;
    }
    this.importing = true;
    this.errorMessage = '';
    this.catalogImportExport.importCatalog(this.data.catalogKey, this.selectedFile).subscribe({
      next: (response) => {
        this.importResult = response;
        this.importing = false;
      },
      error: () => {
        this.importing = false;
        this.errorMessage = CATALOG_IMPORT_IMPORT_ERROR;
      },
    });
  }

  downloadErrorReport(): void {
    if (!this.importResult?.errorReportCsvBase64) {
      return;
    }
    downloadBase64Csv(this.importResult.errorReportCsvBase64, `${this.data.catalogKey}-import-errors.csv`);
  }

  close(): void {
    this.dialogRef.close(!!this.importResult);
  }
}
