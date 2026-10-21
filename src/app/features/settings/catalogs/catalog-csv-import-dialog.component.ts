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
  CATALOG_IMPORT_GENDER_DOWNLOAD_ITEMS,
  CATALOG_IMPORT_GENDER_HINT,
  CATALOG_IMPORT_GENDER_IMPORTED_ROWS,
  CATALOG_IMPORT_GENDER_INVALID_ROWS,
  CATALOG_IMPORT_GENDER_NONE,
  CATALOG_IMPORT_GENDER_NOTICE_EMPTY,
  CATALOG_IMPORT_GENDER_NOTICE_HEADER_ONLY,
  CATALOG_IMPORT_GENDER_NOTICE_NO_FILE,
  CATALOG_IMPORT_GENDER_NOT_IMPORTED_ROWS,
  CATALOG_IMPORT_GENDER_PARTIAL,
  CATALOG_IMPORT_GENDER_SUMMARY_BY_ROWS,
  CATALOG_IMPORT_GENDER_SUMMARY_IMPORT,
  CATALOG_IMPORT_GENDER_SUMMARY_VALIDATION,
  CATALOG_IMPORT_GENDER_VALID_ROWS,
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
  localizeGenderCsvIssue,
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

  constructor() {
    if (this.data.catalogKey === 'genders') {
      this.dialogRef.updateSize('840px');
    }
  }
  private readonly catalogImportExport = inject(CatalogImportExportService);
  private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  selectedFile: File | null = null;
  busy = false;
  validation: CatalogCsvStructureValidationResponse | null = null;
  importResult: CatalogCsvImportResponse | null = null;
  errorMessage = '';
  noticeMessage = '';

  readonly importTitle = catalogImportTitle(this.data.catalogLabel);
  readonly hint = CATALOG_IMPORT_HINT;
  readonly genderHint = CATALOG_IMPORT_GENDER_HINT;
  readonly genderSummaryValidation = CATALOG_IMPORT_GENDER_SUMMARY_VALIDATION;
  readonly genderSummaryByRows = CATALOG_IMPORT_GENDER_SUMMARY_BY_ROWS;
  readonly pendingValue = CATALOG_IMPORT_STRUCTURE_PENDING_VALUE;
  readonly genderSummaryImport = CATALOG_IMPORT_GENDER_SUMMARY_IMPORT;
  readonly genderDownloadItems = CATALOG_IMPORT_GENDER_DOWNLOAD_ITEMS;
  readonly genderValidRows = CATALOG_IMPORT_GENDER_VALID_ROWS;
  readonly genderInvalidRows = CATALOG_IMPORT_GENDER_INVALID_ROWS;
  readonly genderImportedRows = CATALOG_IMPORT_GENDER_IMPORTED_ROWS;
  readonly genderNotImportedRows = CATALOG_IMPORT_GENDER_NOT_IMPORTED_ROWS;
  readonly genderPartial = CATALOG_IMPORT_GENDER_PARTIAL;
  readonly genderNoneImported = CATALOG_IMPORT_GENDER_NONE;
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

  get isGender(): boolean {
    return this.data.catalogKey === 'genders';
  }

  get importedCount(): number {
    if (!this.importResult) {
      return 0;
    }
    return this.importResult.created + this.importResult.updated;
  }

  get notImportedCount(): number {
    return this.importResult?.failed ?? 0;
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
    this.noticeMessage = '';
    if (!this.selectedFile) {
      if (this.isGender) {
        this.noticeMessage = CATALOG_IMPORT_GENDER_NOTICE_NO_FILE;
      }
      return;
    }
    if (this.isGender) {
      void this.prepareGenderFile(this.selectedFile);
      return;
    }
    this.runValidationOnly();
  }

  private async prepareGenderFile(file: File): Promise<void> {
    const shape = genderCsvFileShape(await file.text());
    if (this.selectedFile !== file) {
      return;
    }
    if (shape === 'empty') {
      this.noticeMessage = CATALOG_IMPORT_GENDER_NOTICE_EMPTY;
      return;
    }
    if (shape === 'header-only') {
      this.noticeMessage = CATALOG_IMPORT_GENDER_NOTICE_HEADER_ONLY;
      return;
    }
    this.runValidationOnly();
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
      if (this.isGender) {
        this.noticeMessage = CATALOG_IMPORT_GENDER_NOTICE_NO_FILE;
        return;
      }
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
        const record = body as { code?: string; errorCode?: string; message?: string; detail?: string };
        const code = record.code || record.errorCode;
        if (this.isGender && code) {
          const label = localizeGenderCsvIssue(code);
          if (label !== code) {
            this.validation = {
              structureValid: false,
              delimiter: ';',
              expectedColumns: [],
              actualColumns: [],
              totalRows: 0,
              structureErrors: [code],
              validCount: 0,
              invalidCount: 0,
            };
            return label;
          }
        }
        const msg = record.message ?? record.detail;
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

  downloadGenderCsv(base64: string | null | undefined, filename: string): void {
    if (!base64) {
      return;
    }
    downloadBase64Csv(base64, filename);
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

export function genderCsvFileShape(text: string): 'empty' | 'header-only' | 'data' {
  const content = text.replace(/^\uFEFF/, '');
  if (!content.trim()) {
    return 'empty';
  }
  const records = splitCsvRecords(content);
  if (records.length === 0 || records.every((cells) => cells.every((cell) => !cell.trim()))) {
    return 'empty';
  }
  if (records.length === 1) {
    return 'header-only';
  }
  return 'data';
}

function splitCsvRecords(content: string): string[][] {
  const records: string[][] = [];
  let cells: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === '"') {
      if (inQuotes && content[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ';' && !inQuotes) {
      cells.push(current);
      current = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && content[i + 1] === '\n') {
        i++;
      }
      cells.push(current);
      current = '';
      records.push(cells);
      cells = [];
    } else {
      current += char;
    }
  }
  if (current.length > 0 || cells.length > 0) {
    cells.push(current);
    records.push(cells);
  }
  return records;
}
