export type FeedbackType = 'error' | 'warning' | 'info' | 'success' | 'confirm';

export interface FeedbackDialogData {
  type: FeedbackType;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmWarn?: boolean;
}

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmWarn?: boolean;
}

export interface ResolvedApiError {
  code: string | null;
  title: string;
  message: string;
  severity: Exclude<FeedbackType, 'confirm'>;
}
