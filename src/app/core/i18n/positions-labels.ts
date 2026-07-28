export {
  DASHBOARD_ACTION_APPROVE_CANCELLATION as POSITIONS_ACTION_APPROVE_CANCELLATION,
  DASHBOARD_ACTION_CANCEL_DIRECT as POSITIONS_ACTION_CANCEL_DIRECT,
  DASHBOARD_ACTION_DUPLICATE as POSITIONS_ACTION_DUPLICATE,
  DASHBOARD_ACTION_REJECT_CANCELLATION as POSITIONS_ACTION_REJECT_CANCELLATION,
  DASHBOARD_ACTION_REQUEST_CANCELLATION as POSITIONS_ACTION_REQUEST_CANCELLATION,
  DASHBOARD_APPROVE_CANCELLATION_ERROR as POSITIONS_APPROVE_CANCELLATION_ERROR,
  DASHBOARD_APPROVE_CANCELLATION_SUCCESS as POSITIONS_APPROVE_CANCELLATION_SUCCESS,
  DASHBOARD_CANCEL_ERROR as POSITIONS_CANCEL_ERROR,
  DASHBOARD_CANCEL_SUCCESS as POSITIONS_CANCEL_SUCCESS,
  DASHBOARD_CLEAR_FILTERS as POSITIONS_CLEAR_FILTERS,
  DASHBOARD_COL_BRAND as POSITIONS_COL_BRAND,
  DASHBOARD_COL_CATEGORY as POSITIONS_COL_CATEGORY,
  DASHBOARD_COL_CITY as POSITIONS_COL_CITY,
  DASHBOARD_COL_CLIENT as POSITIONS_COL_CLIENT,
  DASHBOARD_COL_COUNTRY as POSITIONS_COL_COUNTRY,
  DASHBOARD_COL_OT as POSITIONS_COL_OT,
  DASHBOARD_COL_POSITION as POSITIONS_COL_POSITION,
  DASHBOARD_COL_POSITIONS_COUNT as POSITIONS_COL_POSITIONS_COUNT,
  DASHBOARD_COL_RECRUITER as POSITIONS_COL_RECRUITER,
  DASHBOARD_COL_REQUISITION as POSITIONS_COL_REQUISITION,
  DASHBOARD_COL_START_DATE as POSITIONS_COL_START_DATE,
  DASHBOARD_COL_STATE as POSITIONS_COL_STATE,
  DASHBOARD_COL_TYPE as POSITIONS_COL_TYPE,
  DASHBOARD_DUPLICATE_ERROR as POSITIONS_DUPLICATE_ERROR,
  DASHBOARD_FILTER_ALL as POSITIONS_FILTER_ALL,
  DASHBOARD_FILTER_COUNTRY as POSITIONS_FILTER_COUNTRY,
  DASHBOARD_FILTER_DATE_FROM as POSITIONS_FILTER_DATE_FROM,
  DASHBOARD_FILTER_DATE_TO as POSITIONS_FILTER_DATE_TO,
  DASHBOARD_FILTER_RECRUITER as POSITIONS_FILTER_RECRUITER,
  DASHBOARD_FILTER_RECRUITER_PLACEHOLDER as POSITIONS_FILTER_RECRUITER_PLACEHOLDER,
  DASHBOARD_FILTER_STATUS as POSITIONS_FILTER_STATUS,
  DASHBOARD_FILTERS_CLEARED as POSITIONS_FILTERS_CLEARED,
  DASHBOARD_REJECT_CANCELLATION_ERROR as POSITIONS_REJECT_CANCELLATION_ERROR,
  DASHBOARD_REJECT_CANCELLATION_SUCCESS as POSITIONS_REJECT_CANCELLATION_SUCCESS,
  DASHBOARD_REQUEST_CANCELLATION_ERROR as POSITIONS_REQUEST_CANCELLATION_ERROR,
  DASHBOARD_REQUEST_CANCELLATION_SUCCESS as POSITIONS_REQUEST_CANCELLATION_SUCCESS,
  DASHBOARD_SNACK_CLOSE as POSITIONS_SNACK_CLOSE,
  dashboardApproveCancellationConfirm as positionsApproveCancellationConfirm,
  dashboardCancelConfirm as positionsCancelConfirm,
  dashboardDuplicateSuccess as positionsDuplicateSuccess,
  dashboardRejectCancellationConfirm as positionsRejectCancellationConfirm,
  dashboardRequestCancellationConfirm as positionsRequestCancellationConfirm,
} from './dashboard-labels';

