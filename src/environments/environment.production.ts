export const environment = {
  production: true,
  /** FE + BE Railway (deploy) */
  apiBaseUrl: 'https://smarthire-backend-staging.up.railway.app/smart_hire_api',
  applicationId: 'smart-hire',
  companyId: 1,
  defaultLocale: 'es-MX',
  azure: {
    enabled: false,
    tenantId: '',
    clientId: '',
    redirectUri: 'https://portal-reclutadores-smarthire-staging.up.railway.app/auth/callback',
  },
};
