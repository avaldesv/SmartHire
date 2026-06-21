import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogLanguage,
  CreateLanguageRequest,
  LanguageListResponse,
  UpdateLanguageRequest,
} from '../../shared/models/catalog-language.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogLanguageService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(page = 0, size = 20): Observable<{ items: CatalogLanguage[]; total: number }> {
    const body = { isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<LanguageListResponse>(this.api.apiUrl('/api/v1/languages/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  create(request: CreateLanguageRequest): Observable<CatalogLanguage> {
    return this.http.post<CatalogLanguage>(this.api.apiUrl('/api/v1/languages'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateLanguageRequest): Observable<CatalogLanguage> {
    return this.http.put<CatalogLanguage>(this.api.apiUrl(`/api/v1/languages/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
}
