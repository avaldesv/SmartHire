import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../services/auth.service';
import { LocaleService } from '../services/locale.service';
import { PermissionService } from '../services/permission.service';
import { TenantContextService } from '../services/tenant-context.service';
import { UserSettingsApiService } from '../services/user-settings-api.service';
import { CatalogCompanyService } from '../services/catalog-company.service';
import { CatalogCompany } from '../../shared/models/catalog-company.model';
import { PortalLanguage } from '../../shared/models/portal-language.model';
import { AppPermissions } from '../auth/app-permissions';
import { MAIN_NAV_ITEMS } from '../i18n/nav-labels';

@Component({
  selector: 'sh-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly localeService = inject(LocaleService);
  private readonly permissions = inject(PermissionService);
  private readonly tenantContext = inject(TenantContextService);
  private readonly companyService = inject(CatalogCompanyService);
  private readonly userSettingsApi = inject(UserSettingsApiService);

  readonly user = this.auth.currentUser;
  readonly activeLocale = this.localeService.activeLocale;
  readonly activePortalLanguageId = this.localeService.portalLanguageId;
  readonly isGlobalAdmin = computed(() => this.permissions.isGlobalAdmin());
  readonly activeCompanyId = this.tenantContext.activeCompanyId;
  readonly tenantOptions = signal<CatalogCompany[]>([]);
  readonly portalLanguages = signal<PortalLanguage[]>([]);
  readonly languageChanging = signal(false);

  readonly activeLanguageName = computed(() => {
    const currentId = this.activePortalLanguageId() ?? this.user()?.portalLanguageId;
    return this.portalLanguages().find((language) => language.id === currentId)?.name ?? '';
  });

  readonly navItems = computed(() =>
    MAIN_NAV_ITEMS.filter((item) => {
      if (item.path === '/settings') {
        return this.permissions.canAccessSettings();
      }
      return this.permissions.hasAuthority(item.authority);
    }),
  );

  ngOnInit(): void {
    this.loadPortalLanguages();
    if (this.isGlobalAdmin()) {
      this.loadTenantOptions();
    }
  }

  onLanguageChange(portalLanguageId: number): void {
    const selected = this.portalLanguages().find((item) => item.id === portalLanguageId);
    if (!selected || selected.locale === this.activeLocale() || this.isActiveLanguage(portalLanguageId)) {
      return;
    }
    this.languageChanging.set(true);
    this.userSettingsApi.updateMySettings(portalLanguageId).subscribe({
      next: () => this.localeService.changePortalLanguage(selected.id, selected.locale),
      error: () => this.languageChanging.set(false),
    });
  }

  isActiveLanguage(portalLanguageId: number): boolean {
    const currentId = this.activePortalLanguageId() ?? this.user()?.portalLanguageId;
    return currentId === portalLanguageId;
  }

  onTenantChange(companyId: number): void {
    if (companyId === this.activeCompanyId()) {
      return;
    }
    this.tenantContext.setCompanyId(companyId);
    this.auth.loadCurrentUserProfile().subscribe({ error: () => undefined });
  }

  logout(): void {
    this.auth.completeLogout();
  }

  private loadTenantOptions(): void {
    this.companyService.list(0, 200).subscribe({
      next: (res) => this.tenantOptions.set(res.items),
      error: () => undefined,
    });
  }

  private loadPortalLanguages(): void {
    this.userSettingsApi.listPortalLanguages().subscribe({
      next: (languages) =>
        this.portalLanguages.set([...languages].sort((a, b) => a.sortOrder - b.sortOrder)),
      error: () => undefined,
    });
  }
}
