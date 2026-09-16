export interface QuestionnaireCsvPanelConfig {
  catalogKey: string;
  label: string;
}

export const QUESTIONNAIRE_CSV_PANELS = {
  knowledgeCategories: {
    catalogKey: 'questionnaire-knowledge-categories',
    label: $localize`:@@questionnaires.csv.knowledgeCategories:Categorías de conocimiento`,
  },
  tags: {
    catalogKey: 'questionnaire-tags',
    label: $localize`:@@questionnaires.csv.tags:Tags`,
  },
  questions: {
    catalogKey: 'questionnaire-questions',
    label: $localize`:@@questionnaires.csv.questions:Preguntas`,
  },
  questionOptions: {
    catalogKey: 'questionnaire-question-options',
    label: $localize`:@@questionnaires.csv.questionOptions:Opciones de pregunta`,
  },
  questionTags: {
    catalogKey: 'questionnaire-question-tags',
    label: $localize`:@@questionnaires.csv.questionTags:Tags de pregunta`,
  },
  questionnaires: {
    catalogKey: 'questionnaire-questionnaires',
    label: $localize`:@@questionnaires.csv.questionnaires:Cuestionarios`,
  },
  questionnaireQuestions: {
    catalogKey: 'questionnaire-questionnaire-questions',
    label: $localize`:@@questionnaires.csv.questionnaireQuestions:Preguntas del cuestionario`,
  },
  exams: {
    catalogKey: 'questionnaire-exams',
    label: $localize`:@@questionnaires.csv.exams:Exámenes`,
  },
  publish: {
    catalogKey: 'questionnaire-questionnaire-publish',
    label: $localize`:@@questionnaires.csv.publish:Publicar cuestionarios`,
  },
} as const satisfies Record<string, QuestionnaireCsvPanelConfig>;
