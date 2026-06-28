export const DASHBOARD_WELCOME = $localize`:@@dashboard.welcome:Bienvenido,`;
export const DASHBOARD_SUBTITLE = $localize`:@@dashboard.subtitle:Resumen general de tu actividad como reclutador`;

export const DASHBOARD_KPI_TOTAL_POSITIONS = $localize`:@@dashboard.kpi.totalPositions:Total Posiciones`;
export const DASHBOARD_KPI_TOTAL_POSITIONS_SUB = $localize`:@@dashboard.kpi.totalPositionsSub:Posiciones registradas en el tenant`;
export const DASHBOARD_KPI_PRESELECTED = $localize`:@@dashboard.kpi.preselected:Candidatos Preseleccionados`;
export const DASHBOARD_KPI_PRESELECTED_SUB = $localize`:@@dashboard.kpi.preselectedSub:Postulaciones en preselección`;
export const DASHBOARD_KPI_INTERESTED = $localize`:@@dashboard.kpi.interested:Candidatos Interesados`;
export const DASHBOARD_KPI_INTERESTED_SUB = $localize`:@@dashboard.kpi.interestedSub:Postulaciones marcadas interesadas`;

export const DASHBOARD_SECTION_REQUESTS = $localize`:@@dashboard.section.requests:Solicitudes`;
export const DASHBOARD_NEW_REQUISITION = $localize`:@@dashboard.newRequisition:Nueva Requisición`;
export const DASHBOARD_SEARCH_LABEL = $localize`:@@dashboard.searchLabel:Buscar requisición`;
export const DASHBOARD_SEARCH_PLACEHOLDER = $localize`:@@dashboard.searchPlaceholder:REQ, puesto, cliente, OT…`;
export const DASHBOARD_FILTER_STATUS = $localize`:@@dashboard.filter.status:Estado`;
export const DASHBOARD_FILTER_RECRUITER = $localize`:@@dashboard.filter.recruiter:Reclutador`;
export const DASHBOARD_FILTER_RECRUITER_PLACEHOLDER = $localize`:@@dashboard.filter.recruiterPlaceholder:Usuario creador`;
export const DASHBOARD_FILTER_COUNTRY = $localize`:@@dashboard.filter.country:País`;
export const DASHBOARD_FILTER_ALL = $localize`:@@dashboard.filter.all:Todos`;
export const DASHBOARD_FILTER_DATE_FROM = $localize`:@@dashboard.filter.dateFrom:Fecha inicio`;
export const DASHBOARD_FILTER_DATE_TO = $localize`:@@dashboard.filter.dateTo:Fecha fin`;
export const DASHBOARD_CLEAR_FILTERS = $localize`:@@dashboard.clearFilters:Limpiar filtros`;

export const DASHBOARD_COL_REQUISITION = $localize`:@@dashboard.column.requisition:Requisición`;
export const DASHBOARD_COL_POSITION = $localize`:@@dashboard.column.position:Puesto`;
export const DASHBOARD_COL_OT = $localize`:@@dashboard.column.ot:OT`;
export const DASHBOARD_COL_CLIENT = $localize`:@@dashboard.column.client:Cliente`;
export const DASHBOARD_COL_CLIENT_KEY = $localize`:@@dashboard.column.clientKey:Clave Cliente`;
export const DASHBOARD_COL_POSITIONS_COUNT = $localize`:@@dashboard.column.positionsCount:# Pos.`;
export const DASHBOARD_COL_CITY = $localize`:@@dashboard.column.city:Ciudad`;
export const DASHBOARD_COL_STATE = $localize`:@@dashboard.column.state:Estado`;
export const DASHBOARD_COL_BRAND = $localize`:@@dashboard.column.brand:Marca`;
export const DASHBOARD_COL_TYPE = $localize`:@@dashboard.column.type:Tipo`;
export const DASHBOARD_COL_CATEGORY = $localize`:@@dashboard.column.category:Categoría`;
export const DASHBOARD_COL_COUNTRY = $localize`:@@dashboard.column.country:País`;
export const DASHBOARD_COL_START_DATE = $localize`:@@dashboard.column.startDate:Primer Día`;
export const DASHBOARD_COL_STATUS = $localize`:@@dashboard.column.status:Estatus`;
export const DASHBOARD_COL_RECRUITER = $localize`:@@dashboard.column.recruiter:Reclutador`;
export const DASHBOARD_COL_CREATED_AT = $localize`:@@dashboard.column.createdAt:Fecha Creación`;

