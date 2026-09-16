export interface JobPortalCredentialItem {
  jobPortalId: number;
  portalCode: string;
  portalName: string;
  username: string | null;
  configured: boolean;
  hasPassword: boolean;
}

export interface JobPortalCredentialsResponse {
  items: JobPortalCredentialItem[];
}

export interface UpdateJobPortalCredentialItem {
  jobPortalId: number;
  username: string | null;
  /** Omit or null to keep; empty string clears. */
  password?: string | null;
}

export interface UpdateJobPortalCredentialsRequest {
  items: UpdateJobPortalCredentialItem[];
}

export interface WizardPublishedPortalRow {
  jobPortalId: number;
  externalPortalId: string;
}
