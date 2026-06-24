import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface CatalogCharacteristic {
  id: number;
  countryId?: number | null;
  code: string;
  name: string;
  description?: string | null;
  legacyManpowerId?: number | null;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreateCharacteristicRequest {
  countryId: number;
  code: string;
  name: string;
  description?: string;
  legacyManpowerId?: number | null;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateCharacteristicRequest = Omit<CreateCharacteristicRequest, 'scope'>;
export type CharacteristicListResponse = ApiPageResponse<CatalogCharacteristic>;
