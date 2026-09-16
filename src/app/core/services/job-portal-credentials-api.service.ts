import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  JobPortalCredentialsResponse,
  UpdateJobPortalCredentialsRequest,
} from '../../shared/models/job-portal-credentials.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class JobPortalCredentialsApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  getMyCredentials(): Observable<JobPortalCredentialsResponse> {
    return this.http.get<JobPortalCredentialsResponse>(
      this.api.apiUrl('/api/v1/users/me/job-portal-credentials'),
      { headers: this.api.buildHeaders() },
    );
  }

  saveMyCredentials(body: UpdateJobPortalCredentialsRequest): Observable<JobPortalCredentialsResponse> {
    return this.http.put<JobPortalCredentialsResponse>(
      this.api.apiUrl('/api/v1/users/me/job-portal-credentials'),
      body,
      { headers: this.api.buildHeaders() },
    );
  }
}
