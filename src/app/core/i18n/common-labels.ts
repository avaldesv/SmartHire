export const COMMON_VIEW = $localize`:@@common.view:Ver`;
export const COMMON_EDIT = $localize`:@@common.edit:Editar`;
export const COMMON_DELETE = $localize`:@@common.delete:Eliminar`;
export const COMMON_OTHERS = $localize`:@@common.others:Otros`;

export const STATUS_DRAFT = $localize`:@@status.draft:Borrador`;
export const STATUS_PENDING_CANCELLATION = $localize`:@@status.pendingCancellation:Cancelación pendiente`;

const REQUISITION_STATUS_LABELS: Record<string, string> = {
  DRAFT: STATUS_DRAFT,
  PENDING_CANCELLATION: STATUS_PENDING_CANCELLATION,
};

export function getRequisitionStatusLabel(status: string): string {
  return REQUISITION_STATUS_LABELS[status] ?? status;
}
