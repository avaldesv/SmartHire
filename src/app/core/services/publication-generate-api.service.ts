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

export interface SharePublicationWhatsAppRequest {
  phone: string;
  contactEmail: string;
  contactPhone: string;
  descripcion?: string;
}

export interface SharePublicationWhatsAppResponse {
  success: boolean;
  channel: string;
  destination: string;
}

export interface SharePublicationEmailRequest {
  toEmail: string;
  format: PublicationDocumentFormat;
  contactEmail: string;
  contactPhone: string;
  subject?: string;
}

export interface SharePublicationEmailResponse {
  success: boolean;
  channel: string;
  destination: string;
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

  shareWhatsApp(
    positionId: number,
    request: SharePublicationWhatsAppRequest,
  ): Observable<SharePublicationWhatsAppResponse> {
    return this.http.post<SharePublicationWhatsAppResponse>(
      this.api.apiUrl(`/api/v1/positions/${positionId}/publications/share-whatsapp`),
      request,
      { headers: this.api.buildHeaders() },
    );
  }

  sendEmail(
    positionId: number,
    request: SharePublicationEmailRequest,
  ): Observable<SharePublicationEmailResponse> {
    return this.http.post<SharePublicationEmailResponse>(
      this.api.apiUrl(`/api/v1/positions/${positionId}/publications/send-email`),
      request,
      { headers: this.api.buildHeaders() },
    );
  }
}
