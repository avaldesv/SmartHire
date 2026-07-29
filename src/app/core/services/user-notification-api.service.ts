import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import {
  MarkReadResponse,
  UnreadCountResponse,
  UserNotificationListResponse,
  UserNotificationPortal,
} from '../../shared/models/user-notification.model';

@Injectable({ providedIn: 'root' })
export class UserNotificationApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(portal: UserNotificationPortal, page = 0, size = 20): Observable<UserNotificationListResponse> {
    return this.http.post<UserNotificationListResponse>(
      this.api.apiUrl('/api/v1/user-notifications/list'),
      { portal },
      { headers: this.api.buildHeaders(page, size) },
    );
  }

  unreadCount(portal: UserNotificationPortal): Observable<UnreadCountResponse> {
    return this.http.get<UnreadCountResponse>(
      this.api.apiUrl(`/api/v1/user-notifications/unread-count?portal=${portal}`),
      { headers: this.api.buildHeaders() },
    );
  }

  markRead(id: number): Observable<MarkReadResponse> {
    return this.http.put<MarkReadResponse>(
      this.api.apiUrl(`/api/v1/user-notifications/${id}/read`),
      {},
      { headers: this.api.buildHeaders() },
    );
  }
}
