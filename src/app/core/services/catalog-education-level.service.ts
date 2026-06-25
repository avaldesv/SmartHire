import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogEducationLevel,
  CreateEducationLevelRequest,
  EducationLevelListResponse,
  UpdateEducationLevelRequest,
} from '../../shared/models/catalog-education-level.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogEducationLevelService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(countryId: number, page = 0, size = 20): Observable<{ items: CatalogEducationLevel[]; total: number }> {
    const body = { countryId, isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<EducationLevelListResponse>(this.api.apiUrl('/api/v1/education-levels/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  create(request: CreateEducationLevelRequest): Observable<CatalogEducationLevel> {
    return this.http.post<CatalogEducationLevel>(this.api.apiUrl('/api/v1/education-levels'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateEducationLevelRequest): Observable<CatalogEducationLevel> {
    return this.http.put<CatalogEducationLevel>(this.api.apiUrl(`/api/v1/education-levels/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/education-levels/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

}
