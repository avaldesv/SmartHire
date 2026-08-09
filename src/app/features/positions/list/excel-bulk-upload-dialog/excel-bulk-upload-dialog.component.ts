import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { firstValueFrom } from 'rxjs';
import {
  EXCEL_BULK_CANCEL,
  EXCEL_BULK_CLEAR,
  EXCEL_BULK_COL_EMAIL,
  EXCEL_BULK_COL_ERRORS,
  EXCEL_BULK_COL_GENDER,
  EXCEL_BULK_COL_NAME,
  EXCEL_BULK_COL_PHONE,
  EXCEL_BULK_COL_ROW,
  EXCEL_BULK_CONFIRM,
  EXCEL_BULK_CONFIRM_ERROR,
  EXCEL_BULK_DIALOG_TITLE,
  EXCEL_BULK_FILE_TOO_LARGE,
  EXCEL_BULK_HINT,
  EXCEL_BULK_INVALID_ROWS,
  EXCEL_BULK_NO_VALID,
  EXCEL_BULK_NOTIFY_EMAIL,
  EXCEL_BULK_NOTIFY_WA,
  EXCEL_BULK_ONLY_VALID_HINT,
  EXCEL_BULK_PICK_FILE,
  EXCEL_BULK_PREVIEW_ERROR,
  EXCEL_BULK_TEMPLATE,
  EXCEL_BULK_TOTAL_ROWS,
  EXCEL_BULK_UNSUPPORTED_FORMAT,
  EXCEL_BULK_VALID_ROWS,
  EXCEL_BULK_VALIDATE,
} from '../../../../core/i18n/excel-bulk-labels';
import { catalogDialogConfig } from '../../../../core/dialog/catalog-dialog.constants';
import { ExcelBulkUploadApiService } from '../../../../core/services/excel-bulk-upload-api.service';
import {
  ExcelBulkCreateResponse,
  ExcelBulkPreviewResponse,
} from '../../../../shared/models/excel-bulk-upload.model';
import { ExcelBulkProgressDialogComponent } from '../excel-bulk-progress-dialog/excel-bulk-progress-dialog.component';

export interface ExcelBulkUploadDialogData {
  positionId: number;
  positionName?: string;
}

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['xlsx', 'xls'];

