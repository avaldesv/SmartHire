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
} from '../../../../core/i18n/cv-bulk-labels';
import { CvBulkUploadApiService } from '../../../../core/services/cv-bulk-upload-api.service';
import { CvBulkUploadStatusResponse } from '../../../../shared/models/cv-bulk-upload.model';

export interface CvBulkProgressDialogData {
  positionId: number;
  jobId: number;
}

export interface CvBulkProgressDialogResult {
  positionId: number;
  successCount: number;
  failedCount: number;
  completed: boolean;
}

@Component({
  selector: 'sh-cv-bulk-progress-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './cv-bulk-progress-dialog.component.html',
  styleUrl: './cv-bulk-progress-dialog.component.scss',
})
export class CvBulkProgressDialogComponent implements OnInit, OnDestroy {
  private readonly dialogRef = inject(
    MatDialogRef<CvBulkProgressDialogComponent, CvBulkProgressDialogResult | undefined>,
  );
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
    console.info('[cv-bulk] progress poll start', {
      positionId: this.positionId,
      jobId: this.jobId,
      intervalMs: 4000,
    });
    this.sub = timer(0, 4000)
      .pipe(switchMap(() => this.api.getStatus(this.positionId, this.jobId)))
      .subscribe({
        next: (res) => {
          const prev = this.status();
          this.status.set(res);
          const changed =
            !prev ||
            prev.status !== res.status ||
            prev.successCount !== res.successCount ||
            prev.failedCount !== res.failedCount ||
            prev.pendingCount !== res.pendingCount ||
            prev.processingCount !== res.processingCount;
          if (changed) {
            console.info('[cv-bulk] progress status', {
              jobId: res.jobId,
              status: res.status,
              success: res.successCount,
              failed: res.failedCount,
              pending: res.pendingCount,
              processing: res.processingCount,
              total: res.totalCount,
            });
          }
          if (res.status === 'DONE' || res.status === 'ERROR') {
            console.info('[cv-bulk] progress finished', {
              jobId: res.jobId,
              status: res.status,
              successes: res.successes?.map((s) => ({
                file: s.fileName,
                outcome: s.outcome,
                label: s.reportLabel,
                email: s.email,
                candidateId: s.candidateId,
              })),
              failures: res.failures?.map((f) => ({
                file: f.fileName,
                code: f.errorCode,
                msg: f.errorMessage,
              })),
            });
            this.done.set(true);
            this.sub?.unsubscribe();
          }
        },
        error: (err) => {
          console.error('[cv-bulk] progress poll error', {
            positionId: this.positionId,
            jobId: this.jobId,
            err,
          });
        },
      });
  }

  ngOnDestroy(): void {
    console.info('[cv-bulk] progress dialog destroy', {
      positionId: this.positionId,
      jobId: this.jobId,
      done: this.done(),
    });
    this.sub?.unsubscribe();
  }

  close(): void {
    const status = this.status();
    this.dialogRef.close({
      positionId: this.positionId,
      successCount: status?.successCount ?? 0,
      failedCount: status?.failedCount ?? 0,
      completed: this.done(),
    });
  }
}
