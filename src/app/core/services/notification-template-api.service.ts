import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CreateNotificationTemplateRequest,
  NotificationTemplateItem,
  NotificationTemplateListResponse,
  UpdateNotificationTemplateRequest,
} from '../../shared/models/notification-template.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class NotificationTemplateApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(page = 0, size = 50): Observable<{ items: NotificationTemplateItem[]; total: number }> {
    const body = { isActive: null, filters: [], ordersBy: ['action:asc'] as string[] };
    return this.http
      .post<NotificationTemplateListResponse>(this.api.apiUrl('/api/v1/notification-templates/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  update(id: number, request: UpdateNotificationTemplateRequest): Observable<NotificationTemplateItem> {
    return this.http.put<NotificationTemplateItem>(this.api.apiUrl(`/api/v1/notification-templates/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }

  create(request: CreateNotificationTemplateRequest): Observable<NotificationTemplateItem> {
    return this.http.post<NotificationTemplateItem>(this.api.apiUrl('/api/v1/notification-templates'), request, {
      headers: this.api.buildHeaders(),
    });
  }
}
