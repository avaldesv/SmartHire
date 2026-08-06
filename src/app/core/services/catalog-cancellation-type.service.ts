import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CancellationTypeListResponse,
  CatalogCancellationType,
  CreateCancellationTypeRequest,
  UpdateCancellationTypeRequest,
} from '../../shared/models/catalog-cancellation-type.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogCancellationTypeService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(page = 0, size = 20): Observable<{ items: CatalogCancellationType[]; total: number }> {
    const body = { isActive: null, filters: [], ordersBy: ['sortOrder:asc'] as string[] };
    return this.http
      .post<CancellationTypeListResponse>(this.api.apiUrl('/api/v1/cancellation-types/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  create(request: CreateCancellationTypeRequest): Observable<CatalogCancellationType> {
    return this.http.post<CatalogCancellationType>(this.api.apiUrl('/api/v1/cancellation-types'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateCancellationTypeRequest): Observable<CatalogCancellationType> {
    return this.http.put<CatalogCancellationType>(this.api.apiUrl(`/api/v1/cancellation-types/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/cancellation-types/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }
}
