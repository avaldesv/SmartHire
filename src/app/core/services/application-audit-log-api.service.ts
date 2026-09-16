import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  ApplicationAuditLogItem,
  ApplicationAuditLogListResponse,
  CreateApplicationAuditLogRequest,
  CreateApplicationAuditLogResponse,
} from '../../shared/models/application-audit-log.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class ApplicationAuditLogApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(
    applicationId: number,
    page = 0,
    size = 20,
  ): Observable<{ items: ApplicationAuditLogItem[]; total: number }> {
    return this.http
      .post<ApplicationAuditLogListResponse>(
        this.api.apiUrl(`/api/v1/candidate-applications/${applicationId}/audit-logs/list`),
        { filters: [], ordersBy: ['createAt:desc'] },
        { headers: this.api.buildHeaders(page, size) },
      )
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  create(
    applicationId: number,
    request: CreateApplicationAuditLogRequest,
  ): Observable<CreateApplicationAuditLogResponse> {
    return this.http.post<CreateApplicationAuditLogResponse>(
      this.api.apiUrl(`/api/v1/candidate-applications/${applicationId}/audit-logs`),
      request,
      { headers: this.api.buildHeaders() },
    );
  }
}
