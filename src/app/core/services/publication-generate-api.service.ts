import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';

export type PublicationDocumentFormat = 'JPG' | 'PDF';

export interface GeneratePublicationRequest {
  format: PublicationDocumentFormat;
  contactEmail: string;
  contactPhone: string;
}

@Injectable({ providedIn: 'root' })
export class PublicationGenerateApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  generate(positionId: number, request: GeneratePublicationRequest): Observable<Blob> {
    return this.http.post(
      this.api.apiUrl(`/api/v1/positions/${positionId}/publications/generate`),
      request,
      {
        headers: this.api.buildHeaders(),
        responseType: 'blob',
      },
    );
  }
}
