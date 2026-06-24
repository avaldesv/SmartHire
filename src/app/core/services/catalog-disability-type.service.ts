import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogDisabilityType,
  CreateDisabilityTypeRequest,
  DisabilityTypeListResponse,
  UpdateDisabilityTypeRequest,
} from '../../shared/models/catalog-disability-type.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogDisabilityTypeService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(countryId: number, page = 0, size = 20): Observable<{ items: CatalogDisabilityType[]; total: number }> {
    const body = { countryId, isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<DisabilityTypeListResponse>(this.api.apiUrl('/api/v1/disability-types/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  create(request: CreateDisabilityTypeRequest): Observable<CatalogDisabilityType> {
    return this.http.post<CatalogDisabilityType>(this.api.apiUrl('/api/v1/disability-types'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateDisabilityTypeRequest): Observable<CatalogDisabilityType> {
    return this.http.put<CatalogDisabilityType>(this.api.apiUrl(`/api/v1/disability-types/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
}
