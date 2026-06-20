export interface CreatePositionRequest {
  countryId: number;
  brandId: number;
  recruitmentType: string;
  coverageTypeId: number;
  ot: string;
  clientKey: string;
  legalName: string;
  contactName: string;
  clientPosition: string;
  generalNotes?: string;
  contractTypeId: number;
  shiftId: number;
  salary: number;
  workDays: string;
  positionsCount: number;
  headcount: number;
  startDate: string;
  hiringContractTypeId: number;
  benefitId: number;
  probationDays: number;
  primaryLanguageId: number;
  secondaryLanguageId?: number | null;
  languageLevelId: number;
  address: string;
  stateId: number;
  municipalityId: number;
  postalCode: string;
  neighborhoodId: number;
  city: string;
  requirements: string;
  educationLevelId: number;
  experienceYears: number;
  documentTypeIds: number[];
}

export interface CreatePositionResponse {
  id: number;
  status: string;
  companyId: number;
}
