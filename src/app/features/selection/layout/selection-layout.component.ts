import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { RequisitionService } from '../../../mock/services/requisition.service';
import { Requisition } from '../../../shared/models';

@Component({
  selector: 'sh-selection-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatTabsModule],
  templateUrl: './selection-layout.component.html',
  styleUrl: './selection-layout.component.scss',
})
export class SelectionLayoutComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly reqService = inject(RequisitionService);

  positionId = +this.route.snapshot.paramMap.get('positionId')!;
  requisition: Requisition | null = null;

  readonly tabs = [
    { label: 'Perfil gestión (AI)', path: 'ai', icon: 'psychology' },
    { label: 'Preselección', path: 'preselection', icon: 'filter_list' },
    { label: 'Análisis', path: 'analysis', icon: 'analytics' },
  ];

  constructor() {
    this.reqService.getById(this.positionId).subscribe((r) => (this.requisition = r ?? null));
  }
}
