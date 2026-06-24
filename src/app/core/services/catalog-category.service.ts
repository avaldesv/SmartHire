import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogCategory,
  CreateCategoryRequest,
  CategoryListResponse,
  UpdateCategoryRequest,
} from '../../shared/models/catalog-category.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogCategoryService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(countryId: number, page = 0, size = 20): Observable<{ items: CatalogCategory[]; total: number }> {
    const body = { countryId, isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<CategoryListResponse>(this.api.apiUrl('/api/v1/categories/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  create(request: CreateCategoryRequest): Observable<CatalogCategory> {
    return this.http.post<CatalogCategory>(this.api.apiUrl('/api/v1/categories'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateCategoryRequest): Observable<CatalogCategory> {
    return this.http.put<CatalogCategory>(this.api.apiUrl(`/api/v1/categories/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
}
