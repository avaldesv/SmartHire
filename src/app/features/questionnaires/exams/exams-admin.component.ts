import { Component, OnInit, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { filter, switchMap } from 'rxjs';
import { AppPermissions } from '../../../core/auth/app-permissions';
import {
  QEXAM_ATTEMPTS_UNLIMITED,
  QEXAM_COL_ATTEMPTS,
  QEXAM_COL_NAME,
  QEXAM_COL_QUESTIONNAIRE,
  QEXAM_COL_QUESTIONS,
  QEXAM_COL_SCOPE,
  QEXAM_COL_STATUS,
  QEXAM_EMPTY,
  QEXAM_ERRORS_DELETE,
  QEXAM_ERRORS_LIST,
  QEXAM_ERRORS_SAVE,
  QEXAM_FIELD_ACTIVE,
  QEXAM_FILTER_ALL,
  QEXAM_FILTER_APPLY,
  QEXAM_FILTER_CLEAR,
  QEXAM_FILTER_NAME,
  QEXAM_FILTER_QUESTIONNAIRE,
  QEXAM_FILTER_STATUS,
  QEXAM_NEW_BUTTON,
  QEXAM_SNACK_CLOSE,
  QEXAM_STATUS_ARCHIVED,
  QEXAM_STATUS_DRAFT,
  QEXAM_STATUS_PUBLISHED,
  QEXAM_SUCCESS_DELETED,
  QEXAM_SUCCESS_SAVED,
  qexamDeleteConfirm,
  qexamStatusLabel,
} from '../../../core/i18n/questionnaire-exams-labels';
import { PermissionService } from '../../../core/services/permission.service';
import { QuestionnaireExamApiService } from '../../../core/services/questionnaire-exam-api.service';
import { QuestionnaireQuestionnaireApiService } from '../../../core/services/questionnaire-questionnaire-api.service';
import { QUESTIONNAIRE_CSV_PANELS } from '../../../core/questionnaire/questionnaire-import-export.registry';
import { QuestionnaireImportExportActionsComponent } from '../shared/questionnaire-import-export-actions.component';
import { ScopeBadgeComponent } from '../../../shared/components/scope-badge/scope-badge.component';
import { TableRowActionsComponent } from '../../../shared/components/table-row-actions/table-row-actions.component';
import { ExamItem, QuestionnaireItem } from '../../../shared/models/questionnaire-v2.model';
import { canEditScopedRecord } from '../../../shared/utils/tenant-scope.util';
import { ExamFormDialogComponent, ExamFormDialogData } from './exam-form-dialog.component';

@Component({
  selector: 'sh-exams-admin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    ScopeBadgeComponent,
    TableRowActionsComponent,
    QuestionnaireImportExportActionsComponent,
  ],
  templateUrl: './exams-admin.component.html',
  styleUrl: './exams-admin.component.scss',
})
export class ExamsAdminComponent implements OnInit {
  private readonly api = inject(QuestionnaireExamApiService);
  private readonly questionnaireApi = inject(QuestionnaireQuestionnaireApiService);
  private readonly permissions = inject(PermissionService);
  private readonly snack = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);

  readonly csvPanel = QUESTIONNAIRE_CSV_PANELS.exams;

  readonly isGlobalAdmin = computed(() => this.permissions.isGlobalAdmin());

  loading = true;
  savingId: number | null = null;
  deletingId: number | null = null;
  data: ExamItem[] = [];
  publishedQuestionnaires: QuestionnaireItem[] = [];
  questionnaireMap = new Map<number, string>();
  total = 0;
  pageIndex = 0;
  pageSize = 10;

  readonly columns = ['name', 'questionnaire', 'status', 'questions', 'attempts', 'scope', 'active', 'actions'];

  readonly newButton = QEXAM_NEW_BUTTON;
  readonly emptyLabel = QEXAM_EMPTY;
  readonly filterName = QEXAM_FILTER_NAME;
  readonly filterQuestionnaire = QEXAM_FILTER_QUESTIONNAIRE;
  readonly filterStatus = QEXAM_FILTER_STATUS;
  readonly filterAll = QEXAM_FILTER_ALL;
  readonly filterApply = QEXAM_FILTER_APPLY;
  readonly filterClear = QEXAM_FILTER_CLEAR;
  readonly columnName = QEXAM_COL_NAME;
  readonly columnQuestionnaire = QEXAM_COL_QUESTIONNAIRE;
  readonly columnStatus = QEXAM_COL_STATUS;
  readonly columnQuestions = QEXAM_COL_QUESTIONS;
  readonly columnAttempts = QEXAM_COL_ATTEMPTS;
  readonly columnScope = QEXAM_COL_SCOPE;
  readonly fieldActive = QEXAM_FIELD_ACTIVE;
  readonly attemptsUnlimited = QEXAM_ATTEMPTS_UNLIMITED;

  readonly statusOptions = [
    { value: '', label: QEXAM_FILTER_ALL },
    { value: 'draft', label: QEXAM_STATUS_DRAFT },
    { value: 'published', label: QEXAM_STATUS_PUBLISHED },
    { value: 'archived', label: QEXAM_STATUS_ARCHIVED },
  ];

  readonly filterForm = this.fb.nonNullable.group({
    name: [''],
    questionnaireId: [null as number | null],
    status: [''],
  });

  ngOnInit(): void {
    this.questionnaireApi.list({ status: 'published' }, 0, 500).subscribe({
      next: ({ items }) => {
        this.publishedQuestionnaires = items;
        this.questionnaireMap = new Map(items.map((q) => [q.id, q.name]));
      },
    });
    this.load();
  }

  canCreate(): boolean {
    return this.permissions.hasAuthority(AppPermissions.QUESTIONNAIRE_CREATE);
  }

  canEdit(): boolean {
    return this.permissions.hasAuthority(AppPermissions.QUESTIONNAIRE_EDIT);
  }

  canDelete(): boolean {
    return this.permissions.hasAuthority(AppPermissions.QUESTIONNAIRE_DELETE);
  }

  canEditRecord(companyId?: number | null): boolean {
    return this.canEdit() && canEditScopedRecord(companyId, this.isGlobalAdmin());
  }

  canDeleteRecord(row: ExamItem): boolean {
    return this.canDelete() && this.canEditRecord(row.companyId);
  }

  questionnaireName(id: number): string {
    return this.questionnaireMap.get(id) ?? `#${id}`;
  }

  statusLabel(status: string): string {
    return qexamStatusLabel(status);
  }

  attemptsLabel(maxAttempts?: number | null): string {
    return maxAttempts == null ? this.attemptsUnlimited : String(maxAttempts);
  }

  load(): void {
    this.loading = true;
    const filters = this.filterForm.getRawValue();
    this.api
      .list(
        {
          name: filters.name.trim() || null,
          questionnaireId: filters.questionnaireId,
          status: filters.status || null,
        },
        this.pageIndex,
        this.pageSize,
      )
      .subscribe({
        next: ({ items, total }) => {
          this.data = items;
          this.total = total;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.snack.open(QEXAM_ERRORS_LIST, QEXAM_SNACK_CLOSE, { duration: 3500 });
        },
      });
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.load();
  }

  clearFilters(): void {
    this.filterForm.reset({ name: '', questionnaireId: null, status: '' });
    this.pageIndex = 0;
    this.load();
  }

  onPage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.load();
  }

  openCreate(): void {
    this.openDialog({});
  }

  openEdit(row: ExamItem): void {
    if (!this.canEditRecord(row.companyId)) {
      return;
    }
    this.openDialog({ examId: row.id });
  }

  private openDialog(data: ExamFormDialogData): void {
    const ref = this.dialog.open<ExamFormDialogComponent, ExamFormDialogData, boolean>(ExamFormDialogComponent, {
      width: '820px',
      maxWidth: '95vw',
      data,
    });
    ref
      .afterClosed()
      .pipe(filter((saved): saved is boolean => saved === true))
      .subscribe(() => {
        this.snack.open(QEXAM_SUCCESS_SAVED, QEXAM_SNACK_CLOSE, { duration: 2500 });
        this.load();
      });
  }

  toggle(row: ExamItem, active: boolean): void {
    if (!this.canEditRecord(row.companyId)) {
      return;
    }
    const previous = row.isActive;
    row.isActive = active;
    this.savingId = row.id;
    this.api
      .getById(row.id)
      .pipe(
        switchMap((exam) =>
          this.api.update(row.id, {
            questionnaireId: exam.questionnaireId,
            name: exam.name,
            description: exam.description ?? undefined,
            numberOfQuestions: exam.numberOfQuestions,
            defaultWeight: exam.defaultWeight ?? undefined,
            defaultTimeLimitSeconds: exam.defaultTimeLimitSeconds ?? undefined,
            generationConfig: exam.generationConfig ?? undefined,
            randomSeed: exam.randomSeed ?? undefined,
            startDate: exam.startDate ?? undefined,
            endDate: exam.endDate ?? undefined,
            totalTimeMinutes: exam.totalTimeMinutes ?? undefined,
            acceptancePercent: exam.acceptancePercent ?? undefined,
            maxAttempts: exam.maxAttempts ?? undefined,
            retryDelayDays: exam.retryDelayDays ?? undefined,
            status: exam.status,
            isActive: active,
          }),
        ),
      )
      .subscribe({
        next: (updated) => {
          Object.assign(row, updated);
          this.savingId = null;
        },
        error: () => {
          row.isActive = previous;
          this.savingId = null;
          this.snack.open(QEXAM_ERRORS_SAVE, QEXAM_SNACK_CLOSE, { duration: 3500 });
        },
      });
  }

  deleteExam(row: ExamItem): void {
    if (!this.canDeleteRecord(row)) {
      return;
    }
    if (!confirm(qexamDeleteConfirm(row.name))) {
      return;
    }
    this.deletingId = row.id;
    this.api.delete(row.id).subscribe({
      next: () => {
        this.deletingId = null;
        this.snack.open(QEXAM_SUCCESS_DELETED, QEXAM_SNACK_CLOSE, { duration: 3000 });
        this.load();
      },
      error: () => {
        this.deletingId = null;
        this.snack.open(QEXAM_ERRORS_DELETE, QEXAM_SNACK_CLOSE, { duration: 3500 });
      },
    });
  }
}
