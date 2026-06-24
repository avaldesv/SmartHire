import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogTool,
  CreateToolRequest,
  ToolListResponse,
  UpdateToolRequest,
} from '../../shared/models/catalog-tool.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogToolService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(countryId: number, page = 0, size = 20): Observable<{ items: CatalogTool[]; total: number }> {
    const body = { countryId, isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<ToolListResponse>(this.api.apiUrl('/api/v1/tools/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  create(request: CreateToolRequest): Observable<CatalogTool> {
    return this.http.post<CatalogTool>(this.api.apiUrl('/api/v1/tools'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateToolRequest): Observable<CatalogTool> {
    return this.http.put<CatalogTool>(this.api.apiUrl(`/api/v1/tools/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/tools/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

}
