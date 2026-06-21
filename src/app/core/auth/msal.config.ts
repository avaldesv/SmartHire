import { BrowserCacheLocation, Configuration, LogLevel } from '@azure/msal-browser';
import { environment } from '../../../environments/environment';

export function createMsalConfiguration(): Configuration | null {
  if (!environment.azure?.enabled) {
    return null;
  }
  return {
    auth: {
      clientId: environment.azure.clientId,
      authority: `https://login.microsoftonline.com/${environment.azure.tenantId}`,
      redirectUri: environment.azure.redirectUri,
      postLogoutRedirectUri: environment.azure.redirectUri.replace('/auth/callback', '/login'),
    },
    cache: {
      cacheLocation: BrowserCacheLocation.SessionStorage,
    },
    system: {
      loggerOptions: {
        logLevel: LogLevel.Warning,
      },
    },
  };
}

export const msalScopes = ['openid', 'profile', 'email', 'User.Read'];
