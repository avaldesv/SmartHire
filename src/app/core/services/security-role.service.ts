import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { SecurityRole, SecurityRoleListResponse } from '../../shared/models/security-role.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class SecurityRoleService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(page = 0, size = 200): Observable<SecurityRole[]> {
    return this.http
      .get<SecurityRoleListResponse>(this.api.apiUrl('/api/v1/roles'), {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => res.data ?? []));
  }
}
