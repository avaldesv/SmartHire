export interface QuestionnaireCsvPanelConfig {
  catalogKey: string;
  label: string;
}

export const QUESTIONNAIRE_CSV_PANELS = {
  knowledgeCategories: {
    catalogKey: 'questionnaire-knowledge-categories',
    label: 'Categorías de conocimiento',
  },
  tags: {
    catalogKey: 'questionnaire-tags',
    label: 'Tags',
  },
  questions: {
    catalogKey: 'questionnaire-questions',
    label: 'Preguntas',
  },
  questionOptions: {
    catalogKey: 'questionnaire-question-options',
    label: 'Opciones de pregunta',
  },
  questionTags: {
    catalogKey: 'questionnaire-question-tags',
    label: 'Tags de pregunta',
  },
  questionnaires: {
    catalogKey: 'questionnaire-questionnaires',
    label: 'Cuestionarios',
  },
  questionnaireQuestions: {
    catalogKey: 'questionnaire-questionnaire-questions',
    label: 'Preguntas del cuestionario',
  },
  exams: {
    catalogKey: 'questionnaire-exams',
    label: 'Exámenes',
  },
  publish: {
    catalogKey: 'questionnaire-questionnaire-publish',
    label: 'Publicar cuestionarios',
  },
} as const satisfies Record<string, QuestionnaireCsvPanelConfig>;
