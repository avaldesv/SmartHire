/**
 * Pure assembler for Auto Generate job-description prompts (Appian-aligned).
 * No Angular inject / HTTP. Empty snapshot fields add no filler phrases.
 */

export type JobDescriptionPromptLanguage = 'es' | 'en';

export interface JobDescriptionPromptCatalogLabels {
  jobPortal?: Record<number, string>;
  educationLevel?: Record<number, string>;
  shift?: Record<number, string>;
  workplace?: Record<number, string>;
  contractType?: Record<number, string>;
  language?: Record<number, string>;
  languageLevel?: Record<number, string>;
}

export interface JobDescriptionPromptSnapshot {
  positionName?: unknown;
  jobPortalId?: unknown;
  publishedPortals?: unknown;
  recruiterEmail?: unknown;
  experienceIn?: unknown;
  minAge?: unknown;
  maxAge?: unknown;
  educationLevelId?: unknown;
  shiftId?: unknown;
  workdayStartTime?: unknown;
  workdayEndTime?: unknown;
  workplaceId?: unknown;
  contractTypeId?: unknown;
  city?: unknown;
  postalCode?: unknown;
  tradeName?: unknown;
  legalName?: unknown;
  languages?: unknown;
  hideSalary?: unknown;
  publishSalaryMin?: unknown;
  publishSalaryMax?: unknown;
  includeSoftSkills?: unknown;
  extraBenefitsText?: unknown;
  includeExtraBenefits?: unknown;
  includeProfessionalDevelopment?: unknown;
  includeKeywords?: unknown;
  clientExpansionDescription?: unknown;
  /** Present on the wizard; never concatenated (Appian flag off / P3). */
  responsibilityLevelId?: unknown;
}

export function catalogLabelMapFromOptions(
  options: { id: number; label: string }[] | undefined,
): Record<number, string> {
  const map: Record<number, string> = {};
  for (const opt of options ?? []) {
    const label = (opt.label ?? '').trim();
    if (opt.id > 0 && label) {
      map[opt.id] = label;
    }
  }
  return map;
}

const CLOSING =
  'En la respuesta no incluyas el nombre de la vacante, ni nada adicional a la publicación de la vacante.';

/**
 * Builds the Auto Generate prompt. Returns '' when `positionName` is missing
 * (UI warning lives in the field component).
 */
export function buildJobDescriptionPrompt(
  snapshot: JobDescriptionPromptSnapshot,
  labels: JobDescriptionPromptCatalogLabels,
  language: JobDescriptionPromptLanguage,
): string {
  const positionName = asTrimmedString(snapshot.positionName);
  if (!positionName) {
    return '';
  }

  let prompt = `Actúa como un especialista en reclutamiento y selección de personal experto y genera un perfil de empleo para la vacante de ${positionName}`;

  const destination = resolvePublicationDestination(snapshot, labels);
  if (destination) {
    prompt += `, para publicar en ${destination}`;
  }

  prompt +=
    ', que sea atractivo y persuasivo, positivo y motivador, personalizado y humano';

  const email = asTrimmedString(snapshot.recruiterEmail);
  if (email) {
    prompt += `. Indica que el correo para recibir cvs de la vacante es ${email}`;
  }

  const experience = asTrimmedString(snapshot.experienceIn);
  if (experience) {
    prompt += `. Indica que el perfil debe estar orientado o tener experiencia en la industria o sector ${experience}`;
  }

  const minAge = asNumber(snapshot.minAge);
  if (minAge != null) {
    const maxAge = asNumber(snapshot.maxAge);
    prompt += `. Indica que el perfil del candidato debe de estar en un rango de edad entre ${minAge}${
      maxAge != null ? ` - ${maxAge}` : ''
    }`;
  }

  const education = catalogLabel(labels.educationLevel, asId(snapshot.educationLevelId));
  if (education) {
    prompt += `. Indica en el perfil que el candidato debe de tener un nivel de escolaridad mínimo de ${education}`;
  }

  const schedule = resolveSchedule(snapshot, labels);
  if (schedule) {
    prompt += `. Incluye en el perfil que el horario de trabajo será ${schedule}`;
  }

  const workplace = catalogLabel(labels.workplace, asId(snapshot.workplaceId));
  if (workplace) {
    prompt += `. Incluye en el perfil que el lugar de trabajo será ${workplace}`;
  }

  const contractType = catalogLabel(labels.contractType, asId(snapshot.contractTypeId));
  if (contractType) {
    prompt += `. Incluye en el perfil que el tipo de contratación será ${contractType}`;
  }

  const city = asTrimmedString(snapshot.city);
  if (city) {
    prompt += `. Incluye en el perfil que el candidato debe vivir en una ubicación cercana a ${city}`;
    const postal = asTrimmedString(snapshot.postalCode);
    if (postal) {
      prompt += ` (codigo postal ${postal})`;
    }
  }

  const client = asTrimmedString(snapshot.tradeName) || asTrimmedString(snapshot.legalName);
  if (client) {
    prompt += `. Incluye en el perfil que la vacante está asociada al cliente ${client}`;
  }

  const languageLine = resolveLanguages(snapshot.languages, labels);
  if (languageLine) {
    prompt += `. Incluye en el perfil que el candidato debe tener dominio en los siguientes idiomas ${languageLine}`;
  }

  if (!asBool(snapshot.hideSalary)) {
    const salary = resolveSalaryRange(snapshot.publishSalaryMin, snapshot.publishSalaryMax);
    if (salary) {
      prompt += `. El sueldo estará en el rango de ${salary}`;
    }
  }

  if (asBool(snapshot.includeSoftSkills)) {
    prompt += '. Incluye en el perfil un desgloce de las habilidades blandas requeridas para el puesto';
  }

  const benefitsText = asTrimmedString(snapshot.extraBenefitsText);
  if (benefitsText) {
    prompt += `. Incluye en el perfil los beneficios adicionales de la vacante ${benefitsText}`;
  } else if (asBool(snapshot.includeExtraBenefits)) {
    prompt +=
      '. Incluye en el perfil un desgloce de beneficios adicionales que podrían ser aplicables para este puesto';
  }

  if (asBool(snapshot.includeProfessionalDevelopment)) {
    prompt += '. Incluye en el perfil desarrollo profesional que podría ser aplicable para este puesto';
  }

  if (asBool(snapshot.includeKeywords)) {
    prompt +=
      '. Incluye en el perfil palabras claves (hashtags) que hagan más atractiva la publicación de esta vacante';
  }

  const clientExpansion = asTrimmedString(snapshot.clientExpansionDescription);
  if (clientExpansion) {
    prompt += `. Complementa este perfil con la siguiente descripción de la vacante generada por el cliente ${clientExpansion}`;
  }

  prompt += `. ${CLOSING}`;

  return appendJobDescriptionLanguageInstruction(prompt, language);
}

