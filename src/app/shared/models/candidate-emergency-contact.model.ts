import { ApiPageResponse } from './catalog-position.model';

export interface CandidateEmergencyContact {
  id: number;
  candidateId: number;
  firstName: string;
  lastName: string;
  secondLastName: string | null;
  kinshipId: number | null;
  phonePrefix: string | null;
  phone: string;
  email: string | null;
  active: boolean;
}

export interface CandidateEmergencyContactPayload {
  firstName: string;
  lastName: string;
  secondLastName?: string | null;
  kinshipId: number | null;
  phonePrefix: string | null;
  phone: string;
  email: string | null;
  isActive: boolean;
}

export type CandidateEmergencyContactListResponse = ApiPageResponse<CandidateEmergencyContact>;
