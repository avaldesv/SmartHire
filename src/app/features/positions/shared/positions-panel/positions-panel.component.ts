import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  POSITIONS_CLEAR_FILTERS,
  POSITIONS_LESS_FILTERS,
  POSITIONS_MORE_FILTERS,
  POSITIONS_NEW_BUTTON,
  POSITIONS_PAGE_SUBTITLE,
  POSITIONS_PAGE_TITLE,
} from '../../../../core/i18n/positions-labels';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { PositionsTableComponent } from '../positions-table/positions-table.component';

/**
 * Shared Positions block: title, subtitle, filter/new actions, filters, table and paginator.
 * Used by Positions menu and Home dashboard.
 */
@Component({
  selector: 'sh-positions-panel',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, PageHeaderComponent, PositionsTableComponent],
  templateUrl: './positions-panel.component.html',
  styleUrl: './positions-panel.component.scss',
})
export class PositionsPanelComponent {
  @ViewChild('table') readonly table!: PositionsTableComponent;

  /** Forwarded from the table (e.g. Home KPIs refresh). */
  @Output() readonly changed = new EventEmitter<void>();

  readonly pageTitle = POSITIONS_PAGE_TITLE;
  readonly pageSubtitle = POSITIONS_PAGE_SUBTITLE;
  readonly newButton = POSITIONS_NEW_BUTTON;
  readonly clearFiltersLabel = POSITIONS_CLEAR_FILTERS;
  readonly moreFiltersLabel = POSITIONS_MORE_FILTERS;
  readonly lessFiltersLabel = POSITIONS_LESS_FILTERS;

  onTableChanged(): void {
    this.changed.emit();
  }
}
