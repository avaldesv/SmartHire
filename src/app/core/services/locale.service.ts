import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

export const LOCALE_STORAGE_KEY = 'sh_portal_locale';
export const DEFAULT_LOGIN_LOCALE = 'es-MX';
export const X_LANGUAGE_HEADER = 'X-Language';

const LOCALE_PATH_PREFIXES = ['es-ES', 'en-US'] as const;

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly document = inject(DOCUMENT);

  readonly activeLocale = signal<string>(this.readStoredLocale() ?? DEFAULT_LOGIN_LOCALE);
  readonly portalLanguageId = signal<number | null>(null);

  getLanguageHeader(): string {
    return this.activeLocale();
  }

  resolveFromAuth(locale?: string | null, portalLanguageId?: number | null): void {
    if (portalLanguageId != null) {
      this.portalLanguageId.set(portalLanguageId);
    }
    const resolved = locale?.trim() || DEFAULT_LOGIN_LOCALE;
    this.syncLocale(resolved);
  }

  changePortalLanguage(portalLanguageId: number, locale: string): void {
    this.portalLanguageId.set(portalLanguageId);
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    this.navigateToLocale(locale);
  }

  private syncLocale(locale: string): void {
    const normalized = locale.trim() || DEFAULT_LOGIN_LOCALE;
    this.activeLocale.set(normalized);
    localStorage.setItem(LOCALE_STORAGE_KEY, normalized);

    const buildLocale = this.getBuildLocale();
    if (buildLocale && buildLocale !== normalized) {
      this.navigateToLocale(normalized);
    }
  }

  private navigateToLocale(locale: string): void {
    const targetPath = this.localeBasePath(locale) + this.stripLocalePrefix(window.location.pathname);
    const normalizedPath = targetPath.replace(/\/{2,}/g, '/');
    window.location.href = normalizedPath + window.location.search + window.location.hash;
  }

  private localeBasePath(locale: string): string {
    return locale === DEFAULT_LOGIN_LOCALE ? '/' : `/${locale}/`;
  }

  private stripLocalePrefix(path: string): string {
    for (const prefix of LOCALE_PATH_PREFIXES) {
      if (path.startsWith(`/${prefix}/`)) {
        return path.slice(prefix.length + 1);
      }
      if (path === `/${prefix}`) {
        return '';
      }
    }
    return path.startsWith('/') ? path.slice(1) : path;
  }

  private readStoredLocale(): string | null {
    return localStorage.getItem(LOCALE_STORAGE_KEY);
  }

  private getBuildLocale(): string {
    return this.document.documentElement.lang?.trim() || DEFAULT_LOGIN_LOCALE;
  }
}
