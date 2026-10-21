export function catalogImportTitle(catalogLabel: string): string {
  return $localize`:@@catalogImport.title:Importar ${catalogLabel}:catalogLabel:`;
}

export const CATALOG_IMPORT_HINT = $localize`:@@catalogImport.hint:Descargue la plantilla, complete los datos y suba el archivo CSV. Al seleccionar el archivo se valida automáticamente; Importar escribe solo las filas válidas.`;
export const CATALOG_IMPORT_DOWNLOAD_TEMPLATE = $localize`:@@catalogImport.downloadTemplate:Descargar plantilla`;
export const CATALOG_IMPORT_PICK_FILE = $localize`:@@catalogImport.pickFile:Seleccionar archivo`;
export const CATALOG_IMPORT_DOWNLOAD_ERRORS = $localize`:@@catalogImport.downloadErrors:Descargar reporte de errores`;
export const CATALOG_IMPORT_DOWNLOAD_PREVIEW_ERRORS = $localize`:@@catalogImport.downloadPreviewErrors:Descargar preview de errores`;
export const CATALOG_IMPORT_CLOSE = $localize`:@@common.close:Cerrar`;
export const CATALOG_IMPORT_VALIDATE = $localize`:@@catalogImport.validate:Validar`;
export const CATALOG_IMPORT_IMPORT = $localize`:@@catalogImport.import:Importar`;
export const CATALOG_IMPORT_ONLY_VALID_HINT = $localize`:@@catalogImport.onlyValidHint:Solo se importarán las filas válidas.`;
export const CATALOG_IMPORT_NO_VALID_ROWS = $localize`:@@catalogImport.noValidRows:No hay filas válidas para importar.`;
export const CATALOG_IMPORT_COL_ID = $localize`:@@catalogImport.col.id:Id`;
export const CATALOG_IMPORT_COL_CODE = $localize`:@@catalogImport.col.code:Código`;
export const CATALOG_IMPORT_COL_NAME = $localize`:@@catalogImport.col.name:Nombre`;
export const CATALOG_IMPORT_COL_COUNTRY = $localize`:@@catalogImport.col.countryId:País`;
export const CATALOG_IMPORT_EXPORT_TOOLTIP = $localize`:@@catalogImport.exportTooltip:Exportar CSV`;
export const CATALOG_IMPORT_IMPORT_TOOLTIP = $localize`:@@catalogImport.importTooltip:Importar CSV`;

export const CATALOG_IMPORT_TEMPLATE_ERROR = $localize`:@@catalogImport.errors.templateDownload:No se pudo descargar la plantilla.`;
export const CATALOG_IMPORT_SELECT_FILE = $localize`:@@catalogImport.errors.selectFile:Seleccione un archivo CSV.`;
export const CATALOG_IMPORT_VALIDATE_ERROR = $localize`:@@catalogImport.errors.validate:No se pudo validar el archivo.`;
export const CATALOG_IMPORT_IMPORT_ERROR = $localize`:@@catalogImport.errors.import:No se pudo importar el archivo.`;
export const CATALOG_IMPORT_EXPORT_ERROR = $localize`:@@catalogImport.errors.export:No se pudo exportar el catálogo`;
export const CATALOG_IMPORT_COMPLETE = $localize`:@@catalogImport.success.importComplete:Importación finalizada`;
export const CATALOG_IMPORT_SNACK_CLOSE = $localize`:@@common.close:Cerrar`;

export const CATALOG_IMPORT_STRUCTURE_LABEL = $localize`:@@catalogImport.structureLabel:Estructura`;
export const CATALOG_IMPORT_STRUCTURE_VALID_VALUE = $localize`:@@catalogImport.structureValidValue:válida`;
export const CATALOG_IMPORT_STRUCTURE_INVALID_VALUE = $localize`:@@catalogImport.structureInvalidValue:inválida`;
export const CATALOG_IMPORT_STRUCTURE_PENDING_VALUE = $localize`:@@catalogImport.structurePendingValue:—`;
export const CATALOG_IMPORT_ROWS_DETECTED = $localize`:@@catalogImport.rowsDetected:Filas detectadas`;
/** Prefix only; column names stay as returned by the API (technical). */
export const CATALOG_IMPORT_MISSING_COLUMNS_PREFIX = $localize`:@@catalogImport.missingRequiredColumns:Faltan columnas requeridas:`;

