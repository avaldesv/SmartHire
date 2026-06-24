import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogMaritalStatus,
  CreateMaritalStatusRequest,
  MaritalStatusListResponse,
  UpdateMaritalStatusRequest,
} from '../../shared/models/catalog-marital-status.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogMaritalStatusService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(countryId: number, page = 0, size = 20): Observable<{ items: CatalogMaritalStatus[]; total: number }> {
    const body = { countryId, isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<MaritalStatusListResponse>(this.api.apiUrl('/api/v1/marital-statuses/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  create(request: CreateMaritalStatusRequest): Observable<CatalogMaritalStatus> {
    return this.http.post<CatalogMaritalStatus>(this.api.apiUrl('/api/v1/marital-statuses'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateMaritalStatusRequest): Observable<CatalogMaritalStatus> {
    return this.http.put<CatalogMaritalStatus>(this.api.apiUrl(`/api/v1/marital-statuses/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
}
