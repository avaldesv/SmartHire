import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CreatePositionRequest,
  CreatePositionResponse,
  DirectCancelPositionResponse,
  DuplicatePositionResponse,
  ExecutePositionCancellationResponse,
  PositionDetail,
  PositionDashboardKpis,
  PositionEventItem,
  PositionEventListResponse,
  PositionListItem,
  PositionListResponse,
  ReassignPositionRequest,
  ReassignPositionResponse,
  RejectPositionCancellationResponse,
  RequestPositionCancellationResponse,
  UpdatePositionRequest,
  UpdatePositionResponse,
} from '../../shared/models/position.model';
import { ApiClientService } from './api-client.service';

export interface PositionListFilters {
  status?: string | null;
  search?: string | null;
  createdFrom?: string | null;
  createdTo?: string | null;
  countryId?: number | null;
  recruiter?: string | null;
  client?: string | null;
  requisitionTypeId?: number | null;
  coverageTypeId?: number | null;
  brandId?: number | null;
  workplaceId?: number | null;
  shiftId?: number | null;
  contractTypeId?: number | null;
  educationLevelId?: number | null;
  responsibilityLevelId?: number | null;
  clientPosition?: string | null;
  createdByIds?: number[] | null;
  careResponsibleUserId?: number | null;
  careResponsibleAts?: string | null;
  stateId?: number | null;
  generalCategoryId?: number | null;
  questionnaireId?: number | null;
  /** CONTAINS by name when countryId is null / Todos */
  brandName?: string | null;
  workplaceName?: string | null;
  contractTypeName?: string | null;
  educationLevelName?: string | null;
  responsibilityLevelName?: string | null;
  coverageTypeName?: string | null;
  requisitionTypeName?: string | null;
  stateName?: string | null;
  generalCategoryName?: string | null;
  shiftName?: string | null;
}

