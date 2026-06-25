import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AddAiSearchToPreselectionRequest,
  AddAiSearchToPreselectionResponse,
  QueryAiSearchRequest,
  QueryAiSearchResponse,
} from '../../shared/models/ai-search.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class AiSearchApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  query(request: QueryAiSearchRequest): Observable<QueryAiSearchResponse> {
    return this.http.post<QueryAiSearchResponse>(this.api.apiUrl('/api/v1/ai-search/query'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  addToPreselection(request: AddAiSearchToPreselectionRequest): Observable<AddAiSearchToPreselectionResponse> {
    return this.http.post<AddAiSearchToPreselectionResponse>(
      this.api.apiUrl('/api/v1/ai-search/results/add-to-preselection'),
      request,
      { headers: this.api.buildHeaders() },
    );
  }
}
