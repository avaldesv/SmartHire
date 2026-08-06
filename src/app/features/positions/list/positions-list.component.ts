import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  POSITIONS_CLEAR_FILTERS,
  POSITIONS_LESS_FILTERS,
  POSITIONS_MORE_FILTERS,
  POSITIONS_NEW_BUTTON,
  POSITIONS_PAGE_SUBTITLE,
  POSITIONS_PAGE_TITLE,
} from '../../../core/i18n/positions-labels';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PositionsTableComponent } from '../shared/positions-table/positions-table.component';

@Component({
  selector: 'sh-positions-list',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, PageHeaderComponent, PositionsTableComponent],
  templateUrl: './positions-list.component.html',
  styleUrl: './positions-list.component.scss',
})
export class PositionsListComponent {
  readonly pageTitle = POSITIONS_PAGE_TITLE;
  readonly pageSubtitle = POSITIONS_PAGE_SUBTITLE;
  readonly newButton = POSITIONS_NEW_BUTTON;
  readonly clearFiltersLabel = POSITIONS_CLEAR_FILTERS;
  readonly moreFiltersLabel = POSITIONS_MORE_FILTERS;
  readonly lessFiltersLabel = POSITIONS_LESS_FILTERS;
}
