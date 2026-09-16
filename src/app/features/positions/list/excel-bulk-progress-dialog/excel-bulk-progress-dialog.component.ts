import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Subscription, switchMap, timer } from 'rxjs';
import {
  EXCEL_BULK_CLOSE,
  EXCEL_BULK_PROGRESS_HINT,
  EXCEL_BULK_PROGRESS_TITLE,
  EXCEL_BULK_REPORT_FAILED,
  EXCEL_BULK_REPORT_PENDING,
  EXCEL_BULK_REPORT_SUCCESS,
  EXCEL_BULK_STATUS_DONE,
  EXCEL_BULK_STATUS_RUNNING,
  EXCEL_BULK_WA_NOT_SENT,
} from '../../../../core/i18n/excel-bulk-labels';
import { ExcelBulkUploadApiService } from '../../../../core/services/excel-bulk-upload-api.service';
import { ExcelBulkStatusResponse } from '../../../../shared/models/excel-bulk-upload.model';

export interface ExcelBulkProgressDialogData {
  positionId: number;
  jobId: number;
}

export interface ExcelBulkProgressDialogResult {
  positionId: number;
  successCount: number;
  failedCount: number;
  completed: boolean;
}

@Component({
  selector: 'sh-excel-bulk-progress-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './excel-bulk-progress-dialog.component.html',
  styleUrl: './excel-bulk-progress-dialog.component.scss',
})
export class ExcelBulkProgressDialogComponent implements OnInit, OnDestroy {
  private readonly dialogRef = inject(
    MatDialogRef<ExcelBulkProgressDialogComponent, ExcelBulkProgressDialogResult | undefined>,
  );
  private readonly data = inject<ExcelBulkProgressDialogData>(MAT_DIALOG_DATA);
  private readonly api = inject(ExcelBulkUploadApiService);

  readonly labels = {
    title: EXCEL_BULK_PROGRESS_TITLE,
    hint: EXCEL_BULK_PROGRESS_HINT,
    close: EXCEL_BULK_CLOSE,
    success: EXCEL_BULK_REPORT_SUCCESS,
    failed: EXCEL_BULK_REPORT_FAILED,
    pending: EXCEL_BULK_REPORT_PENDING,
    done: EXCEL_BULK_STATUS_DONE,
    running: EXCEL_BULK_STATUS_RUNNING,
    waNotSent: EXCEL_BULK_WA_NOT_SENT,
  };

  readonly jobId = this.data.jobId;
  readonly positionId = this.data.positionId;
  readonly status = signal<ExcelBulkStatusResponse | null>(null);
  readonly done = signal(false);

  private sub?: Subscription;

  ngOnInit(): void {
    console.info('[excel-bulk] progress poll start', {
      positionId: this.positionId,
      jobId: this.jobId,
      intervalMs: 4000,
    });
    this.sub = timer(0, 4000)
      .pipe(switchMap(() => this.api.getStatus(this.positionId, this.jobId)))
      .subscribe({
        next: (res) => {
          this.status.set(res);
          if (res.status === 'DONE' || res.status === 'ERROR') {
            console.info('[excel-bulk] progress finished', {
              jobId: res.jobId,
              status: res.status,
              success: res.successCount,
              failed: res.failedCount,
              total: res.totalCount,
            });
            this.done.set(true);
            this.sub?.unsubscribe();
          }
        },
        error: (err) => {
          console.error('[excel-bulk] progress poll error', {
            positionId: this.positionId,
            jobId: this.jobId,
            err,
          });
        },
      });
  }

  ngOnDestroy(): void {
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
