export type ViaBotScope = 'POOL' | 'APPLICANTS';

export interface ViaBotCandidate {
  candidateId: number;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  matchPercent?: number | null;
  summary?: string | null;
}

export interface ViaBotConversationMessage {
  role: string;
  content: string;
  createdAt: string | null;
  candidateIds: number[] | null;
}

export interface ViaBotConversationResponse {
  exists: boolean;
  conversationId: number | null;
  viaConversationId: string | null;
  scope: string | null;
  status: string | null;
  messages: ViaBotConversationMessage[];
  candidates: ViaBotCandidate[];
}

export interface ViaBotChatRequest {
  message: string;
  scope: ViaBotScope;
  candidateLimit?: number | null;
  experienceYears?: number | null;
}

export interface ViaBotChatResponse {
  conversationId: number;
  viaConversationId: string;
  response: string;
  candidates: ViaBotCandidate[];
}

export interface ViaBotAddToPreselectionRequest {
  candidateIds: number[];
}

export interface ViaBotAddToPreselectionResponse {
  updated: number;
}

export interface ViaBotResetResponse {
  reset: boolean;
}
