import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CreatePositionRequest,
  CreatePositionResponse,
  DuplicatePositionResponse,
  PositionDetail,
  PositionDashboardKpis,
  PositionListItem,
  PositionListResponse,
  UpdatePositionRequest,
  UpdatePositionResponse,
} from '../../shared/models/position.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class PositionService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(
    page = 0,
    size = 20,
    status?: string | null,
    search?: string,
    createdFrom?: string | null,
    createdTo?: string | null,
    countryId?: number | null,
    recruiter?: string | null,
  ): Observable<{ items: PositionListItem[]; total: number }> {
    const term = search?.trim();
    const recruiterTerm = recruiter?.trim();
    const body = {
      status: status ?? null,
      search: term || null,
      createdFrom: createdFrom || null,
      createdTo: createdTo || null,
      countryId: countryId ?? null,
      recruiter: recruiterTerm || null,
      filters: [],
      ordersBy: ['createAt:desc'] as string[],
    };
    return this.http
      .post<PositionListResponse>(this.api.apiUrl('/api/v1/positions/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(
        map((res) => ({
          items: (res.data ?? []).map((item) => ({
            ...item,
            recruiter: item.recruiter ?? '—',
            brand: item.brand ?? '—',
            country: item.country ?? '—',
            state: item.state ?? '—',
            requisitionType: item.requisitionType ?? '—',
            coverageType: item.coverageType ?? '—',
            createdAt: item.createdAt,
          })),
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  getDashboardKpis(): Observable<PositionDashboardKpis> {
    return this.http.get<PositionDashboardKpis>(this.api.apiUrl('/api/v1/positions/dashboard-kpis'), {
      headers: this.api.buildHeaders(),
    });
  }

  getById(id: number): Observable<PositionDetail> {
    return this.http.get<PositionDetail>(this.api.apiUrl(`/api/v1/positions/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

  create(request: CreatePositionRequest): Observable<CreatePositionResponse> {
    return this.http.post<CreatePositionResponse>(this.api.apiUrl('/api/v1/positions'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdatePositionRequest): Observable<UpdatePositionResponse> {
    return this.http.put<UpdatePositionResponse>(this.api.apiUrl(`/api/v1/positions/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }

  duplicate(id: number): Observable<DuplicatePositionResponse> {
    return this.http.post<DuplicatePositionResponse>(
      this.api.apiUrl(`/api/v1/positions/${id}/duplicate`),
      {},
      { headers: this.api.buildHeaders() },
    );
  }
}
