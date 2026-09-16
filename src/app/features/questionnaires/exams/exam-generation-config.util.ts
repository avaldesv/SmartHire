export interface ExamGenerationConfig {
  difficultyMin?: number;
  difficultyMax?: number;
  questionTypes?: string[];
  knowledgeCategoryIds?: number[];
  tagIds?: number[];
  excludeQuestionIds?: number[];
}

const KNOWN_KEYS = new Set([
  'difficultyMin',
  'difficultyMax',
  'questionTypes',
  'knowledgeCategoryIds',
  'tagIds',
  'excludeQuestionIds',
]);

export interface ParsedGenerationConfig {
  config: ExamGenerationConfig;
  hasUnsupportedKeys: boolean;
  rawJson: string;
}

export function parseGenerationConfig(json: string | null | undefined): ParsedGenerationConfig {
  const empty: ParsedGenerationConfig = { config: {}, hasUnsupportedKeys: false, rawJson: '{}' };
  if (json == null || json.trim() === '' || json.trim() === '{}') {
    return empty;
  }
  try {
    const parsed = JSON.parse(json) as Record<string, unknown>;
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return { config: {}, hasUnsupportedKeys: true, rawJson: json };
    }
    const hasUnsupportedKeys = Object.keys(parsed).some((key) => !KNOWN_KEYS.has(key));
    const config: ExamGenerationConfig = {};
    if (typeof parsed['difficultyMin'] === 'number') {
      config.difficultyMin = parsed['difficultyMin'];
    }
    if (typeof parsed['difficultyMax'] === 'number') {
      config.difficultyMax = parsed['difficultyMax'];
    }
    if (Array.isArray(parsed['questionTypes'])) {
      config.questionTypes = parsed['questionTypes'].filter((t): t is string => typeof t === 'string');
    }
    if (Array.isArray(parsed['knowledgeCategoryIds'])) {
      config.knowledgeCategoryIds = parsed['knowledgeCategoryIds'].filter(
        (id): id is number => typeof id === 'number',
      );
    }
    if (Array.isArray(parsed['tagIds'])) {
      config.tagIds = parsed['tagIds'].filter((id): id is number => typeof id === 'number');
    }
    if (Array.isArray(parsed['excludeQuestionIds'])) {
      config.excludeQuestionIds = parsed['excludeQuestionIds'].filter(
        (id): id is number => typeof id === 'number',
      );
    }
    return { config, hasUnsupportedKeys, rawJson: json };
  } catch {
    return { config: {}, hasUnsupportedKeys: true, rawJson: json };
  }
}

export function buildGenerationConfigJson(config: ExamGenerationConfig): string | null {
  const out: ExamGenerationConfig = {};
  if (config.difficultyMin != null) {
    out.difficultyMin = config.difficultyMin;
  }
  if (config.difficultyMax != null) {
    out.difficultyMax = config.difficultyMax;
  }
  if (config.questionTypes?.length) {
    out.questionTypes = config.questionTypes;
  }
  if (config.knowledgeCategoryIds?.length) {
    out.knowledgeCategoryIds = config.knowledgeCategoryIds;
  }
  if (config.tagIds?.length) {
    out.tagIds = config.tagIds;
  }
  if (config.excludeQuestionIds?.length) {
    out.excludeQuestionIds = config.excludeQuestionIds;
  }
  if (Object.keys(out).length === 0) {
    return null;
  }
  return JSON.stringify(out);
}

export interface ExamEligibleQuestion {
  questionId: number;
  type?: string | null;
  knowledgeCategoryId?: number | null;
  difficulty?: number | null;
  tagIds?: number[];
}

export function countEligibleQuestions(
  questions: ExamEligibleQuestion[],
  generationConfigJson: string | null | undefined,
): number {
  const { config } = parseGenerationConfig(generationConfigJson);
  return questions.filter((question) => isQuestionEligible(question, config)).length;
}

export function isQuestionEligible(question: ExamEligibleQuestion, config: ExamGenerationConfig): boolean {
  if (config.excludeQuestionIds?.includes(question.questionId)) {
    return false;
  }
  if (config.questionTypes?.length) {
    if (!question.type || !config.questionTypes.includes(question.type)) {
      return false;
    }
  }
  if (config.knowledgeCategoryIds?.length) {
    if (
      question.knowledgeCategoryId == null ||
      !config.knowledgeCategoryIds.includes(question.knowledgeCategoryId)
    ) {
      return false;
    }
  }
  if (config.tagIds?.length) {
    const questionTags = question.tagIds ?? [];
    if (!questionTags.length || !config.tagIds.some((tagId) => questionTags.includes(tagId))) {
      return false;
    }
  }
  if (config.difficultyMin != null || config.difficultyMax != null) {
    if (question.difficulty == null) {
      return false;
    }
    if (config.difficultyMin != null && question.difficulty < config.difficultyMin) {
      return false;
    }
    if (config.difficultyMax != null && question.difficulty > config.difficultyMax) {
      return false;
    }
  }
  return true;
}

export function formatGenerationConfigPreview(json: string | null): string {
  if (!json || json.trim() === '') {
    return '{}';
  }
  try {
    return JSON.stringify(JSON.parse(json), null, 2);
  } catch {
    return json;
  }
}
