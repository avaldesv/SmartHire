import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogResponsibilityLevel,
  CreateResponsibilityLevelRequest,
  ResponsibilityLevelListResponse,
  UpdateResponsibilityLevelRequest,
} from '../../shared/models/catalog-responsibility-level.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogResponsibilityLevelService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(countryId: number, page = 0, size = 20): Observable<{ items: CatalogResponsibilityLevel[]; total: number }> {
    const body = { countryId, isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<ResponsibilityLevelListResponse>(this.api.apiUrl('/api/v1/responsibility-levels/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  create(request: CreateResponsibilityLevelRequest): Observable<CatalogResponsibilityLevel> {
    return this.http.post<CatalogResponsibilityLevel>(this.api.apiUrl('/api/v1/responsibility-levels'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateResponsibilityLevelRequest): Observable<CatalogResponsibilityLevel> {
    return this.http.put<CatalogResponsibilityLevel>(this.api.apiUrl(`/api/v1/responsibility-levels/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
}
