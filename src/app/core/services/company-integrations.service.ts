import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CompanyIntegrations,
  UpsertCompanyIntegrationsRequest,
} from '../../shared/models/company-integrations.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CompanyIntegrationsService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  get(companyId: number): Observable<CompanyIntegrations> {
    return this.http.get<CompanyIntegrations>(
      this.api.apiUrl(`/api/v1/companies/${companyId}/integrations`),
      { headers: this.api.buildHeaders() },
    );
  }

  template(): Observable<CompanyIntegrations> {
    return this.http.get<CompanyIntegrations>(
      this.api.apiUrl('/api/v1/company-integrations/template'),
      { headers: this.api.buildHeaders() },
    );
  }

  upsert(companyId: number, request: UpsertCompanyIntegrationsRequest): Observable<CompanyIntegrations> {
    return this.http.put<CompanyIntegrations>(
      this.api.apiUrl(`/api/v1/companies/${companyId}/integrations`),
      request,
      { headers: this.api.buildHeaders() },
    );
  }
}
