import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogFileExtension,
  CreateFileExtensionRequest,
  FileExtensionListResponse,
  UpdateFileExtensionRequest,
} from '../../shared/models/catalog-file-extension.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogFileExtensionService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(countryId: number | null, page = 0, size = 20): Observable<{ items: CatalogFileExtension[]; total: number }> {
    const body = { countryId, isActive: null, filters: [], ordersBy: ['code:asc'] as string[] };
    return this.http
      .post<FileExtensionListResponse>(this.api.apiUrl('/api/v1/file-extensions/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  create(request: CreateFileExtensionRequest): Observable<CatalogFileExtension> {
    return this.http.post<CatalogFileExtension>(this.api.apiUrl('/api/v1/file-extensions'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateFileExtensionRequest): Observable<CatalogFileExtension> {
    return this.http.put<CatalogFileExtension>(this.api.apiUrl(`/api/v1/file-extensions/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/file-extensions/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }
}
