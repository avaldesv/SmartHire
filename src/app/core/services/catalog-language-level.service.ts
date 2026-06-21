import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogLanguageLevel,
  CreateLanguageLevelRequest,
  LanguageLevelListResponse,
  UpdateLanguageLevelRequest,
} from '../../shared/models/catalog-language-level.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogLanguageLevelService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(countryId: number, page = 0, size = 20): Observable<{ items: CatalogLanguageLevel[]; total: number }> {
    const body = { countryId, isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<LanguageLevelListResponse>(this.api.apiUrl('/api/v1/language-levels/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  create(request: CreateLanguageLevelRequest): Observable<CatalogLanguageLevel> {
    return this.http.post<CatalogLanguageLevel>(this.api.apiUrl('/api/v1/language-levels'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateLanguageLevelRequest): Observable<CatalogLanguageLevel> {
    return this.http.put<CatalogLanguageLevel>(this.api.apiUrl(`/api/v1/language-levels/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
}
