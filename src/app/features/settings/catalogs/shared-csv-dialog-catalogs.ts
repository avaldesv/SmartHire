/** Catalogs that already upsert through the shared CSV reader and use the gender dialog. */
const SHARED_CSV_DIALOG_KEYS = new Set<string>([
  'genders',
  'benefits',
  'branches',
  'brands',
  'business-units',
  'careers',
  'categories',
  'characteristics',
  'clients',
  'contract-types',
  'coverage-categories',
  'coverage-types',
  'currencies',
  'disability-types',
  'document-types',
  'education-levels',
  'experience-levels',
  'file-extensions',
  'general-categories',
  'job-portals',
  'language-levels',
  'marital-statuses',
  'position-types',
  'recruiter-groups',
  'requirements',
  'requisition-types',
  'responsibility-levels',
  'shifts',
  'states',
  'tools',
  'work-schedules',
  'workplaces',
  'countries',
  'municipalities',
  'neighborhoods',
  'languages',
  'kinships',
  'company-areas',
  'company-departments',
  'cancellation-types',
  'cancellation-reasons',
  'questionnaire-questions',
  'companies',
  'notification-templates',
  'ai-prompts',
]);

export function usesSharedCsvDialog(catalogKey: string): boolean {
  return SHARED_CSV_DIALOG_KEYS.has(catalogKey);
}

export function sharedCsvDownloadName(
  catalogKey: string,
  kind: 'valid' | 'invalid' | 'imported' | 'not-imported',
): string {
  return `${catalogKey}-${kind}.csv`;
}
