import { ApiPageResponse } from './catalog-position.model';

export interface PositionLanguageItem {
  languageId: number;
  languageLevelId: number;
}

export interface PositionDocumentRequirementItem {
  documentTypeId: number;
  isRequired: boolean;
}

export interface PositionQuestionnaireItem {
  questionnaireId: number;
  evaluationType: string;
  acceptancePercentage: number | null;
}

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
  tradeName?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  clientPositionKey?: string | null;
  positionName?: string | null;
  serviceNumber?: string | null;
  genderId?: number | null;
  maritalStatusId?: number | null;
  careerId?: number | null;
  experienceIn?: string | null;
  experienceLevelId?: number | null;
  minAge?: number | null;
  maxAge?: number | null;
  hasPeopleInCharge?: boolean | null;
  peopleInChargeCount?: number | null;
  travelAvailability?: boolean | null;
  relocationAvailability?: boolean | null;
  publishProfileDescription?: boolean | null;
  requirementsMandatory?: string | null;
  requirementsOptional?: string | null;
  requirementsDesirable?: string | null;
  serviceFee?: number | null;
  currencyId?: number | null;
  hasAdvancePayment?: boolean | null;
  workdayStartTime?: string | null;
  workdayEndTime?: string | null;
  lunchStartTime?: string | null;
  lunchEndTime?: string | null;
  rotatingShifts?: boolean | null;
  commitmentDate?: string | null;
  hiringDate?: string | null;
  hiringRequirements?: string | null;
  tools?: string | null;
  recruiterGroupId?: number | null;
  careResponsibleUserId?: number | null;
  careResponsibleAts?: string | null;
  disabilityTypeId?: number | null;
  hasLinkage?: boolean | null;
  seniorCitizen?: boolean | null;
  subregion?: string | null;
  recruiterEmail?: string | null;
  generalCategoryId?: number | null;
  jobDescription?: string | null;
  workplaceId?: number | null;
  responsibilityLevelId?: number | null;
  publishSalaryMin?: number | null;
  publishSalaryMax?: number | null;
  hasCommission?: boolean | null;
  hideSalary?: boolean | null;
  jobPortalId?: number | null;
  includeSoftSkills?: boolean | null;
  includeExtraBenefits?: boolean | null;
  includeProfessionalDevelopment?: boolean | null;
  includeKeywords?: boolean | null;
  clientExpansionDescription?: string | null;
  extraBenefitsText?: string | null;
  languages?: PositionLanguageItem[];
  questionnaire?: PositionQuestionnaireItem | null;
  documentRequirements?: PositionDocumentRequirementItem[];
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
  brand?: string | null;
  country?: string | null;
  state?: string | null;
  requisitionType?: string | null;
  coverageType?: string | null;
}

export interface PositionDetail extends CreatePositionRequest {
  id: number;
  requisitionNo: string;
  status: string;
  companyId: number;
  formConfigId?: number | null;
  formConfigVersion?: number | null;
}

export type UpdatePositionRequest = CreatePositionRequest;
export type UpdatePositionResponse = CreatePositionResponse;
export type DuplicatePositionResponse = CreatePositionResponse;
export type RequestPositionCancellationResponse = CreatePositionResponse;
export type RejectPositionCancellationResponse = CreatePositionResponse;

export type PositionListResponse = ApiPageResponse<PositionListItem>;

export interface PositionDashboardKpis {
  totalPositions: number;
  preselectedCandidates: number;
  interestedCandidates: number;
}
