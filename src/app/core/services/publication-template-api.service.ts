import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CreatePublicationTemplateRequest,
  PreviewPublicationTemplateRequest,
  PreviewPublicationTemplateResponse,
  PublicationTemplateItem,
  PublicationTemplateListResponse,
  UpdatePublicationTemplateRequest,
} from '../../shared/models/publication-template.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class PublicationTemplateApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(page = 0, size = 10): Observable<{ items: PublicationTemplateItem[]; total: number }> {
    const body = { isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<PublicationTemplateListResponse>(this.api.apiUrl('/api/v1/publication-templates/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  getById(id: number): Observable<PublicationTemplateItem> {
    return this.http.get<PublicationTemplateItem>(this.api.apiUrl(`/api/v1/publication-templates/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

  create(request: CreatePublicationTemplateRequest): Observable<PublicationTemplateItem> {
    return this.http.post<PublicationTemplateItem>(this.api.apiUrl('/api/v1/publication-templates'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdatePublicationTemplateRequest): Observable<PublicationTemplateItem> {
    return this.http.put<PublicationTemplateItem>(this.api.apiUrl(`/api/v1/publication-templates/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/publication-templates/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

  preview(request: PreviewPublicationTemplateRequest): Observable<PreviewPublicationTemplateResponse> {
    return this.http.post<PreviewPublicationTemplateResponse>(
      this.api.apiUrl('/api/v1/publication-templates/preview'),
      request,
      { headers: this.api.buildHeaders() },
    );
  }
}
