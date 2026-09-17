import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import {
  CatalogCsvImportResponse,
  CatalogCsvStructureValidationResponse,
  CatalogImportExportService,
  downloadBase64Csv,
  downloadBlob,
} from '../../../core/services/catalog-import-export.service';
import {
  CATALOG_IMPORT_CLOSE,
  CATALOG_IMPORT_COL_CODE,
  CATALOG_IMPORT_COL_COUNTRY,
  CATALOG_IMPORT_COL_ID,
  CATALOG_IMPORT_COL_NAME,
  CATALOG_IMPORT_DOWNLOAD_ERRORS,
  CATALOG_IMPORT_DOWNLOAD_PREVIEW_ERRORS,
  CATALOG_IMPORT_DOWNLOAD_TEMPLATE,
  CATALOG_IMPORT_HINT,
  CATALOG_IMPORT_IMPORT,
  CATALOG_IMPORT_IMPORT_ERROR,
  CATALOG_IMPORT_NO_VALID_ROWS,
  CATALOG_IMPORT_ONLY_VALID_HINT,
  CATALOG_IMPORT_SELECT_FILE,
  CATALOG_IMPORT_TEMPLATE_ERROR,
  CATALOG_IMPORT_VALIDATE,
  CATALOG_IMPORT_VALIDATE_ERROR,
  catalogImportPreviewSummary,
  catalogImportResultSummary,
  catalogImportStructureValid,
  catalogImportTitle,
} from '../../../core/i18n/catalog-import-labels';
import {
  EXCEL_BULK_COL_ERRORS,
  EXCEL_BULK_COL_ROW,
  EXCEL_BULK_INVALID_ROWS,
  EXCEL_BULK_TOTAL_ROWS,
  EXCEL_BULK_VALID_ROWS,
} from '../../../core/i18n/excel-bulk-labels';
import {
  ShModalActionsDirective,
  ShModalFormComponent,
} from '../../../shared/components/modal-form/sh-modal-form.component';

export interface CatalogCsvImportDialogData {
  catalogKey: string;
  catalogLabel: string;
}

@Component({
  selector: 'sh-catalog-csv-import-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    ShModalFormComponent,
    ShModalActionsDirective,
  ],
  templateUrl: './catalog-csv-import-dialog.component.html',
  styleUrls: [
    './catalog-csv-import-dialog.component.scss',
    '../../positions/list/excel-bulk-upload-dialog/excel-bulk-upload-dialog.component.scss',
  ],
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
  readonly downloadPreviewErrorsLabel = CATALOG_IMPORT_DOWNLOAD_PREVIEW_ERRORS;
  readonly closeLabel = CATALOG_IMPORT_CLOSE;
  readonly validateLabel = CATALOG_IMPORT_VALIDATE;
  readonly importLabel = CATALOG_IMPORT_IMPORT;
  readonly onlyValidHint = CATALOG_IMPORT_ONLY_VALID_HINT;
  readonly noValidRowsLabel = CATALOG_IMPORT_NO_VALID_ROWS;
  readonly structureValidMessage = catalogImportStructureValid;
  readonly previewSummary = catalogImportPreviewSummary;
  readonly labels = {
    totalRows: EXCEL_BULK_TOTAL_ROWS,
    validRows: EXCEL_BULK_VALID_ROWS,
    invalidRows: EXCEL_BULK_INVALID_ROWS,
    colRow: EXCEL_BULK_COL_ROW,
    colId: CATALOG_IMPORT_COL_ID,
    colCode: CATALOG_IMPORT_COL_CODE,
    colName: CATALOG_IMPORT_COL_NAME,
    colCountry: CATALOG_IMPORT_COL_COUNTRY,
    colErrors: EXCEL_BULK_COL_ERRORS,
  };

  resultSummary(created: number, updated: number, failed: number): string {
    return catalogImportResultSummary(this.data.catalogKey, created, updated, failed);
  }

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

  get showPreview(): boolean {
    return this.isValidated && !this.isImportDone && this.validation != null;
  }

  get validCount(): number {
    return this.validation?.validCount ?? this.validation?.validRows?.length ?? 0;
  }

  get invalidCount(): number {
    return this.validation?.invalidCount ?? this.validation?.invalidRows?.length ?? 0;
  }

  get canConfirmImport(): boolean {
    return this.showImportAction && this.validCount > 0;
  }

  /** Preview table columns: prefer API expectedColumns, fall back to id/code/name/countryId. */
  get previewColumns(): string[] {
    const fromApi = this.validation?.expectedColumns?.filter(
      (c) => c && c.toLowerCase() !== 'rownumber',
    );
    if (fromApi && fromApi.length > 0) {
      return fromApi.slice(0, 6);
    }
    return ['id', 'code', 'name', 'countryId'];
  }

  columnLabel(col: string): string {
    switch (col.toLowerCase()) {
      case 'id':
        return this.labels.colId;
      case 'code':
        return this.labels.colCode;
      case 'name':
        return this.labels.colName;
      case 'countryid':
        return this.labels.colCountry;
      default:
        return col;
    }
  }

  cell(row: Record<string, string>, key: string): string {
    return row[key] ?? row[key.toLowerCase()] ?? '';
  }

  rowNumber(row: Record<string, string>): string {
    return this.cell(row, 'rowNumber') || '—';
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
    if (!this.validation?.structureValid) {
      return;
    }
    const validRows = this.validation.validRows ?? [];
    if (validRows.length === 0) {
      this.errorMessage = CATALOG_IMPORT_NO_VALID_ROWS;
      return;
    }
    this.importing = true;
    this.errorMessage = '';
    this.catalogImportExport.importRows(this.data.catalogKey, validRows).subscribe({
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

  downloadPreviewErrorReport(): void {
    if (!this.validation?.previewErrorReportCsvBase64) {
      return;
    }
    downloadBase64Csv(
      this.validation.previewErrorReportCsvBase64,
      `${this.data.catalogKey}-import-preview-errors.csv`,
    );
  }

  close(): void {
    this.dialogRef.close(!!this.importResult);
  }
}
