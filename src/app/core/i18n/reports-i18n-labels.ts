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
export const REPORTS_FILTER_DIMENSION = $localize`:@@reports.filter.dimension:Dimensión`;
export const REPORTS_FILTER_START_DAY = $localize`:@@reports.filter.startDay:Día inicial`;
export const REPORTS_FILTER_END_DAY = $localize`:@@reports.filter.endDay:Día final`;

export function reportsOrderNumber(id: number): string {
  return $localize`:@@reports.filter.orderNumber:Orden #${id}:id:`;
}

export function reportsPagerRange(from: number, to: number, total: number): string {
  return $localize`:@@reports.pager.range:${from}:from: - ${to}:to: de ${total}:total:`;
}

export const REPORTS_RECRUITMENT_TEMP = $localize`:@@reports.recruitment.temp:Temporal (TEMP)`;
export const REPORTS_RECRUITMENT_TEMPORARY = $localize`:@@reports.recruitment.temporary:Temporal (TEMPORARY)`;
export const REPORTS_RECRUITMENT_PERMANENT = $localize`:@@reports.recruitment.permanent:Permanente`;

export const REPORTS_MONTH_JANUARY = $localize`:@@reports.month.january:Enero`;
export const REPORTS_MONTH_FEBRUARY = $localize`:@@reports.month.february:Febrero`;
export const REPORTS_MONTH_MARCH = $localize`:@@reports.month.march:Marzo`;
export const REPORTS_MONTH_APRIL = $localize`:@@reports.month.april:Abril`;
export const REPORTS_MONTH_MAY = $localize`:@@reports.month.may:Mayo`;
export const REPORTS_MONTH_JUNE = $localize`:@@reports.month.june:Junio`;
export const REPORTS_MONTH_JULY = $localize`:@@reports.month.july:Julio`;
export const REPORTS_MONTH_AUGUST = $localize`:@@reports.month.august:Agosto`;
export const REPORTS_MONTH_SEPTEMBER = $localize`:@@reports.month.september:Septiembre`;
export const REPORTS_MONTH_OCTOBER = $localize`:@@reports.month.october:Octubre`;
export const REPORTS_MONTH_NOVEMBER = $localize`:@@reports.month.november:Noviembre`;
export const REPORTS_MONTH_DECEMBER = $localize`:@@reports.month.december:Diciembre`;

export function reportsMonthFullOptions(): Array<{ value: number; label: string }> {
  return [
    { value: 1, label: REPORTS_MONTH_JANUARY },
    { value: 2, label: REPORTS_MONTH_FEBRUARY },
    { value: 3, label: REPORTS_MONTH_MARCH },
    { value: 4, label: REPORTS_MONTH_APRIL },
    { value: 5, label: REPORTS_MONTH_MAY },
    { value: 6, label: REPORTS_MONTH_JUNE },
    { value: 7, label: REPORTS_MONTH_JULY },
    { value: 8, label: REPORTS_MONTH_AUGUST },
    { value: 9, label: REPORTS_MONTH_SEPTEMBER },
    { value: 10, label: REPORTS_MONTH_OCTOBER },
    { value: 11, label: REPORTS_MONTH_NOVEMBER },
    { value: 12, label: REPORTS_MONTH_DECEMBER },
  ];
}

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

export const REPORTS_DIM_NONE = $localize`:@@reports.dim.none:Resumen (sin dimensión)`;
export const REPORTS_CONS_STATUS_CREATED = $localize`:@@reports.cons.status.created:Creada`;
export const REPORTS_CONS_STATUS_ANALYSIS = $localize`:@@reports.cons.status.analysis:Análisis`;
export const REPORTS_CONS_STATUS_SELECTION = $localize`:@@reports.cons.status.selection:Selección`;

const CONS_STATUS_LABELS: Record<string, string> = {
  CREATED: REPORTS_CONS_STATUS_CREATED,
  IN_ANALYSIS: REPORTS_CONS_STATUS_ANALYSIS,
  IN_SELECTION: REPORTS_CONS_STATUS_SELECTION,
  CANCELLED: REPORTS_SBR_STATUS_CANCELLED,
  COVERED: REPORTS_SBR_STATUS_COVERED,
};

