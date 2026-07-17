import { ApiPageResponse } from './catalog-position.model';

export interface CatalogDocumentProcessingService {
  id: number;
  code: string;
  name: string;
  isIa?: boolean;
  iaName?: string;
  configSource?: string;
}

export type DocumentProcessingServiceListResponse = ApiPageResponse<CatalogDocumentProcessingService>;
