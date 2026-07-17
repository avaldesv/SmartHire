import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

/** Client-side locale preference (tab session). */
export const LOCALE_SESSION_KEY = 'sh_portal_locale';
/** @deprecated Use LOCALE_SESSION_KEY — kept for legacy localStorage cleanup only. */
export const LOCALE_STORAGE_KEY = LOCALE_SESSION_KEY;
/** Server bundle selection on full page reload (session cookie, no Max-Age). */
export const LOCALE_COOKIE_KEY = 'sh_portal_locale';
export const LOCALE_RELOAD_GUARD_KEY = 'sh_locale_reload_guard';
export const DEFAULT_LOGIN_LOCALE = 'es-MX';
export const X_LANGUAGE_HEADER = 'X-Language';

const LEGACY_LOCALE_PREFIXES = ['es-ES', 'en-US'] as const;

/**
 * Maps portal/API locales and Angular `document.lang` (CLDR codes es/en vs es-MX)
 * to the serve-spa / dist folder that must be loaded. es-MX and es-ES are distinct bundles.
 * Note: bare `es` in document.lang is the Angular id for the es-ES build (subPath es-ES).
 */
function toBundleLocale(locale: string): string {
  const trimmed = locale.trim();
  if (!trimmed) {
    return DEFAULT_LOGIN_LOCALE;
  }
  if (trimmed === 'en' || trimmed.startsWith('en-')) {
    return 'en-US';
  }
  if (trimmed === 'es' || trimmed === 'es-ES') {
    return 'es-ES';
  }
  if (trimmed === 'es-MX' || trimmed.startsWith('es-')) {
    return 'es-MX';
  }
  return trimmed;
}

/** Cookie/session codes for serve-spa: bare `es` defaults to product locale es-MX. */
function normalizeStoredLocale(locale: string): string {
  const trimmed = locale.trim() || DEFAULT_LOGIN_LOCALE;
  if (trimmed === 'en' || trimmed.startsWith('en-')) {
    return 'en-US';
  }
  if (trimmed === 'es-ES') {
    return 'es-ES';
  }
  if (trimmed === 'es' || trimmed === 'es-MX' || trimmed.startsWith('es-')) {
    return 'es-MX';
  }
  return trimmed;
}

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly document = inject(DOCUMENT);

  readonly activeLocale = signal<string>(this.readStoredLocale() ?? DEFAULT_LOGIN_LOCALE);
  readonly portalLanguageId = signal<number | null>(null);

  constructor() {
    this.migrateLegacyLocaleStorage();
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
    const preferred = normalizeStoredLocale(locale?.trim() || DEFAULT_LOGIN_LOCALE);
    // Compare bundle folders: document.lang may be Angular CLDR ("es"/"en").
    if (toBundleLocale(this.getBuildLocale()) === toBundleLocale(preferred)) {
      sessionStorage.removeItem(LOCALE_RELOAD_GUARD_KEY);
      return false;
    }
    return sessionStorage.getItem(LOCALE_RELOAD_GUARD_KEY) !== preferred;
  }

  reloadForLocale(locale: string): void {
    const normalized = normalizeStoredLocale(locale);
    sessionStorage.setItem(LOCALE_RELOAD_GUARD_KEY, normalized);
    this.persistLocale(normalized);
    window.location.reload();
  }

  /** Clears locale for logout — next user gets language from auth/me. */
  clearLocalePreference(): void {
    sessionStorage.removeItem(LOCALE_SESSION_KEY);
    sessionStorage.removeItem(LOCALE_RELOAD_GUARD_KEY);
    localStorage.removeItem(LOCALE_SESSION_KEY);
    this.portalLanguageId.set(null);
    this.activeLocale.set(DEFAULT_LOGIN_LOCALE);
    this.clearLocaleCookie();
  }

  private migrateLegacyLocaleStorage(): void {
    const legacy = localStorage.getItem(LOCALE_SESSION_KEY);
    if (!legacy) {
      return;
    }
    localStorage.removeItem(LOCALE_SESSION_KEY);
    if (!sessionStorage.getItem(LOCALE_SESSION_KEY)) {
      sessionStorage.setItem(LOCALE_SESSION_KEY, legacy);
    }
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
    const normalized = normalizeStoredLocale(locale);
    this.activeLocale.set(normalized);
    sessionStorage.setItem(LOCALE_SESSION_KEY, normalized);
    this.writeLocaleCookie(normalized);
  }

  /** Session cookie — used by serve-spa.js on reload; cleared on logout. */
  private writeLocaleCookie(locale: string): void {
    document.cookie = `${LOCALE_COOKIE_KEY}=${encodeURIComponent(locale)}; path=/; SameSite=Lax`;
  }

  private clearLocaleCookie(): void {
    document.cookie = `${LOCALE_COOKIE_KEY}=; path=/; max-age=0; SameSite=Lax`;
  }

  private readStoredLocale(): string | null {
    const fromSession = sessionStorage.getItem(LOCALE_SESSION_KEY);
    if (fromSession?.trim()) {
      return fromSession.trim();
    }
    return this.readLocaleFromCookie();
  }

  private readLocaleFromCookie(): string | null {
    const prefix = `${LOCALE_COOKIE_KEY}=`;
    for (const part of document.cookie.split(';')) {
      const trimmed = part.trim();
      if (trimmed.startsWith(prefix)) {
        const value = decodeURIComponent(trimmed.slice(prefix.length)).trim();
        return value || null;
      }
    }
    return null;
  }

  private getBuildLocale(): string {
    return this.document.documentElement.lang?.trim() || DEFAULT_LOGIN_LOCALE;
  }
}