export function reportsConsStatusLabel(code: string, fallback?: string | null): string {
  return CONS_STATUS_LABELS[code] ?? fallback ?? code;
}

export const REPORTS_PF_TITLE = REPORTS_NAV_PROCESS_FUNNEL;
export const REPORTS_PF_SUBTITLE = $localize`:@@reports.pf.subtitle:Embudo de candidatos por requisición`;
export const REPORTS_PF_LOAD_ERROR = $localize`:@@reports.pf.loadError:No se pudo cargar el reporte Funnel del proceso. Intenta de nuevo.`;
export const REPORTS_PF_CHART_TOTAL = $localize`:@@reports.pf.chart.totalCoverage:Cubrimiento Total`;
export const REPORTS_PF_CHART_BY_BRAND = $localize`:@@reports.pf.chart.coverageByBrand:Cubrimiento por Marca`;
export const REPORTS_PF_EMPTY_BRANDS = $localize`:@@reports.pf.empty.brands:No hay marcas para mostrar`;
export const REPORTS_PF_NO_BRAND = $localize`:@@reports.pf.empty.noBrand:Sin marca`;

export const REPORTS_CONS_TITLE = REPORTS_NAV_CONSOLIDATED;
export const REPORTS_CONS_SUBTITLE = $localize`:@@reports.cons.subtitle:Resumen de requisiciones por estado y día del mes`;
export const REPORTS_CONS_LOAD_ERROR = $localize`:@@reports.cons.loadError:No se pudo cargar el reporte Consolidado. Intenta de nuevo.`;
export const REPORTS_CONS_KPI_TOTAL_REQUISITIONS = $localize`:@@reports.cons.kpi.totalRequisitions:Total de requisiciones`;
export const REPORTS_CONS_KPI_RECRUITERS = $localize`:@@reports.cons.kpi.recruiters:Reclutadores`;
export const REPORTS_CONS_KPI_REQ_PER_RECRUITER = $localize`:@@reports.cons.kpi.reqPerRecruiter:Requis./Reclutadores`;
export const REPORTS_CONS_CHART_STATUS = $localize`:@@reports.cons.chart.status:Requisiciones por estado`;
export const REPORTS_CONS_SECTION_DETAIL = $localize`:@@reports.cons.section.detail:Detalle de las requisiciones por estado y días del mes`;
export const REPORTS_CONS_COL_STATUS_DAY = $localize`:@@reports.cons.col.statusDay:Estado/Día`;
export const REPORTS_CONS_SECTION_BY_DIMENSION = $localize`:@@reports.cons.section.byDimension:Por dimensión`;
export const REPORTS_CONS_COL_ENTITY = $localize`:@@reports.cons.col.entity:Entidad`;

export const REPORTS_SEG_TITLE = REPORTS_NAV_SEGMENTED_SUMMARY;
export const REPORTS_SEG_SUBTITLE = $localize`:@@reports.seg.subtitle:Requisiciones por estado y totales por dimensión`;
export const REPORTS_SEG_LOAD_ERROR = $localize`:@@reports.seg.loadError:No se pudo cargar el Resumen segmentado. Intenta de nuevo.`;
export const REPORTS_SEG_SECTION_DAILY = $localize`:@@reports.seg.section.daily:Resumen diario de requisiciones por Grupo / Reclutador`;
export const REPORTS_SEG_COL_GROUP_RECRUITER = $localize`:@@reports.seg.col.groupRecruiter:Grupo/Reclutador`;

export const REPORTS_TOPS_SUBTITLE = $localize`:@@reports.tops.subtitle:Tops de incidencias (métricas pendientes de definición)`;
export const REPORTS_TOPS_DIM_PENDING_ASSIGNMENT = $localize`:@@reports.tops.dim.pendingAssignment:Pendientes por asignar`;
export const REPORTS_TOPS_COL_COORDINATOR = $localize`:@@reports.tops.col.coordinator:Coordinador`;
export const REPORTS_TOPS_COL_REQUIS = $localize`:@@reports.tops.col.requis:Requis.`;
export const REPORTS_TOPS_COL_BUSINESS_UNIT = $localize`:@@reports.tops.col.businessUnit:Unidad de negocio`;
export const REPORTS_TOPS_LOAD_ERROR = $localize`:@@reports.tops.loadError:No se pudo cargar el reporte Tops de incidencias. Intenta de nuevo.`;

