import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { msalScopes } from '../auth/msal.config';
import { AuthUser } from '../../shared/models';
import { ApiClientService } from './api-client.service';

const MOCK_USER: AuthUser = {
  id: '1',
  email: 'gquintana@empresa.com',
  firstName: 'Gerardo',
  lastName: 'Quintana',
  initials: 'GQ',
  role: 'RECRUITER',
  branch: 'CDMX Centro',
  permissions: ['home:read', 'positions:write', 'candidates:write', 'reports:read', 'settings:admin'],
};

interface LoginApiResponse {
  accessToken: string;
  expiresIn?: number;
  refreshToken?: string;
  refreshExpiresIn?: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);
  private readonly msal = inject(MsalService, { optional: true });

  readonly currentUser = signal<AuthUser | null>(null);

  private refreshTimerId: ReturnType<typeof setTimeout> | null = null;
  private refreshInFlight: Observable<LoginApiResponse> | null = null;

  isSsoEnabled(): boolean {
    const azure = environment.azure;
    return !!azure?.enabled && !!azure.clientId && !!azure.tenantId;
  }

  login(username: string, password: string): Observable<AuthUser> {
    return this.http
      .post<LoginApiResponse>(
        this.api.apiUrl('/api/v1/auth/login'),
        { companyId: environment.companyId, username, password },
        { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) },
      )
      .pipe(
        tap((res) => this.persistSession(username, res)),
        map(() => this.buildUserFromUsername(username)),
      );
  }

  exchangeSsoToken(azureAccessToken: string): Observable<AuthUser> {
    return this.http
      .post<LoginApiResponse>(
        this.api.apiUrl('/api/v1/auth/sso/exchange'),
        { companyId: environment.companyId },
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${azureAccessToken}`,
          }),
        },
      )
      .pipe(
        tap((res) => {
          const email = this.resolveSsoEmail();
          this.persistSession(email, res);
        }),
        map(() => this.buildUserFromUsername(this.resolveSsoEmail())),
      );
  }

  refreshSession(): Observable<boolean> {
    const refreshToken = sessionStorage.getItem('sh_refresh_token');
    if (!refreshToken) {
      return throwError(() => new Error('Missing refresh token'));
    }
    if (this.refreshInFlight) {
      return this.refreshInFlight.pipe(map(() => true));
    }
    this.refreshInFlight = this.http
      .post<LoginApiResponse>(
        this.api.apiUrl('/api/v1/auth/refresh'),
        { companyId: environment.companyId, refreshToken },
        { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) },
      )
      .pipe(
        tap((res) => {
          const userRaw = sessionStorage.getItem('sh_user');
          const email = userRaw ? (JSON.parse(userRaw) as AuthUser).email : MOCK_USER.email;
          this.persistSession(email, res);
        }),
        catchError((err) => {
          this.logout();
          return throwError(() => err);
        }),
        tap(() => {
          this.refreshInFlight = null;
        }),
      );
    return this.refreshInFlight.pipe(map(() => true));
  }

  ssoLogin(): void {
    if (!this.isSsoEnabled() || !this.msal) {
      return;
    }
    this.msal.loginRedirect({ scopes: msalScopes });
  }

  logout(): void {
    this.clearRefreshTimer();
    this.currentUser.set(null);
    sessionStorage.removeItem('sh_token');
    sessionStorage.removeItem('sh_refresh_token');
    sessionStorage.removeItem('sh_token_expires_at');
    sessionStorage.removeItem('sh_user');
  }

  restoreSession(): boolean {
    const raw = sessionStorage.getItem('sh_user');
    const token = sessionStorage.getItem('sh_token');
    if (raw && token) {
      this.currentUser.set(JSON.parse(raw));
      this.scheduleSilentRefresh();
      return true;
    }
    return false;
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('sh_token');
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem('sh_token');
  }

  private persistSession(usernameOrEmail: string, response: LoginApiResponse): void {
    const user = this.buildUserFromUsername(usernameOrEmail);
    this.currentUser.set(user);
    sessionStorage.setItem('sh_token', response.accessToken);
    sessionStorage.setItem('sh_user', JSON.stringify(user));
    if (response.refreshToken) {
      sessionStorage.setItem('sh_refresh_token', response.refreshToken);
    }
    if (response.expiresIn) {
      const expiresAt = Date.now() + response.expiresIn * 1000;
      sessionStorage.setItem('sh_token_expires_at', String(expiresAt));
      this.scheduleSilentRefresh(response.expiresIn);
    }
  }

  private scheduleSilentRefresh(expiresInSeconds?: number): void {
    this.clearRefreshTimer();
    const refreshToken = sessionStorage.getItem('sh_refresh_token');
    if (!refreshToken) {
      return;
    }
    let delayMs: number;
    if (expiresInSeconds != null) {
      delayMs = Math.max((expiresInSeconds - 60) * 1000, 10_000);
    } else {
      const expiresAt = Number(sessionStorage.getItem('sh_token_expires_at') ?? 0);
      delayMs = Math.max(expiresAt - Date.now() - 60_000, 10_000);
    }
    this.refreshTimerId = setTimeout(() => {
      this.refreshSession().subscribe({ error: () => undefined });
    }, delayMs);
  }

  private clearRefreshTimer(): void {
    if (this.refreshTimerId != null) {
      clearTimeout(this.refreshTimerId);
      this.refreshTimerId = null;
    }
  }

  private buildUserFromUsername(usernameOrEmail: string): AuthUser {
    const email = usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@empresa.com`;
    return { ...MOCK_USER, email };
  }

  private resolveSsoEmail(): string {
    const account = this.msal?.instance.getAllAccounts()[0];
    const claimEmail = account?.username ?? account?.idTokenClaims?.['preferred_username'];
    if (typeof claimEmail === 'string' && claimEmail.includes('@')) {
      return claimEmail;
    }
    return MOCK_USER.email;
  }
}
