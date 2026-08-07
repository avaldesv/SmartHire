import { Injectable, inject } from '@angular/core';
import { ApiErrorResolverService } from './api-error-resolver.service';

/**
 * @deprecated Use ApiErrorResolverService + FeedbackDialogService instead.
 * Kept for gradual migration from inline/snackbar error handling.
 */
@Injectable({ providedIn: 'root' })
export class ApiErrorTranslationService {
  private readonly resolver = inject(ApiErrorResolverService);

  translate(error: unknown): string {
    return this.resolver.translateMessage(error);
  }
}
