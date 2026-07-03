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

/** Build bundles use CLDR base codes (es/en); portal/API keep regional codes (es-ES/en-US). */
const LOCALE_EQUIVALENCE_GROUPS: readonly (readonly string[])[] = [
  ['es', 'es-ES'],
  ['en', 'en-US'],
];

function localesEquivalent(a: string, b: string): boolean {
  if (a === b) {
    return true;
  }
  return LOCALE_EQUIVALENCE_GROUPS.some((group) => group.includes(a) && group.includes(b));
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
    const preferred = locale?.trim() || DEFAULT_LOGIN_LOCALE;
    if (localesEquivalent(this.getBuildLocale(), preferred)) {
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
    const normalized = locale.trim() || DEFAULT_LOGIN_LOCALE;
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
