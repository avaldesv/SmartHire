import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CreateNotificationTemplateRequest,
  ListNotificationCoverageRequest,
  ListNotificationLogsRequest,
  ListNotificationOutboxRequest,
  ListNotificationTemplatesRequest,
  NotificationActionItem,
  NotificationActionListResponse,
  NotificationCoverageResponse,
  NotificationLogItem,
  NotificationLogListResponse,
  NotificationOutboxItem,
  NotificationOutboxListResponse,
  NotificationTemplateItem,
  NotificationTemplateListResponse,
  PreviewNotificationTemplateRequest,
  PreviewNotificationTemplateResponse,
  RetryNotificationOutboxResponse,
  UpdateNotificationTemplateRequest,
} from '../../shared/models/notification-template.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class NotificationTemplateApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(
    page = 0,
    size = 25,
    request: ListNotificationTemplatesRequest = {},
  ): Observable<{ items: NotificationTemplateItem[]; total: number }> {
    const body = {
      action: request.action?.trim() || null,
      isActive: request.isActive ?? null,
      filters: request.filters ?? [],
      ordersBy: request.ordersBy ?? (['actionCode:asc'] as string[]),
    };
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

  listActions(page = 0, size = 200): Observable<NotificationActionItem[]> {
    const body = { isActive: true, filters: [], ordersBy: ['code:ASC'] as string[] };
    return this.http
      .post<NotificationActionListResponse>(this.api.apiUrl('/api/v1/notification-actions/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => res.data ?? []));
  }

  preview(request: PreviewNotificationTemplateRequest): Observable<PreviewNotificationTemplateResponse> {
    return this.http.post<PreviewNotificationTemplateResponse>(
      this.api.apiUrl('/api/v1/notification-templates/preview'),
      request,
      { headers: this.api.buildHeaders() },
    );
  }

  listLogs(
    request: ListNotificationLogsRequest = {},
    page = 0,
    size = 25,
  ): Observable<{ items: NotificationLogItem[]; total: number }> {
    return this.http
      .post<NotificationLogListResponse>(this.api.apiUrl('/api/v1/notification-logs/list'), request, {
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

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/notification-templates/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

  getCoverage(
    request: ListNotificationCoverageRequest = {},
    page = 0,
    size = 25,
  ): Observable<NotificationCoverageResponse> {
    const body = {
      module: request.module?.trim() || null,
      actionCode: request.actionCode?.trim() || null,
      hasActiveTemplate: request.hasActiveTemplate ?? null,
      ordersBy: request.ordersBy ?? ['actionCode:asc'],
    };
    return this.http.post<NotificationCoverageResponse>(
      this.api.apiUrl('/api/v1/notification-templates/coverage'),
      body,
      { headers: this.api.buildHeaders(page, size) },
    );
  }

  listFailedOutbox(
    page = 0,
    size = 25,
    actionCode?: string | null,
  ): Observable<{ items: NotificationOutboxItem[]; total: number }> {
    const body: ListNotificationOutboxRequest = {
      status: 'FAILED',
      actionCode: actionCode?.trim() || null,
    };
    return this.http
      .post<NotificationOutboxListResponse>(this.api.apiUrl('/api/v1/notification-outbox/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  retryOutbox(id: number): Observable<RetryNotificationOutboxResponse> {
    return this.http.post<RetryNotificationOutboxResponse>(
      this.api.apiUrl(`/api/v1/notification-outbox/${id}/retry`),
      {},
      { headers: this.api.buildHeaders() },
    );
  }
}
