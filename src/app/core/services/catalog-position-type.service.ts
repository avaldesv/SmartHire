import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogPositionType,
  CreatePositionTypeRequest,
  PositionTypeListResponse,
  UpdatePositionTypeRequest,
} from '../../shared/models/catalog-position-type.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogPositionTypeService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(countryId: number, page = 0, size = 20): Observable<{ items: CatalogPositionType[]; total: number }> {
    const body = { countryId, isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<PositionTypeListResponse>(this.api.apiUrl('/api/v1/position-types/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  create(request: CreatePositionTypeRequest): Observable<CatalogPositionType> {
    return this.http.post<CatalogPositionType>(this.api.apiUrl('/api/v1/position-types'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdatePositionTypeRequest): Observable<CatalogPositionType> {
    return this.http.put<CatalogPositionType>(this.api.apiUrl(`/api/v1/position-types/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/position-types/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

}
