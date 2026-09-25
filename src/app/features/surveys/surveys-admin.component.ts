import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { debounceTime, filter, forkJoin } from 'rxjs';
import { AppPermissions } from '../../core/auth/app-permissions';
import { catalogTallDialogConfig } from '../../core/dialog/catalog-dialog.constants';
import { FeedbackDialogService } from '../../core/feedback/feedback-dialog.service';
import { COMMON_CLEAR_FILTERS } from '../../core/i18n/common-labels';
import { FEEDBACK_GENERIC_WARNING_TITLE } from '../../core/i18n/feedback-labels';
import {
  SURVEYS_COL_DESCRIPTION,
  SURVEYS_COL_NAME,
  SURVEYS_COL_QUESTIONS,
  SURVEYS_COL_STATUS,
  SURVEYS_EMPTY,
  SURVEYS_ERRORS_DELETE,
  SURVEYS_ERRORS_LIST,
  SURVEYS_KPI_ACTIVE,
  SURVEYS_KPI_AVG_QUESTIONS,
  SURVEYS_KPI_TOTAL,
  SURVEYS_NEW_BUTTON,
  SURVEYS_PREVIEW_EMPTY,
  SURVEYS_PREVIEW_NO_QUESTIONS,
  SURVEYS_PREVIEW_TITLE,
  SURVEYS_SEARCH,
  SURVEYS_STATUS_ACTIVE,
  SURVEYS_STATUS_INACTIVE,
  SURVEYS_SUCCESS_DELETED,
  SURVEYS_SUCCESS_SAVED,
  surveysDeleteConfirm,
} from '../../core/i18n/survey-labels';
import { PermissionService } from '../../core/services/permission.service';
import { SurveyApiService } from '../../core/services/survey-api.service';
import { WizardFieldCatalogService } from '../../core/services/wizard-field-catalog.service';
import { KpiCardComponent } from '../../shared/components/kpi-card/kpi-card.component';
import { ShPaginatorComponent } from '../../shared/components/paginator/sh-paginator.component';
import { TableRowActionsComponent } from '../../shared/components/table-row-actions/table-row-actions.component';
import { SurveyDetail, SurveyListItem } from '../../shared/models/survey.model';
import {
  SurveyFormDialogComponent,
  SurveyFormDialogData,
} from './survey-form-dialog.component';

