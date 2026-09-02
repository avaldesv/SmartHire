/** Pipeline stages for candidate applications (selection / tracking). */

export const CANDIDATE_APPLICATION_STATUS = {
  APPLIED: 'APPLIED',
  PRESELECTED: 'PRESELECTED',
  SELECTED: 'SELECTED',
  PREHIRED: 'PREHIRED',
  HIRED: 'HIRED',
  RELEASED: 'RELEASED',
} as const;

/** Stages selectable when changing status from the preselection screen. */
export const CANDIDATE_APPLICATION_STAGES = [
  CANDIDATE_APPLICATION_STATUS.PRESELECTED,
  CANDIDATE_APPLICATION_STATUS.SELECTED,
  CANDIDATE_APPLICATION_STATUS.PREHIRED,
  CANDIDATE_APPLICATION_STATUS.HIRED,
  CANDIDATE_APPLICATION_STATUS.RELEASED,
] as const;

export type CandidateApplicationStage = typeof CANDIDATE_APPLICATION_STAGES[number];

export const CANDIDATE_APPLICATION_STAGE_LABELS: Record<string, string> = {
  APPLIED: $localize`:@@candidateApplication.stage.applied:Postulado`,
  PRESELECTED: $localize`:@@candidateApplication.stage.preselected:Preseleccionado`,
  PRESELECTION: $localize`:@@candidateApplication.stage.preselection:Preselección`,
  SELECTED: $localize`:@@candidateApplication.stage.selected:Seleccionado`,
  PREHIRED: $localize`:@@candidateApplication.stage.prehired:Precontratado`,
  INTERVIEW: $localize`:@@candidateApplication.stage.interview:Entrevista`,
  EVALUATION: $localize`:@@candidateApplication.stage.evaluation:Evaluación`,
  DOCUMENTS: $localize`:@@candidateApplication.stage.documents:Documentos`,
  HIRED: $localize`:@@candidateApplication.stage.hired:Contratado`,
  RELEASED: $localize`:@@candidateApplication.stage.released:Liberado`,
};

export function getCandidateApplicationStageLabel(status: string | null | undefined): string {
  if (!status?.trim()) {
    return '—';
  }
  const key = status.trim().toUpperCase();
  return CANDIDATE_APPLICATION_STAGE_LABELS[key] ?? status;
}

export const PRESELECTION_CHANGEABLE_STAGES: readonly CandidateApplicationStage[] = CANDIDATE_APPLICATION_STAGES;

/** Checkbox «seleccionado»: status SELECTED (o legacy isSelected en PRESELECTED). */
export function isApplicationSelected(
  app: { status?: string | null; isSelected?: boolean | null },
): boolean {
  const status = app.status?.trim().toUpperCase() ?? '';
  if (status === CANDIDATE_APPLICATION_STATUS.SELECTED) {
    return true;
  }
  return Boolean(app.isSelected) && status === CANDIDATE_APPLICATION_STATUS.PRESELECTED;
}
