import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogPositionStatus,
  CreatePositionStatusRequest,
  PositionStatusListResponse,
  UpdatePositionStatusRequest,
} from '../../shared/models/catalog-position-status.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogPositionStatusService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(
    page = 0,
    size = 20,
    options?: { isActive?: boolean | null; type?: string | null; search?: string | null },
  ): Observable<{ items: CatalogPositionStatus[]; total: number }> {
    const body = {
      isActive: options?.isActive ?? null,
      type: options?.type ?? null,
      search: options?.search?.trim() || null,
      filters: [],
      ordersBy: ['sortOrder:asc'] as string[],
    };
    return this.http
      .post<PositionStatusListResponse>(this.api.apiUrl('/api/v1/position-statuses/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  create(request: CreatePositionStatusRequest): Observable<CatalogPositionStatus> {
    return this.http.post<CatalogPositionStatus>(this.api.apiUrl('/api/v1/position-statuses'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdatePositionStatusRequest): Observable<CatalogPositionStatus> {
    return this.http.put<CatalogPositionStatus>(this.api.apiUrl(`/api/v1/position-statuses/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/position-statuses/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }
}
