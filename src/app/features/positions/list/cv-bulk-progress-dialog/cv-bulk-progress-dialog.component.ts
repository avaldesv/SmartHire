import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Subscription, switchMap, timer } from 'rxjs';
import {
  CV_BULK_CLOSE,
  CV_BULK_PROGRESS_HINT,
  CV_BULK_PROGRESS_TITLE,
  CV_BULK_REPORT_FAILED,
  CV_BULK_REPORT_PENDING,
  CV_BULK_REPORT_SUCCESS,
  CV_BULK_STATUS_DONE,
  CV_BULK_STATUS_RUNNING,
} from '../../../core/i18n/cv-bulk-labels';
import { CvBulkUploadApiService } from '../../../core/services/cv-bulk-upload-api.service';
import { CvBulkUploadStatusResponse } from '../../../shared/models/cv-bulk-upload.model';

export interface CvBulkProgressDialogData {
  positionId: number;
  jobId: number;
}

@Component({
  selector: 'sh-cv-bulk-progress-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './cv-bulk-progress-dialog.component.html',
  styleUrl: './cv-bulk-progress-dialog.component.scss',
})
export class CvBulkProgressDialogComponent implements OnInit, OnDestroy {
  private readonly dialogRef = inject(MatDialogRef<CvBulkProgressDialogComponent>);
  private readonly data = inject<CvBulkProgressDialogData>(MAT_DIALOG_DATA);
  private readonly api = inject(CvBulkUploadApiService);

  readonly labels = {
    title: CV_BULK_PROGRESS_TITLE,
    hint: CV_BULK_PROGRESS_HINT,
    close: CV_BULK_CLOSE,
    success: CV_BULK_REPORT_SUCCESS,
    failed: CV_BULK_REPORT_FAILED,
    pending: CV_BULK_REPORT_PENDING,
    done: CV_BULK_STATUS_DONE,
    running: CV_BULK_STATUS_RUNNING,
  };

  readonly jobId = this.data.jobId;
  readonly positionId = this.data.positionId;
  readonly status = signal<CvBulkUploadStatusResponse | null>(null);
  readonly done = signal(false);

  private sub?: Subscription;

  ngOnInit(): void {
    this.sub = timer(0, 4000)
      .pipe(switchMap(() => this.api.getStatus(this.positionId, this.jobId)))
      .subscribe({
        next: (res) => {
          this.status.set(res);
          if (res.status === 'DONE' || res.status === 'ERROR') {
            this.done.set(true);
            this.sub?.unsubscribe();
          }
        },
        error: () => undefined,
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  close(): void {
    this.dialogRef.close();
  }
}