const MISSING_REQUIRED_COLUMNS_EN = 'Missing required columns:';

/** Localize known CSV structure error prefixes; leave technical column names intact. */
export function localizeCatalogCsvStructureError(raw: string): string {
  const idx = raw.indexOf(MISSING_REQUIRED_COLUMNS_EN);
  if (idx >= 0) {
    return (
      raw.slice(0, idx) +
      CATALOG_IMPORT_MISSING_COLUMNS_PREFIX +
      raw.slice(idx + MISSING_REQUIRED_COLUMNS_EN.length)
    );
  }
  return raw;
}

export function localizeCatalogCsvStructureErrors(errors: string[]): string {
  return errors.map(localizeCatalogCsvStructureError).filter(Boolean).join(' ');
}

export const CATALOG_IMPORT_GENDER_HINT = $localize`:@@catalogImport.gender.hint:Descargue la plantilla, complete los datos y suba el archivo CSV. Al seleccionar el archivo se valida automáticamente; se importarán solo las filas válidas.`;
export const CATALOG_IMPORT_GENDER_SUMMARY_VALIDATION = $localize`:@@catalogImport.gender.summaryValidation:Resumen global de validaciones`;
export const CATALOG_IMPORT_GENDER_SUMMARY_BY_ROWS = $localize`:@@catalogImport.gender.summaryByRows:Resumen de validaciones`;
export const CATALOG_IMPORT_GENDER_SUMMARY_IMPORT = $localize`:@@catalogImport.gender.summaryImport:Resumen de importaciones`;
export const CATALOG_IMPORT_GENDER_DOWNLOAD_ITEMS = $localize`:@@catalogImport.gender.downloadItems:Descargar ítems`;
export const CATALOG_IMPORT_GENDER_VALID_ROWS = $localize`:@@catalogImport.gender.validRows:Filas válidas`;
export const CATALOG_IMPORT_GENDER_INVALID_ROWS = $localize`:@@catalogImport.gender.invalidRows:Filas inválidas`;
export const CATALOG_IMPORT_GENDER_IMPORTED_ROWS = $localize`:@@catalogImport.gender.importedRows:Filas importadas`;
export const CATALOG_IMPORT_GENDER_NOT_IMPORTED_ROWS = $localize`:@@catalogImport.gender.notImportedRows:Filas no importadas`;
export const CATALOG_IMPORT_GENDER_NOTICE_NO_FILE = $localize`:@@catalogImport.gender.noticeNoFile:Hay que elegir un archivo.`;
export const CATALOG_IMPORT_GENDER_NOTICE_HEADER_ONLY = $localize`:@@catalogImport.gender.noticeHeaderOnly:No hay filas que validar. El archivo solo tiene la cabecera.`;
export const CATALOG_IMPORT_GENDER_NOTICE_EMPTY = $localize`:@@catalogImport.gender.noticeEmpty:El fichero no trae cabecera.`;
export const CATALOG_IMPORT_GENDER_PARTIAL = $localize`:@@catalogImport.gender.partial:La importación quedó parcial: no se importaron todas las filas.`;
export const CATALOG_IMPORT_GENDER_NONE = $localize`:@@catalogImport.gender.noneImported:No se importó ninguna fila.`;

