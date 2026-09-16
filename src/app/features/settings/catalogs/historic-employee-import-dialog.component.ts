import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { firstValueFrom } from 'rxjs';
import {
  EXCEL_BULK_CANCEL,
  EXCEL_BULK_CLEAR,
  EXCEL_BULK_COL_EMAIL,
  EXCEL_BULK_COL_ERRORS,
  EXCEL_BULK_COL_NAME,
  EXCEL_BULK_COL_ROW,
  EXCEL_BULK_FILE_TOO_LARGE,
  EXCEL_BULK_INVALID_ROWS,
  EXCEL_BULK_PICK_FILE,
  EXCEL_BULK_PREVIEW_ERROR,
  EXCEL_BULK_TOTAL_ROWS,
  EXCEL_BULK_UNSUPPORTED_FORMAT,
  EXCEL_BULK_VALID_ROWS,
  EXCEL_BULK_VALIDATE,
} from '../../../core/i18n/excel-bulk-labels';
import {
  HISTORIC_REASSIGN_COL_JOB,
  HISTORIC_REASSIGN_COL_STATUS,
  HISTORIC_REASSIGN_CONFIRM_IMPORT,
  HISTORIC_REASSIGN_IMPORT_ERROR,
  HISTORIC_REASSIGN_IMPORT_HINT,
  HISTORIC_REASSIGN_IMPORT_TITLE,
  HISTORIC_REASSIGN_NO_VALID,
  HISTORIC_REASSIGN_ONLY_VALID_HINT,
  HISTORIC_REASSIGN_TEMPLATE,
  HISTORIC_REASSIGN_TEMPLATE_FILENAME,
} from '../../../core/i18n/historic-reassign-labels';
import { HistoricEmployeeApiService } from '../../../core/services/historic-employee-api.service';
import {
  HistoricEmployeeInvalidRow,
  HistoricEmployeePreviewResponse,
  HistoricEmployeeValidRow,
} from '../../../shared/models/historic-employee.model';
import {
  ShModalActionsDirective,
  ShModalFormComponent,
} from '../../../shared/components/modal-form/sh-modal-form.component';

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['xlsx', 'xls'];

@Component({
  selector: 'sh-historic-employee-import-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatTabsModule,
    ShModalFormComponent,
    ShModalActionsDirective,
  ],
  templateUrl: './historic-employee-import-dialog.component.html',
  styleUrl: '../../positions/list/excel-bulk-upload-dialog/excel-bulk-upload-dialog.component.scss',
})
export class HistoricEmployeeImportDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<HistoricEmployeeImportDialogComponent, boolean | undefined>);
  private readonly api = inject(HistoricEmployeeApiService);

  @ViewChild('fileInput') private fileInput?: ElementRef<HTMLInputElement>;

  readonly labels = {
    title: HISTORIC_REASSIGN_IMPORT_TITLE,
    hint: HISTORIC_REASSIGN_IMPORT_HINT,
    template: HISTORIC_REASSIGN_TEMPLATE,
    templateFilename: HISTORIC_REASSIGN_TEMPLATE_FILENAME,
    pickFile: EXCEL_BULK_PICK_FILE,
    clear: EXCEL_BULK_CLEAR,
    validate: EXCEL_BULK_VALIDATE,
    confirm: HISTORIC_REASSIGN_CONFIRM_IMPORT,
    cancel: EXCEL_BULK_CANCEL,
    validRows: EXCEL_BULK_VALID_ROWS,
    invalidRows: EXCEL_BULK_INVALID_ROWS,
    totalRows: EXCEL_BULK_TOTAL_ROWS,
    onlyValidHint: HISTORIC_REASSIGN_ONLY_VALID_HINT,
    colRow: EXCEL_BULK_COL_ROW,
    colName: EXCEL_BULK_COL_NAME,
    colEmail: EXCEL_BULK_COL_EMAIL,
    colJob: HISTORIC_REASSIGN_COL_JOB,
    colStatus: HISTORIC_REASSIGN_COL_STATUS,
    colErrors: EXCEL_BULK_COL_ERRORS,
  };

  readonly templateUrl = '/templates/Plantilla_Historico_Reasignacion.xlsx';
  readonly fileName = signal<string | null>(null);
  readonly preview = signal<HistoricEmployeePreviewResponse | null>(null);
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
      const res = await firstValueFrom(this.api.preview(this.file));
      this.preview.set(res);
      if (res.validCount === 0) {
        this.error.set(HISTORIC_REASSIGN_NO_VALID);
      }
    } catch (err) {
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
      await firstValueFrom(this.api.importRows(preview.validRows));
      this.dialogRef.close(true);
    } catch (err) {
      this.error.set(this.serverMessage(err) ?? HISTORIC_REASSIGN_IMPORT_ERROR);
      this.busy.set(false);
    }
  }

  displayName(row: HistoricEmployeeValidRow | HistoricEmployeeInvalidRow): string {
    return [row.firstName, row.paternalLastName].filter((part) => !!part?.trim()).join(' ');
  }

  private serverMessage(err: unknown): string | null {
    const body = (err as { error?: { userMessage?: string; title?: string } })?.error;
    return body?.userMessage || body?.title || null;
  }
}
