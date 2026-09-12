import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { catalogDialogConfig } from '../../../core/dialog/catalog-dialog.constants';
import { FeedbackDialogService } from '../../../core/feedback/feedback-dialog.service';
import { COMMON_CLEAR_FILTERS, COMMON_SEARCH } from '../../../core/i18n/common-labels';
import {
  HISTORIC_REASSIGN_IMPORT,
  HISTORIC_REASSIGN_IMPORT_OK,
  HISTORIC_REASSIGN_TITLE,
} from '../../../core/i18n/historic-reassign-labels';
import { HistoricEmployeeApiService } from '../../../core/services/historic-employee-api.service';
import { HistoricEmployee } from '../../../shared/models/historic-employee.model';
import { HistoricEmployeeImportDialogComponent } from './historic-employee-import-dialog.component';

@Component({
  selector: 'sh-historic-employee-catalog-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './historic-employee-catalog-panel.component.html',
  styleUrl: './historic-employee-catalog-panel.component.scss',
})
export class HistoricEmployeeCatalogPanelComponent {
  private readonly api = inject(HistoricEmployeeApiService);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly dialog = inject(MatDialog);

  readonly title = HISTORIC_REASSIGN_TITLE;
  readonly searchLabel = COMMON_SEARCH;
  readonly clearLabel = COMMON_CLEAR_FILTERS;
  readonly importLabel = HISTORIC_REASSIGN_IMPORT;

  search = '';
  loading = false;
  rows: HistoricEmployee[] = [];
  total = 0;
  page = 0;
  size = 20;
  displayedColumns = ['id', 'firstName', 'lastNames', 'email', 'jobTitle', 'sourceKind', 'employmentRecordStatus'];

  constructor() {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.list(this.page, this.size, this.search, null, null).subscribe({
      next: (res) => {
        this.rows = res.items;
        this.total = res.total;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.feedback.showApiError(err);
      },
    });
  }

  onPage(event: PageEvent): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.load();
  }

  openImport(): void {
    this.dialog
      .open(HistoricEmployeeImportDialogComponent, catalogDialogConfig('920px', { maxWidth: '96vw' }))
      .afterClosed()
      .subscribe((imported) => {
        if (imported) {
          this.feedback.showSuccess(HISTORIC_REASSIGN_IMPORT_OK);
          this.page = 0;
          this.load();
        }
      });
  }
}
