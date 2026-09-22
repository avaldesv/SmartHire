/**
 * Pure assembler/parser for job-requirements AI (Appian-aligned JSON).
 * No Angular inject / HTTP.
 */

import {
  appendJobDescriptionLanguageInstruction,
  jobDescriptionLanguageDisplayName,
  type JobDescriptionPromptLanguage,
} from './build-job-description-prompt';

export type JobRequirementsPromptLanguage = JobDescriptionPromptLanguage;

export interface JobRequirementsPromptInput {
  positionName?: unknown;
  jobDescription?: unknown;
}

/** Three requirement texts per type (mandatory / optional / desirable). */
export interface JobRequirementsTriple {
  mandatory: [string, string, string];
  optional: [string, string, string];
  desirable: [string, string, string];
}

export interface JobRequirementsTextBlocks {
  mandatory: string;
  optional: string;
  desirable: string;
}

const TRANSLATE_HEADERS = {
  mandatory: 'OBLIGATORIOS:',
  optional: 'OPCIONALES:',
  desirable: 'DESEABLES:',
} as const;

const JSON_SCHEMA_EXAMPLE = `{
  "type_document": "json",
  "nombre de la vacante": "{NOMBRE_PUESTO}",
  "tipo_de_requisitos": {
    "obligatorios": {
      "requisito1": "",
      "requisito2": "",
      "requisito3": ""
    },
    "opcionales": {
      "requisito1": "",
      "requisito2": "",
      "requisito3": ""
    },
    "deseables": {
      "requisito1": "",
      "requisito2": "",
      "requisito3": ""
    }
  }
}`;

/**
 * Builds the Generate prompt. Returns '' when `positionName` is missing
 * (UI warning lives in the field component).
 */
export function buildJobRequirementsPrompt(
  input: JobRequirementsPromptInput,
  language: JobRequirementsPromptLanguage,
): string {
  const positionName = asTrimmedString(input.positionName);
  if (!positionName) {
    return '';
  }

  const schema = JSON_SCHEMA_EXAMPLE.replace('{NOMBRE_PUESTO}', escapeForPrompt(positionName));
  let prompt =
    `Actúa como un especialista experto en reclutamiento y selección de personal y ayúdame a obtener los ` +
    `requisitos que debe de cubrir un candidato para poder cubrir la vacante de: '${escapeForPrompt(positionName)}'`;

  const jobDescription = asTrimmedString(input.jobDescription);
  if (jobDescription) {
    prompt +=
      `. Complementa con la siguiente descripción del puesto: ${escapeForPrompt(jobDescription)}`;
  }

  prompt +=
    `. Agrupa dichos requisitos en obligatorios, opcionales y deseables. ` +
    `Siempre debes ofrecer exactamente 3 requisitos obligatorios, 3 opcionales y 3 deseables, ` +
    `y deben de ayudar a poder seleccionar correctamente a los candidatos que puedan cubrir esta vacante. ` +
    `En la llave tipo_de_requisitos incluye todos los tipos (obligatorios, opcionales y deseables); ` +
    `no resumas ni omitas ningún objeto. ` +
    `Para la respuesta genera un JSON UTF-8 basándote en la siguiente estructura. ` +
    `Responde únicamente con el JSON completo, no excluyas ninguna llave y no incluyas ninguna otra ` +
    `información, comentario ni cercas de markdown: ${schema}`;

  return appendJobDescriptionLanguageInstruction(prompt, language);
}

/**
 * Reads the chat message into nine requirement strings.
 * Accepts markdown fences and either a `tipo_de_requisitos` wrapper or top-level blocks.
 * Returns null when JSON is invalid, incomplete, or any requirement is empty.
 */
export function parseJobRequirementsJson(message: string): JobRequirementsTriple | null {
  const raw = stripMarkdownFence(message);
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isRecord(parsed)) {
    return null;
  }

  const container = isRecord(parsed['tipo_de_requisitos'])
    ? parsed['tipo_de_requisitos']
    : parsed;

  const mandatory = readRequirementBlock(container['obligatorios']);
  const optional = readRequirementBlock(container['opcionales']);
  const desirable = readRequirementBlock(container['deseables']);
  if (!mandatory || !optional || !desirable) {
    return null;
  }
  return { mandatory, optional, desirable };
}

/** Joins three requirement texts as editable bullet lines. */
export function formatRequirementsBlock(items: readonly string[]): string {
  return items.map((item) => `- ${item.trim()}`).join('\n');
}

export function formatJobRequirementsTriple(triple: JobRequirementsTriple): JobRequirementsTextBlocks {
  return {
    mandatory: formatRequirementsBlock(triple.mandatory),
    optional: formatRequirementsBlock(triple.optional),
    desirable: formatRequirementsBlock(triple.desirable),
  };
}

export function buildJobRequirementsTranslatePrompt(
  blocks: JobRequirementsTextBlocks,
  language: JobRequirementsPromptLanguage,
): string {
  const body = [
    `${TRANSLATE_HEADERS.mandatory}`,
    asTrimmedString(blocks.mandatory),
    '',
    `${TRANSLATE_HEADERS.optional}`,
    asTrimmedString(blocks.optional),
    '',
    `${TRANSLATE_HEADERS.desirable}`,
    asTrimmedString(blocks.desirable),
    '',
    `Traducir el texto anterior al idioma: ${jobDescriptionLanguageDisplayName(language)}.`,
    'Conservar las etiquetas OBLIGATORIOS / OPCIONALES / DESEABLES exactamente.',
  ].join('\n');
  return body;
}

/**
 * Splits a labeled translation response into the three textareas.
 * Returns null if any of the three headers is missing.
 */
export function splitTranslatedRequirements(message: string): JobRequirementsTextBlocks | null {
  const text = (message ?? '').replace(/\r\n/g, '\n');
  const mandatory = sliceBetweenHeaders(text, TRANSLATE_HEADERS.mandatory, TRANSLATE_HEADERS.optional);
  const optional = sliceBetweenHeaders(text, TRANSLATE_HEADERS.optional, TRANSLATE_HEADERS.desirable);
  const desirable = sliceAfterHeader(text, TRANSLATE_HEADERS.desirable);
  if (mandatory === null || optional === null || desirable === null) {
    return null;
  }
  return { mandatory, optional, desirable };
}

function readRequirementBlock(value: unknown): [string, string, string] | null {
  if (!isRecord(value)) {
    return null;
  }
  const r1 = asTrimmedString(value['requisito1']);
  const r2 = asTrimmedString(value['requisito2']);
  const r3 = asTrimmedString(value['requisito3']);
  if (!r1 || !r2 || !r3) {
    return null;
  }
  return [r1, r2, r3];
}

function stripMarkdownFence(message: string): string {
  const trimmed = (message ?? '').trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return (fenced ? fenced[1] : trimmed).trim();
}

function sliceBetweenHeaders(text: string, startHeader: string, endHeader: string): string | null {
  const start = indexOfHeader(text, startHeader);
  const end = indexOfHeader(text, endHeader);
  if (start < 0 || end < 0 || end <= start) {
    return null;
  }
  return text.slice(start + startHeader.length, end).trim();
}

function sliceAfterHeader(text: string, header: string): string | null {
  const start = indexOfHeader(text, header);
  if (start < 0) {
    return null;
  }
  return text.slice(start + header.length).trim();
}

function indexOfHeader(text: string, header: string): number {
  return text.toUpperCase().indexOf(header.toUpperCase());
}

function asTrimmedString(value: unknown): string {
  if (value == null) {
    return '';
  }
  return String(value).trim();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function escapeForPrompt(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}
