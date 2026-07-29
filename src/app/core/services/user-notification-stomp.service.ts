import { Injectable, OnDestroy, inject } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import SockJS from 'sockjs-client';
import { environment } from '../../../environments/environment';
import { UserNotificationItem } from '../../shared/models/user-notification.model';

/**
 * STOMP client for /ws/notifications — subscribe /user/queue/notifications.
 */
@Injectable({ providedIn: 'root' })
export class UserNotificationStompService implements OnDestroy {
  private client: Client | null = null;
  private readonly messages$ = new Subject<UserNotificationItem>();

  readonly notifications$: Observable<UserNotificationItem> = this.messages$.asObservable();

  connect(accessToken: string): void {
    this.disconnect();
    if (!accessToken) {
      return;
    }

    const wsUrl = `${environment.apiBaseUrl}/ws/notifications`;
    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl) as WebSocket,
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe('/user/queue/notifications', (message: IMessage) => {
          try {
            const body = JSON.parse(message.body) as UserNotificationItem;
            this.messages$.next({
              ...body,
              read: body.readAt != null,
            });
          } catch {
            // ignore malformed push
          }
        });
      },
    });
    this.client = client;
    client.activate();
  }

  disconnect(): void {
    if (this.client) {
      void this.client.deactivate();
      this.client = null;
    }
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
