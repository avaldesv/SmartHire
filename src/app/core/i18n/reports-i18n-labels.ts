/** UI chrome labels for Reports (group/row labels come from API via MessageSource). */

export const REPORTS_UPDATE = $localize`:@@reports.action.update:Actualizar`;
export const REPORTS_CLEAR_FILTERS = $localize`:@@reports.action.clearFilters:Limpiar filtros`;

export const REPORTS_PAGE_TITLE = $localize`:@@reports.pageTitle:Reportes`;
export const REPORTS_NAV_CATEGORY_GENERAL = $localize`:@@reports.nav.category.general:Generales`;
export const REPORTS_NAV_CATEGORY_COVERAGE = $localize`:@@reports.nav.category.coverage:Cubrimiento`;
export const REPORTS_NAV_CATEGORY_VACANCIES = $localize`:@@reports.nav.category.vacancies:Vacantes`;
export const REPORTS_NAV_MMR = $localize`:@@reports.nav.mmr:MMR`;
export const REPORTS_NAV_STATUS_BY_REQUISITION = $localize`:@@reports.nav.statusByRequisition:Estatus por requisición`;
export const REPORTS_NAV_PROCESS_FUNNEL = $localize`:@@reports.nav.processFunnel:Funnel del proceso`;
export const REPORTS_NAV_CONSOLIDATED = $localize`:@@reports.nav.consolidated:Consolidado`;
export const REPORTS_NAV_SEGMENTED_SUMMARY = $localize`:@@reports.nav.segmentedSummary:Resumen segmentado`;
export const REPORTS_NAV_TOP_INCIDENTS = $localize`:@@reports.nav.topIncidents:Tops incidencias`;
export const REPORTS_NAV_METRICS = $localize`:@@reports.nav.metrics:Métricas`;
export const REPORTS_NAV_POSITIONS_IN_PROCESS = $localize`:@@reports.nav.positionsInProcess:Posiciones en proceso`;
export const REPORTS_NAV_BEHAVIOR = $localize`:@@reports.nav.behavior:Comportamiento`;
export const REPORTS_NAV_REQUISITIONS_BY_SOURCE = $localize`:@@reports.nav.requisitionsBySource:Requisiciones por fuente`;
export const REPORTS_INDICATORS = $localize`:@@reports.section.indicators:Indicadores`;
export const REPORTS_INDICATOR_COL = $localize`:@@reports.column.indicator:Indicador`;
export const REPORTS_EMPTY_MATRIX = $localize`:@@reports.empty.matrix:Sin datos para los filtros seleccionados`;

export const REPORTS_KPI_FILL_CURRENT = $localize`:@@reports.kpi.fillRateCurrent:Fill Rate actual`;
export const REPORTS_KPI_FILL_PRIOR = $localize`:@@reports.kpi.fillRatePrior:Fill Rate anterior`;
export const REPORTS_KPI_FILL_YTD = $localize`:@@reports.kpi.fillRateYtd:Fill Rate YTD`;

export const REPORTS_FILTER_COUNTRY = $localize`:@@reports.filter.country:País`;
export const REPORTS_FILTER_RECRUITMENT_TYPE = $localize`:@@reports.filter.recruitmentType:Tipo reclutamiento`;
export const REPORTS_FILTER_BUSINESS_UNIT = $localize`:@@reports.filter.businessUnit:Unidades de negocio`;
export const REPORTS_FILTER_BUSINESS_UNIT_SHORT = $localize`:@@reports.filter.businessUnitShort:U. Negocio`;
export const REPORTS_FILTER_GROUP = $localize`:@@reports.filter.group:Grupo`;
export const REPORTS_FILTER_YEAR = $localize`:@@reports.filter.year:Año`;
export const REPORTS_FILTER_ORDER = $localize`:@@reports.filter.order:Orden`;
export const REPORTS_FILTER_REQUISITION = $localize`:@@reports.filter.requisition:Requisición`;
export const REPORTS_FILTER_STATUS = $localize`:@@reports.filter.status:Estado`;
export const REPORTS_FILTER_START_DATE = $localize`:@@reports.filter.startDate:Fecha inicial`;
export const REPORTS_FILTER_END_DATE = $localize`:@@reports.filter.endDate:Fecha final`;
export const REPORTS_FILTER_RECRUITER = $localize`:@@reports.filter.recruiter:Reclutador`;
export const REPORTS_FILTER_CLIENT = $localize`:@@reports.filter.client:Cliente`;
export const REPORTS_FILTER_CLIENT_PLACEHOLDER = $localize`:@@reports.filter.clientPlaceholder:Buscar cliente`;
export const REPORTS_FILTER_CLIENT_CLEAR = $localize`:@@reports.filter.clientClear:Limpiar cliente`;
export const REPORTS_FILTER_ALL = $localize`:@@reports.filter.all:Todos`;
export const REPORTS_FILTER_ALL_FEM = $localize`:@@reports.filter.allFem:Todas`;
export const REPORTS_FILTER_SELECT_COUNTRY = $localize`:@@reports.filter.selectCountry:Selecciona país`;

