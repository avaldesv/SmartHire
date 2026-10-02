export interface EvaluatestBatteryCompetenceItem {
  id: number;
  name?: string | null;
  level?: number | null;
  required?: boolean | null;
}

export interface EvaluatestBatteryTestItem {
  id: number;
  name?: string | null;
  mandatory?: boolean | null;
  isTestEsic?: boolean | null;
  avgTimeMinutes?: number | null;
}

export interface EvaluatestBatteryCatalogOption {
  id: number;
  name?: string | null;
}

export interface EvaluatestBatteryResponse {
  positionId: number;
  jobName?: string | null;
  competenceModelId?: number | null;
  competenceModelName?: string | null;
  jobLevelId?: number | null;
  selectionJobPatternId?: number | null;
  evaluatestJobProfileId: number;
  isCompetenceEvaluation?: boolean | null;
  mandatoryWeight?: number | null;
  desirableWeight?: number | null;
  currentCompetences: EvaluatestBatteryCompetenceItem[];
  currentTests: EvaluatestBatteryTestItem[];
  availableCompetences: EvaluatestBatteryCatalogOption[];
  availableTests: EvaluatestBatteryCatalogOption[];
}

export interface UpdateEvaluatestBatteryRequest {
  isCompetenceEvaluation?: boolean | null;
  mandatoryWeight?: number | null;
  desirableWeight?: number | null;
  competences: EvaluatestBatteryCompetenceItem[];
  tests: EvaluatestBatteryTestItem[];
}
