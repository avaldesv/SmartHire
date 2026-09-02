import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { FeedbackDialogService } from '../../../../core/feedback/feedback-dialog.service';
import {
  APP_NOTIFICATIONS_COL_ACTION,
  APP_NOTIFICATIONS_COL_CHANNEL,
  APP_NOTIFICATIONS_COL_DATE,
  APP_NOTIFICATIONS_COL_PREVIEW,
  APP_NOTIFICATIONS_COL_RECIPIENT,
  APP_NOTIFICATIONS_COL_STATUS,
  APP_NOTIFICATIONS_DIALOG_CLOSE,
  APP_NOTIFICATIONS_DIALOG_TITLE,
  APP_NOTIFICATIONS_EMPTY,
  APP_NOTIFICATIONS_LOAD_ERROR,
} from '../../../../core/i18n/application-notifications-dialog-labels';
import { ApplicationNotificationApiService } from '../../../../core/services/application-notification-api.service';
import { ApplicationNotificationItem } from '../../../../shared/models/application-notification.model';

export interface ApplicationNotificationsDialogData {
  applicationId: number;
  candidateName: string;
}

@Component({
  selector: 'sh-application-notifications-dialog',
  standalone: true,
  imports: [
    DatePipe,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="sh-catalog-dialog-header" mat-dialog-title>
      <span class="sh-catalog-dialog-header__text">
        <mat-icon class="header-icon">notifications</mat-icon>
        {{ title }} — {{ data.candidateName }}
      </span>
    </div>

    <mat-dialog-content class="sh-catalog-dialog-body">
      <div class="sh-catalog-dialog-gap" aria-hidden="true"></div>
      @if (loading) {
        <div class="loading-wrap"><mat-spinner diameter="36" /></div>
      } @else {
        <div class="table-wrap">
          <table mat-table [dataSource]="rows" class="notifications-table">
            <ng-container matColumnDef="createdAt">
              <th mat-header-cell *matHeaderCellDef>{{ colDate }}</th>
              <td mat-cell *matCellDef="let row">{{ row.createAt | date: 'dd/MM/yyyy HH:mm' }}</td>
            </ng-container>
            <ng-container matColumnDef="actionCode">
              <th mat-header-cell *matHeaderCellDef>{{ colAction }}</th>
              <td mat-cell *matCellDef="let row">{{ row.actionCode }}</td>
            </ng-container>
            <ng-container matColumnDef="channel">
              <th mat-header-cell *matHeaderCellDef>{{ colChannel }}</th>
              <td mat-cell *matCellDef="let row">{{ row.channel }}</td>
            </ng-container>
            <ng-container matColumnDef="recipient">
              <th mat-header-cell *matHeaderCellDef>{{ colRecipient }}</th>
              <td mat-cell *matCellDef="let row">{{ row.recipient || '—' }}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>{{ colStatus }}</th>
              <td mat-cell *matCellDef="let row">{{ row.status }}</td>
            </ng-container>
            <ng-container matColumnDef="preview">
              <th mat-header-cell *matHeaderCellDef>{{ colPreview }}</th>
              <td mat-cell *matCellDef="let row" class="preview-cell">{{ row.renderedPreview || '—' }}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns"></tr>
          </table>
          @if (!rows.length) {
            <p class="empty-msg">{{ empty }}</p>
          }
          <mat-paginator
            [length]="total"
            [pageIndex]="pageIndex"
            [pageSize]="pageSize"
            [pageSizeOptions]="[5, 10, 20]"
            (page)="onPage($event)"
          />
        </div>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-stroked-button type="button" (click)="close()">{{ closeLabel }}</button>
    </mat-dialog-actions>
  `,
  styles: `
    .header-icon {
      vertical-align: middle;
      margin-right: 0.35rem;
    }
    .loading-wrap {
      display: flex;
      justify-content: center;
      padding: 2rem;
    }
    .table-wrap {
      overflow-x: auto;
    }
    .notifications-table {
      width: 100%;
    }
    .preview-cell {
      max-width: 280px;
      white-space: normal;
      font-size: 0.875rem;
    }
    .empty-msg {
      margin: 1rem 0;
      color: var(--sh-text-muted, #64748b);
    }
  `,
})
export class ApplicationNotificationsDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<ApplicationNotificationsDialogComponent>);
  readonly data = inject<ApplicationNotificationsDialogData>(MAT_DIALOG_DATA);
  private readonly notificationApi = inject(ApplicationNotificationApiService);
  private readonly feedback = inject(FeedbackDialogService);

  readonly title = APP_NOTIFICATIONS_DIALOG_TITLE;
  readonly closeLabel = APP_NOTIFICATIONS_DIALOG_CLOSE;
  readonly colDate = APP_NOTIFICATIONS_COL_DATE;
  readonly colAction = APP_NOTIFICATIONS_COL_ACTION;
  readonly colChannel = APP_NOTIFICATIONS_COL_CHANNEL;
  readonly colRecipient = APP_NOTIFICATIONS_COL_RECIPIENT;
  readonly colStatus = APP_NOTIFICATIONS_COL_STATUS;
  readonly colPreview = APP_NOTIFICATIONS_COL_PREVIEW;
  readonly empty = APP_NOTIFICATIONS_EMPTY;

  loading = true;
  rows: ApplicationNotificationItem[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;

  readonly columns = ['createdAt', 'actionCode', 'channel', 'recipient', 'status', 'preview'];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.notificationApi.list(this.data.applicationId, this.pageIndex, this.pageSize).subscribe({
      next: (res) => {
        this.rows = res.items;
        this.total = res.total;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.feedback.showApiError(err, { fallbackMessage: APP_NOTIFICATIONS_LOAD_ERROR });
      },
    });
  }

  onPage(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.load();
  }

  close(): void {
    this.dialogRef.close();
  }
}