@Component({
  selector: 'sh-surveys-admin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    ShPaginatorComponent,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    TableRowActionsComponent,
    KpiCardComponent,
  ],
  templateUrl: './surveys-admin.component.html',
  styleUrl: './surveys-admin.component.scss',
})
export class SurveysAdminComponent implements OnInit {
  private readonly api = inject(SurveyApiService);
  private readonly permissions = inject(PermissionService);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);
  private readonly wizardCatalog = inject(WizardFieldCatalogService);

  loading = true;
  previewLoading = false;
  deletingId: number | null = null;
  data: SurveyListItem[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;
  selectedId: number | null = null;
  preview: SurveyDetail | null = null;

  kpiTotal = 0;
  kpiActive = 0;
  kpiAvgQuestions: number | string = '—';

  readonly columns = ['name', 'description', 'questionCount', 'isActive', 'actions'];

  readonly labels = {
    newButton: SURVEYS_NEW_BUTTON,
    search: SURVEYS_SEARCH,
    colName: SURVEYS_COL_NAME,
    colDescription: SURVEYS_COL_DESCRIPTION,
    colQuestions: SURVEYS_COL_QUESTIONS,
    colStatus: SURVEYS_COL_STATUS,
    statusActive: SURVEYS_STATUS_ACTIVE,
    statusInactive: SURVEYS_STATUS_INACTIVE,
    empty: SURVEYS_EMPTY,
    clearFilters: COMMON_CLEAR_FILTERS,
    kpiTotal: SURVEYS_KPI_TOTAL,
    kpiActive: SURVEYS_KPI_ACTIVE,
    kpiAvgQuestions: SURVEYS_KPI_AVG_QUESTIONS,
    previewTitle: SURVEYS_PREVIEW_TITLE,
    previewEmpty: SURVEYS_PREVIEW_EMPTY,
    previewNoQuestions: SURVEYS_PREVIEW_NO_QUESTIONS,
    edit: $localize`:@@surveys.preview.edit:Editar`,
  };

  readonly searchForm = this.fb.nonNullable.group({ search: [''] });

  ngOnInit(): void {
    this.load();
    this.loadKpis();
    this.searchForm.controls.search.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.pageIndex = 0;
      this.load();
    });
  }

  canCreate(): boolean {
    return this.permissions.hasAuthority(AppPermissions.SURVEY_CREATE);
  }

  canEdit(): boolean {
    return this.permissions.hasAuthority(AppPermissions.SURVEY_EDIT);
  }

  canDelete(): boolean {
    return this.permissions.hasAuthority(AppPermissions.SURVEY_DELETE);
  }

  load(): void {
    this.loading = true;
    const search = this.searchForm.controls.search.value.trim() || null;
    this.api.list({ search, isActive: null }, this.pageIndex, this.pageSize).subscribe({
      next: ({ items, total }) => {
        this.data = items;
        this.total = total;
        this.loading = false;
        if (items.length && (this.selectedId == null || !items.some((i) => i.id === this.selectedId))) {
          this.selectRow(items[0]);
        } else if (!items.length) {
          this.selectedId = null;
          this.preview = null;
        }
      },
      error: (err) => {
        this.loading = false;
        this.feedback.showApiError(err, { fallbackMessage: SURVEYS_ERRORS_LIST });
      },
    });
  }

  loadKpis(): void {
    forkJoin({
      all: this.api.list({ isActive: null }, 0, 1),
      active: this.api.list({ isActive: true }, 0, 1),
      sample: this.api.list({ isActive: null }, 0, 100),
    }).subscribe({
      next: ({ all, active, sample }) => {
        this.kpiTotal = all.total;
        this.kpiActive = active.total;
        const counts = sample.items
          .map((i) => i.questionCount ?? 0)
          .filter((n) => n >= 0);
        if (!counts.length) {
          this.kpiAvgQuestions = '—';
          return;
        }
        const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
        this.kpiAvgQuestions = Math.round(avg * 10) / 10;
      },
      error: () => {
        this.kpiTotal = 0;
        this.kpiActive = 0;
        this.kpiAvgQuestions = '—';
      },
    });
  }

  selectRow(row: SurveyListItem): void {
    if (this.selectedId === row.id && this.preview) {
      return;
    }
    this.selectedId = row.id;
    this.previewLoading = true;
    this.api.getById(row.id).subscribe({
      next: (detail) => {
        this.preview = detail;
        this.previewLoading = false;
      },
      error: (err) => {
        this.previewLoading = false;
        this.preview = null;
        this.feedback.showApiError(err, { fallbackMessage: SURVEYS_ERRORS_LIST });
      },
    });
  }

  onPage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.load();
  }

  clearFilters(): void {
    this.searchForm.controls.search.setValue('');
    this.pageIndex = 0;
    this.load();
  }

  openCreate(): void {
    if (!this.canCreate()) {
      return;
    }
    this.openDialog({});
  }

  openEdit(row: SurveyListItem): void {
    if (!this.canEdit()) {
      return;
    }
    this.openDialog({ surveyId: row.id });
  }

  openEditFromPreview(): void {
    if (this.selectedId == null || !this.canEdit()) {
      return;
    }
    this.openDialog({ surveyId: this.selectedId });
  }

  private openDialog(data: SurveyFormDialogData): void {
    const ref = this.dialog.open<SurveyFormDialogComponent, SurveyFormDialogData, boolean>(
      SurveyFormDialogComponent,
      {
        ...catalogTallDialogConfig('880px'),
        data,
      },
    );
    ref
      .afterClosed()
      .pipe(filter((saved): saved is boolean => saved === true))
      .subscribe(() => {
        this.feedback.showSuccess(SURVEYS_SUCCESS_SAVED);
        this.wizardCatalog.clearCache('surveys');
        this.load();
        this.loadKpis();
        if (this.selectedId != null) {
          const id = this.selectedId;
          this.selectedId = null;
          const row = this.data.find((d) => d.id === id);
          if (row) {
            this.selectRow(row);
          }
        }
      });
  }

  deleteSurvey(row: SurveyListItem): void {
    if (!this.canDelete()) {
      return;
    }
    this.feedback
      .confirm({
        title: FEEDBACK_GENERIC_WARNING_TITLE,
        message: surveysDeleteConfirm(row.name),
        confirmWarn: true,
      })
      .subscribe((ok) => {
        if (!ok) {
          return;
        }
        this.deletingId = row.id;
        this.api.delete(row.id).subscribe({
          next: () => {
            this.deletingId = null;
            this.feedback.showSuccess(SURVEYS_SUCCESS_DELETED);
            this.wizardCatalog.clearCache('surveys');
            if (this.selectedId === row.id) {
              this.selectedId = null;
              this.preview = null;
            }
            this.load();
            this.loadKpis();
          },
          error: (err) => {
            this.deletingId = null;
            this.feedback.showApiError(err, { fallbackMessage: SURVEYS_ERRORS_DELETE });
          },
        });
      });
  }
}