export function reportsOrderNumber(id: number): string {
  return $localize`:@@reports.filter.orderNumber:Orden #${id}:id:`;
}

export const REPORTS_RECRUITMENT_TEMP = $localize`:@@reports.recruitment.temp:Temporal (TEMP)`;
export const REPORTS_RECRUITMENT_TEMPORARY = $localize`:@@reports.recruitment.temporary:Temporal (TEMPORARY)`;
export const REPORTS_RECRUITMENT_PERMANENT = $localize`:@@reports.recruitment.permanent:Permanente`;

export const REPORTS_MMR_TITLE = $localize`:@@reports.mmr.title:Reporte MMR`;
export const REPORTS_MMR_SUBTITLE = $localize`:@@reports.mmr.subtitle:Fill rate e indicadores mensuales`;
export const REPORTS_MMR_LOAD_ERROR = $localize`:@@reports.mmr.loadError:No se pudo cargar el reporte MMR. Intenta de nuevo.`;

export const REPORTS_RBM_TITLE = $localize`:@@reports.rbm.title:Requisiciones por mes`;
export const REPORTS_RBM_SUBTITLE = $localize`:@@reports.rbm.subtitle:Volumen e indicadores mensuales`;
export const REPORTS_RBM_LOAD_ERROR = $localize`:@@reports.rbm.loadError:No se pudo cargar el reporte Requisiciones por mes. Intenta de nuevo.`;

export const REPORTS_PERF_TITLE = $localize`:@@reports.perf.title:Desempeño`;
export const REPORTS_PERF_SUBTITLE = $localize`:@@reports.perf.subtitle:Resumen de desempeño por reclutador`;
export const REPORTS_PERF_LOAD_ERROR = $localize`:@@reports.perf.loadError:No se pudo cargar el reporte de desempeño. Intenta de nuevo.`;
export const REPORTS_PERF_KPI_TITLE = $localize`:@@reports.perf.kpiTitle:FILL RATE`;
export const REPORTS_PERF_FILTER_MONTH = $localize`:@@reports.perf.filter.month:Mes`;
export const REPORTS_PERF_COL_RECRUITER = $localize`:@@reports.perf.col.recruiter:Reclutador`;
export const REPORTS_PERF_COL_OPENING = $localize`:@@reports.perf.col.opening:Órdenes de apertura`;
export const REPORTS_PERF_COL_TEMP = $localize`:@@reports.perf.col.temp:Órdenes temporales obtenidas`;
export const REPORTS_PERF_COL_CANCELLATIONS = $localize`:@@reports.perf.col.cancellations:Órdenes canceladas`;
export const REPORTS_PERF_COL_ASSOCIATE_STARTS = $localize`:@@reports.perf.col.associateStarts:Inicios de asociados (Placement)`;
export const REPORTS_PERF_COL_MONTH_END = $localize`:@@reports.perf.col.monthEnd:Órdenes (fin de mes)`;
export const REPORTS_PERF_COL_FILL_RATE = $localize`:@@reports.perf.col.fillRate:Tasa de cubrimiento`;
export const REPORTS_PERF_COL_CANCEL_RATE = $localize`:@@reports.perf.col.cancelRate:Tasa de cancelación`;
export const REPORTS_PERF_COL_TOTAL = $localize`:@@reports.perf.col.total:TOTAL`;