@Injectable({ providedIn: 'root' })
export class PositionService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(
    page = 0,
    size = 20,
    statusOrFilters?: string | null | PositionListFilters,
    search?: string,
    createdFrom?: string | null,
    createdTo?: string | null,
    countryId?: number | null,
    recruiter?: string | null,
  ): Observable<{ items: PositionListItem[]; total: number }> {
    const filters: PositionListFilters =
      statusOrFilters && typeof statusOrFilters === 'object'
        ? statusOrFilters
        : {
            status: statusOrFilters as string | null | undefined,
            search,
            createdFrom,
            createdTo,
            countryId,
            recruiter,
          };

    const body = {
      status: filters.status ?? null,
      search: filters.search?.trim() || null,
      createdFrom: filters.createdFrom || null,
      createdTo: filters.createdTo || null,
      countryId: filters.countryId ?? null,
      recruiter: filters.recruiter?.trim() || null,
      client: filters.client?.trim() || null,
      requisitionTypeId: filters.requisitionTypeId ?? null,
      coverageTypeId: filters.coverageTypeId ?? null,
      brandId: filters.brandId ?? null,
      workplaceId: filters.workplaceId ?? null,
      shiftId: filters.shiftId ?? null,
      contractTypeId: filters.contractTypeId ?? null,
      educationLevelId: filters.educationLevelId ?? null,
      responsibilityLevelId: filters.responsibilityLevelId ?? null,
      clientPosition: filters.clientPosition?.trim() || null,
      createdByIds: filters.createdByIds?.length ? filters.createdByIds : [],
      careResponsibleUserId: filters.careResponsibleUserId ?? null,
      careResponsibleAts: filters.careResponsibleAts?.trim() || null,
      stateId: filters.stateId ?? null,
      generalCategoryId: filters.generalCategoryId ?? null,
      questionnaireId: filters.questionnaireId ?? null,
      brandName: filters.brandName?.trim() || null,
      workplaceName: filters.workplaceName?.trim() || null,
      contractTypeName: filters.contractTypeName?.trim() || null,
      educationLevelName: filters.educationLevelName?.trim() || null,
      responsibilityLevelName: filters.responsibilityLevelName?.trim() || null,
      coverageTypeName: filters.coverageTypeName?.trim() || null,
      requisitionTypeName: filters.requisitionTypeName?.trim() || null,
      stateName: filters.stateName?.trim() || null,
      generalCategoryName: filters.generalCategoryName?.trim() || null,
      shiftName: filters.shiftName?.trim() || null,
      filters: [],
      ordersBy: ['createAt:desc'] as string[],
    };
    return this.http
      .post<PositionListResponse>(this.api.apiUrl('/api/v1/positions/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(
        map((res) => ({
          items: (res.data ?? []).map((item) => ({
            ...item,
            brand: item.brand ?? '—',
            country: item.country ?? '—',
            state: item.state ?? '—',
            requisitionType: item.requisitionType ?? '—',
            coverageType: item.coverageType ?? '—',
            createdAt: item.createdAt,
          })),
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  getDashboardKpis(): Observable<PositionDashboardKpis> {
    return this.http.get<PositionDashboardKpis>(this.api.apiUrl('/api/v1/positions/dashboard-kpis'), {
      headers: this.api.buildHeaders(),
    });
  }

  getById(id: number): Observable<PositionDetail> {
    return this.http.get<PositionDetail>(this.api.apiUrl(`/api/v1/positions/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

  create(request: CreatePositionRequest): Observable<CreatePositionResponse> {
    return this.http.post<CreatePositionResponse>(this.api.apiUrl('/api/v1/positions'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdatePositionRequest): Observable<UpdatePositionResponse> {
    return this.http.put<UpdatePositionResponse>(this.api.apiUrl(`/api/v1/positions/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }

  duplicate(id: number, positionName: string): Observable<DuplicatePositionResponse> {
    return this.http.post<DuplicatePositionResponse>(
      this.api.apiUrl(`/api/v1/positions/${id}/duplicate`),
      { positionName },
      { headers: this.api.buildHeaders() },
    );
  }

  publishOnPortal(id: number): Observable<{ id: number; publishedOnPortal: boolean; publishedOnPortalAt: string | null }> {
    return this.http.post<{ id: number; publishedOnPortal: boolean; publishedOnPortalAt: string | null }>(
      this.api.apiUrl(`/api/v1/positions/${id}/publish-on-portal`),
      {},
      { headers: this.api.buildHeaders() },
    );
  }

  delete(id: number, reason?: string | null): Observable<DirectCancelPositionResponse> {
    return this.http.delete<DirectCancelPositionResponse>(this.api.apiUrl(`/api/v1/positions/${id}`), {
      headers: this.api.buildHeaders(),
      body: { reason: reason ?? null },
    });
  }

  reassign(id: number, request: ReassignPositionRequest): Observable<ReassignPositionResponse> {
    return this.http.post<ReassignPositionResponse>(
      this.api.apiUrl(`/api/v1/positions/${id}/reassign`),
      request,
      { headers: this.api.buildHeaders() },
    );
  }

  listEvents(id: number, page = 0, size = 50): Observable<{ items: PositionEventItem[]; total: number }> {
    return this.http
      .get<PositionEventListResponse>(this.api.apiUrl(`/api/v1/positions/${id}/events`), {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  requestCancellation(id: number, reason: string): Observable<RequestPositionCancellationResponse> {
    return this.http.post<RequestPositionCancellationResponse>(
      this.api.apiUrl(`/api/v1/positions/${id}/request-cancellation`),
      { reason },
      { headers: this.api.buildHeaders() },
    );
  }

  approveCancellation(id: number): Observable<{ id: number; status: string; companyId: number }> {
    return this.http.post<{ id: number; status: string; companyId: number }>(
      this.api.apiUrl(`/api/v1/positions/${id}/approve-cancellation`),
      {},
      { headers: this.api.buildHeaders() },
    );
  }

  rejectCancellation(id: number, reason?: string | null): Observable<RejectPositionCancellationResponse> {
    return this.http.post<RejectPositionCancellationResponse>(
      this.api.apiUrl(`/api/v1/positions/${id}/reject-cancellation`),
      { reason: reason ?? null },
      { headers: this.api.buildHeaders() },
    );
  }

  executeCancellation(id: number): Observable<ExecutePositionCancellationResponse> {
    return this.http.post<ExecutePositionCancellationResponse>(
      this.api.apiUrl(`/api/v1/positions/${id}/execute-cancellation`),
      {},
      { headers: this.api.buildHeaders() },
    );
  }
}
