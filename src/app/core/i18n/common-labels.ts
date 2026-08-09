export const COMMON_VIEW = $localize`:@@common.view:Ver`;
export const COMMON_EDIT = $localize`:@@common.edit:Editar`;
export const COMMON_DELETE = $localize`:@@common.delete:Eliminar`;
export const COMMON_OTHERS = $localize`:@@common.others:Otros`;

export const STATUS_ACTIVE = $localize`:@@status.active:Activa`;
export const STATUS_PUBLISHED = $localize`:@@status.published:Publicada`;
export const STATUS_PENDING_CANCELLATION = $localize`:@@status.pendingCancellation:Cancelación pendiente`;
export const STATUS_CANCELLATION_AUTHORIZED = $localize`:@@status.cancellationAuthorized:Cancelación autorizada`;
export const STATUS_CANCELLED = $localize`:@@status.cancelled:Cancelada`;

const REQUISITION_STATUS_LABELS: Record<string, string> = {
  ACTIVE: STATUS_ACTIVE,
  PUBLISHED: STATUS_PUBLISHED,
  PENDING_CANCELLATION: STATUS_PENDING_CANCELLATION,
  CANCELLATION_AUTHORIZED: STATUS_CANCELLATION_AUTHORIZED,
  CANCELLED: STATUS_CANCELLED,
};

export function getRequisitionStatusLabel(status: string): string {
  return REQUISITION_STATUS_LABELS[status] ?? status;
}
