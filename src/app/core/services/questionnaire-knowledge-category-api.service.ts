import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  KnowledgeCategoryItem,
  QuestionnaireV2ListResponse,
  TenantDataScope,
} from '../../shared/models/questionnaire-v2.model';
import { ApiClientService } from './api-client.service';

export interface KnowledgeCategoryListRequest {
  parentId?: number | null;
  isActive?: boolean | null;
  filters?: string[];
  ordersBy?: string[];
}

export interface UpsertKnowledgeCategoryRequest {
  parentId?: number | null;
  name: string;
  description?: string | null;
  isActive: boolean;
  scope?: TenantDataScope;
}

@Injectable({ providedIn: 'root' })
export class QuestionnaireKnowledgeCategoryApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(
    request: KnowledgeCategoryListRequest = {},
    page = 0,
    size = 20,
  ): Observable<{ items: KnowledgeCategoryItem[]; total: number }> {
    const body = {
      parentId: request.parentId ?? null,
      isActive: request.isActive ?? null,
      filters: request.filters ?? [],
      ordersBy: request.ordersBy ?? ['name:asc'],
    };
    return this.http
      .post<QuestionnaireV2ListResponse<KnowledgeCategoryItem>>(
        this.api.apiUrl('/api/v1/questionnaire-knowledge-categories/list'),
        body,
        { headers: this.api.buildHeaders(page, size) },
      )
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  create(request: UpsertKnowledgeCategoryRequest): Observable<KnowledgeCategoryItem> {
    return this.http.post<KnowledgeCategoryItem>(
      this.api.apiUrl('/api/v1/questionnaire-knowledge-categories'),
      request,
      { headers: this.api.buildHeaders() },
    );
  }

  update(id: number, request: Omit<UpsertKnowledgeCategoryRequest, 'scope'>): Observable<KnowledgeCategoryItem> {
    return this.http.put<KnowledgeCategoryItem>(
      this.api.apiUrl(`/api/v1/questionnaire-knowledge-categories/${id}`),
      request,
      { headers: this.api.buildHeaders() },
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/questionnaire-knowledge-categories/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }
}
