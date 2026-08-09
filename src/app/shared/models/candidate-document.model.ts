export interface CandidateDocumentListItem {
  id: number;
  documentTypeId: number | null;
  documentTypeName: string | null;
  fileName: string | null;
  contentType: string | null;
  sizeBytes: number | null;
  status: string | null;
  downloadUrl: string | null;
  createAt: string | null;
}

export interface CandidateDocumentListResponse {
  data?: CandidateDocumentListItem[];
  pagination?: { page?: number; size?: number; total?: number };
}
