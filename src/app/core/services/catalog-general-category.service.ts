import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogGeneralCategory,
  CreateGeneralCategoryRequest,
  GeneralCategoryListResponse,
  UpdateGeneralCategoryRequest,
} from '../../shared/models/catalog-general-category.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogGeneralCategoryService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(countryId: number, page = 0, size = 20): Observable<{ items: CatalogGeneralCategory[]; total: number }> {
    const body = { countryId, isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<GeneralCategoryListResponse>(this.api.apiUrl('/api/v1/general-categories/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  create(request: CreateGeneralCategoryRequest): Observable<CatalogGeneralCategory> {
    return this.http.post<CatalogGeneralCategory>(this.api.apiUrl('/api/v1/general-categories'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateGeneralCategoryRequest): Observable<CatalogGeneralCategory> {
    return this.http.put<CatalogGeneralCategory>(this.api.apiUrl(`/api/v1/general-categories/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/general-categories/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }
}
