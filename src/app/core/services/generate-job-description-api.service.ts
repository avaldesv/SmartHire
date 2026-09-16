import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';

export interface GenerateJobDescriptionRequest {
  pregunta: string;
  conversationThreadId?: string | null;
}

export interface GenerateJobDescriptionResponse {
  message: string;
  conversationThreadId: string;
}

@Injectable({ providedIn: 'root' })
export class GenerateJobDescriptionApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  generate(request: GenerateJobDescriptionRequest): Observable<GenerateJobDescriptionResponse> {
    return this.http.post<GenerateJobDescriptionResponse>(
      this.api.apiUrl('/api/v1/positions/generate-job-description'),
      {
        pregunta: request.pregunta,
        conversationThreadId: request.conversationThreadId ?? null,
      },
      { headers: this.api.buildHeaders() },
    );
  }
}
