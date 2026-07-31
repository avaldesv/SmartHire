import { DatePipe } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { UserNotificationApiService } from '../../services/user-notification-api.service';
import { UserNotificationStompService } from '../../services/user-notification-stomp.service';
import { UserNotificationItem } from '../../../shared/models/user-notification.model';
import { CvBulkNotificationPayload } from '../../../shared/models/cv-bulk-upload.model';
import { CvBulkProgressDialogComponent } from '../../../features/positions/list/cv-bulk-progress-dialog/cv-bulk-progress-dialog.component';

@Component({
  selector: 'sh-notification-bell',
  standalone: true,
  imports: [
    DatePipe,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './notification-bell.component.html',
  styleUrl: './notification-bell.component.scss',
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  private static readonly PREVIEW_SIZE = 5;
  private static readonly ALL_SIZE = 50;

  private readonly api = inject(UserNotificationApiService);
  private readonly stomp = inject(UserNotificationStompService);
  private readonly snack = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  readonly portal = 'RECRUITER' as const;
  readonly loading = signal(false);
  readonly unreadCount = signal(0);
  readonly items = signal<UserNotificationItem[]>([]);
  readonly expanded = signal(false);
  readonly totalElements = signal(0);

  private pushSub?: Subscription;

  ngOnInit(): void {
    this.refreshUnread();
    const token = sessionStorage.getItem('sh_token') ?? '';
    this.stomp.connect(token);
    this.pushSub = this.stomp.notifications$.subscribe((n) => {
      if ((n.portal ?? '').toUpperCase() !== this.portal) {
        return;
      }
      const cap = this.expanded()
        ? NotificationBellComponent.ALL_SIZE
        : NotificationBellComponent.PREVIEW_SIZE;
      this.items.update((list) => [n, ...list.filter((x) => x.id !== n.id)].slice(0, cap));
      this.totalElements.update((t) => t + 1);
      if (!n.read) {
        this.unreadCount.update((c) => c + 1);
      }
      this.snack.open(n.title || $localize`:@@shell.notifications:Notificaciones`, undefined, {
        duration: 4500,
      });
    });
  }

  ngOnDestroy(): void {
    this.pushSub?.unsubscribe();
    this.stomp.disconnect();
  }

  canShowAll(): boolean {
    return !this.expanded() && this.totalElements() > NotificationBellComponent.PREVIEW_SIZE;
  }

  onMenuOpened(): void {
    this.expanded.set(false);
    this.items.set([]);
    this.loadInbox(NotificationBellComponent.PREVIEW_SIZE);
  }

  onShowAll(event: Event): void {
    event.stopPropagation();
    this.expanded.set(true);
    this.items.set([]);
    this.loadInbox(NotificationBellComponent.ALL_SIZE);
  }

  onItemClick(item: UserNotificationItem, event: Event): void {
    event.stopPropagation();
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
        this.items.update((list) =>
          list.map((x) => (x.id === item.id ? { ...x, read: true, readAt: new Date().toISOString() } : x)),
        );
        this.unreadCount.update((c) => Math.max(0, c - 1));
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

  private refreshUnread(): void {
    this.api.unreadCount(this.portal).subscribe({
      next: (res) => this.unreadCount.set(res.unreadCount ?? 0),
      error: () => undefined,
    });
  }

  private loadInbox(size: number): void {
    this.loading.set(true);
    this.api.list(this.portal, 0, size).subscribe({
      next: (res) => {
        this.items.set(res.data ?? []);
        this.totalElements.set(res.pagination?.total ?? res.data?.length ?? 0);
        this.loading.set(false);
        this.refreshUnread();
      },
      error: () => this.loading.set(false),
    });
  }
}
