import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { MSAL_INSTANCE, MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';

import { routes } from './app.routes';
import { createMsalConfiguration } from './core/auth/msal.config';
import { authTokenInterceptor } from './core/interceptors/auth-token.interceptor';
import { languageInterceptor } from './core/interceptors/language.interceptor';

function createMsalInstance(): IPublicClientApplication | null {
  const config = createMsalConfiguration();
  if (!config) {
    return null;
  }
  return new PublicClientApplication(config);
}

function initializeMsalFactory(msalService: MsalService) {
  return () => msalService.instance.initialize();
}

const msalInstance = createMsalInstance();
const msalProviders =
  msalInstance === null
    ? []
    : [
        {
          provide: MSAL_INSTANCE,
          useValue: msalInstance,
        },
        MsalService,
        MsalBroadcastService,
        {
          provide: APP_INITIALIZER,
          useFactory: initializeMsalFactory,
          deps: [MsalService],
          multi: true,
        },
      ];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([languageInterceptor, authTokenInterceptor])),
    ...msalProviders,
  ],
};
