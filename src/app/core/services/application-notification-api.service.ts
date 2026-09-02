import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  ApplicationNotificationItem,
  ApplicationNotificationListResponse,
} from '../../shared/models/application-notification.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class ApplicationNotificationApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(
    applicationId: number,
    page = 0,
    size = 20,
  ): Observable<{ items: ApplicationNotificationItem[]; total: number }> {
    return this.http
      .post<ApplicationNotificationListResponse>(
        this.api.apiUrl(`/api/v1/candidate-applications/${applicationId}/notifications/list`),
        { filters: [], ordersBy: [] },
        { headers: this.api.buildHeaders(page, size) },
      )
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }
}
