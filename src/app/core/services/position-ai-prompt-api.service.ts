import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  PositionAiPromptConfig,
  UpsertPositionAiPromptConfigRequest,
} from '../../shared/models/ai-search.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class PositionAiPromptApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  get(positionId: number): Observable<PositionAiPromptConfig> {
    return this.http.get<PositionAiPromptConfig>(
      this.api.apiUrl(`/api/v1/positions/${positionId}/ai-prompts`),
      { headers: this.api.buildHeaders() },
    );
  }

  upsert(positionId: number, request: UpsertPositionAiPromptConfigRequest): Observable<PositionAiPromptConfig> {
    return this.http.put<PositionAiPromptConfig>(
      this.api.apiUrl(`/api/v1/positions/${positionId}/ai-prompts`),
      request,
      { headers: this.api.buildHeaders() },
    );
  }
}
