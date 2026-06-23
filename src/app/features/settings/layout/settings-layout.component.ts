import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PermissionService } from '../../../core/services/permission.service';
import { AppPermissions } from '../../../core/auth/app-permissions';

interface SettingsNavItem {
  label: string;
  path: string;
  authority: string;
}

const ALL_SETTINGS_NAV: SettingsNavItem[] = [
  { label: 'Usuarios', path: 'users', authority: AppPermissions.SETTINGS_USERS_READ },
  { label: 'Grupos', path: 'groups', authority: AppPermissions.SETTINGS_GROUPS_READ },
  { label: 'Catálogos', path: 'catalogs', authority: AppPermissions.SETTINGS_CATALOGS_READ },
  { label: 'Notificaciones', path: 'notifications', authority: AppPermissions.SETTINGS_NOTIFICATIONS_READ },
  { label: 'Documentos', path: 'documents', authority: AppPermissions.SETTINGS_SYSTEM_READ },
  { label: 'Prompts IA', path: 'prompts', authority: AppPermissions.SETTINGS_SYSTEM_READ },
  { label: 'CVs', path: 'cvs', authority: AppPermissions.SETTINGS_SYSTEM_READ },
  { label: 'Entrevistas', path: 'interviews', authority: AppPermissions.SETTINGS_SYSTEM_READ },
  { label: 'Etapas', path: 'pipeline-stages', authority: AppPermissions.SETTINGS_SYSTEM_READ },
  { label: 'Sistema', path: 'system', authority: AppPermissions.SETTINGS_SYSTEM_READ },
  { label: 'Bitácoras', path: 'audit', authority: AppPermissions.SETTINGS_SYSTEM_READ },
];

@Component({
  selector: 'sh-settings-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './settings-layout.component.html',
  styleUrl: './settings-layout.component.scss',
})
export class SettingsLayoutComponent {
  private readonly permissions = inject(PermissionService);

  readonly navItems = computed(() =>
    ALL_SETTINGS_NAV.filter((item) => this.permissions.hasAuthority(item.authority)),
  );
}
