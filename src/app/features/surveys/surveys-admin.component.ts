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
import { debounceTime, filter } from 'rxjs';
import { AppPermissions } from '../../core/auth/app-permissions';
import { catalogTallDialogConfig } from '../../core/dialog/catalog-dialog.constants';
import { FeedbackDialogService } from '../../core/feedback/feedback-dialog.service';
import { COMMON_CLEAR_FILTERS } from '../../core/i18n/common-labels';
import { FEEDBACK_GENERIC_WARNING_TITLE } from '../../core/i18n/feedback-labels';
import {
  SURVEYS_COL_ACTIVE,
  SURVEYS_COL_DESCRIPTION,
  SURVEYS_COL_NAME,
  SURVEYS_COL_QUESTIONS,
  SURVEYS_EMPTY,
  SURVEYS_ERRORS_DELETE,
  SURVEYS_ERRORS_LIST,
  SURVEYS_NEW_BUTTON,
  SURVEYS_PAGE_TITLE,
  SURVEYS_SEARCH,
  SURVEYS_SUCCESS_DELETED,
  SURVEYS_SUCCESS_SAVED,
  surveysDeleteConfirm,
} from '../../core/i18n/survey-labels';
import { PermissionService } from '../../core/services/permission.service';
import { SurveyApiService } from '../../core/services/survey-api.service';
import { WizardFieldCatalogService } from '../../core/services/wizard-field-catalog.service';
import { ShPaginatorComponent } from '../../shared/components/paginator/sh-paginator.component';
import { TableRowActionsComponent } from '../../shared/components/table-row-actions/table-row-actions.component';
import { SurveyListItem } from '../../shared/models/survey.model';
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
  deletingId: number | null = null;
  data: SurveyListItem[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;

  readonly columns = ['name', 'description', 'questionCount', 'isActive', 'actions'];

  readonly pageTitle = SURVEYS_PAGE_TITLE;
  readonly newButton = SURVEYS_NEW_BUTTON;
  readonly searchLabel = SURVEYS_SEARCH;
  readonly columnName = SURVEYS_COL_NAME;
  readonly columnDescription = SURVEYS_COL_DESCRIPTION;
  readonly columnQuestions = SURVEYS_COL_QUESTIONS;
  readonly columnActive = SURVEYS_COL_ACTIVE;
  readonly emptyLabel = SURVEYS_EMPTY;
  readonly clearFiltersLabel = COMMON_CLEAR_FILTERS;

  readonly searchForm = this.fb.nonNullable.group({ search: [''] });

  ngOnInit(): void {
    this.load();
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
      },
      error: (err) => {
        this.loading = false;
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
            this.load();
          },
          error: (err) => {
            this.deletingId = null;
            this.feedback.showApiError(err, { fallbackMessage: SURVEYS_ERRORS_DELETE });
          },
        });
      });
  }
}
