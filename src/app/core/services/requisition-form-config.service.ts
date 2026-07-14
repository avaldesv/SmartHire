import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CreateRequisitionFormConfigRequest,
  ListRequisitionFormConfigsRequest,
  RequisitionFormConfigDetail,
  RequisitionFormConfigListResponse,
  RequisitionFormConfigSummary,
  UpdateRequisitionFormConfigRequest,
} from '../../shared/models/requisition-form.model';
import { ResolvedRequisitionFormConfig } from '../../shared/models/requisition-wizard.model';
import { ApiClientService } from './api-client.service';

interface ResolveFormConfigApiResponse {
  configId: number;
  version: number;
  steps: ResolvedRequisitionFormConfig['steps'];
}

@Injectable({ providedIn: 'root' })
export class RequisitionFormConfigService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(
    page = 0,
    size = 20,
    request: ListRequisitionFormConfigsRequest = {},
  ): Observable<{ items: RequisitionFormConfigSummary[]; total: number }> {
    const body: ListRequisitionFormConfigsRequest = {
      filters: [],
      ordersBy: ['version:desc'],
      ...request,
    };
    return this.http
      .post<RequisitionFormConfigListResponse>(this.api.apiUrl('/api/v1/requisition-form/configs/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  getById(id: number): Observable<RequisitionFormConfigDetail> {
    return this.http.get<RequisitionFormConfigDetail>(this.api.apiUrl(`/api/v1/requisition-form/configs/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

  create(request: CreateRequisitionFormConfigRequest): Observable<RequisitionFormConfigDetail> {
    return this.http.post<RequisitionFormConfigDetail>(this.api.apiUrl('/api/v1/requisition-form/configs'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateRequisitionFormConfigRequest): Observable<RequisitionFormConfigDetail> {
    return this.http.put<RequisitionFormConfigDetail>(this.api.apiUrl(`/api/v1/requisition-form/configs/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }

  publish(id: number): Observable<RequisitionFormConfigDetail> {
    return this.http.post<RequisitionFormConfigDetail>(
      this.api.apiUrl(`/api/v1/requisition-form/configs/${id}/publish`),
      null,
      { headers: this.api.buildHeaders() },
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/requisition-form/configs/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

  resolve(countryId: number, coverageTypeId: number): Observable<ResolvedRequisitionFormConfig> {
    return this.http
      .get<ResolveFormConfigApiResponse>(
        this.api.apiUrl(`/api/v1/requisition-form/configs/resolve?countryId=${countryId}&coverageTypeId=${coverageTypeId}`),
        { headers: this.api.buildHeaders() },
      )
      .pipe(
        map((res) => ({
          configId: res.configId,
          version: res.version,
          steps: res.steps ?? [],
        })),
      );
  }
}
