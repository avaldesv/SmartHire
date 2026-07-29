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
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { UserNotificationApiService } from '../../services/user-notification-api.service';
import { UserNotificationStompService } from '../../services/user-notification-stomp.service';
import { UserNotificationItem } from '../../../shared/models/user-notification.model';

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
  private readonly api = inject(UserNotificationApiService);
  private readonly stomp = inject(UserNotificationStompService);
  private readonly snack = inject(MatSnackBar);

  readonly portal = 'RECRUITER' as const;
  readonly loading = signal(false);
  readonly unreadCount = signal(0);
  readonly items = signal<UserNotificationItem[]>([]);

  private pushSub?: Subscription;

  ngOnInit(): void {
    this.refreshUnread();
    const token = sessionStorage.getItem('sh_token') ?? '';
    this.stomp.connect(token);
    this.pushSub = this.stomp.notifications$.subscribe((n) => {
      if ((n.portal ?? '').toUpperCase() !== this.portal) {
        return;
      }
      this.items.update((list) => [n, ...list.filter((x) => x.id !== n.id)].slice(0, 20));
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

  onMenuOpened(): void {
    this.loadInbox();
  }

  markRead(item: UserNotificationItem, event: Event): void {
    event.stopPropagation();
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

  private refreshUnread(): void {
    this.api.unreadCount(this.portal).subscribe({
      next: (res) => this.unreadCount.set(res.unreadCount ?? 0),
      error: () => undefined,
    });
  }

  private loadInbox(): void {
    this.loading.set(true);
    this.api.list(this.portal, 0, 20).subscribe({
      next: (res) => {
        this.items.set(res.data ?? []);
        this.loading.set(false);
        this.refreshUnread();
      },
      error: () => this.loading.set(false),
    });
  }
}
