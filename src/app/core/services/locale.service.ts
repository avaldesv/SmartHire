import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

export const LOCALE_STORAGE_KEY = 'sh_portal_locale';
export const LOCALE_COOKIE_KEY = 'sh_portal_locale';
export const LOCALE_RELOAD_GUARD_KEY = 'sh_locale_reload_guard';
export const DEFAULT_LOGIN_LOCALE = 'es-MX';
export const X_LANGUAGE_HEADER = 'X-Language';

const LEGACY_LOCALE_PREFIXES = ['es-ES', 'en-US'] as const;

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly document = inject(DOCUMENT);

  readonly activeLocale = signal<string>(this.readStoredLocale() ?? DEFAULT_LOGIN_LOCALE);
  readonly portalLanguageId = signal<number | null>(null);

  constructor() {
    this.normalizeLegacyLocaleUrl();
  }

  getLanguageHeader(): string {
    return this.activeLocale();
  }

  /** Routes never include locale prefix (RF: X-Language + session, not URL). */
  appPath(routePath: string): string {
    return routePath.startsWith('/') ? routePath : `/${routePath}`;
  }

  normalizeAppPath(pathname: string): string {
    let path = pathname.startsWith('/') ? pathname : `/${pathname}`;
    for (const prefix of LEGACY_LOCALE_PREFIXES) {
      const legacyRoot = `/${prefix}`;
      if (path.startsWith(`${legacyRoot}/`)) {
        path = path.slice(legacyRoot.length) || '/';
        break;
      }
      if (path === legacyRoot) {
        path = '/';
        break;
      }
    }
    return path;
  }

  resolveFromAuth(locale?: string | null, portalLanguageId?: number | null): void {
    if (portalLanguageId != null) {
      this.portalLanguageId.set(portalLanguageId);
    }
    const resolved = locale?.trim() || DEFAULT_LOGIN_LOCALE;
    this.persistLocale(resolved);
  }

  changePortalLanguage(portalLanguageId: number, locale: string): void {
    this.portalLanguageId.set(portalLanguageId);
    this.persistLocale(locale);
    window.location.reload();
  }

  needsLocaleReload(locale?: string | null): boolean {
    const preferred = locale?.trim() || DEFAULT_LOGIN_LOCALE;
    if (this.getBuildLocale() === preferred) {
      sessionStorage.removeItem(LOCALE_RELOAD_GUARD_KEY);
      return false;
    }
    return sessionStorage.getItem(LOCALE_RELOAD_GUARD_KEY) !== preferred;
  }

  reloadForLocale(locale: string): void {
    const normalized = locale.trim() || DEFAULT_LOGIN_LOCALE;
    sessionStorage.setItem(LOCALE_RELOAD_GUARD_KEY, normalized);
    this.persistLocale(normalized);
    window.location.reload();
  }

  private normalizeLegacyLocaleUrl(): void {
    const path = window.location.pathname;
    for (const prefix of LEGACY_LOCALE_PREFIXES) {
      if (path.startsWith(`/${prefix}/`)) {
        this.persistLocale(prefix);
        const target = this.normalizeAppPath(path) + window.location.search + window.location.hash;
        window.location.replace(target);
        return;
      }
      if (path === `/${prefix}`) {
        this.persistLocale(prefix);
        window.location.replace('/' + window.location.search + window.location.hash);
        return;
      }
    }
  }

  private persistLocale(locale: string): void {
    const normalized = locale.trim() || DEFAULT_LOGIN_LOCALE;
    this.activeLocale.set(normalized);
    localStorage.setItem(LOCALE_STORAGE_KEY, normalized);
    this.writeLocaleCookie(normalized);
  }

  private writeLocaleCookie(locale: string): void {
    const maxAge = 60 * 60 * 24 * 365;
    document.cookie = `${LOCALE_COOKIE_KEY}=${encodeURIComponent(locale)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }

  private readStoredLocale(): string | null {
    return localStorage.getItem(LOCALE_STORAGE_KEY);
  }

  private getBuildLocale(): string {
    return this.document.documentElement.lang?.trim() || DEFAULT_LOGIN_LOCALE;
  }
}
