import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { firstValueFrom } from 'rxjs';
import {
  CV_BULK_CANCEL,
  CV_BULK_CLEAR,
  CV_BULK_DIALOG_TITLE,
  CV_BULK_HINT,
  CV_BULK_NO_VALID,
  CV_BULK_NOTIFY_EMAIL,
  CV_BULK_NOTIFY_WA,
  CV_BULK_PICK_FILES,
  CV_BULK_PICK_FOLDER,
  CV_BULK_START,
  CV_BULK_UPLOAD_ERROR,
} from '../../../core/i18n/cv-bulk-labels';
import { CvBulkUploadApiService } from '../../../core/services/cv-bulk-upload-api.service';
import { packCvBulkFiles } from '../../../core/utils/cv-bulk-packer';
import { CvBulkProgressDialogComponent } from '../cv-bulk-progress-dialog/cv-bulk-progress-dialog.component';

export interface CvBulkUploadDialogData {
  positionId: number;
  positionName?: string;
}

@Component({
  selector: 'sh-cv-bulk-upload-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './cv-bulk-upload-dialog.component.html',
  styleUrl: './cv-bulk-upload-dialog.component.scss',
})
export class CvBulkUploadDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CvBulkUploadDialogComponent>);
  private readonly data = inject<CvBulkUploadDialogData>(MAT_DIALOG_DATA);
  private readonly api = inject(CvBulkUploadApiService);
  private readonly dialog = inject(MatDialog);

  readonly labels = {
    title: CV_BULK_DIALOG_TITLE,
    hint: CV_BULK_HINT,
    email: CV_BULK_NOTIFY_EMAIL,
    wa: CV_BULK_NOTIFY_WA,
    pickFiles: CV_BULK_PICK_FILES,
    pickFolder: CV_BULK_PICK_FOLDER,
    start: CV_BULK_START,
    cancel: CV_BULK_CANCEL,
    clear: CV_BULK_CLEAR,
  };

  readonly positionId = this.data.positionId;
  readonly positionName = this.data.positionName ?? `#${this.data.positionId}`;

  notifyEmail = true;
  notifyWhatsapp = true;

  readonly selectedCount = signal(0);
  readonly invalidSummary = signal<string | null>(null);
  readonly uploading = signal(false);
  readonly uploadLabel = signal('');
  readonly error = signal<string | null>(null);

  private files: File[] = [];

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const list = input.files ? Array.from(input.files) : [];
    this.applyFiles(list);
    input.value = '';
  }

  clearFiles(): void {
    this.files = [];
    this.selectedCount.set(0);
    this.invalidSummary.set(null);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  async startUpload(): Promise<void> {
    const packed = packCvBulkFiles(this.files);
    if (packed.chunks.length === 0) {
      this.error.set(CV_BULK_NO_VALID);
      return;
    }
    this.uploading.set(true);
    this.error.set(null);
    let jobId: number | null = null;
    try {
      for (let i = 0; i < packed.chunks.length; i++) {
        this.uploadLabel.set(`Subiendo lote ${i + 1} de ${packed.chunks.length}…`);
        const res = await firstValueFrom(
          this.api.uploadChunk(this.positionId, packed.chunks[i], {
            jobId,
            notifyEmail: this.notifyEmail,
            notifyWhatsapp: this.notifyWhatsapp,
          }),
        );
        jobId = res.jobId;
      }
      this.dialogRef.close({ started: true, jobId, positionId: this.positionId });
      this.dialog.open(CvBulkProgressDialogComponent, {
        width: '720px',
        data: { positionId: this.positionId, jobId: jobId! },
      });
    } catch {
      this.error.set(CV_BULK_UPLOAD_ERROR);
      this.uploading.set(false);
    }
  }

  private applyFiles(files: File[]): void {
    const packed = packCvBulkFiles(files);
    this.files = packed.valid;
    this.selectedCount.set(packed.valid.length);
    this.invalidSummary.set(
      packed.invalid.length > 0
        ? `${packed.invalid.length} archivo(s) omitidos (formato o tamaño >10MB)`
        : null,
    );
  }
}
