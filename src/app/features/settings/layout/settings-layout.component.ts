import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PermissionService } from '../../../core/services/permission.service';
import { SETTINGS_NAV_ITEMS } from '../../../core/i18n/nav-labels';

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
    SETTINGS_NAV_ITEMS.filter((item) => this.permissions.hasAuthority(item.authority)),
  );
}
