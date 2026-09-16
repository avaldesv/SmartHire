import { Injectable, OnDestroy, inject } from '@angular/core';
import { Client, IFrame, IMessage } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import SockJS from 'sockjs-client';
import { environment } from '../../../environments/environment';
import { UserNotificationItem } from '../../shared/models/user-notification.model';
import { AuthService } from './auth.service';

/**
 * STOMP client for /ws/notifications — subscribe /user/queue/notifications.
 * SockJS + remote API: prefer xhr/websocket transports (avoid iframe.html 404)
 * and pass JWT as access_token query (handshake interceptor).
 */
@Injectable({ providedIn: 'root' })
export class UserNotificationStompService implements OnDestroy {
  private readonly auth = inject(AuthService);
  private client: Client | null = null;
  private endingSession = false;
  private readonly messages$ = new Subject<UserNotificationItem>();

  readonly notifications$: Observable<UserNotificationItem> = this.messages$.asObservable();

  connect(accessToken?: string): void {
    this.disconnect();
    this.endingSession = false;
    const token = accessToken || this.auth.getAccessToken();
    if (!token) {
      return;
    }
    if (this.auth.isAccessTokenExpired()) {
      this.endSessionAfterFailedRefresh();
      return;
    }

    const client = new Client({
      webSocketFactory: () => this.createSockJs(),
      connectHeaders: {
        Authorization: `Bearer ${this.auth.getAccessToken() ?? token}`,
      },
      reconnectDelay: 5000,
      beforeConnect: () => {
        if (this.auth.isAccessTokenExpired()) {
          this.endSessionAfterFailedRefresh();
          throw new Error('Session expired');
        }
      },
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
      onStompError: (frame: IFrame) => {
        if (this.isAuthFailure(frame.headers['message'] ?? '', frame.body)) {
          this.endSessionAfterFailedRefresh();
        }
      },
      onWebSocketError: () => {
        if (this.auth.isAccessTokenExpired()) {
          this.endSessionAfterFailedRefresh();
        }
      },
      onWebSocketClose: () => {
        if (this.auth.isAccessTokenExpired()) {
          this.endSessionAfterFailedRefresh();
        }
      },
    });
    this.client = client;
    client.activate();
  }

  disconnect(): void {
    if (this.client) {
      this.client.reconnectDelay = 0;
      void this.client.deactivate();
      this.client = null;
    }
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  private createSockJs(): WebSocket {
    const current = this.auth.getAccessToken();
    if (!current || this.auth.isAccessTokenExpired()) {
      this.endSessionAfterFailedRefresh();
      throw new Error('Session expired');
    }
    const base = `${environment.apiBaseUrl}/ws/notifications`;
    const sep = base.includes('?') ? '&' : '?';
    const wsUrl = `${base}${sep}access_token=${encodeURIComponent(current)}`;
    return new SockJS(wsUrl, undefined, {
      transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
    }) as WebSocket;
  }

  private endSessionAfterFailedRefresh(): void {
    if (this.endingSession) {
      return;
    }
    this.endingSession = true;
    this.disconnect();
    this.auth.refreshSession().subscribe({
      next: () => {
        this.endingSession = false;
        const next = this.auth.getAccessToken();
        if (next && !this.auth.isAccessTokenExpired()) {
          this.connect(next);
          return;
        }
        this.auth.expireSessionAndRedirectToLogin();
      },
      error: () => this.auth.expireSessionAndRedirectToLogin(),
    });
  }

  private isAuthFailure(message: string, body: string): boolean {
    const text = `${message} ${body}`.toLowerCase();
    return (
      text.includes('401') ||
      text.includes('unauthorized') ||
      text.includes('expired')
    );
  }
}
