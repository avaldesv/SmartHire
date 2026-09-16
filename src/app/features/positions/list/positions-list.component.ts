import { Component } from '@angular/core';
import { PositionsPanelComponent } from '../shared/positions-panel/positions-panel.component';

@Component({
  selector: 'sh-positions-list',
  standalone: true,
  imports: [PositionsPanelComponent],
  templateUrl: './positions-list.component.html',
  styleUrl: './positions-list.component.scss',
})
export class PositionsListComponent {}
