export function catalogImportTitle(catalogLabel: string): string {
  return $localize`:@@catalogImport.title:Importar ${catalogLabel}:catalogLabel:`;
}

export const CATALOG_IMPORT_HINT = $localize`:@@catalogImport.hint:Descargue la plantilla, complete los datos y suba el archivo CSV.`;
export const CATALOG_IMPORT_DOWNLOAD_TEMPLATE = $localize`:@@catalogImport.downloadTemplate:Descargar plantilla`;
export const CATALOG_IMPORT_DOWNLOAD_ERRORS = $localize`:@@catalogImport.downloadErrors:Descargar reporte de errores`;
export const CATALOG_IMPORT_CLOSE = $localize`:@@common.close:Cerrar`;
export const CATALOG_IMPORT_VALIDATE = $localize`:@@catalogImport.validate:Validar`;
export const CATALOG_IMPORT_IMPORT = $localize`:@@catalogImport.import:Importar`;
export const CATALOG_IMPORT_EXPORT_TOOLTIP = $localize`:@@catalogImport.exportTooltip:Exportar CSV`;
export const CATALOG_IMPORT_IMPORT_TOOLTIP = $localize`:@@catalogImport.importTooltip:Importar CSV`;

export const CATALOG_IMPORT_TEMPLATE_ERROR = $localize`:@@catalogImport.errors.templateDownload:No se pudo descargar la plantilla.`;
export const CATALOG_IMPORT_SELECT_FILE = $localize`:@@catalogImport.errors.selectFile:Seleccione un archivo CSV.`;
export const CATALOG_IMPORT_VALIDATE_ERROR = $localize`:@@catalogImport.errors.validate:No se pudo validar el archivo.`;
export const CATALOG_IMPORT_IMPORT_ERROR = $localize`:@@catalogImport.errors.import:No se pudo importar el archivo.`;
export const CATALOG_IMPORT_EXPORT_ERROR = $localize`:@@catalogImport.errors.export:No se pudo exportar el catálogo`;
export const CATALOG_IMPORT_COMPLETE = $localize`:@@catalogImport.success.importComplete:Importación completada`;
export const CATALOG_IMPORT_SNACK_CLOSE = $localize`:@@common.close:Cerrar`;

export function catalogImportStructureValid(totalRows: number): string {
  return $localize`:@@catalogImport.structureValid:Estructura válida. Filas detectadas: ${totalRows}:totalRows:.`;
}

export function catalogImportResultSummary(created: number, updated: number, failed: number): string {
  return $localize`:@@catalogImport.resultSummary:Creados: ${created}:created: · Actualizados: ${updated}:updated: · Fallidos: ${failed}:failed:`;
}
