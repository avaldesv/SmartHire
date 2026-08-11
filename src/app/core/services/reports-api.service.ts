import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ReportFilterRequest,
  ReportMatrixResponse,
  RequisitionsBySourceFilterRequest,
  RequisitionsBySourceResponse,
  RequisitionsInProcessFilterRequest,
  RequisitionsInProcessResponse,
  StatusByRequisitionFilterRequest,
  StatusByRequisitionResponse,
} from '../../shared/models/report.model';
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

  getStatusByRequisition(
    request: StatusByRequisitionFilterRequest,
  ): Observable<StatusByRequisitionResponse> {
    return this.http.post<StatusByRequisitionResponse>(
      this.api.apiUrl('/api/v1/reports/status-by-requisition'),
      request,
      { headers: this.api.buildHeaders() },
    );
  }

  getRequisitionsInProcess(
    request: RequisitionsInProcessFilterRequest,
    page = 0,
    size = 15,
  ): Observable<RequisitionsInProcessResponse> {
    return this.http.post<RequisitionsInProcessResponse>(
      this.api.apiUrl('/api/v1/reports/requisitions-in-process'),
      request,
      { headers: this.api.buildHeaders(page, size) },
    );
  }

  getRequisitionsBySource(
    request: RequisitionsBySourceFilterRequest,
  ): Observable<RequisitionsBySourceResponse> {
    return this.http.post<RequisitionsBySourceResponse>(
      this.api.apiUrl('/api/v1/reports/requisitions-by-source'),
      request,
      { headers: this.api.buildHeaders() },
    );
  }
}
