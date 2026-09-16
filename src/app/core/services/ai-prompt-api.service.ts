import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  AiPromptItem,
  AiPromptListResponse,
  CreateAiPromptRequest,
  UpdateAiPromptRequest,
} from '../../shared/models/ai-prompt.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class AiPromptApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(page = 0, size = 10): Observable<{ items: AiPromptItem[]; total: number }> {
    const body = { isActive: null, filters: [], ordersBy: ['clave:asc'] as string[] };
    return this.http
      .post<AiPromptListResponse>(this.api.apiUrl('/api/v1/ai-prompts/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  getById(id: number): Observable<AiPromptItem> {
    return this.http.get<AiPromptItem>(this.api.apiUrl(`/api/v1/ai-prompts/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

  create(request: CreateAiPromptRequest): Observable<AiPromptItem> {
    return this.http.post<AiPromptItem>(this.api.apiUrl('/api/v1/ai-prompts'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateAiPromptRequest): Observable<AiPromptItem> {
    return this.http.put<AiPromptItem>(this.api.apiUrl(`/api/v1/ai-prompts/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/ai-prompts/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }
}
