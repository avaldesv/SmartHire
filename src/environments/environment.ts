export const environment = {
  production: false,
  /** FE local + BE local */
  apiBaseUrl: 'http://localhost:8080/smart_hire_api',
  applicationId: 'smart-hire',
  companyId: 1,
  defaultLocale: 'es-MX',
  azure: {
    enabled: false,
    tenantId: '',
    clientId: '',
    redirectUri: 'http://localhost:4200/auth/callback',
  },
};
