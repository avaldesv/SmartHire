/**
 * FE local (ng serve + proxy.conf.json) → BE Railway.
 * apiBaseUrl is same-origin so CORS is not required.
 */
export const environment = {
  production: false,
  apiBaseUrl: '/smart_hire_api',
  applicationId: 'smart-hire',
  companyId: 1,
  defaultLocale: 'es-MX',
  azure: {
    enabled: false,
    tenantId: '',
    clientId: '',
    redirectUri: 'http://localhost:4300/auth/callback',
  },
};
