import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CreateDocumentTemplateVariableRequest,
  DocumentTemplateVariableItem,
  DocumentTemplateVariableListResponse,
  UpdateDocumentTemplateVariableRequest,
} from '../../shared/models/document-template.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class DocumentTemplateVariableApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(page = 0, size = 10): Observable<{ items: DocumentTemplateVariableItem[]; total: number }> {
    const body = { code: null, isActive: null, filters: [], ordersBy: ['code:asc'] as string[] };
    return this.http
      .post<DocumentTemplateVariableListResponse>(
        this.api.apiUrl('/api/v1/document-template-variables/list'),
        body,
        { headers: this.api.buildHeaders(page, size) },
      )
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  create(request: CreateDocumentTemplateVariableRequest): Observable<DocumentTemplateVariableItem> {
    return this.http.post<DocumentTemplateVariableItem>(
      this.api.apiUrl('/api/v1/document-template-variables'),
      request,
      { headers: this.api.buildHeaders() },
    );
  }

  update(id: number, request: UpdateDocumentTemplateVariableRequest): Observable<DocumentTemplateVariableItem> {
    return this.http.put<DocumentTemplateVariableItem>(
      this.api.apiUrl(`/api/v1/document-template-variables/${id}`),
      request,
      { headers: this.api.buildHeaders() },
    );
  }
}
