import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../services/auth.service';
import { PermissionService } from '../services/permission.service';
import { AppPermissions } from '../auth/app-permissions';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  authority: string;
}

const SETTINGS_MENU_AUTHORITIES = [
  AppPermissions.SETTINGS_USERS_READ,
  AppPermissions.SETTINGS_GROUPS_READ,
  AppPermissions.SETTINGS_CATALOGS_READ,
  AppPermissions.SETTINGS_NOTIFICATIONS_READ,
  AppPermissions.SETTINGS_SYSTEM_READ,
];

const ALL_NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', path: '/home', icon: 'home', authority: AppPermissions.HOME_READ },
  { label: 'Posiciones', path: '/positions', icon: 'work', authority: AppPermissions.REQUISITION_READ },
  { label: 'Candidatos', path: '/candidates', icon: 'people', authority: AppPermissions.CANDIDATE_READ },
  { label: 'Cuestionarios', path: '/questionnaires', icon: 'quiz', authority: AppPermissions.QUESTIONNAIRE_READ },
  { label: 'Seguimiento', path: '/tracking', icon: 'timeline', authority: AppPermissions.TRACKING_READ },
  { label: 'Reportes', path: '/reports', icon: 'bar_chart', authority: AppPermissions.REPORT_READ },
  { label: 'Configuraciones', path: '/settings', icon: 'settings', authority: AppPermissions.SETTINGS_USERS_READ },
];

@Component({
  selector: 'sh-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule, MatMenuModule, MatBadgeModule],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  private readonly auth = inject(AuthService);
  private readonly permissions = inject(PermissionService);
  readonly user = this.auth.currentUser;

  readonly navItems = computed(() =>
    ALL_NAV_ITEMS.filter((item) => {
      if (item.path === '/settings') {
        return this.permissions.hasAny(SETTINGS_MENU_AUTHORITIES);
      }
      return this.permissions.hasAuthority(item.authority);
    }),
  );

  logout(): void {
    this.auth.completeLogout();
  }
}
