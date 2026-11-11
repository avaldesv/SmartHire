import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, shareReplay, throwError } from 'rxjs';
import { PortalLanguage } from '../../shared/models/portal-language.model';
import { AuthService } from './auth.service';
import { LocaleService } from './locale.service';
import { resolvePortalLanguage } from './resolve-portal-language';
import { UserSettingsApiService } from './user-settings-api.service';

/** Active rows of config_portal_language (`GET /api/v1/portal-languages`). */
@Injectable({ providedIn: 'root' })
export class PortalLanguageCatalogService {
  private readonly api = inject(UserSettingsApiService);
  private readonly auth = inject(AuthService);
  private readonly localeService = inject(LocaleService);
  private request$: Observable<PortalLanguage[]> | null = null;

  load(): Observable<PortalLanguage[]> {
    if (!this.request$) {
      this.request$ = this.api.listPortalLanguages().pipe(
        map((items) =>
          [...items]
            .filter((item) => item.id != null && !!item.name?.trim())
            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
        ),
        shareReplay(1),
        catchError((err: unknown) => {
          this.request$ = null;
          return throwError(() => err);
        }),
      );
    }
    return this.request$;
  }

  /** Profile language from /auth/me, then ES_MX when that row is missing. */
  resolveDefault(languages: readonly PortalLanguage[]): PortalLanguage | null {
    const user = this.auth.currentUser();
    return resolvePortalLanguage(languages, {
      portalLanguageId: this.localeService.portalLanguageId() ?? user?.portalLanguageId ?? null,
      locale: this.localeService.activeLocale() || user?.locale || null,
    });
  }
}
