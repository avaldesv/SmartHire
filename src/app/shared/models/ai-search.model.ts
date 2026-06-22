export interface QueryAiSearchRequest {
  positionId: number;
  prompt?: string | null;
  sources?: string[] | null;
  count?: number | null;
  yearsExperience?: number | null;
}

export interface QueryAiSearchResultItem {
  resultId: number;
  candidateId: number;
  applicationId: number | null;
  compatibilityPercent: number;
  evidence: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface QueryAiSearchResponse {
  sessionId: number;
  results: QueryAiSearchResultItem[];
}

export interface AddAiSearchToPreselectionRequest {
  sessionId: number;
  resultIds: number[];
}

export interface AddAiSearchToPreselectionResponse {
  updatedCount: number;
}

export interface AiSearchResultView {
  resultId: number;
  candidateId: number;
  name: string;
  email: string;
  phone: string;
  compatibility: number;
  evidence: string;
  selected: boolean;
}
