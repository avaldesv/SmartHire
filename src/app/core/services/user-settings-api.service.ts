import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PortalLanguage, UserSettings } from '../../shared/models/portal-language.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class UserSettingsApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  listPortalLanguages(): Observable<PortalLanguage[]> {
    return this.http.get<PortalLanguage[]>(this.api.apiUrl('/api/v1/portal-languages'));
  }

  getMySettings(): Observable<UserSettings> {
    return this.http.get<UserSettings>(this.api.apiUrl('/api/v1/users/me/settings'));
  }

  updateMySettings(portalLanguageId: number): Observable<UserSettings> {
    return this.http.patch<UserSettings>(this.api.apiUrl('/api/v1/users/me/settings'), {
      portalLanguageId,
    });
  }
}
