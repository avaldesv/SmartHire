import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogExperienceLevel,
  CreateExperienceLevelRequest,
  ExperienceLevelListResponse,
  UpdateExperienceLevelRequest,
} from '../../shared/models/catalog-experience-level.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogExperienceLevelService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(countryId: number, page = 0, size = 20): Observable<{ items: CatalogExperienceLevel[]; total: number }> {
    const body = { countryId, isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<ExperienceLevelListResponse>(this.api.apiUrl('/api/v1/experience-levels/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  create(request: CreateExperienceLevelRequest): Observable<CatalogExperienceLevel> {
    return this.http.post<CatalogExperienceLevel>(this.api.apiUrl('/api/v1/experience-levels'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateExperienceLevelRequest): Observable<CatalogExperienceLevel> {
    return this.http.put<CatalogExperienceLevel>(this.api.apiUrl(`/api/v1/experience-levels/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
}
