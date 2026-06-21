import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  SecurityModulePermission,
  SecurityModulePermissionListResponse,
} from '../../shared/models/security-module-permission.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class SecurityModulePermissionService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(page = 0, size = 200): Observable<SecurityModulePermission[]> {
    return this.http
      .get<SecurityModulePermissionListResponse>(this.api.apiUrl('/api/v1/module-permission'), {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => (res.data ?? []).filter((p) => p.isActive)));
  }
}
