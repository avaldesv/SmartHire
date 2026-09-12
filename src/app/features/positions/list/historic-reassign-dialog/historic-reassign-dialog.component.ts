import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { FeedbackDialogService } from '../../../../core/feedback/feedback-dialog.service';
import {
  ShModalActionsDirective,
  ShModalFormComponent,
} from '../../../../shared/components/modal-form/sh-modal-form.component';
import { COMMON_CANCEL } from '../../../../core/i18n/nav-labels';
import {
  HISTORIC_REASSIGN_EDUCATION,
  HISTORIC_REASSIGN_EDUCATION_ANY,
  HISTORIC_REASSIGN_NOTIFY_EMAIL,
  HISTORIC_REASSIGN_NOTIFY_WA,
  HISTORIC_REASSIGN_POSTULATE,
  HISTORIC_REASSIGN_POSTULATE_OK,
  HISTORIC_REASSIGN_REASSIGN_HINT,
  HISTORIC_REASSIGN_SEARCH,
  HISTORIC_REASSIGN_SEARCH_BTN,
  HISTORIC_REASSIGN_SELECT_ONE,
  HISTORIC_REASSIGN_SOURCE,
  HISTORIC_REASSIGN_SOURCE_HISTORY,
  HISTORIC_REASSIGN_SOURCE_REASSIGN,
  HISTORIC_REASSIGN_TITLE,
} from '../../../../core/i18n/historic-reassign-labels';
import { CatalogEducationLevelService } from '../../../../core/services/catalog-education-level.service';
import { HistoricEmployeeApiService } from '../../../../core/services/historic-employee-api.service';
import { HistoricEmployee } from '../../../../shared/models/historic-employee.model';
import { CatalogEducationLevel } from '../../../../shared/models/catalog-education-level.model';

export interface HistoricReassignDialogData {
  positionId: number;
}

@Component({
  selector: 'sh-historic-reassign-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    ShModalFormComponent,
    ShModalActionsDirective,
  ],
  templateUrl: './historic-reassign-dialog.component.html',
  styleUrl: './historic-reassign-dialog.component.scss',
})
export class HistoricReassignDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<HistoricReassignDialogComponent>);
  private readonly data = inject<HistoricReassignDialogData>(MAT_DIALOG_DATA);
  private readonly api = inject(HistoricEmployeeApiService);
  private readonly educationApi = inject(CatalogEducationLevelService);
  private readonly feedback = inject(FeedbackDialogService);

  readonly title = HISTORIC_REASSIGN_TITLE;
  readonly sourceLabel = HISTORIC_REASSIGN_SOURCE;
  readonly sourceHistory = HISTORIC_REASSIGN_SOURCE_HISTORY;
  readonly sourceReassign = HISTORIC_REASSIGN_SOURCE_REASSIGN;
  readonly reassignHint = HISTORIC_REASSIGN_REASSIGN_HINT;
  readonly searchLabel = HISTORIC_REASSIGN_SEARCH;
  readonly searchBtn = HISTORIC_REASSIGN_SEARCH_BTN;
  readonly educationLabel = HISTORIC_REASSIGN_EDUCATION;
  readonly educationAny = HISTORIC_REASSIGN_EDUCATION_ANY;
  readonly postulateLabel = HISTORIC_REASSIGN_POSTULATE;
  readonly notifyEmailLabel = HISTORIC_REASSIGN_NOTIFY_EMAIL;
  readonly notifyWaLabel = HISTORIC_REASSIGN_NOTIFY_WA;
  readonly cancelLabel = COMMON_CANCEL;

  sourceKind = 'HISTORICAL';
  search = '';
  educationLevelId: number | null = null;
  educationLevels: CatalogEducationLevel[] = [];
  notifyEmail = true;
  notifyWhatsApp = true;
  loading = false;
  posting = false;
  rows: HistoricEmployee[] = [];
  total = 0;
  page = 0;
  size = 20;
  selected = new Set<number>();
  displayedColumns = [
    'select',
    'id',
    'countryName',
    'firstName',
    'lastNames',
    'email',
    'phone',
    'mobilePhone',
    'employmentRecordStatus',
    'jobTitle',
    'birthDate',
    'salary',
    'educationLevelName',
    'recruitmentSource',
    'originSystem',
  ];

  constructor() {
    this.educationApi.list(0, 0, 200).subscribe({
      next: (res) => (this.educationLevels = res.items ?? []),
      error: () => (this.educationLevels = []),
    });
    this.load();
  }

  load(): void {
    if (this.sourceKind !== 'HISTORICAL') {
      this.rows = [];
      this.total = 0;
      return;
    }
    this.loading = true;
    this.api.list(this.page, this.size, this.search, 'HISTORICAL', this.educationLevelId).subscribe({
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

  toggle(id: number, checked: boolean): void {
    if (checked) {
      this.selected.add(id);
    } else {
      this.selected.delete(id);
    }
  }

  isChecked(id: number): boolean {
    return this.selected.has(id);
  }

  close(): void {
    this.dialogRef.close();
  }

  postulate(): void {
    if (this.selected.size === 0) {
      this.feedback.showWarning(HISTORIC_REASSIGN_SELECT_ONE, '');
      return;
    }
    this.posting = true;
    this.api
      .postulate(this.data.positionId, [...this.selected], this.notifyEmail, this.notifyWhatsApp)
      .subscribe({
        next: () => {
          this.posting = false;
          this.feedback.showSuccess(HISTORIC_REASSIGN_POSTULATE_OK);
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.posting = false;
          this.feedback.showApiError(err);
        },
      });
  }
}
