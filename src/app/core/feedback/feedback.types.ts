export type FeedbackType = 'error' | 'warning' | 'info' | 'success' | 'confirm';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmWarn?: boolean;
  /** Visual icon; defaults to confirm (help). Use warning to match Atención dialogs. */
  iconType?: 'confirm' | 'warning';
}

export interface FeedbackDialogData {
  type: FeedbackType;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmWarn?: boolean;
  iconType?: 'confirm' | 'warning';
}

export interface ResolvedApiError {
  code: string | null;
  title: string;
  message: string;
  severity: Exclude<FeedbackType, 'confirm'>;
}
