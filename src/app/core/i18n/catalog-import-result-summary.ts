const GROUPED_QUESTIONNAIRE_CATALOGS = new Set([
  'questionnaire-question-options',
  'questionnaire-questionnaire-questions',
  'questionnaire-question-tags',
  'questionnaire-questionnaire-publish',
]);

function importErrorSuffix(failed: number): string {
  if (failed === 0) {
    return $localize`:@@catalogImport.resultNoErrors: Sin errores.`;
  }
  return $localize`:@@catalogImport.resultWithErrors: Filas con error: ${failed}:failed:.`;
}

export function catalogImportResultSummary(
  catalogKey: string,
  created: number,
  updated: number,
  failed: number,
): string {
  const errors = importErrorSuffix(failed);

  switch (catalogKey) {
    case 'questionnaire-question-options':
      return (
        $localize`:@@catalogImport.resultSummary.questionOptions:Se importaron ${created}:options: opciones en ${updated}:questions: preguntas.` +
        ' ' +
        errors
      );
    case 'questionnaire-questionnaire-questions':
      return (
        $localize`:@@catalogImport.resultSummary.questionnaireQuestions:Se vincularon ${created}:links: preguntas en ${updated}:questionnaires: cuestionarios.` +
        ' ' +
        errors
      );
    case 'questionnaire-question-tags':
      return (
        $localize`:@@catalogImport.resultSummary.questionTags:Se asignaron ${created}:tags: tags en ${updated}:questions: preguntas.` +
        ' ' +
        errors
      );
    case 'questionnaire-questionnaire-publish':
      return (
        $localize`:@@catalogImport.resultSummary.questionnairePublish:Se publicaron ${updated}:questionnaires: cuestionarios.` +
        ' ' +
        errors
      );
    default:
      return (
        $localize`:@@catalogImport.resultSummary.default:Nuevos: ${created}:created: · Actualizados: ${updated}:updated:.` +
        ' ' +
        errors
      );
  }
}

export function isGroupedQuestionnaireImport(catalogKey: string): boolean {
  return GROUPED_QUESTIONNAIRE_CATALOGS.has(catalogKey);
}
