import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportFilterRequest, ReportMatrixResponse } from '../../shared/models/report.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class ReportsApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  getMmr(request: ReportFilterRequest): Observable<ReportMatrixResponse> {
    return this.http.post<ReportMatrixResponse>(this.api.apiUrl('/api/v1/reports/mmr'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  getRequisitionsByMonth(request: ReportFilterRequest): Observable<ReportMatrixResponse> {
    return this.http.post<ReportMatrixResponse>(
      this.api.apiUrl('/api/v1/reports/requisitions-by-month'),
      request,
      { headers: this.api.buildHeaders() },
    );
  }
}
