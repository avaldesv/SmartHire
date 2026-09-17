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

export function catalogImportPreviewSummary(created: number, updated: number, failed: number): string {
  return $localize`:@@catalogImport.previewSummary:Preview de negocio — Se crearían: ${created}:created: · Se actualizarían: ${updated}:updated: · Errores: ${failed}:failed:.`;
}

export { catalogImportResultSummary, isGroupedQuestionnaireImport } from './catalog-import-result-summary';
