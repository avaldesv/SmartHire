import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { DEFAULT_LOGIN_LOCALE, LocaleService, X_LANGUAGE_HEADER } from '../services/locale.service';
import { ApiClientService } from '../services/api-client.service';

export const languageInterceptor: HttpInterceptorFn = (req, next) => {
  const api = inject(ApiClientService);
  const localeService = inject(LocaleService);

  if (!req.url.startsWith(api.apiUrl(''))) {
    return next(req);
  }

  const isPreAuthEndpoint =
    req.url.includes('/api/v1/auth/login') ||
    req.url.includes('/api/v1/auth/sso/exchange');

  const languageHeader = isPreAuthEndpoint
    ? DEFAULT_LOGIN_LOCALE
    : localeService.getLanguageHeader();

  if (req.headers.has(X_LANGUAGE_HEADER)) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        [X_LANGUAGE_HEADER]: languageHeader,
      },
    }),
  );
};
