import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogClient,
  ClientListResponse,
  CreateClientRequest,
  UpdateClientRequest,
} from '../../shared/models/catalog-client.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogClientService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(
    page = 0,
    size = 20,
    ordersBy: string[] = ['tradeName:asc'],
    filters: string[] = [],
    countryId?: number | null,
    search?: string | null,
  ): Observable<{ items: CatalogClient[]; total: number }> {
    const body = {
      isActive: true,
      filters,
      ordersBy,
      countryId: countryId ?? null,
      search: search?.trim() || null,
    };
    return this.http
      .post<ClientListResponse>(this.api.apiUrl('/api/v1/clients/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  getById(id: number): Observable<CatalogClient> {
    return this.http.get<CatalogClient>(this.api.apiUrl(`/api/v1/clients/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

  /** Typeahead: name, email, code or trade name. */
  searchByCompanyArea(term: string, size = 20): Observable<CatalogClient[]> {
    return this.list(0, size, ['tradeName:asc'], [], null, term).pipe(map((res) => res.items));
  }

  create(request: CreateClientRequest): Observable<CatalogClient> {
    return this.http.post<CatalogClient>(this.api.apiUrl('/api/v1/clients'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateClientRequest): Observable<CatalogClient> {
    return this.http.put<CatalogClient>(this.api.apiUrl(`/api/v1/clients/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/clients/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

}