export const DASHBOARD_ACTION_EDIT = $localize`:@@dashboard.action.edit:Editar`;
export const DASHBOARD_ACTION_GO_SELECTION = $localize`:@@dashboard.action.goSelection:Ir a selección`;
export const DASHBOARD_ACTION_APPLY_CANDIDATES = $localize`:@@dashboard.action.applyCandidates:Postular candidatos`;
export const DASHBOARD_ACTION_VIEW_APPLICANTS = $localize`:@@dashboard.action.viewApplicants:Ver postulados`;
export const DASHBOARD_ACTION_DUPLICATE = $localize`:@@dashboard.action.duplicate:Duplicar`;
export const DASHBOARD_ACTION_REQUEST_CANCELLATION = $localize`:@@dashboard.action.requestCancellation:Solicitar cancelación`;
export const DASHBOARD_ACTION_APPROVE_CANCELLATION = $localize`:@@dashboard.action.approveCancellation:Aprobar cancelación`;
export const DASHBOARD_ACTION_REJECT_CANCELLATION = $localize`:@@dashboard.action.rejectCancellation:Rechazar solicitud`;
export const DASHBOARD_ACTION_CANCEL_DIRECT = $localize`:@@dashboard.action.cancelDirect:Cancelar directamente`;

export const DASHBOARD_PAGINATOR_ARIA = $localize`:@@dashboard.paginatorAria:Paginación de solicitudes`;
export const DASHBOARD_SNACK_CLOSE = $localize`:@@common.close:Cerrar`;

export const DASHBOARD_LOAD_KPIS_ERROR = $localize`:@@dashboard.errors.loadKpis:No se pudieron cargar los KPIs`;
export const DASHBOARD_LOAD_REQUESTS_ERROR = $localize`:@@dashboard.errors.loadRequests:No se pudieron cargar las solicitudes`;
export const DASHBOARD_FILTERS_CLEARED = $localize`:@@dashboard.success.filtersCleared:Filtros limpiados`;
export const DASHBOARD_DUPLICATE_ERROR = $localize`:@@dashboard.errors.duplicate:No se pudo duplicar la posición`;
export const DASHBOARD_CANCEL_SUCCESS = $localize`:@@dashboard.success.cancelled:Requisición cancelada`;
export const DASHBOARD_CANCEL_ERROR = $localize`:@@dashboard.errors.cancel:No se pudo cancelar la requisición`;
export const DASHBOARD_REQUEST_CANCELLATION_SUCCESS = $localize`:@@dashboard.success.requestCancellation:Solicitud de cancelación enviada`;
export const DASHBOARD_REQUEST_CANCELLATION_ERROR = $localize`:@@dashboard.errors.requestCancellation:No se pudo solicitar la cancelación`;
export const DASHBOARD_APPROVE_CANCELLATION_SUCCESS = $localize`:@@dashboard.success.approveCancellation:Cancelación aprobada`;
export const DASHBOARD_APPROVE_CANCELLATION_ERROR = $localize`:@@dashboard.errors.approveCancellation:No se pudo aprobar la cancelación`;
export const DASHBOARD_REJECT_CANCELLATION_SUCCESS = $localize`:@@dashboard.success.rejectCancellation:Solicitud de cancelación rechazada`;
export const DASHBOARD_REJECT_CANCELLATION_ERROR = $localize`:@@dashboard.errors.rejectCancellation:No se pudo rechazar la solicitud`;

export function dashboardDuplicateSuccess(id: number): string {
  return $localize`:@@dashboard.success.duplicated:Posición duplicada: REQ-${id}:id:`;
}

export function dashboardCancelConfirm(requisitionNo: string): string {
  return $localize`:@@dashboard.confirm.cancel:¿Cancelar directamente la requisición ${requisitionNo}:requisitionNo:? Esta acción no se puede deshacer.`;
}

export function dashboardRequestCancellationConfirm(requisitionNo: string): string {
  return $localize`:@@dashboard.confirm.requestCancellation:¿Solicitar cancelación de ${requisitionNo}:requisitionNo:? Quedará pendiente de aprobación.`;
}

export function dashboardApproveCancellationConfirm(requisitionNo: string): string {
  return $localize`:@@dashboard.confirm.approveCancellation:¿Aprobar cancelación de ${requisitionNo}:requisitionNo:? La requisición será eliminada.`;
}

export function dashboardRejectCancellationConfirm(requisitionNo: string): string {
  return $localize`:@@dashboard.confirm.rejectCancellation:¿Rechazar solicitud de cancelación de ${requisitionNo}:requisitionNo:? Volverá a borrador.`;
}

export function dashboardCandidatesApplied(count: number, requisitionNo: string): string {
  return $localize`:@@dashboard.success.candidatesApplied:${count}:count: candidato(s) postulado(s) a ${requisitionNo}:requisitionNo:`;
}
