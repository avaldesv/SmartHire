import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CreateRecruiterGroupRequest,
  RecruiterGroupListResponse,
  SecurityRecruiterGroup,
  UpdateRecruiterGroupRequest,
} from '../../shared/models/security-recruiter-group.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class SecurityRecruiterGroupService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(countryId: number, page = 0, size = 20): Observable<{ items: SecurityRecruiterGroup[]; total: number }> {
    const body = { countryId, isActive: null, filters: [], ordersBy: ['description:asc'] as string[] };
    return this.http
      .post<RecruiterGroupListResponse>(this.api.apiUrl('/api/v1/recruiter-groups/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  /** Groups where the logged-in user is a member, ordered by id ascending. */
  listMine(countryId?: number | null): Observable<SecurityRecruiterGroup[]> {
    const params =
      countryId != null && Number.isFinite(countryId)
        ? { countryId: String(countryId) }
        : undefined;
    return this.http.get<SecurityRecruiterGroup[]>(this.api.apiUrl('/api/v1/recruiter-groups/mine'), {
      headers: this.api.buildHeaders(),
      params,
    });
  }

  getById(id: number): Observable<SecurityRecruiterGroup> {
    return this.http.get<SecurityRecruiterGroup>(this.api.apiUrl(`/api/v1/recruiter-groups/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

  create(request: CreateRecruiterGroupRequest): Observable<SecurityRecruiterGroup> {
    return this.http.post<SecurityRecruiterGroup>(this.api.apiUrl('/api/v1/recruiter-groups'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateRecruiterGroupRequest): Observable<SecurityRecruiterGroup> {
    return this.http.put<SecurityRecruiterGroup>(this.api.apiUrl(`/api/v1/recruiter-groups/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/recruiter-groups/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }
}