export const POSITIONS_PAGE_TITLE = $localize`:@@positions.pageTitle:Posiciones`;
export const POSITIONS_PAGE_SUBTITLE = $localize`:@@positions.pageSubtitle:Gestión de requisiciones y posiciones abiertas`;
export const POSITIONS_NEW_BUTTON = $localize`:@@positions.newButton:Nueva posición`;
export const POSITIONS_SEARCH_LABEL = $localize`:@@positions.searchLabel:Buscar posición`;
export const POSITIONS_SEARCH_PLACEHOLDER = $localize`:@@positions.searchPlaceholder:Cliente, puesto, OT, clave…`;
export const POSITIONS_LOAD_ERROR = $localize`:@@positions.errors.load:No se pudieron cargar las posiciones`;
export const POSITIONS_COL_CLIENT_KEY = $localize`:@@positions.column.clientKey:Clave`;
export const POSITIONS_COL_STATUS = $localize`:@@positions.column.status:Estatus`;
export const POSITIONS_COL_CREATED_AT = $localize`:@@positions.column.createdAt:Fecha de creación`;
export const POSITIONS_COL_NAME = $localize`:@@positions.column.name:Posición`;
export const POSITIONS_COL_POSITIONS = $localize`:@@positions.column.positions:Posiciones`;
export const POSITIONS_COL_APPLICANTS = $localize`:@@positions.column.applicants:Postulados`;
export const POSITIONS_COL_PRESELECTION = $localize`:@@positions.column.preselection:Preselección`;
export const POSITIONS_COL_FIRST_DAY = $localize`:@@positions.column.firstDay:Primer día`;
export const POSITIONS_COL_GROUP = $localize`:@@positions.column.group:Grupo`;
export const POSITIONS_ACTION_GO_SELECTION_ARIA = $localize`:@@positions.action.goSelectionAria:Ir a selección`;
export const POSITIONS_ACTION_MORE_ARIA = $localize`:@@positions.action.moreAria:Más acciones`;
export const POSITIONS_ACTION_GENERATE_PUBLICATION = $localize`:@@positions.action.generatePublication:Generar publicación`;
export const POSITIONS_ACTION_PUBLISH_ON_PORTAL = $localize`:@@positions.action.publishOnPortal:Publicar en portal candidatos`;
export const POSITIONS_PUBLISH_ON_PORTAL_SUCCESS = $localize`:@@positions.success.publishOnPortal:Vacante publicada en el portal candidatos`;
export const POSITIONS_PUBLISH_ON_PORTAL_ERROR = $localize`:@@positions.errors.publishOnPortal:No se pudo publicar la vacante en el portal`;
export const POSITIONS_PUBLISH_ON_PORTAL_CONFIRM = $localize`:@@positions.confirm.publishOnPortal:¿Publicar esta vacante en el portal de candidatos?`;
export const POSITIONS_GENERATE_PUBLICATION_LOAD_ERROR = $localize`:@@positions.errors.generatePublicationLoad:No se pudo obtener la información de contacto de la posición`;
export const POSITIONS_NO_PUBLICATION_TEMPLATE_TITLE = $localize`:@@positions.publication.noTemplate.title:Plantilla de publicación requerida`;
export const POSITIONS_NO_PUBLICATION_TEMPLATE_MESSAGE = $localize`:@@positions.publication.noTemplate.message:No hay plantilla de publicación para el idioma seleccionado. Cree una plantilla en Configuración para poder generar el anuncio.`;
export const POSITIONS_NO_PUBLICATION_TEMPLATE_OK = $localize`:@@positions.publication.noTemplate.ok:OK`;
export const POSITIONS_NO_PUBLICATION_TEMPLATE_CREATE = $localize`:@@positions.publication.noTemplate.create:Crear publicación`;
export const POSITIONS_NO_PUBLICATION_TEMPLATE_CHECK_ERROR = $localize`:@@positions.publication.noTemplate.checkError:No se pudo verificar si existen plantillas de publicación`;
