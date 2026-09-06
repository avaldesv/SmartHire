import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CancellationReasonListResponse,
  CatalogCancellationReason,
  CreateCancellationReasonRequest,
  UpdateCancellationReasonRequest,
} from '../../shared/models/catalog-cancellation-reason.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogCancellationReasonService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(
    page = 0,
    size = 20,
    cancellationTypeId: number | null = null,
    search?: string | null,
  ): Observable<{ items: CatalogCancellationReason[]; total: number }> {
    const body = {
      search: search?.trim() || null,
      cancellationTypeId,
      isActive: null,
      filters: [],
      ordersBy: ['sortOrder:asc'] as string[],
    };
    return this.http
      .post<CancellationReasonListResponse>(this.api.apiUrl('/api/v1/cancellation-reasons/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  create(request: CreateCancellationReasonRequest): Observable<CatalogCancellationReason> {
    return this.http.post<CatalogCancellationReason>(this.api.apiUrl('/api/v1/cancellation-reasons'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateCancellationReasonRequest): Observable<CatalogCancellationReason> {
    return this.http.put<CatalogCancellationReason>(this.api.apiUrl(`/api/v1/cancellation-reasons/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/cancellation-reasons/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }
}
