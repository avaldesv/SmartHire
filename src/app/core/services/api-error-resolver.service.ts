import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ERROR_CATALOG } from '../i18n/api-error-catalog';
import {
  FEEDBACK_GENERIC_ERROR_MESSAGE,
  FEEDBACK_GENERIC_ERROR_TITLE,
} from '../i18n/feedback-labels';
import { ResolvedApiError } from '../feedback/feedback.types';

interface ApiErrorBody {
  errorCode?: string;
  code?: string | number;
  title?: string;
  userMessage?: string;
  message?: string | unknown;
  params?: unknown[];
}

export interface ApiErrorResolveOptions {
  fallbackTitle?: string;
  fallbackMessage?: string;
}

@Injectable({ providedIn: 'root' })
export class ApiErrorResolverService {
  resolve(error: unknown, options: ApiErrorResolveOptions = {}): ResolvedApiError {
    const body = this.extractBody(error);
    const code = this.normalizeCode(body);

    if (code) {
      const catalog = API_ERROR_CATALOG[code];
      if (catalog) {
        return {
          code,
          title: this.interpolate(catalog.title, body?.params),
          message: this.interpolate(catalog.message, body?.params),
          severity: catalog.severity ?? 'error',
        };
      }
    }

    const apiTitle = this.asUserText(body?.title) ?? this.asUserText(body?.userMessage);
    const apiMessage =
      this.asUserText(body?.userMessage) ??
      this.asUserText(body?.title) ??
      this.asUserText(typeof body?.message === 'string' ? body.message : null);

    if (apiTitle || apiMessage) {
      return {
        code,
        title: apiTitle ?? options.fallbackTitle ?? FEEDBACK_GENERIC_ERROR_TITLE,
        message: apiMessage ?? apiTitle ?? options.fallbackMessage ?? FEEDBACK_GENERIC_ERROR_MESSAGE,
        severity: 'error',
      };
    }

    return {
      code,
      title: options.fallbackTitle ?? FEEDBACK_GENERIC_ERROR_TITLE,
      message: options.fallbackMessage ?? FEEDBACK_GENERIC_ERROR_MESSAGE,
      severity: 'error',
    };
  }

  /** Legacy helper — message line only. */
  translateMessage(error: unknown, options: ApiErrorResolveOptions = {}): string {
    return this.resolve(error, options).message;
  }

  private extractBody(error: unknown): ApiErrorBody | null {
    if (error instanceof HttpErrorResponse) {
      const payload = error.error;
      if (payload && typeof payload === 'object') {
        return payload as ApiErrorBody;
      }
    }
    return null;
  }

  private normalizeCode(body: ApiErrorBody | null): string | null {
    const raw = body?.errorCode ?? body?.code;
    if (raw == null || raw === '') {
      return null;
    }
    if (typeof raw === 'number') {
      return null;
    }
    return String(raw);
  }

  private asUserText(value: string | null | undefined): string | null {
    if (!value?.trim()) {
      return null;
    }
    return value.trim();
  }

  private interpolate(template: string, params: unknown[] | undefined): string {
    if (!params?.length) {
      return template;
    }
    return params.reduce<string>((text, param, index) => {
      const token = new RegExp(`\\{${index}\\}`, 'g');
      return text.replace(token, String(param ?? ''));
    }, template);
  }
}
