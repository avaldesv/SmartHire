import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogClientCompany,
  ClientCompanyListResponse,
  CreateClientCompanyRequest,
  UpdateClientCompanyRequest,
} from '../../shared/models/catalog-client-company.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogClientCompanyService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(countryId: number, page = 0, size = 20): Observable<{ items: CatalogClientCompany[]; total: number }> {
    const body = { countryId, isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<ClientCompanyListResponse>(this.api.apiUrl('/api/v1/client-companies/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  create(request: CreateClientCompanyRequest): Observable<CatalogClientCompany> {
    return this.http.post<CatalogClientCompany>(this.api.apiUrl('/api/v1/client-companies'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateClientCompanyRequest): Observable<CatalogClientCompany> {
    return this.http.put<CatalogClientCompany>(this.api.apiUrl(`/api/v1/client-companies/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
}