@Component({
  selector: 'sh-excel-bulk-upload-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressBarModule,
    MatTabsModule,
  ],
  templateUrl: './excel-bulk-upload-dialog.component.html',
  styleUrl: './excel-bulk-upload-dialog.component.scss',
})
export class ExcelBulkUploadDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<ExcelBulkUploadDialogComponent>);
  private readonly data = inject<ExcelBulkUploadDialogData>(MAT_DIALOG_DATA);
  private readonly api = inject(ExcelBulkUploadApiService);
  private readonly dialog = inject(MatDialog);

  @ViewChild('fileInput') private fileInput?: ElementRef<HTMLInputElement>;

  readonly labels = {
    title: EXCEL_BULK_DIALOG_TITLE,
    hint: EXCEL_BULK_HINT,
    template: EXCEL_BULK_TEMPLATE,
    pickFile: EXCEL_BULK_PICK_FILE,
    clear: EXCEL_BULK_CLEAR,
    email: EXCEL_BULK_NOTIFY_EMAIL,
    wa: EXCEL_BULK_NOTIFY_WA,
    validate: EXCEL_BULK_VALIDATE,
    confirm: EXCEL_BULK_CONFIRM,
    cancel: EXCEL_BULK_CANCEL,
    validRows: EXCEL_BULK_VALID_ROWS,
    invalidRows: EXCEL_BULK_INVALID_ROWS,
    totalRows: EXCEL_BULK_TOTAL_ROWS,
    onlyValidHint: EXCEL_BULK_ONLY_VALID_HINT,
    colRow: EXCEL_BULK_COL_ROW,
    colName: EXCEL_BULK_COL_NAME,
    colEmail: EXCEL_BULK_COL_EMAIL,
    colPhone: EXCEL_BULK_COL_PHONE,
    colGender: EXCEL_BULK_COL_GENDER,
    colErrors: EXCEL_BULK_COL_ERRORS,
  };

  readonly templateUrl = '/templates/Plantilla_Carga_Masiva.xlsx';
  readonly positionId = this.data.positionId;
  readonly positionName = this.data.positionName ?? '';

  notifyEmail = true;
  notifyWhatsapp = true;

  readonly fileName = signal<string | null>(null);
  readonly preview = signal<ExcelBulkPreviewResponse | null>(null);
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);

  private file: File | null = null;

  pickFile(): void {
    this.fileInput?.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const selected = input.files && input.files.length > 0 ? input.files[0] : null;
    input.value = '';
    this.clearFile();
    if (!selected) {
      return;
    }
    const extension = selected.name.split('.').pop()?.toLowerCase() ?? '';
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      this.error.set(EXCEL_BULK_UNSUPPORTED_FORMAT);
      return;
    }
    if (selected.size > MAX_FILE_BYTES) {
      this.error.set(EXCEL_BULK_FILE_TOO_LARGE);
      return;
    }
    this.file = selected;
    this.fileName.set(selected.name);
  }

  clearFile(): void {
    this.file = null;
    this.fileName.set(null);
    this.preview.set(null);
    this.error.set(null);
  }

  canValidate(): boolean {
    return !this.busy() && this.file != null && this.preview() == null;
  }

  canConfirm(): boolean {
    return !this.busy() && (this.preview()?.validCount ?? 0) > 0;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  async validateFile(): Promise<void> {
    if (!this.file) {
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    try {
      const res = await firstValueFrom(this.api.preview(this.positionId, this.file));
      console.info('[excel-bulk] preview OK', {
        positionId: this.positionId,
        fileName: res.fileName,
        totalRows: res.totalRows,
        valid: res.validCount,
        invalid: res.invalidCount,
      });
      this.preview.set(res);
      if (res.validCount === 0) {
        this.error.set(EXCEL_BULK_NO_VALID);
      }
    } catch (err) {
      console.error('[excel-bulk] preview error', { positionId: this.positionId, err });
      this.error.set(this.serverMessage(err) ?? EXCEL_BULK_PREVIEW_ERROR);
    } finally {
      this.busy.set(false);
    }
  }

  async confirmUpload(): Promise<void> {
    const preview = this.preview();
    if (!preview || preview.validCount === 0) {
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    try {
      const res: ExcelBulkCreateResponse = await firstValueFrom(
        this.api.confirm(this.positionId, {
          notifyEmail: this.notifyEmail,
          notifyWhatsapp: this.notifyWhatsapp,
          rows: preview.validRows,
        }),
      );
      console.info('[excel-bulk] job created', {
        positionId: this.positionId,
        jobId: res.jobId,
        totalCount: res.totalCount,
        notifyEmail: res.notifyEmail,
        notifyWhatsapp: res.notifyWhatsapp,
      });
      this.dialogRef.close({ started: true, jobId: res.jobId, positionId: this.positionId });
      this.dialog.open(ExcelBulkProgressDialogComponent, {
        ...catalogDialogConfig('720px'),
        data: { positionId: this.positionId, jobId: res.jobId },
      });
    } catch (err) {
      console.error('[excel-bulk] confirm error', { positionId: this.positionId, err });
      this.error.set(this.serverMessage(err) ?? EXCEL_BULK_CONFIRM_ERROR);
      this.busy.set(false);
    }
  }

  errorSummary(errors: { code: string | null; message: string | null }[] | null | undefined): string {
    if (!errors?.length) {
      return '';
    }
    return errors.map((e) => e.message || e.code).filter(Boolean).join(' · ');
  }

  displayName(row: {
    firstName: string | null;
    lastName: string | null;
    maternalLastName: string | null;
  }): string {
    return [row.firstName, row.lastName, row.maternalLastName].filter((p) => !!p?.trim()).join(' ');
  }

  displayPhone(row: { dialCode: string | null; phone: string | null }): string {
    return [row.dialCode, row.phone].filter((p) => !!p?.trim()).join(' ');
  }

  private serverMessage(err: unknown): string | null {
    const body = (err as { error?: { userMessage?: string; title?: string } })?.error;
    return body?.userMessage || body?.title || null;
  }
}
