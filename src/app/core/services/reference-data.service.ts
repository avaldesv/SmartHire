import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';

export interface CountryDialCodeOption {
  countryId: number;
  countryCode: string;
  countryName: string;
  dialCode: string;
}

export interface UserTenantContext {
  companyId: number;
  countryId: number | null;
  countryCode: string | null;
  countryName: string | null;
}

@Injectable({ providedIn: 'root' })
export class ReferenceDataService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  listCountryDialCodes(preferredCountryId?: number | null): Observable<CountryDialCodeOption[]> {
    const params =
      preferredCountryId != null ? { preferredCountryId: String(preferredCountryId) } : undefined;
    return this.http.get<CountryDialCodeOption[]>(
      this.api.apiUrl('/api/v1/reference/country-dial-codes'),
      {
        headers: this.api.buildHeaders(),
        params,
      },
    );
  }

  getUserTenantContext(): Observable<UserTenantContext> {
    return this.http.get<UserTenantContext>(this.api.apiUrl('/api/v1/users/tenant-context'), {
      headers: this.api.buildHeaders(),
    });
  }
}
