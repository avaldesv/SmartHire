import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PermissionService } from '../../../core/services/permission.service';
import { QUESTIONNAIRES_NAV_ITEMS } from '../../../core/i18n/nav-labels';

const QUESTIONNAIRES_NAV_ORDER: Record<string, number> = {
  categories: 0,
  questions: 1,
  'question-types': 2,
  'question-tags': 3,
  questionnaires: 4,
  exams: 5,
};

@Component({
  selector: 'sh-questionnaires-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './questionnaires-layout.component.html',
  styleUrl: './questionnaires-layout.component.scss',
})
export class QuestionnairesLayoutComponent {
  private readonly permissions = inject(PermissionService);

  readonly navItems = computed(() =>
    QUESTIONNAIRES_NAV_ITEMS.filter((item) => this.permissions.hasAuthority(item.authority)).sort(
      (a, b) => (QUESTIONNAIRES_NAV_ORDER[a.path] ?? 99) - (QUESTIONNAIRES_NAV_ORDER[b.path] ?? 99),
    ),
  );
}