export const REPORTS_SBR_TITLE = REPORTS_NAV_STATUS_BY_REQUISITION;
export const REPORTS_SBR_SUBTITLE = $localize`:@@reports.sbr.subtitle:Agregado por estado de la requisición`;
export const REPORTS_SBR_LOAD_ERROR = $localize`:@@reports.sbr.loadError:No se pudo cargar el reporte Estatus por requisición. Intenta de nuevo.`;
export const REPORTS_SBR_CHART_TITLE = $localize`:@@reports.sbr.chartTitle:Requisiciones por estatus`;
export const REPORTS_SBR_EMPTY = $localize`:@@reports.sbr.empty:No hay información`;

export const REPORTS_SBR_COL_STATUS = $localize`:@@reports.sbr.col.status:Estado`;
export const REPORTS_SBR_COL_REQUISITIONS = $localize`:@@reports.sbr.col.requisitions:Requisiciones`;
export const REPORTS_SBR_COL_POSITIONS = $localize`:@@reports.sbr.col.positions:Número de posiciones`;
export const REPORTS_SBR_COL_APPLICANTS = $localize`:@@reports.sbr.col.applicants:Postulados`;
export const REPORTS_SBR_COL_PRESELECTED = $localize`:@@reports.sbr.col.preselected:Preseleccionados`;
export const REPORTS_SBR_COL_SELECTED = $localize`:@@reports.sbr.col.selected:Seleccionados`;
export const REPORTS_SBR_COL_EVALUATED = $localize`:@@reports.sbr.col.evaluated:Evaluados`;
export const REPORTS_SBR_COL_INTERVIEWED = $localize`:@@reports.sbr.col.interviewed:Entrevistados`;
export const REPORTS_SBR_COL_PREHIRED = $localize`:@@reports.sbr.col.prehired:Precontratados`;
export const REPORTS_SBR_COL_HIRED = $localize`:@@reports.sbr.col.hired:Contratados`;
export const REPORTS_SBR_COL_UNCOVERED = $localize`:@@reports.sbr.col.uncovered:Sin cubrir`;
export const REPORTS_SBR_COL_COMPLIANCE = $localize`:@@reports.sbr.col.compliance:% cumplimiento`;
export const REPORTS_SBR_COL_DIGITAL_DOCS = $localize`:@@reports.sbr.col.digitalDocs:Doc. digitales`;

export const REPORTS_SBR_STATUS_COVERED = $localize`:@@reports.sbr.status.covered:Cubierta`;
export const REPORTS_SBR_STATUS_PARTIALLY_COVERED = $localize`:@@reports.sbr.status.partiallyCovered:Parcialmente cubierta`;
export const REPORTS_SBR_STATUS_IN_ANALYSIS = $localize`:@@reports.sbr.status.inAnalysis:En análisis`;
export const REPORTS_SBR_STATUS_IN_SELECTION = $localize`:@@reports.sbr.status.inSelection:En selección`;
export const REPORTS_SBR_STATUS_CANCELLED = $localize`:@@reports.sbr.status.cancelled:Cancelada`;
export const REPORTS_SBR_STATUS_CANCELLATION_REQUESTED = $localize`:@@reports.sbr.status.cancellationRequested:Cancelación solicitada`;
export const REPORTS_SBR_STATUS_IN_PROCESS = $localize`:@@reports.sbr.status.inProcess:En proceso`;

const SBR_STATUS_LABELS: Record<string, string> = {
  COVERED: REPORTS_SBR_STATUS_COVERED,
  PARTIALLY_COVERED: REPORTS_SBR_STATUS_PARTIALLY_COVERED,
  IN_ANALYSIS: REPORTS_SBR_STATUS_IN_ANALYSIS,
  IN_SELECTION: REPORTS_SBR_STATUS_IN_SELECTION,
  CANCELLED: REPORTS_SBR_STATUS_CANCELLED,
  CANCELLATION_REQUESTED: REPORTS_SBR_STATUS_CANCELLATION_REQUESTED,
  IN_PROCESS: REPORTS_SBR_STATUS_IN_PROCESS,
};

export function reportsSbrStatusLabel(code: string, fallback?: string | null): string {
  return SBR_STATUS_LABELS[code] ?? fallback ?? code;
}
