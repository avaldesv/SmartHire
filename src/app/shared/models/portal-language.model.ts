export interface PortalLanguage {
  id: number;
  code: string;
  locale: string;
  name: string;
  sortOrder: number;
}

export interface UserSettings {
  portalLanguageId: number;
  portalLanguageCode: string;
  locale: string;
}
