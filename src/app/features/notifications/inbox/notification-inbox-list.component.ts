import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserNotificationApiService } from '../../../core/services/user-notification-api.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { CvBulkNotificationPayload } from '../../../shared/models/cv-bulk-upload.model';
import { UserNotificationItem } from '../../../shared/models/user-notification.model';
import { CvBulkProgressDialogComponent } from '../../positions/list/cv-bulk-progress-dialog/cv-bulk-progress-dialog.component';

@Component({
  selector: 'sh-notification-inbox-list',
  standalone: true,
  imports: [
    DatePipe,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    PageHeaderComponent,
  ],
  templateUrl: './notification-inbox-list.component.html',
  styleUrl: './notification-inbox-list.component.scss',
})
export class NotificationInboxListComponent implements OnInit {
  private readonly api = inject(UserNotificationApiService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  readonly portal = 'RECRUITER' as const;
  readonly pageTitle = $localize`:@@shell.notifications:Notificaciones`;
  readonly pageSubtitle = $localize`:@@inbox.subtitle:Historial de notificaciones del portal`;

  loading = true;
  data: UserNotificationItem[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 20;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.list(this.portal, this.pageIndex, this.pageSize).subscribe({
      next: (res) => {
        this.data = res.data ?? [];
        this.total = res.pagination?.total ?? this.data.length;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open(
          $localize`:@@inbox.loadError:No se pudieron cargar las notificaciones`,
          'Cerrar',
          { duration: 4000 },
        );
      },
    });
  }

  onPage(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.load();
  }

  onItemClick(item: UserNotificationItem): void {
    this.markRead(item);
    if ((item.type ?? '').toUpperCase() === 'CV_BULK_DONE') {
      const payload = this.parseBulkPayload(item.payloadJson);
      if (payload?.jobId && payload?.positionId) {
        this.dialog.open(CvBulkProgressDialogComponent, {
          width: '720px',
          data: { positionId: payload.positionId, jobId: payload.jobId },
        });
      }
    }
  }

  private markRead(item: UserNotificationItem): void {
    if (item.read) {
      return;
    }
    this.api.markRead(item.id).subscribe({
      next: () => {
        this.data = this.data.map((x) =>
          x.id === item.id ? { ...x, read: true, readAt: new Date().toISOString() } : x,
        );
      },
      error: () => undefined,
    });
  }

  private parseBulkPayload(payloadJson: string | null): CvBulkNotificationPayload | null {
    if (!payloadJson) {
      return null;
    }
    try {
      return JSON.parse(payloadJson) as CvBulkNotificationPayload;
    } catch {
      return null;
    }
  }
}
