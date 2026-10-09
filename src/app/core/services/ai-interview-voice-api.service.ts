import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiPageResponse } from '../../shared/models/catalog-position.model';
import { ApiClientService } from './api-client.service';

export interface AiInterviewVoiceItem {
  id: number;
  code: string;
  name: string;
}

export type AiInterviewVoiceListResponse = ApiPageResponse<AiInterviewVoiceItem>;

@Injectable({ providedIn: 'root' })
export class AiInterviewVoiceApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(page = 0, size = 100): Observable<AiInterviewVoiceItem[]> {
    return this.http
      .post<AiInterviewVoiceListResponse>(
        this.api.apiUrl('/api/v1/ai-interview-voices/list'),
        { filters: [], ordersBy: [] },
        { headers: this.api.buildHeaders(page, size) },
      )
      .pipe(map((response) => response.data ?? []));
  }
}
