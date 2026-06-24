import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogWorkSchedule,
  CreateWorkScheduleRequest,
  WorkScheduleListResponse,
  UpdateWorkScheduleRequest,
} from '../../shared/models/catalog-work-schedule.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogWorkScheduleService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(countryId: number, page = 0, size = 20): Observable<{ items: CatalogWorkSchedule[]; total: number }> {
    const body = { countryId, isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<WorkScheduleListResponse>(this.api.apiUrl('/api/v1/work-schedules/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  create(request: CreateWorkScheduleRequest): Observable<CatalogWorkSchedule> {
    return this.http.post<CatalogWorkSchedule>(this.api.apiUrl('/api/v1/work-schedules'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateWorkScheduleRequest): Observable<CatalogWorkSchedule> {
    return this.http.put<CatalogWorkSchedule>(this.api.apiUrl(`/api/v1/work-schedules/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/work-schedules/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

}
