import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogCareer,
  CreateCareerRequest,
  CareerListResponse,
  UpdateCareerRequest,
} from '../../shared/models/catalog-career.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogCareerService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(countryId: number, page = 0, size = 20): Observable<{ items: CatalogCareer[]; total: number }> {
    const body = { countryId, isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<CareerListResponse>(this.api.apiUrl('/api/v1/careers/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  create(request: CreateCareerRequest): Observable<CatalogCareer> {
    return this.http.post<CatalogCareer>(this.api.apiUrl('/api/v1/careers'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateCareerRequest): Observable<CatalogCareer> {
    return this.http.put<CatalogCareer>(this.api.apiUrl(`/api/v1/careers/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/careers/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

}