export function reportsTopsTitle(dim: string): string {
  return $localize`:@@reports.tops.title:Tops de incidencias - Requisiciones ${dim}:dim:`;
}

export const REPORTS_MET_SUBTITLE = $localize`:@@reports.met.subtitle:Métricas de posiciones, postulados y contratados`;
export const REPORTS_MET_DIM_BY_GROUP = $localize`:@@reports.met.dim.byGroup:Por grupo`;
export const REPORTS_MET_DIM_BY_RECRUITER = $localize`:@@reports.met.dim.byRecruiter:Por reclutador`;
export const REPORTS_MET_DIM_BY_CLIENT = $localize`:@@reports.met.dim.byClient:Por cliente`;
export const REPORTS_MET_DIM_BY_BUSINESS_UNIT = $localize`:@@reports.met.dim.byBusinessUnit:Por U. Negocio`;
export const REPORTS_MET_EMPTY_CHART = $localize`:@@reports.met.emptyChart:Sin datos para graficar`;
export const REPORTS_MET_COL_POSITIONS = $localize`:@@reports.met.col.positions:Posiciones`;
export const REPORTS_MET_COL_AVG_HIRE_DAYS = $localize`:@@reports.met.col.avgHireDays:Promedio días contratación`;
export const REPORTS_MET_LOAD_ERROR = $localize`:@@reports.met.loadError:No se pudo cargar el reporte Métricas. Intenta de nuevo.`;

export function reportsMetricsTitleBy(dim: string): string {
  return $localize`:@@reports.met.titleBy:Métricas de requisiciones cubiertas por ${dim}:dim:`;
}

export const REPORTS_RIP_TITLE = REPORTS_NAV_POSITIONS_IN_PROCESS;
export const REPORTS_RIP_SUBTITLE = $localize`:@@reports.rip.subtitle:En tiempo vs vencidas y detalle por cliente`;
export const REPORTS_RIP_CHART_ON_TIME_VS_EXPIRED = $localize`:@@reports.rip.chart.onTimeVsExpired:Requisiciones en proceso vs. vencidas`;
export const REPORTS_RIP_ARIA_PIE = $localize`:@@reports.rip.aria.pie:En tiempo vs vencidas`;
export const REPORTS_RIP_ON_TIME = $localize`:@@reports.rip.onTime:En tiempo`;
export const REPORTS_RIP_EXPIRED = $localize`:@@reports.rip.expired:Vencidas`;
export const REPORTS_RIP_CHART_BY_YEAR = $localize`:@@reports.rip.chart.byYear:Requisiciones en proceso y cantidad de postulados por año`;
export const REPORTS_RIP_EMPTY_YEAR = $localize`:@@reports.rip.emptyYear:No hay información por año`;
export const REPORTS_RIP_ARIA_YEAR_BARS = $localize`:@@reports.rip.aria.yearBars:Barras por año`;
export const REPORTS_RIP_CLIENTS = $localize`:@@reports.rip.clients:Clientes`;
export const REPORTS_RIP_COL_IN_PROCESS = $localize`:@@reports.rip.col.inProcess:En proceso`;
export const REPORTS_RIP_LOAD_ERROR = $localize`:@@reports.rip.loadError:No se pudo cargar el reporte Requisiciones en proceso. Intenta de nuevo.`;

