import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ViaBotAddToPreselectionRequest,
  ViaBotAddToPreselectionResponse,
  ViaBotChatRequest,
  ViaBotChatResponse,
  ViaBotConversationResponse,
  ViaBotResetResponse,
} from '../../shared/models/via-bot.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class ViaBotApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  getConversation(positionId: number): Observable<ViaBotConversationResponse> {
    return this.http.get<ViaBotConversationResponse>(
      this.api.apiUrl(`/api/v1/positions/${positionId}/via-bot/conversation`),
      { headers: this.api.buildHeaders() },
    );
  }

  chat(positionId: number, request: ViaBotChatRequest): Observable<ViaBotChatResponse> {
    return this.http.post<ViaBotChatResponse>(
      this.api.apiUrl(`/api/v1/positions/${positionId}/via-bot/chat`),
      request,
      { headers: this.api.buildHeaders() },
    );
  }

  reset(positionId: number): Observable<ViaBotResetResponse> {
    return this.http.post<ViaBotResetResponse>(
      this.api.apiUrl(`/api/v1/positions/${positionId}/via-bot/reset`),
      {},
      { headers: this.api.buildHeaders() },
    );
  }

  addToPreselection(
    positionId: number,
    request: ViaBotAddToPreselectionRequest,
  ): Observable<ViaBotAddToPreselectionResponse> {
    return this.http.post<ViaBotAddToPreselectionResponse>(
      this.api.apiUrl(`/api/v1/positions/${positionId}/via-bot/add-to-preselection`),
      request,
      { headers: this.api.buildHeaders() },
    );
  }
}
