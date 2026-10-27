export interface EvaluatestQualifiedVariable {
  score: number | null;
  idVariable: number | null;
  nameVariableEvaluated: string | null;
  shortNameVariableEvaluated: string | null;
  domainLevel: string | null;
  domainPercentage: number | null;
  domainRange: string | null;
  interpretationForEvaluator: string | null;
  evaluationDate: string | null;
}

export interface EvaluatestResultsResponse {
  applicationId: number;
  candidateId: number;
  positionId: number;
  status: string;
  evaluatedAt: string | null;
  invitedAt: string | null;
  variables: EvaluatestQualifiedVariable[];
}
