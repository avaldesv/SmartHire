import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CreateSecurityUserRequest,
  SecurityUser,
  SecurityUserListResponse,
  UpdateSecurityUserRequest,
} from '../../shared/models/security-user.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class SecurityUserService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(page = 0, size = 20, search?: string): Observable<{ items: SecurityUser[]; total: number }> {
    const params: Record<string, string> = {};
    const term = search?.trim();
    if (term) {
      params['search'] = term;
    }
    return this.http
      .get<SecurityUserListResponse>(this.api.apiUrl('/api/v1/users'), {
        headers: this.api.buildHeaders(page, size),
        params,
      })
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  getById(id: number): Observable<SecurityUser> {
    return this.http.get<SecurityUser>(this.api.apiUrl(`/api/v1/users/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

  create(request: CreateSecurityUserRequest): Observable<SecurityUser> {
    return this.http.post<SecurityUser>(this.api.apiUrl('/api/v1/users'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateSecurityUserRequest): Observable<SecurityUser> {
    return this.http.put<SecurityUser>(this.api.apiUrl(`/api/v1/users/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/users/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }
}
