export interface CatalogPipelineStage {
  id: number;
  countryId: number | null;
  code: string;
  name: string;
  description: string | null;
  sortOrder: number;
  colorHex: string;
  isActive: boolean;
}

export interface PipelineStageListResponse {
  data: CatalogPipelineStage[];
  pagination?: { total: number; page: number; size: number };
}
