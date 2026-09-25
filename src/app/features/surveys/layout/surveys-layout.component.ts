import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SURVEYS_PAGE_TITLE } from '../../../core/i18n/survey-labels';
import { SURVEYS_NAV_ITEMS } from '../../../core/i18n/nav-labels';
import { PermissionService } from '../../../core/services/permission.service';

const SURVEYS_NAV_ORDER: Record<string, number> = {
  list: 0,
  results: 1,
};

@Component({
  selector: 'sh-surveys-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './surveys-layout.component.html',
  styleUrl: './surveys-layout.component.scss',
})
export class SurveysLayoutComponent {
  private readonly permissions = inject(PermissionService);

  readonly pageTitle = SURVEYS_PAGE_TITLE;

  readonly navItems = computed(() =>
    SURVEYS_NAV_ITEMS.filter((item) => this.permissions.hasAuthority(item.authority)).sort(
      (a, b) => (SURVEYS_NAV_ORDER[a.path] ?? 99) - (SURVEYS_NAV_ORDER[b.path] ?? 99),
    ),
  );
}
