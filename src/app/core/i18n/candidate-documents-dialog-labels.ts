/** i18n labels for candidate documents dialog. */

export const CANDIDATE_DOCS_DIALOG_TITLE = $localize`:@@candidateDocuments.title:Documentos del candidato`;
export const CANDIDATE_DOCS_DIALOG_CLOSE = $localize`:@@common.close:Cerrar`;
export const CANDIDATE_DOCS_DIALOG_EMPTY = $localize`:@@candidateDocuments.empty:No hay documentos registrados.`;
export const CANDIDATE_DOCS_COL_TYPE = $localize`:@@candidateDocuments.col.type:Tipo`;
export const CANDIDATE_DOCS_COL_FILE = $localize`:@@candidateDocuments.col.file:Archivo`;
export const CANDIDATE_DOCS_COL_SIZE = $localize`:@@candidateDocuments.col.size:Tamaño`;
export const CANDIDATE_DOCS_COL_STATUS = $localize`:@@candidateDocuments.col.status:Estado`;
export const CANDIDATE_DOCS_COL_CREATED = $localize`:@@candidateDocuments.col.createdAt:Fecha`;
export const CANDIDATE_DOCS_COL_ACTIONS = $localize`:@@candidateDocuments.col.actions:Acciones`;
export const CANDIDATE_DOCS_DOWNLOAD = $localize`:@@candidateDocuments.download:Descargar`;
export const CANDIDATE_DOCS_ERRORS_LIST = $localize`:@@candidateDocuments.errors.list:No se pudieron cargar los documentos`;
export const CANDIDATE_DOCS_ERRORS_DOWNLOAD = $localize`:@@candidateDocuments.errors.download:No se pudo descargar el documento`;
export const CANDIDATE_DOCS_EM_DASH = $localize`:@@common.emDash:—`;

export function candidateDocumentsSizeLabel(bytes: number | null | undefined): string {
  if (bytes == null || bytes <= 0) {
    return CANDIDATE_DOCS_EM_DASH;
  }
  if (bytes < 1024) {
    return $localize`:@@candidateDocuments.sizeBytes:${bytes}:bytes: B`;
  }
  const kb = bytes / 1024;
  if (kb < 1024) {
    return $localize`:@@candidateDocuments.sizeKb:${kb.toFixed(1)}:size: KB`;
  }
  const mb = kb / 1024;
  return $localize`:@@candidateDocuments.sizeMb:${mb.toFixed(1)}:size: MB`;
}