export const REPORTS_BEH_TITLE = $localize`:@@reports.beh.title:Comportamiento del cubrimiento`;
export const REPORTS_BEH_SUBTITLE = $localize`:@@reports.beh.subtitle:Fill rate, etapas y detalle por requisición`;
export const REPORTS_BEH_CHART_FILL_RATE = $localize`:@@reports.beh.chart.fillRate:Fill rate`;
export const REPORTS_BEH_CHART_BY_TYPE = $localize`:@@reports.beh.chart.byType:Por tipo de requisición`;
export const REPORTS_BEH_CHART_STAGES = $localize`:@@reports.beh.chart.stages:Métricas de candidatos por etapa`;
export const REPORTS_BEH_NO_DATA = $localize`:@@reports.beh.noData:No hay datos disponibles`;
export const REPORTS_BEH_SECTION_COVERED = $localize`:@@reports.beh.section.covered:Comportamiento de las requisiciones cubiertas`;
export const REPORTS_BEH_COL_CREATE_DATE = $localize`:@@reports.beh.col.createDate:Fecha de creación`;
export const REPORTS_BEH_COL_COMMITMENT_DATE = $localize`:@@reports.beh.col.commitmentDate:Fecha de compromiso`;
export const REPORTS_BEH_COL_COVERAGE_DATE = $localize`:@@reports.beh.col.coverageDate:Fecha de cobertura`;
export const REPORTS_BEH_COL_DAYS_CREATE_COVERAGE = $localize`:@@reports.beh.col.daysCreateCoverage:Tiempo (días) Creación-Cobertura`;
export const REPORTS_BEH_COL_DAYS_COVERAGE_COMMITMENT = $localize`:@@reports.beh.col.daysCoverageCommitment:Tiempo (días) Cobertura-Compromiso`;
export const REPORTS_BEH_COL_POSITIONS_COUNT = $localize`:@@reports.beh.col.positionsCount:Número de posiciones`;
export const REPORTS_BEH_COL_QTY_APPLICANTS = $localize`:@@reports.beh.col.qtyApplicants:Cantidad de postulados`;
export const REPORTS_BEH_COL_QTY_PRESELECTED = $localize`:@@reports.beh.col.qtyPreselected:Cantidad de preseleccionados`;
export const REPORTS_BEH_COL_QTY_SELECTED = $localize`:@@reports.beh.col.qtySelected:Cantidad de seleccionados`;
export const REPORTS_BEH_COL_QTY_EVALUATED = $localize`:@@reports.beh.col.qtyEvaluated:Cantidad de evaluados`;
export const REPORTS_BEH_COL_QTY_INTERVIEWED = $localize`:@@reports.beh.col.qtyInterviewed:Cantidad de entrevistados`;
export const REPORTS_BEH_COL_QTY_PREHIRED = $localize`:@@reports.beh.col.qtyPrehired:Cantidad de precontratados`;
export const REPORTS_BEH_COL_QTY_HIRED = $localize`:@@reports.beh.col.qtyHired:Cantidad de contratados`;
export const REPORTS_BEH_LOAD_ERROR = $localize`:@@reports.beh.loadError:No se pudo cargar el reporte Comportamiento. Intenta de nuevo.`;

export function reportsBehaviorPositions(pct: string): string {
  return $localize`:@@reports.beh.fill.positions:Posiciones (${pct}:pct:)`;
}

export function reportsBehaviorHired(pct: string): string {
  return $localize`:@@reports.beh.fill.hired:Contratados (${pct}:pct:)`;
}

export function reportsBehaviorUncovered(pct: string): string {
  return $localize`:@@reports.beh.fill.uncovered:Sin cubrir (${pct}:pct:)`;
}

export const REPORTS_RBS_TITLE = REPORTS_NAV_REQUISITIONS_BY_SOURCE;
export const REPORTS_RBS_SUBTITLE = $localize`:@@reports.rbs.subtitle:Desempeño por fuente de candidatos`;
export const REPORTS_RBS_COL_SOURCE = $localize`:@@reports.rbs.col.source:Fuente de reclutamiento`;
export const REPORTS_RBS_COL_HIRED_PCT = $localize`:@@reports.rbs.col.hiredPct:% de Contratados`;
export const REPORTS_RBS_COL_NOT_HIRED = $localize`:@@reports.rbs.col.notHired:No contratados`;
export const REPORTS_RBS_COL_NOT_HIRED_PCT = $localize`:@@reports.rbs.col.notHiredPct:% No Contratados`;
export const REPORTS_RBS_COL_SOURCE_COVERAGE = $localize`:@@reports.rbs.col.sourceCoverage:% Cubrimiento fuentes`;
export const REPORTS_RBS_LOAD_ERROR = $localize`:@@reports.rbs.loadError:No se pudo cargar el reporte Requisiciones por fuente de reclutamiento. Intenta de nuevo.`;
