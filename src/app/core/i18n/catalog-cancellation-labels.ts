/** Display labels for seeded cancellation type/reason codes (fallback: API name). */

const CANCELLATION_TYPE_BY_CODE: Record<string, string> = {
  CLIENT: $localize`:@@catalogs.cancellationType.value.CLIENT:Cliente`,
};

const CANCELLATION_REASON_BY_CODE: Record<string, string> = {
  PROFILE_CHANGE: $localize`:@@catalogs.cancellationReason.value.PROFILE_CHANGE:Cambio de perfil`,
  CONTRACT_CANCEL_NONPAYMENT: $localize`:@@catalogs.cancellationReason.value.CONTRACT_CANCEL_NONPAYMENT:Cancelación de contrato por falta de pago`,
  PROJECT_CANCEL: $localize`:@@catalogs.cancellationReason.value.PROJECT_CANCEL:Cancelación de proyecto`,
  LACK_OF_FEEDBACK: $localize`:@@catalogs.cancellationReason.value.LACK_OF_FEEDBACK:Falta de retroalimentación`,
  PERM_FLEX: $localize`:@@catalogs.cancellationReason.value.PERM_FLEX:PERM FLEX`,
  PROJECT_TO_SUCCESS: $localize`:@@catalogs.cancellationReason.value.PROJECT_TO_SUCCESS:Proyecto al Exito`,
  CLIENT_REFERRAL: $localize`:@@catalogs.cancellationReason.value.CLIENT_REFERRAL:Referido del cliente`,
  PROJECT_POSTPONED: $localize`:@@catalogs.cancellationReason.value.PROJECT_POSTPONED:Se pospone el proyecto`,
};

export function cancellationTypeDisplayName(code: string | undefined | null, fallback: string): string {
  if (!code) {
    return fallback;
  }
  return CANCELLATION_TYPE_BY_CODE[code] ?? fallback;
}

export function cancellationReasonDisplayName(code: string | undefined | null, fallback: string): string {
  if (!code) {
    return fallback;
  }
  return CANCELLATION_REASON_BY_CODE[code] ?? fallback;
}
