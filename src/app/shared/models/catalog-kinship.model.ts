import { ApiPageResponse } from './catalog-position.model';

export interface CatalogKinship {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
}

export interface CreateKinshipRequest {
  code: string;
  name: string;
  isActive?: boolean;
}

export type UpdateKinshipRequest = CreateKinshipRequest;
export type KinshipListResponse = ApiPageResponse<CatalogKinship>;
