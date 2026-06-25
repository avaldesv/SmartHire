import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

const STORAGE_KEY = 'sh_company_id';

@Injectable({ providedIn: 'root' })
export class TenantContextService {
  readonly activeCompanyId = signal<number>(this.readStoredCompanyId());

  getCompanyId(): number {
    return this.activeCompanyId();
  }

  initialize(homeCompanyId?: number): void {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored != null && stored !== '') {
      const parsed = Number(stored);
      if (!Number.isNaN(parsed)) {
        this.activeCompanyId.set(parsed);
        return;
      }
    }
    if (homeCompanyId != null) {
      this.setCompanyId(homeCompanyId);
      return;
    }
    this.activeCompanyId.set(environment.companyId);
  }

  setCompanyId(companyId: number): void {
    this.activeCompanyId.set(companyId);
    sessionStorage.setItem(STORAGE_KEY, String(companyId));
  }

  clear(): void {
    sessionStorage.removeItem(STORAGE_KEY);
    this.activeCompanyId.set(environment.companyId);
  }

  private readStoredCompanyId(): number {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored != null && stored !== '') {
      const parsed = Number(stored);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
    return environment.companyId;
  }
}
