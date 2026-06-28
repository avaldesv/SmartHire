import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

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

  /** Build an app route respecting the active locale (production multi-bundle layout). */
  appPath(routePath: string): string {
    const clean = routePath.startsWith('/') ? routePath.slice(1) : routePath;
    const locale = this.activeLocale();
    if (locale === DEFAULT_LOGIN_LOCALE) {
      return `/${clean}`;
    }
    return `/${locale}/${clean}`;
  }

  resolveFromAuth(locale?: string | null, portalLanguageId?: number | null): void {
    if (portalLanguageId != null) {
      this.portalLanguageId.set(portalLanguageId);
    }
    const resolved = locale?.trim() || DEFAULT_LOGIN_LOCALE;
    this.activeLocale.set(resolved);
    localStorage.setItem(LOCALE_STORAGE_KEY, resolved);
  }

  changePortalLanguage(portalLanguageId: number, locale: string): void {
    this.portalLanguageId.set(portalLanguageId);
    this.activeLocale.set(locale);
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);

    if (environment.production) {
      this.navigateToLocale(locale);
      return;
    }
    window.location.reload();
  }

  /** One-time sync after login when profile locale bundle differs from current URL. */
  ensureLocaleBundle(locale?: string | null): void {
    if (!environment.production || !locale?.trim()) {
      return;
    }
    const normalized = locale.trim();
    if (this.getBuildLocale() !== normalized) {
      this.navigateToLocale(normalized);
    }
  }

  private navigateToLocale(locale: string): void {
    const suffix = this.stripLocalePrefix(window.location.pathname);
    const targetPath = (this.localeBasePath(locale) + suffix).replace(/\/{2,}/g, '/');
    const target = targetPath + window.location.search + window.location.hash;

    const current = window.location.pathname + window.location.search + window.location.hash;
    if (current === target || window.location.pathname === targetPath) {
      return;
    }
    window.location.href = target;
  }

  private localeBasePath(locale: string): string {
    return locale === DEFAULT_LOGIN_LOCALE ? '/' : `/${locale}/`;
  }

  private stripLocalePrefix(path: string): string {
    for (const prefix of LOCALE_PATH_PREFIXES) {
      if (path.startsWith(`/${prefix}/`)) {
        return path.slice(prefix.length + 2);
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
    const fromUrl = this.getBuildLocaleFromUrl();
    if (fromUrl) {
      return fromUrl;
    }
    return this.document.documentElement.lang?.trim() || DEFAULT_LOGIN_LOCALE;
  }

  private getBuildLocaleFromUrl(): string | null {
    const path = window.location.pathname;
    for (const prefix of LOCALE_PATH_PREFIXES) {
      if (path === `/${prefix}` || path.startsWith(`/${prefix}/`)) {
        return prefix;
      }
    }
    return null;
  }
}
