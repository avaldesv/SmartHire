import { ApiPageResponse } from './catalog-position.model';

export type BeneficiaryType = 'PRIMARY' | 'CONTINGENT';

export interface CandidateBeneficiary {
  id: number;
  candidateId: number;
  beneficiaryType: BeneficiaryType;
  firstName: string;
  lastName: string;
  secondLastName: string | null;
  kinshipId: number | null;
  irrevocable: boolean;
  age: number | null;
  percent: number;
  country: string | null;
  phone: string | null;
  email: string | null;
  active: boolean;
}

export interface CandidateBeneficiaryPayload {
  beneficiaryType: BeneficiaryType;
  firstName: string;
  lastName: string;
  secondLastName?: string | null;
  kinshipId: number | null;
  irrevocable: boolean;
  age: number | null;
  percent: number;
  country: string | null;
  phone: string | null;
  email: string | null;
  isActive: boolean;
}

export type CandidateBeneficiaryListResponse = ApiPageResponse<CandidateBeneficiary>;
