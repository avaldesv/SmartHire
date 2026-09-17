import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
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
  CATALOG_IMPORT_DOWNLOAD_PREVIEW_ERRORS,
  CATALOG_IMPORT_DOWNLOAD_TEMPLATE,
  CATALOG_IMPORT_HINT,
  CATALOG_IMPORT_IMPORT,
  CATALOG_IMPORT_IMPORT_ERROR,
  CATALOG_IMPORT_NO_VALID_ROWS,
  CATALOG_IMPORT_ONLY_VALID_HINT,
  CATALOG_IMPORT_PICK_FILE,
  CATALOG_IMPORT_ROWS_DETECTED,
  CATALOG_IMPORT_SELECT_FILE,
  CATALOG_IMPORT_STRUCTURE_INVALID_VALUE,
  CATALOG_IMPORT_STRUCTURE_LABEL,
  CATALOG_IMPORT_STRUCTURE_PENDING_VALUE,
  CATALOG_IMPORT_STRUCTURE_VALID_VALUE,
  CATALOG_IMPORT_TEMPLATE_ERROR,
  CATALOG_IMPORT_VALIDATE_ERROR,
  catalogImportResultSummary,
  catalogImportTitle,
  localizeCatalogCsvStructureError,
  localizeCatalogCsvStructureErrors,
} from '../../../core/i18n/catalog-import-labels';
import {
  EXCEL_BULK_INVALID_ROWS,
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
    ShModalFormComponent,
    ShModalActionsDirective,
  ],
  templateUrl: './catalog-csv-import-dialog.component.html',
  styleUrls: ['./catalog-csv-import-dialog.component.scss'],
})
export class CatalogCsvImportDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CatalogCsvImportDialogComponent, boolean>);
  readonly data = inject<CatalogCsvImportDialogData>(MAT_DIALOG_DATA);
  private readonly catalogImportExport = inject(CatalogImportExportService);
  private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  selectedFile: File | null = null;
  busy = false;
  validation: CatalogCsvStructureValidationResponse | null = null;
  importResult: CatalogCsvImportResponse | null = null;
  errorMessage = '';

  readonly importTitle = catalogImportTitle(this.data.catalogLabel);
  readonly hint = CATALOG_IMPORT_HINT;
  readonly downloadTemplateLabel = CATALOG_IMPORT_DOWNLOAD_TEMPLATE;
  readonly pickFileLabel = CATALOG_IMPORT_PICK_FILE;
  readonly downloadErrorsLabel = CATALOG_IMPORT_DOWNLOAD_ERRORS;
  readonly downloadPreviewErrorsLabel = CATALOG_IMPORT_DOWNLOAD_PREVIEW_ERRORS;
  readonly closeLabel = CATALOG_IMPORT_CLOSE;
  readonly importLabel = CATALOG_IMPORT_IMPORT;
  readonly onlyValidHint = CATALOG_IMPORT_ONLY_VALID_HINT;
  readonly structureLabel = CATALOG_IMPORT_STRUCTURE_LABEL;
  readonly rowsDetectedLabel = CATALOG_IMPORT_ROWS_DETECTED;
  readonly labels = {
    validRows: EXCEL_BULK_VALID_ROWS,
    invalidRows: EXCEL_BULK_INVALID_ROWS,
  };

  resultSummary(created: number, updated: number, failed: number): string {
    return catalogImportResultSummary(this.data.catalogKey, created, updated, failed);
  }

  get isImportDone(): boolean {
    return this.importResult !== null;
  }

  get isBusy(): boolean {
    return this.busy;
  }

  get canConfirmImport(): boolean {
    return (
      !!this.selectedFile &&
      !this.isImportDone &&
      !this.busy &&
      this.validation?.structureValid === true &&
      this.validCount > 0
    );
  }

  get hasValidation(): boolean {
    return this.validation != null;
  }

  get totalRows(): number {
    return this.validation?.totalRows ?? 0;
  }

  get validCount(): number {
    return this.validation?.validCount ?? this.validation?.validRows?.length ?? 0;
  }

  get invalidCount(): number {
    return this.validation?.invalidCount ?? this.validation?.invalidRows?.length ?? 0;
  }

  get totalRowsDisplay(): string {
    return this.hasValidation ? String(this.totalRows) : CATALOG_IMPORT_STRUCTURE_PENDING_VALUE;
  }

  get validCountDisplay(): string {
    return this.hasValidation ? String(this.validCount) : CATALOG_IMPORT_STRUCTURE_PENDING_VALUE;
  }

  get invalidCountDisplay(): string {
    return this.hasValidation ? String(this.invalidCount) : CATALOG_IMPORT_STRUCTURE_PENDING_VALUE;
  }

  get structureIsValid(): boolean {
    return this.validation?.structureValid === true;
  }

  get structureIsInvalid(): boolean {
    return this.validation?.structureValid === false;
  }

  get structureStatusText(): string {
    if (this.structureIsValid) {
      return CATALOG_IMPORT_STRUCTURE_VALID_VALUE;
    }
    if (this.structureIsInvalid) {
      return CATALOG_IMPORT_STRUCTURE_INVALID_VALUE;
    }
    return CATALOG_IMPORT_STRUCTURE_PENDING_VALUE;
  }

  pickFile(): void {
    this.fileInput()?.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
    this.validation = null;
    this.importResult = null;
    this.errorMessage = '';
    if (this.selectedFile) {
      this.runValidationOnly();
    }
  }

  downloadTemplate(): void {
    this.catalogImportExport.downloadTemplate(this.data.catalogKey).subscribe({
      next: (blob) => downloadBlob(blob, `${this.data.catalogKey}-template.csv`),
      error: () => {
        this.errorMessage = CATALOG_IMPORT_TEMPLATE_ERROR;
      },
    });
  }

  /** Preview counts as soon as a file is chosen (no import yet). */
  private runValidationOnly(): void {
    if (!this.selectedFile) {
      return;
    }
    this.busy = true;
    this.errorMessage = '';
    this.catalogImportExport
      .validateImport(this.data.catalogKey, this.selectedFile)
      .pipe(finalize(() => (this.busy = false)))
      .subscribe({
        next: (response) => {
          this.validation = response;
          if (!response.structureValid) {
            this.errorMessage =
              localizeCatalogCsvStructureErrors(response.structureErrors) || CATALOG_IMPORT_VALIDATE_ERROR;
          }
        },
        error: (err: unknown) => {
          this.errorMessage = this.resolveHttpMessage(err, CATALOG_IMPORT_VALIDATE_ERROR);
        },
      });
  }

  importCsv(): void {
    if (!this.selectedFile) {
      this.errorMessage = CATALOG_IMPORT_SELECT_FILE;
      return;
    }
    if (this.busy || this.isImportDone) {
      return;
    }
    if (!this.validation?.structureValid) {
      this.errorMessage =
        localizeCatalogCsvStructureErrors(this.validation?.structureErrors ?? []) ||
        CATALOG_IMPORT_VALIDATE_ERROR;
      return;
    }
    const validRows = this.validation.validRows ?? [];
    if (validRows.length === 0) {
      this.errorMessage = CATALOG_IMPORT_NO_VALID_ROWS;
      return;
    }

    this.busy = true;
    this.errorMessage = '';
    this.catalogImportExport
      .importRows(this.data.catalogKey, validRows)
      .pipe(finalize(() => (this.busy = false)))
      .subscribe({
        next: (importResponse) => {
          this.importResult = importResponse;
        },
        error: (err: unknown) => {
          this.errorMessage = this.resolveHttpMessage(err, CATALOG_IMPORT_IMPORT_ERROR);
        },
      });
  }

  private resolveHttpMessage(err: unknown, fallback: string): string {
    if (err instanceof HttpErrorResponse) {
      const body = err.error;
      if (typeof body === 'string' && body.trim()) {
        return localizeCatalogCsvStructureError(body);
      }
      if (body && typeof body === 'object') {
        const msg = (body as { message?: string; detail?: string }).message
          ?? (body as { detail?: string }).detail;
        if (msg) {
          return localizeCatalogCsvStructureError(String(msg));
        }
      }
      if (err.status === 0) {
        return CATALOG_IMPORT_VALIDATE_ERROR;
      }
    }
    return fallback;
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
