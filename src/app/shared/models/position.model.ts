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
  brandId?: number | null;
  requisitionTypeId: number;
  coverageTypeId: number;
  clientId?: number | null;
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
  hiringRequirements?: number[] | null;
  tools?: number[] | null;
  recruiterGroupId?: number | null;
  careResponsibleUserId?: number | null;
  careResponsibleAts?: string | null;
  disabilityTypeIds?: number[] | null;
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
  publishedOnPortal?: boolean | null;
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
  assignedUserId?: number | null;
}

export interface CreatePositionResponse {
  id: number;
  status: string;
  companyId: number;
  cancellationScope?: string | null;
}

export interface PositionUserSummary {
  id: number;
  name: string | null;
  lastName: string | null;
  email: string | null;
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
  contactEmail?: string | null;
  contactPhone?: string | null;
  applicantsCount?: number | null;
  preselectedCount?: number | null;
  hiredCount?: number | null;
  recruiterGroupId?: number | null;
  recruiterGroup?: string | null;
  assignedUserId?: number | null;
  assignedUser?: PositionUserSummary | null;
  supervisorUserId?: number | null;
  supervisorUser?: PositionUserSummary | null;
  cancellationScope?: string | null;
  statusName?: string | null;
  statusType?: string | null;
}

export interface PositionDetail extends CreatePositionRequest {
  id: number;
  requisitionNo: string;
  status: string;
  companyId: number;
  formConfigId?: number | null;
  formConfigVersion?: number | null;
  assignedUser?: PositionUserSummary | null;
  supervisorUserId?: number | null;
  supervisorUser?: PositionUserSummary | null;
  cancellationScope?: string | null;
  statusName?: string | null;
  statusType?: string | null;
}

export type UpdatePositionRequest = CreatePositionRequest;
export type UpdatePositionResponse = CreatePositionResponse;
export type DuplicatePositionResponse = CreatePositionResponse;
export type RequestPositionCancellationResponse = CreatePositionResponse;
export type RejectPositionCancellationResponse = CreatePositionResponse;
export type ExecutePositionCancellationResponse = CreatePositionResponse;
export type DirectCancelPositionResponse = CreatePositionResponse;

export interface PositionCancellationRequest {
  cancellationTypeId: number;
  cancellationReasonId: number;
  description?: string | null;
  evidenceStorageKey?: string | null;
  evidenceFileName?: string | null;
  evidenceContentType?: string | null;
}

export interface PositionCancellationImpactCandidate {
  applicationId: number;
  candidateId: number;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  status: string | null;
}

export interface PositionCancellationImpact {
  requisitionId: number;
  requisitionNumber: string;
  requisitionName: string;
  positionsCount: number;
  applicantsCount: number;
  preselectionCount: number;
  firstDayCount: number;
  candidates: PositionCancellationImpactCandidate[];
}

export interface UploadCancellationEvidenceResponse {
  storageKey: string;
  fileName: string;
  contentType: string;
}

export interface ReassignPositionRequest {
  assignedUserId: number;
  reason?: string | null;
}

export interface ReassignPositionResponse {
  id: number;
  assignedUserId: number | null;
  supervisorUserId: number | null;
}

export interface PositionEventItem {
  id: number;
  eventType: string;
  fromStatus: string | null;
  toStatus: string | null;
  actorUserId: number | null;
  payloadJson: string | null;
  cancellationRequestId: number | null;
  createdAt: string | null;
}

export type PositionEventListResponse = ApiPageResponse<PositionEventItem>;

export type PositionListResponse = ApiPageResponse<PositionListItem>;

export interface PositionDashboardKpis {
  totalPositions: number;
  preselectedCandidates: number;
  interestedCandidates: number;
}
