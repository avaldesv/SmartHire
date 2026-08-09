import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
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
} from '../../../../core/i18n/cv-bulk-labels';
import { catalogDialogConfig } from '../../../../core/dialog/catalog-dialog.constants';
import { CvBulkUploadApiService } from '../../../../core/services/cv-bulk-upload-api.service';
import { packCvBulkFiles } from '../../../../core/utils/cv-bulk-packer';
import { CvBulkProgressDialogComponent } from '../cv-bulk-progress-dialog/cv-bulk-progress-dialog.component';
import { CvBulkUploadCreateResponse } from '../../../../shared/models/cv-bulk-upload.model';

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

  @ViewChild('filesInput') private filesInput?: ElementRef<HTMLInputElement>;
  @ViewChild('folderInput') private folderInput?: ElementRef<HTMLInputElement>;

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
  readonly positionName = this.data.positionName ?? '';

  notifyEmail = true;
  notifyWhatsapp = true;

  readonly selectedCount = signal(0);
  readonly invalidSummary = signal<string | null>(null);
  readonly uploading = signal(false);
  readonly uploadLabel = signal('');
  readonly error = signal<string | null>(null);

  private files: File[] = [];

  pickFiles(): void {
    this.filesInput?.nativeElement.click();
  }

  pickFolder(): void {
    this.folderInput?.nativeElement.click();
  }

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
      console.warn('[cv-bulk] start blocked: no valid files', {
        positionId: this.positionId,
        selected: this.files.length,
      });
      return;
    }
    console.info('[cv-bulk] upload start', {
      positionId: this.positionId,
      files: packed.valid.length,
      chunks: packed.chunks.length,
      invalid: packed.invalid.length,
      notifyEmail: this.notifyEmail,
      notifyWhatsapp: this.notifyWhatsapp,
      fileNames: packed.valid.map((f) => f.name),
    });
    this.uploading.set(true);
    this.error.set(null);
    let jobId: number | null = null;
    try {
      for (let i = 0; i < packed.chunks.length; i++) {
        this.uploadLabel.set(`Subiendo lote ${i + 1} de ${packed.chunks.length}…`);
        const chunk = packed.chunks[i];
        console.info('[cv-bulk] chunk POST', {
          positionId: this.positionId,
          chunkIndex: i + 1,
          chunkTotal: packed.chunks.length,
          filesInChunk: chunk.length,
          jobId,
        });
        const t0 = performance.now();
        const res: CvBulkUploadCreateResponse = await firstValueFrom(
          this.api.uploadChunk(this.positionId, chunk, {
            jobId,
            notifyEmail: this.notifyEmail,
            notifyWhatsapp: this.notifyWhatsapp,
          }),
        );
        jobId = res.jobId;
        console.info('[cv-bulk] chunk OK', {
          jobId: res.jobId,
          status: res.status,
          accepted: res.acceptedCount,
          totalCount: res.totalCount,
          items: res.items?.map((i) => ({ itemId: i.itemId, fileName: i.fileName })),
          elapsedMs: Math.round(performance.now() - t0),
        });
      }
      console.info('[cv-bulk] upload complete → open progress', { positionId: this.positionId, jobId });
      this.dialogRef.close({ started: true, jobId, positionId: this.positionId });
      this.dialog.open(CvBulkProgressDialogComponent, {
        ...catalogDialogConfig('720px'),
        data: { positionId: this.positionId, jobId: jobId! },
      });
    } catch (err) {
      console.error('[cv-bulk] upload error', { positionId: this.positionId, jobId, err });
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
