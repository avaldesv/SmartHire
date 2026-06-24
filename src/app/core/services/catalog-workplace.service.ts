import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogWorkplace,
  CreateWorkplaceRequest,
  WorkplaceListResponse,
  UpdateWorkplaceRequest,
} from '../../shared/models/catalog-workplace.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogWorkplaceService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(countryId: number, page = 0, size = 20): Observable<{ items: CatalogWorkplace[]; total: number }> {
    const body = { countryId, isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<WorkplaceListResponse>(this.api.apiUrl('/api/v1/workplaces/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  create(request: CreateWorkplaceRequest): Observable<CatalogWorkplace> {
    return this.http.post<CatalogWorkplace>(this.api.apiUrl('/api/v1/workplaces'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateWorkplaceRequest): Observable<CatalogWorkplace> {
    return this.http.put<CatalogWorkplace>(this.api.apiUrl(`/api/v1/workplaces/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
}
