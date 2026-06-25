import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../services/auth.service';
import { PermissionService } from '../services/permission.service';
import { TenantContextService } from '../services/tenant-context.service';
import { CatalogCompanyService } from '../services/catalog-company.service';
import { CatalogCompany } from '../../shared/models/catalog-company.model';
import { AppPermissions } from '../auth/app-permissions';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  authority: string;
}

const ALL_NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', path: '/home', icon: 'home', authority: AppPermissions.HOME_READ },
  /*{ label: 'Posiciones', path: '/positions', icon: 'work', authority: AppPermissions.REQUISITION_READ },
  { label: 'Candidatos', path: '/candidates', icon: 'people', authority: AppPermissions.CANDIDATE_READ },
  { label: 'Cuestionarios', path: '/questionnaires', icon: 'quiz', authority: AppPermissions.QUESTIONNAIRE_READ },
  { label: 'Seguimiento', path: '/tracking', icon: 'timeline', authority: AppPermissions.TRACKING_READ },
  { label: 'Reportes', path: '/reports', icon: 'bar_chart', authority: AppPermissions.REPORT_READ },*/
  { label: 'Configuraciones', path: '/settings', icon: 'settings', authority: AppPermissions.SETTINGS_USERS_READ },
];

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
  private readonly permissions = inject(PermissionService);
  private readonly tenantContext = inject(TenantContextService);
  private readonly companyService = inject(CatalogCompanyService);

  readonly user = this.auth.currentUser;
  readonly isGlobalAdmin = computed(() => this.permissions.isGlobalAdmin());
  readonly activeCompanyId = this.tenantContext.activeCompanyId;
  readonly tenantOptions = signal<CatalogCompany[]>([]);

  readonly navItems = computed(() =>
    ALL_NAV_ITEMS.filter((item) => {
      if (item.path === '/settings') {
        return this.permissions.canAccessSettings();
      }
      return this.permissions.hasAuthority(item.authority);
    }),
  );

  ngOnInit(): void {
    if (this.isGlobalAdmin()) {
      this.loadTenantOptions();
    }
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
}
