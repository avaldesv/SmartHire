/** GET/PUT /api/v1/candidate-applications/{id}/complete-info */

export interface ApplicationCompleteInfoLookupItem {
  id: number;
  name: string;
  countryId: number | null;
}

export interface ApplicationCompleteInfoLookups {
  genders: ApplicationCompleteInfoLookupItem[];
  maritalStatuses: ApplicationCompleteInfoLookupItem[];
  educationLevels: ApplicationCompleteInfoLookupItem[];
  countries: ApplicationCompleteInfoLookupItem[];
  states: ApplicationCompleteInfoLookupItem[];
  kinships: ApplicationCompleteInfoLookupItem[];
}

export interface ApplicationCompleteInfoPersonalData {
  firstName: string | null;
  lastName: string | null;
  maternalLastName: string | null;
  email: string | null;
  phone: string | null;
  phoneCountryId: number | null;
  curp: string | null;
  rfc: string | null;
  nss: string | null;
  nssDv: string | null;
  infonavit: string | null;
  taxRegime: string | null;
  rfcPostalCode: string | null;
  maritalStatusId: number | null;
  birthDate: string | null;
  birthCountryId: number | null;
  birthStateId: number | null;
  genderId: number | null;
  residenceCountryId: number | null;
  residenceStateId: number | null;
  postalCode: string | null;
  municipality: string | null;
  neighborhood: string | null;
  street: string | null;
  exteriorNumber: string | null;
  interiorNumber: string | null;
  educationLevelId: number | null;
  educationInstitution: string | null;
  desiredSalary: number | null;
  experienceYears: number | null;
}

export interface ApplicationCompleteInfoBeneficiary {
  id: number | null;
  beneficiaryType: string | null;
  firstName: string | null;
  lastName: string | null;
  secondLastName: string | null;
  kinshipId: number | null;
  irrevocable: boolean | null;
  age: number | null;
  percent: number | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  isActive: boolean | null;
}

export interface ApplicationCompleteInfoEmergencyContact {
  id: number | null;
  firstName: string | null;
  lastName: string | null;
  secondLastName: string | null;
  kinshipId: number | null;
  phonePrefix: string | null;
  phone: string | null;
  email: string | null;
  isActive: boolean | null;
}

export interface ApplicationCompleteInfoResponse {
  inviteId: number | null;
  applicationId: number;
  candidateId: number;
  expiresAt: string | null;
  positionName: string | null;
  enabledTabs: string[];
  personal: ApplicationCompleteInfoPersonalData | null;
  beneficiaries: ApplicationCompleteInfoBeneficiary[];
  emergencyContacts: ApplicationCompleteInfoEmergencyContact[];
  lookups: ApplicationCompleteInfoLookups | null;
}

export interface SubmitApplicationCompleteInfoRequest {
  personal?: ApplicationCompleteInfoPersonalData | null;
  beneficiaries?: Array<{
    beneficiaryType: string;
    firstName: string;
    lastName: string;
    secondLastName?: string | null;
    kinshipId?: number | null;
    irrevocable?: boolean | null;
    age?: number | null;
    percent?: number | null;
    country?: string | null;
    phone?: string | null;
    email?: string | null;
    isActive?: boolean | null;
  }> | null;
  emergencyContacts?: Array<{
    firstName: string;
    lastName: string;
    secondLastName?: string | null;
    kinshipId?: number | null;
    phonePrefix?: string | null;
    phone: string;
    email?: string | null;
    isActive?: boolean | null;
  }> | null;
}

export interface ApplicationCompleteInfoSaveResponse {
  applicationId: number;
  candidateId: number;
  infoValidated: boolean;
  message: string;
}
