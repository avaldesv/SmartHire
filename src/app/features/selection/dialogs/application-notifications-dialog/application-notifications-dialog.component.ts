import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FeedbackDialogService } from '../../../../core/feedback/feedback-dialog.service';
import {
  APP_NOTIFICATIONS_CHANNEL_EMAIL,
  APP_NOTIFICATIONS_CHANNEL_INBOX,
  APP_NOTIFICATIONS_CHANNEL_WHATSAPP,
  APP_NOTIFICATIONS_DIALOG_CLOSE,
  APP_NOTIFICATIONS_DIALOG_TITLE,
  APP_NOTIFICATIONS_EMPTY,
  APP_NOTIFICATIONS_LOAD_ERROR,
  APP_NOTIFICATIONS_PAGINATION_NEXT,
  APP_NOTIFICATIONS_PAGINATION_PREV,
  APP_NOTIFICATIONS_STATUS_FAILED,
  APP_NOTIFICATIONS_STATUS_FALLBACK,
  APP_NOTIFICATIONS_STATUS_SENT,
  APP_NOTIFICATIONS_STATUS_SKIPPED,
} from '../../../../core/i18n/application-notifications-dialog-labels';
import { ApplicationNotificationApiService } from '../../../../core/services/application-notification-api.service';
import { ApplicationNotificationItem } from '../../../../shared/models/application-notification.model';

export interface ApplicationNotificationsDialogData {
  applicationId: number;
  candidateName: string;
}

interface ChannelMeta {
  label: string;
  icon: string;
  cssClass: string;
}

interface StatusMeta {
  label: string;
  cssClass: string;
}

@Component({
  selector: 'sh-application-notifications-dialog',
  standalone: true,
  imports: [
    DatePipe,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './application-notifications-dialog.component.html',
  styleUrl: './application-notifications-dialog.component.scss',
})
export class ApplicationNotificationsDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<ApplicationNotificationsDialogComponent>);
  readonly data = inject<ApplicationNotificationsDialogData>(MAT_DIALOG_DATA);
  private readonly notificationApi = inject(ApplicationNotificationApiService);
  private readonly feedback = inject(FeedbackDialogService);

  readonly title = APP_NOTIFICATIONS_DIALOG_TITLE;
  readonly closeLabel = APP_NOTIFICATIONS_DIALOG_CLOSE;
  readonly empty = APP_NOTIFICATIONS_EMPTY;
  readonly paginationPrevLabel = APP_NOTIFICATIONS_PAGINATION_PREV;
  readonly paginationNextLabel = APP_NOTIFICATIONS_PAGINATION_NEXT;

  loading = true;
  rows: ApplicationNotificationItem[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;

  ngOnInit(): void {
    this.load();
  }

  get paginationLabel(): string {
    if (this.total === 0) {
      return '0–0 de 0';
    }
    const start = this.pageIndex * this.pageSize + 1;
    const end = Math.min((this.pageIndex + 1) * this.pageSize, this.total);
    return `${start}–${end} de ${this.total}`;
  }

  get canGoPrev(): boolean {
    return this.pageIndex > 0;
  }

  get canGoNext(): boolean {
    return (this.pageIndex + 1) * this.pageSize < this.total;
  }

  channelMeta(channel: string): ChannelMeta {
    const normalized = (channel || '').trim().toUpperCase();
    switch (normalized) {
      case 'WHATSAPP':
        return {
          label: APP_NOTIFICATIONS_CHANNEL_WHATSAPP,
          icon: 'chat',
          cssClass: 'channel-pill--whatsapp',
        };
      case 'EMAIL':
        return {
          label: APP_NOTIFICATIONS_CHANNEL_EMAIL,
          icon: 'mail',
          cssClass: 'channel-pill--email',
        };
      case 'INBOX':
        return {
          label: APP_NOTIFICATIONS_CHANNEL_INBOX,
          icon: 'inbox',
          cssClass: 'channel-pill--inbox',
        };
      default:
        return {
          label: channel || '—',
          icon: 'notifications',
          cssClass: 'channel-pill--default',
        };
    }
  }

  statusMeta(status: string): StatusMeta {
    const normalized = (status || '').trim().toUpperCase();
    switch (normalized) {
      case 'SENT':
        return { label: APP_NOTIFICATIONS_STATUS_SENT, cssClass: 'status-pill--sent' };
      case 'FAILED':
        return { label: APP_NOTIFICATIONS_STATUS_FAILED, cssClass: 'status-pill--failed' };
      case 'FALLBACK':
        return { label: APP_NOTIFICATIONS_STATUS_FALLBACK, cssClass: 'status-pill--fallback' };
      case 'SKIPPED':
        return { label: APP_NOTIFICATIONS_STATUS_SKIPPED, cssClass: 'status-pill--skipped' };
      default:
        return { label: status || '—', cssClass: 'status-pill--default' };
    }
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

  goPrev(): void {
    if (!this.canGoPrev) {
      return;
    }
    this.pageIndex -= 1;
    this.load();
  }

  goNext(): void {
    if (!this.canGoNext) {
      return;
    }
    this.pageIndex += 1;
    this.load();
  }

  close(): void {
    this.dialogRef.close();
  }
}
