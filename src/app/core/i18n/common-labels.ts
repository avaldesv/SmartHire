export const COMMON_VIEW = $localize`:@@common.view:Ver`;
export const COMMON_EDIT = $localize`:@@common.edit:Editar`;
export const COMMON_DELETE = $localize`:@@common.delete:Eliminar`;
export const COMMON_OTHERS = $localize`:@@common.others:Otros`;

export const STATUS_CREATED = $localize`:@@status.created:Creada`;
export const STATUS_ANALYSIS = $localize`:@@status.analysis:Análisis`;
export const STATUS_SELECTION = $localize`:@@status.selection:Selección`;
export const STATUS_HIRED = $localize`:@@status.hired:Contratada`;
export const STATUS_PAUSED = $localize`:@@status.paused:Pausada`;
export const STATUS_CLOSED = $localize`:@@status.closed:Cerrada`;
export const STATUS_CANCELLATION_REQUEST = $localize`:@@status.cancellationRequest:Solicitud cancelación`;
export const STATUS_DRAFT = $localize`:@@status.draft:Borrador`;
export const STATUS_ACTIVE = $localize`:@@status.active:Activa`;
export const STATUS_PUBLISHED = $localize`:@@status.published:Publicada`;
export const STATUS_PENDING_CANCELLATION = $localize`:@@status.pendingCancellation:Cancelación pendiente`;
export const STATUS_CANCELLATION_AUTHORIZED = $localize`:@@status.cancellationAuthorized:Cancelación autorizada`;
export const STATUS_CANCELLED = $localize`:@@status.cancelled:Cancelada`;
export const STATUS_COVERED = $localize`:@@status.covered:Cubierta`;
export const STATUS_PARTIALLY_COVERED = $localize`:@@status.partiallyCovered:Parcialmente cubierta`;

const REQUISITION_STATUS_LABELS: Record<string, string> = {
  CREATED: STATUS_CREATED,
  ANALYSIS: STATUS_ANALYSIS,
  SELECTION: STATUS_SELECTION,
  HIRED: STATUS_HIRED,
  PAUSED: STATUS_PAUSED,
  CLOSED: STATUS_CLOSED,
  CANCELLATION_REQUEST: STATUS_CANCELLATION_REQUEST,
  DRAFT: STATUS_DRAFT,
  ACTIVE: STATUS_ACTIVE,
  PUBLISHED: STATUS_PUBLISHED,
  PENDING_CANCELLATION: STATUS_PENDING_CANCELLATION,
  CANCELLATION_AUTHORIZED: STATUS_CANCELLATION_AUTHORIZED,
  CANCELLED: STATUS_CANCELLED,
  COVERED: STATUS_COVERED,
  PARTIALLY_COVERED: STATUS_PARTIALLY_COVERED,
};

export function getRequisitionStatusLabel(status: string, fallback?: string | null): string {
  return REQUISITION_STATUS_LABELS[status] ?? fallback ?? status;
}

export function isTerminalPositionStatus(status: string | null | undefined): boolean {
  return status === 'CANCELLED' || status === 'COVERED' || status === 'PARTIALLY_COVERED';
}