export function jobDescriptionLanguageDisplayName(language: JobDescriptionPromptLanguage): string {
  return language === 'en' ? 'inglés' : 'español';
}

export function appendJobDescriptionLanguageInstruction(
  pregunta: string,
  language: JobDescriptionPromptLanguage,
): string {
  const trimmed = pregunta.trim().replace(/\.?\s*$/, '');
  return `${trimmed}. En idioma ${jobDescriptionLanguageDisplayName(language)}.`;
}

function resolvePublicationDestination(
  snapshot: JobDescriptionPromptSnapshot,
  labels: JobDescriptionPromptCatalogLabels,
): string | null {
  const names: string[] = [];
  const seen = new Set<number>();
  const pushId = (raw: unknown): void => {
    const id = asId(raw);
    if (id == null || seen.has(id)) {
      return;
    }
    const name = catalogLabel(labels.jobPortal, id);
    if (!name) {
      return;
    }
    seen.add(id);
    names.push(name);
  };

  pushId(snapshot.jobPortalId);
  if (Array.isArray(snapshot.publishedPortals)) {
    for (const row of snapshot.publishedPortals) {
      if (row && typeof row === 'object' && 'jobPortalId' in row) {
        pushId((row as { jobPortalId: unknown }).jobPortalId);
      }
    }
  }
  return names.length ? names.join(', ') : null;
}

function resolveSchedule(
  snapshot: JobDescriptionPromptSnapshot,
  labels: JobDescriptionPromptCatalogLabels,
): string | null {
  const parts: string[] = [];
  const shift = catalogLabel(labels.shift, asId(snapshot.shiftId));
  if (shift) {
    parts.push(shift);
  }
  const start = formatTime(snapshot.workdayStartTime);
  const end = formatTime(snapshot.workdayEndTime);
  if (start && end) {
    parts.push(`${start} - ${end}`);
  } else if (start) {
    parts.push(`desde ${start}`);
  } else if (end) {
    parts.push(`hasta ${end}`);
  }
  return parts.length ? parts.join(', ') : null;
}

function resolveLanguages(
  raw: unknown,
  labels: JobDescriptionPromptCatalogLabels,
): string | null {
  if (!Array.isArray(raw)) {
    return null;
  }
  const parts: string[] = [];
  for (const row of raw) {
    if (!row || typeof row !== 'object') {
      continue;
    }
    const rec = row as { languageId?: unknown; languageLevelId?: unknown };
    const lang = catalogLabel(labels.language, asId(rec.languageId));
    if (!lang) {
      continue;
    }
    const level = catalogLabel(labels.languageLevel, asId(rec.languageLevelId));
    parts.push(level ? `${lang} (${level})` : lang);
  }
  return parts.length ? parts.join(', ') : null;
}

function resolveSalaryRange(minRaw: unknown, maxRaw: unknown): string | null {
  const min = asNumber(minRaw);
  const max = asNumber(maxRaw);
  if (min == null && max == null) {
    return null;
  }
  if (min != null && max != null) {
    return `${min} - ${max}`;
  }
  return String(min ?? max);
}

function catalogLabel(map: Record<number, string> | undefined, id: number | null): string | null {
  if (id == null || !map) {
    return null;
  }
  const label = asTrimmedString(map[id]);
  return label || null;
}

function asTrimmedString(value: unknown): string | null {
  if (value == null) {
    return null;
  }
  const text = String(value).trim();
  return text ? text : null;
}

function asNumber(value: unknown): number | null {
  if (value == null || value === '') {
    return null;
  }
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function asId(value: unknown): number | null {
  const n = asNumber(value);
  return n != null && n > 0 ? n : null;
}

function asBool(value: unknown): boolean {
  return value === true || value === 'true' || value === 1;
}

function formatTime(value: unknown): string | null {
  if (value == null || value === '') {
    return null;
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return `${pad2(value.getHours())}:${pad2(value.getMinutes())}`;
  }
  const text = String(value).trim();
  const match = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(text);
  if (match) {
    return `${pad2(Number(match[1]))}:${match[2]}`;
  }
  return null;
}

function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}
