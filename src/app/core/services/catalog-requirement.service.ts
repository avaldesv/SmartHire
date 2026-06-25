import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogRequirement,
  CreateRequirementRequest,
  RequirementListResponse,
  UpdateRequirementRequest,
} from '../../shared/models/catalog-requirement.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogRequirementService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(countryId: number, page = 0, size = 20): Observable<{ items: CatalogRequirement[]; total: number }> {
    const body = { countryId, isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<RequirementListResponse>(this.api.apiUrl('/api/v1/requirements/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  create(request: CreateRequirementRequest): Observable<CatalogRequirement> {
    return this.http.post<CatalogRequirement>(this.api.apiUrl('/api/v1/requirements'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateRequirementRequest): Observable<CatalogRequirement> {
    return this.http.put<CatalogRequirement>(this.api.apiUrl(`/api/v1/requirements/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/requirements/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

}