const GENDER_ISSUE_LABELS: Record<string, string> = {
  'legacy-id-conflict': $localize`:@@catalogImport.gender.issue.legacyIdConflict:El legacyId ya está asignado a otro género o está repetido en el CSV.`,
  'business-key-duplicate': $localize`:@@catalogImport.gender.issue.businessKeyDuplicate:Hay más de una fila con la misma clave de negocio. Deje solo la primera.`,
  'global-country-not-allowed': $localize`:@@catalogImport.gender.issue.globalCountryNotAllowed:En alcance GLOBAL el país debe ir vacío.`,
  'code-too-long': $localize`:@@catalogImport.gender.issue.codeTooLong:El código supera 32 caracteres.`,
  'name-too-long': $localize`:@@catalogImport.gender.issue.nameTooLong:El nombre supera 255 caracteres.`,
  'value-too-long': $localize`:@@catalogImport.gender.issue.valueTooLong:El valor supera 64 caracteres.`,
  'is-active-invalid': $localize`:@@catalogImport.gender.issue.isActiveInvalid:Solo se importan filas activas (isActive = true).`,
  'scope-invalid': $localize`:@@catalogImport.gender.issue.scopeInvalid:El alcance debe ser TENANT o GLOBAL. Vacío se toma como TENANT.`,
  'country-not-found': $localize`:@@catalogImport.gender.issue.countryNotFound:El país no existe o está eliminado.`,
  'row-too-short': $localize`:@@catalogImport.gender.issue.rowTooShort:La fila trae menos celdas que la cabecera.`,
  'row-too-long': $localize`:@@catalogImport.gender.issue.rowTooLong:La fila trae más celdas que la cabecera.`,
  'blank-row': $localize`:@@catalogImport.gender.issue.blankRow:Hay una línea vacía en el CSV.`,
  'missing-column': $localize`:@@catalogImport.gender.issue.missingColumn:El CSV no trae todas las columnas obligatorias.`,
  'duplicate-column': $localize`:@@catalogImport.gender.issue.duplicateColumn:Hay una columna repetida.`,
  'empty-file': $localize`:@@catalogImport.gender.issue.emptyFile:El fichero no trae cabecera.`,
  'bad-separator': $localize`:@@catalogImport.gender.issue.badSeparator:El separador debe ser punto y coma.`,
  'unclosed-quote': $localize`:@@catalogImport.gender.issue.unclosedQuote:Hay comillas sin cerrar.`,
  'invalid-encoding': $localize`:@@catalogImport.gender.issue.invalidEncoding:El fichero debe estar en UTF-8.`,
  'code-required': $localize`:@@catalogImport.gender.issue.codeRequired:El código es obligatorio.`,
  'name-required': $localize`:@@catalogImport.gender.issue.nameRequired:El nombre es obligatorio.`,
  'legacy-id-invalid': $localize`:@@catalogImport.gender.issue.legacyIdInvalid:El legacyId debe ser un número entero.`,
  'country-id-invalid': $localize`:@@catalogImport.gender.issue.countryIdInvalid:El countryId debe ser un número entero.`,
  'legacy-country-id-invalid': $localize`:@@catalogImport.gender.issue.legacyCountryIdInvalid:El legacyCountryId debe ser un número entero.`,
  'update-legacy-id-empty': $localize`:@@catalogImport.gender.issue.updateLegacyIdEmpty:En una actualización el legacyId es obligatorio. En un alta nueva puede ir vacío.`,
  'global-admin-required': $localize`:@@catalogImport.gender.issue.globalAdminRequired:El alcance GLOBAL solo lo importa un administrador global.`,
  'company-header-required': $localize`:@@catalogImport.gender.issue.companyHeaderRequired:Falta la empresa de la sesión.`,
  'tenant-not-writable': $localize`:@@catalogImport.gender.issue.tenantNotWritable:No se puede modificar este género con la empresa de la sesión.`,
  'legacy-id-assign-failed': $localize`:@@catalogImport.gender.issue.legacyIdAssignFailed:No se pudo asignar el legacyId del alta.`,
};

export function localizeGenderCsvIssue(code: string): string {
  return GENDER_ISSUE_LABELS[code] ?? code;
}

export function catalogImportPreviewSummary(created: number, updated: number, failed: number): string {
  return $localize`:@@catalogImport.previewSummary:Preview de negocio — Se crearían: ${created}:created: · Se actualizarían: ${updated}:updated: · Errores: ${failed}:failed:.`;
}

export { catalogImportResultSummary, isGroupedQuestionnaireImport } from './catalog-import-result-summary';
