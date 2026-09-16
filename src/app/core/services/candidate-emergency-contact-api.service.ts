import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CandidateEmergencyContact,
  CandidateEmergencyContactListResponse,
  CandidateEmergencyContactPayload,
} from '../../shared/models/candidate-emergency-contact.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CandidateEmergencyContactApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(
    candidateId: number,
    page = 0,
    size = 20,
    isActive?: boolean | null,
  ): Observable<{ items: CandidateEmergencyContact[]; total: number }> {
    const body = {
      isActive: isActive ?? null,
      filters: [],
      ordersBy: ['createAt:desc'] as string[],
    };
    return this.http
      .post<CandidateEmergencyContactListResponse>(
        this.api.apiUrl(`/api/v1/candidates/${candidateId}/emergency-contacts/list`),
        body,
        { headers: this.api.buildHeaders(page, size) },
      )
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  getById(candidateId: number, contactId: number): Observable<CandidateEmergencyContact> {
    return this.http.get<CandidateEmergencyContact>(
      this.api.apiUrl(`/api/v1/candidates/${candidateId}/emergency-contacts/${contactId}`),
      { headers: this.api.buildHeaders() },
    );
  }

  create(candidateId: number, request: CandidateEmergencyContactPayload): Observable<CandidateEmergencyContact> {
    return this.http.post<CandidateEmergencyContact>(
      this.api.apiUrl(`/api/v1/candidates/${candidateId}/emergency-contacts`),
      request,
      { headers: this.api.buildHeaders() },
    );
  }

  update(
    candidateId: number,
    contactId: number,
    request: CandidateEmergencyContactPayload,
  ): Observable<CandidateEmergencyContact> {
    return this.http.put<CandidateEmergencyContact>(
      this.api.apiUrl(`/api/v1/candidates/${candidateId}/emergency-contacts/${contactId}`),
      request,
      { headers: this.api.buildHeaders() },
    );
  }
}
