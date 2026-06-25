import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  BrandListResponse,
  CatalogBrand,
  CreateBrandRequest,
  UpdateBrandRequest,
} from '../../shared/models/catalog-brand.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogBrandService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(countryId: number, page = 0, size = 20): Observable<{ items: CatalogBrand[]; total: number }> {
    const body = { countryId, isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<BrandListResponse>(this.api.apiUrl('/api/v1/brands/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  create(request: CreateBrandRequest): Observable<CatalogBrand> {
    return this.http.post<CatalogBrand>(this.api.apiUrl('/api/v1/brands'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateBrandRequest): Observable<CatalogBrand> {
    return this.http.put<CatalogBrand>(this.api.apiUrl(`/api/v1/brands/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/brands/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

}
