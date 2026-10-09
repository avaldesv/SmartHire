import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';

export interface CompanyExamModalityItem {
  examModalityId: number;
  code: string | null;
  name: string | null;
  description: string | null;
  requiresExternalConfig: boolean | null;
  isEnabled: boolean | null;
  baseUrl: string | null;
  createProfileTokenConfigured: boolean;
  createLinkTokenConfigured: boolean;
  ownerId: string | null;
  model: string | null;
  showTranscription: boolean | null;
  instructionsTemplate: string | null;
}

export interface CompanyExamModalityListResponse {
  companyId: number;
  items: CompanyExamModalityItem[];
}

export interface UpsertCompanyExamModalityItemRequest {
  examModalityId: number;
  isEnabled?: boolean | null;
  baseUrl?: string | null;
  createProfileToken?: string | null;
  createLinkToken?: string | null;
  ownerId?: string | null;
  model?: string | null;
  showTranscription?: boolean | null;
  instructionsTemplate?: string | null;
}

export interface UpsertCompanyExamModalitiesRequest {
  items: UpsertCompanyExamModalityItemRequest[];
}

@Injectable({ providedIn: 'root' })
export class ExamModalityApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  getByCompany(companyId: number): Observable<CompanyExamModalityListResponse> {
    return this.http.get<CompanyExamModalityListResponse>(
      this.api.apiUrl(`/api/v1/companies/${companyId}/exam-modalities`),
      { headers: this.api.buildHeaders() },
    );
  }

  upsertByCompany(
    companyId: number,
    request: UpsertCompanyExamModalitiesRequest,
  ): Observable<CompanyExamModalityListResponse> {
    return this.http.put<CompanyExamModalityListResponse>(
      this.api.apiUrl(`/api/v1/companies/${companyId}/exam-modalities`),
      request,
      { headers: this.api.buildHeaders() },
    );
  }
}

export const EXAM_MODALITY_CODE_AI_INTERVIEW = 'AI_INTERVIEW';

export function examModalityShowsExternalConfig(item: {
  code?: string | null;
  requiresExternalConfig?: boolean | null;
}): boolean {
  const code = item.code?.trim();
  return code === EXAM_MODALITY_CODE_AI_INTERVIEW || item.requiresExternalConfig === true;
}
