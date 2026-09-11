import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import {
  SELECTION_PAGE_TITLE,
  SELECTION_TAB_AI,
  SELECTION_TAB_ANALYSIS,
  SELECTION_TAB_PRESELECTION,
} from '../../../core/i18n/selection-labels';
import { PositionService } from '../../../core/services/position.service';

@Component({
  selector: 'sh-selection-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatTabsModule],
  templateUrl: './selection-layout.component.html',
  styleUrl: './selection-layout.component.scss',
})
export class SelectionLayoutComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly positionService = inject(PositionService);

  positionId = +this.route.snapshot.paramMap.get('positionId')!;
  positionHeader: { requisitionNo: string; name: string; client: string } | null = null;

  readonly pageTitle = SELECTION_PAGE_TITLE;
  readonly tabs = [
    { label: SELECTION_TAB_AI, path: 'ai', icon: 'psychology' },
    { label: SELECTION_TAB_PRESELECTION, path: 'preselection', icon: 'filter_list' },
    { label: SELECTION_TAB_ANALYSIS, path: 'analysis', icon: 'analytics' },
  ];

  constructor() {
    this.positionService.getById(this.positionId).subscribe({
      next: (position) => {
        this.positionHeader = {
          requisitionNo: position.requisitionNo,
          name: position.clientPosition,
          client: position.legalName,
        };
      },
      error: () => {
        this.positionHeader = null;
      },
    });
  }
}
