import { ApiPageResponse } from './catalog-position.model';

export interface CreatePositionRequest {
  countryId: number;
  brandId: number;
  requisitionTypeId: number;
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

export interface PositionListItem {
  id: number;
  requisitionNo: string;
  name: string;
  client: string;
  status: string;
  recruiter: string | null;
  createdAt: string;
  ot?: string | null;
  clientKey?: string | null;
  positionsCount?: number | null;
  city?: string | null;
  startDate?: string | null;
}

export interface PositionDetail extends CreatePositionRequest {
  id: number;
  requisitionNo: string;
  status: string;
  companyId: number;
}

export type UpdatePositionRequest = CreatePositionRequest;
export type UpdatePositionResponse = CreatePositionResponse;

export type PositionListResponse = ApiPageResponse<PositionListItem>;
