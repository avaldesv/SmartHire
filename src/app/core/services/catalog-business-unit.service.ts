import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogBusinessUnit,
  CreateBusinessUnitRequest,
  BusinessUnitListResponse,
  UpdateBusinessUnitRequest,
} from '../../shared/models/catalog-business-unit.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogBusinessUnitService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(countryId: number, page = 0, size = 20): Observable<{ items: CatalogBusinessUnit[]; total: number }> {
    const body = { countryId, isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<BusinessUnitListResponse>(this.api.apiUrl('/api/v1/business-units/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  create(request: CreateBusinessUnitRequest): Observable<CatalogBusinessUnit> {
    return this.http.post<CatalogBusinessUnit>(this.api.apiUrl('/api/v1/business-units'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateBusinessUnitRequest): Observable<CatalogBusinessUnit> {
    return this.http.put<CatalogBusinessUnit>(this.api.apiUrl(`/api/v1/business-units/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
}
