import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ApiClientService } from '../services/api-client.service';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const api = inject(ApiClientService);

  if (!req.url.startsWith(api.apiUrl(''))) {
    return next(req);
  }

  const isAuthEndpoint =
    req.url.includes('/api/v1/auth/login') ||
    req.url.includes('/api/v1/auth/refresh') ||
    req.url.includes('/api/v1/auth/sso/exchange');

  if (isAuthEndpoint) {
    return next(req);
  }

  const token = auth.getAccessToken();
  const authedReq =
    token && !req.headers.has('authorization')
      ? req.clone({ setHeaders: { authorization: `Bearer ${token}` } })
      : req;

  return next(authedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || isAuthEndpoint) {
        return throwError(() => error);
      }
      return auth.refreshSession().pipe(
        switchMap(() => {
          const newToken = auth.getAccessToken();
          if (!newToken) {
            return throwError(() => error);
          }
          return next(
            req.clone({
              setHeaders: { authorization: `Bearer ${newToken}` },
            }),
          );
        }),
        catchError(() => throwError(() => error)),
      );
    }),
  );
};
