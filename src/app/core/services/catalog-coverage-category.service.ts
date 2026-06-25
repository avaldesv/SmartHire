import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogCoverageCategory,
  CreateCoverageCategoryRequest,
  CoverageCategoryListResponse,
  UpdateCoverageCategoryRequest,
} from '../../shared/models/catalog-coverage-category.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogCoverageCategoryService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(countryId: number, page = 0, size = 20): Observable<{ items: CatalogCoverageCategory[]; total: number }> {
    const body = { countryId, isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<CoverageCategoryListResponse>(this.api.apiUrl('/api/v1/coverage-categories/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  create(request: CreateCoverageCategoryRequest): Observable<CatalogCoverageCategory> {
    return this.http.post<CatalogCoverageCategory>(this.api.apiUrl('/api/v1/coverage-categories'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateCoverageCategoryRequest): Observable<CatalogCoverageCategory> {
    return this.http.put<CatalogCoverageCategory>(this.api.apiUrl(`/api/v1/coverage-categories/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/coverage-categories/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

}
