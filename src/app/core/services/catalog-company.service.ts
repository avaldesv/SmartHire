import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogCompany,
  CompanyListResponse,
  CreateCompanyRequest,
  UpdateCompanyRequest,
} from '../../shared/models/catalog-company.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogCompanyService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(page = 0, size = 20): Observable<{ items: CatalogCompany[]; total: number }> {
    const body = { isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<CompanyListResponse>(this.api.apiUrl('/api/v1/companies/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  create(request: CreateCompanyRequest): Observable<CatalogCompany> {
    return this.http.post<CatalogCompany>(this.api.apiUrl('/api/v1/companies'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateCompanyRequest): Observable<CatalogCompany> {
    return this.http.put<CatalogCompany>(this.api.apiUrl(`/api/v1/companies/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
}
