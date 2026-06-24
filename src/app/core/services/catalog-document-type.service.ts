import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogDocumentType,
  CreateDocumentTypeRequest,
  DocumentTypeListResponse,
  UpdateDocumentTypeRequest,
} from '../../shared/models/catalog-document-type.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogDocumentTypeService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(countryId: number, page = 0, size = 20): Observable<{ items: CatalogDocumentType[]; total: number }> {
    const body = { countryId, isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<DocumentTypeListResponse>(this.api.apiUrl('/api/v1/document-types/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  create(request: CreateDocumentTypeRequest): Observable<CatalogDocumentType> {
    return this.http.post<CatalogDocumentType>(this.api.apiUrl('/api/v1/document-types'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateDocumentTypeRequest): Observable<CatalogDocumentType> {
    return this.http.put<CatalogDocumentType>(this.api.apiUrl(`/api/v1/document-types/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/document-types/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

}
