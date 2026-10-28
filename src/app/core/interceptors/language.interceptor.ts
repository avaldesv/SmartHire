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

  // HeadersDto expects `language`; keep X-Language for callers that read it.
  let headers = req.headers;
  if (!headers.has(X_LANGUAGE_HEADER)) {
    headers = headers.set(X_LANGUAGE_HEADER, languageHeader);
  }
  if (!headers.has('language')) {
    headers = headers.set('language', languageHeader);
  }

  return next(req.clone({ headers }));
};
