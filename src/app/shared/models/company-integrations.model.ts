export interface CompanyEmailChannelConfig {
  isEnabled: boolean;
  mailFrom: string | null;
  smtpHost: string | null;
  smtpPort: number | null;
  smtpUsername: string | null;
  smtpPassword: string | null;
}

export interface CompanyWhatsAppChannelConfig {
  isEnabled: boolean;
  whatsappBaseUrl: string | null;
  whatsappBearer: string | null;
  whatsappInstanceId: string | null;
  whatsappInstanceToken: string | null;
}

export interface CompanyDocumentServiceIntegration {
  documentProcessingServiceId: number;
  code: string;
  name: string;
  description: string;
  catalogServiceUrl: string | null;
  isEnabled: boolean;
  apiKeyToken: string | null;
  serviceUrlOverride: string | null;
}

export interface CompanyIntegrations {
  email: CompanyEmailChannelConfig;
  whatsapp: CompanyWhatsAppChannelConfig;
  documentServices: CompanyDocumentServiceIntegration[];
}

export interface UpsertCompanyIntegrationsRequest {
  email: CompanyEmailChannelConfig;
  whatsapp: CompanyWhatsAppChannelConfig;
  documentServices: Array<{
    documentProcessingServiceId: number;
    isEnabled: boolean;
    apiKeyToken: string | null;
    serviceUrlOverride: string | null;
  }>;
}
