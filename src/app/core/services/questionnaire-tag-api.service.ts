import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { QuestionnaireV2ListResponse, TagItem, TenantDataScope } from '../../shared/models/questionnaire-v2.model';
import { ApiClientService } from './api-client.service';

export interface TagListRequest {
  isActive?: boolean | null;
  filters?: string[];
  ordersBy?: string[];
}

export interface UpsertTagRequest {
  name: string;
  description?: string | null;
  isActive: boolean;
  scope?: TenantDataScope;
}

@Injectable({ providedIn: 'root' })
export class QuestionnaireTagApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(request: TagListRequest = {}, page = 0, size = 20): Observable<{ items: TagItem[]; total: number }> {
    const body = {
      isActive: request.isActive ?? null,
      filters: request.filters ?? [],
      ordersBy: request.ordersBy ?? ['name:asc'],
    };
    return this.http
      .post<QuestionnaireV2ListResponse<TagItem>>(this.api.apiUrl('/api/v1/questionnaire-tags/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  create(request: UpsertTagRequest): Observable<TagItem> {
    return this.http.post<TagItem>(this.api.apiUrl('/api/v1/questionnaire-tags'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: Omit<UpsertTagRequest, 'scope'>): Observable<TagItem> {
    return this.http.put<TagItem>(this.api.apiUrl(`/api/v1/questionnaire-tags/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/questionnaire-tags/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }
}
