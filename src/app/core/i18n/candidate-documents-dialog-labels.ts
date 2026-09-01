/** i18n labels for candidate documents dialog. */

export const CANDIDATE_DOCS_DIALOG_TITLE = $localize`:@@candidateDocuments.title:Documentos del candidato`;
export const CANDIDATE_DOCS_DIALOG_CLOSE = $localize`:@@common.close:Cerrar`;
export const CANDIDATE_DOCS_DIALOG_EMPTY = $localize`:@@candidateDocuments.empty:No hay documentos registrados.`;
export const CANDIDATE_DOCS_COL_TYPE = $localize`:@@candidateDocuments.col.type:Tipo`;
export const CANDIDATE_DOCS_COL_FILE = $localize`:@@candidateDocuments.col.file:Archivo`;
export const CANDIDATE_DOCS_COL_SIZE = $localize`:@@candidateDocuments.col.size:Tamaño`;
export const CANDIDATE_DOCS_COL_STATUS = $localize`:@@candidateDocuments.col.status:Estado`;
export const CANDIDATE_DOCS_COL_VALIDATION = $localize`:@@candidateDocuments.col.validation:Validación`;
export const CANDIDATE_DOCS_COL_CREATED = $localize`:@@candidateDocuments.col.createdAt:Fecha`;
export const CANDIDATE_DOCS_COL_ACTIONS = $localize`:@@candidateDocuments.col.actions:Acciones`;
export const CANDIDATE_DOCS_DOWNLOAD = $localize`:@@candidateDocuments.download:Descargar`;
export const CANDIDATE_DOCS_VALIDATE = $localize`:@@candidateDocuments.validate:Validar documento`;
export const CANDIDATE_DOCS_MARK_VALIDATED = $localize`:@@candidateDocuments.markValidated:Marcar validado`;
export const CANDIDATE_DOCS_MARK_NOT_VALIDATED = $localize`:@@candidateDocuments.markNotValidated:Marcar no validado`;
export const CANDIDATE_DOCS_VALIDATION_PENDING = $localize`:@@candidateDocuments.validation.pending:pendiente`;
export const CANDIDATE_DOCS_VALIDATION_VALIDATED = $localize`:@@candidateDocuments.validation.validated:validado`;
export const CANDIDATE_DOCS_VALIDATION_NOT_VALIDATED = $localize`:@@candidateDocuments.validation.notValidated:no valido`;
export const CANDIDATE_DOCS_MARK_AS_VALIDATED = $localize`:@@candidateDocuments.markAsValidated:Marcar como validado`;
export const CANDIDATE_DOCS_MARK_AS_NOT_VALID = $localize`:@@candidateDocuments.markAsNotValid:Marcar como no valido`;
export const CANDIDATE_DOCS_REQUIRED_BADGE = $localize`:@@candidateDocuments.requiredBadge:Obligatorio`;
export const CANDIDATE_DOCS_INVALIDATE_TITLE = $localize`:@@candidateDocuments.invalidate.title:Documento no validado`;
export const CANDIDATE_DOCS_INVALIDATE_REASON = $localize`:@@candidateDocuments.invalidate.reason:Motivo`;
export const CANDIDATE_DOCS_INVALIDATE_CONFIRM = $localize`:@@candidateDocuments.invalidate.confirm:Confirmar`;
export const CANDIDATE_DOCS_INVALIDATE_CANCEL = $localize`:@@common.cancel:Cancelar`;
export const CANDIDATE_DOCS_ERRORS_LIST = $localize`:@@candidateDocuments.errors.list:No se pudieron cargar los documentos`;
export const CANDIDATE_DOCS_ERRORS_DOWNLOAD = $localize`:@@candidateDocuments.errors.download:No se pudo descargar el documento`;
export const CANDIDATE_DOCS_ERRORS_VALIDATE = $localize`:@@candidateDocuments.errors.validate:No se pudo actualizar la validación del documento`;
export const CANDIDATE_DOCS_SUCCESS_VALIDATE = $localize`:@@candidateDocuments.success.validate:Validación del documento actualizada`;
export const CANDIDATE_DOCS_EM_DASH = $localize`:@@common.emDash:—`;

export const CANDIDATE_DOCS_MISSING_FILE = $localize`:@@candidateDocuments.missing.file:Documento no entregado`;
export const CANDIDATE_DOCS_VALIDATION_MISSING = $localize`:@@candidateDocuments.validation.missing:faltante`;
export const CANDIDATE_DOCS_UPLOAD = $localize`:@@candidateDocuments.upload:Subir documento`;
export const CANDIDATE_DOCS_UPLOADING = $localize`:@@candidateDocuments.uploading:Subiendo…`;
export const CANDIDATE_DOCS_UPLOAD_SUCCESS = $localize`:@@candidateDocuments.upload.success:Documento subido correctamente`;
export const CANDIDATE_DOCS_UPLOAD_ERROR = $localize`:@@candidateDocuments.upload.error:No se pudo subir el documento`;
export const CANDIDATE_DOCS_SUMMARY_REQUIRED = $localize`:@@candidateDocuments.summary.required:Obligatorios entregados`;
export const CANDIDATE_DOCS_SUMMARY_MISSING = $localize`:@@candidateDocuments.summary.missing:pendientes de subir`;
export const CANDIDATE_DOCS_CHOOSE_FILE = $localize`:@@candidateDocuments.chooseFile:Seleccionar archivo`;

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
