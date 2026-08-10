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
  isValidated?: boolean | null;
  rejectionReason?: string | null;
  validatedAt?: string | null;
  isRequiredForPosition?: boolean | null;
}

export interface UpdateApplicationDocumentValidationRequest {
  isValidated: boolean;
  rejectionReason?: string | null;
}

export interface UpdateApplicationDocumentValidationResponse {
  applicationId: number;
  documentId: number;
  isValidated: boolean;
  rejectionReason: string | null;
  validatedAt: string | null;
  documentsSaved: boolean;
}

export interface CandidateDocumentListResponse {
  data?: CandidateDocumentListItem[];
  pagination?: { page?: number; size?: number; total?: number };
}
