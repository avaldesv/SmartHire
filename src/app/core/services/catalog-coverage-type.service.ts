import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogCoverageType,
  CoverageTypeListResponse,
  CreateCoverageTypeRequest,
  UpdateCoverageTypeRequest,
} from '../../shared/models/catalog-coverage-type.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogCoverageTypeService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(countryId: number, page = 0, size = 20): Observable<{ items: CatalogCoverageType[]; total: number }> {
    const body = { countryId, isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<CoverageTypeListResponse>(this.api.apiUrl('/api/v1/coverage-types/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  create(request: CreateCoverageTypeRequest): Observable<CatalogCoverageType> {
    return this.http.post<CatalogCoverageType>(this.api.apiUrl('/api/v1/coverage-types'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateCoverageTypeRequest): Observable<CatalogCoverageType> {
    return this.http.put<CatalogCoverageType>(this.api.apiUrl(`/api/v1/coverage-types/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/coverage-types/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

}
