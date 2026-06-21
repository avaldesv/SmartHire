import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of, switchMap } from 'rxjs';
import {
  CreateSecurityRoleRequest,
  SecurityRole,
  SecurityRoleListResponse,
  UpdateSecurityRoleRequest,
} from '../../shared/models/security-role.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class SecurityRoleService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(page = 0, size = 20): Observable<{ items: SecurityRole[]; total: number }> {
    return this.http
      .get<SecurityRoleListResponse>(this.api.apiUrl('/api/v1/roles'), {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  getById(id: number): Observable<SecurityRole> {
    return this.http.get<SecurityRole>(this.api.apiUrl(`/api/v1/roles/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

  create(request: CreateSecurityRoleRequest): Observable<SecurityRole> {
    const headers = this.roleHeaders();
    return this.http.post<SecurityRole>(this.api.apiUrl('/api/v1/roles'), request, { headers }).pipe(
      switchMap((role) => {
        const permissionIds = request.modulePermissionIds ?? [];
        if (permissionIds.length === 0) {
          return of(role);
        }
        return this.assignModulePermissions(role.id, permissionIds).pipe(map(() => role));
      }),
    );
  }

  update(id: number, request: UpdateSecurityRoleRequest): Observable<SecurityRole> {
    return this.http.put<SecurityRole>(this.api.apiUrl(`/api/v1/roles/${id}`), request, {
      headers: this.roleHeaders(),
    });
  }

  assignModulePermissions(roleId: number, modulePermissionIds: number[]): Observable<void> {
    return this.http.post<void>(
      this.api.apiUrl(`/api/v1/roles/${roleId}/module-permissions`),
      modulePermissionIds,
      { headers: this.roleHeaders() },
    );
  }

  private roleHeaders(): HttpHeaders {
    return this.api.buildHeaders();
  }
}
