import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogCompanyArea,
  CreateCompanyAreaRequest,
  CompanyAreaListResponse,
  UpdateCompanyAreaRequest,
} from '../../shared/models/catalog-company-area.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogCompanyAreaService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(catalogCompanyId: number, page = 0, size = 20): Observable<{ items: CatalogCompanyArea[]; total: number }> {
    const body = { catalogCompanyId, isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<CompanyAreaListResponse>(this.api.apiUrl('/api/v1/company-areas/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  create(request: CreateCompanyAreaRequest): Observable<CatalogCompanyArea> {
    return this.http.post<CatalogCompanyArea>(this.api.apiUrl('/api/v1/company-areas'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateCompanyAreaRequest): Observable<CatalogCompanyArea> {
    return this.http.put<CatalogCompanyArea>(this.api.apiUrl(`/api/v1/company-areas/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
}
