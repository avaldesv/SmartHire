import { ApiPageResponse } from './catalog-position.model';

export interface CandidateExperience {
  id: number;
  position: string;
  companyName: string;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  source: string;
  extractJobId: number | null;
}

export interface CandidateEducation {
  id: number;
  degree: string;
  institution: string | null;
  issueDate: string | null;
  isGraduate: boolean | null;
  rating: string | null;
  locationText: string | null;
  source: string;
  extractJobId: number | null;
}

export interface CandidateCourseCertification {
  id: number;
  name: string;
  institution: string | null;
  credentialNumber: string | null;
  expiresAt: string | null;
  kind: string | null;
  source: string;
  extractJobId: number | null;
}

export interface CandidateLanguage {
  id: number;
  name: string;
  level: string | null;
  institution: string | null;
  source: string;
  extractJobId: number | null;
}

export type CandidateExperienceListResponse = ApiPageResponse<CandidateExperience>;
export type CandidateEducationListResponse = ApiPageResponse<CandidateEducation>;
export type CandidateCourseCertificationListResponse = ApiPageResponse<CandidateCourseCertification>;
export type CandidateLanguageListResponse = ApiPageResponse<CandidateLanguage>;
