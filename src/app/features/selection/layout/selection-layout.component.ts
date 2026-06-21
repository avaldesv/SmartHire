import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
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

  readonly tabs = [
    { label: 'Perfil gestión (AI)', path: 'ai', icon: 'psychology' },
    { label: 'Preselección', path: 'preselection', icon: 'filter_list' },
    { label: 'Análisis', path: 'analysis', icon: 'analytics' },
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
