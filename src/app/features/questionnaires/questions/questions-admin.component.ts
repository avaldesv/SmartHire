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
  QQUEST_COL_CATEGORY,
  QQUEST_COL_DIFFICULTY,
  QQUEST_COL_LOCKED,
  QQUEST_COL_SCOPE,
  QQUEST_COL_TEXT,
  QQUEST_COL_TYPE,
  QQUEST_EMPTY,
  QQUEST_ERRORS_DELETE,
  QQUEST_ERRORS_LIST,
  QQUEST_ERRORS_SAVE,
  QQUEST_FIELD_ACTIVE,
  QQUEST_FILTER_ALL,
  QQUEST_FILTER_APPLY,
  QQUEST_FILTER_CATEGORY,
  QQUEST_FILTER_CLEAR,
  QQUEST_FILTER_TEXT,
  QQUEST_FILTER_TYPE,
  QQUEST_NEW_BUTTON,
  QQUEST_SNACK_CLOSE,
  QQUEST_SUCCESS_DELETED,
  QQUEST_SUCCESS_SAVED,
  QQUEST_TYPE_OPEN,
  QQUEST_TYPE_SINGLE,
  QQUEST_TYPE_MULTIPLE,
  QQUEST_TYPE_YES_NO,
  qquestDeleteConfirm,
  qquestTypeLabel,
} from '../../../core/i18n/questionnaire-questions-labels';
import { PermissionService } from '../../../core/services/permission.service';
import { QuestionnaireKnowledgeCategoryApiService } from '../../../core/services/questionnaire-knowledge-category-api.service';
import { QuestionnaireV2QuestionApiService } from '../../../core/services/questionnaire-v2-question-api.service';
import { QUESTIONNAIRE_CSV_PANELS } from '../../../core/questionnaire/questionnaire-import-export.registry';
import { QuestionnaireImportExportActionsComponent } from '../shared/questionnaire-import-export-actions.component';
import { ScopeBadgeComponent } from '../../../shared/components/scope-badge/scope-badge.component';
import { TableRowActionsComponent } from '../../../shared/components/table-row-actions/table-row-actions.component';
import { KnowledgeCategoryItem, QuestionItem } from '../../../shared/models/questionnaire-v2.model';
import { canEditScopedRecord } from '../../../shared/utils/tenant-scope.util';
import {
  QuestionFormDialogComponent,
  QuestionFormDialogData,
} from './question-form-dialog.component';

@Component({
  selector: 'sh-questions-admin',
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
  templateUrl: './questions-admin.component.html',
  styleUrl: './questions-admin.component.scss',
})
export class QuestionsAdminComponent implements OnInit {
  private readonly api = inject(QuestionnaireV2QuestionApiService);
  private readonly categoryApi = inject(QuestionnaireKnowledgeCategoryApiService);
  private readonly permissions = inject(PermissionService);
  private readonly snack = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);

  readonly csvQuestions = QUESTIONNAIRE_CSV_PANELS.questions;
  readonly csvQuestionOptions = QUESTIONNAIRE_CSV_PANELS.questionOptions;

  readonly isGlobalAdmin = computed(() => this.permissions.isGlobalAdmin());

  loading = true;
  savingId: number | null = null;
  deletingId: number | null = null;
  data: QuestionItem[] = [];
  categories: KnowledgeCategoryItem[] = [];
  categoryMap = new Map<number, string>();
  total = 0;
  pageIndex = 0;
  pageSize = 10;

  readonly columns = ['text', 'type', 'category', 'difficulty', 'scope', 'locked', 'active', 'actions'];
  readonly textPreviewLength = 60;

  readonly newButton = QQUEST_NEW_BUTTON;
  readonly emptyLabel = QQUEST_EMPTY;
  readonly filterText = QQUEST_FILTER_TEXT;
  readonly filterCategory = QQUEST_FILTER_CATEGORY;
  readonly filterType = QQUEST_FILTER_TYPE;
  readonly filterAll = QQUEST_FILTER_ALL;
  readonly filterApply = QQUEST_FILTER_APPLY;
  readonly filterClear = QQUEST_FILTER_CLEAR;
  readonly columnText = QQUEST_COL_TEXT;
  readonly columnType = QQUEST_COL_TYPE;
  readonly columnCategory = QQUEST_COL_CATEGORY;
  readonly columnDifficulty = QQUEST_COL_DIFFICULTY;
  readonly columnScope = QQUEST_COL_SCOPE;
  readonly columnLocked = QQUEST_COL_LOCKED;
  readonly fieldActive = QQUEST_FIELD_ACTIVE;

  readonly typeOptions = [
    { value: '', label: QQUEST_FILTER_ALL },
    { value: 'single_choice', label: QQUEST_TYPE_SINGLE },
    { value: 'multiple_choice', label: QQUEST_TYPE_MULTIPLE },
    { value: 'yes_no', label: QQUEST_TYPE_YES_NO },
    { value: 'open', label: QQUEST_TYPE_OPEN },
  ];

  readonly filterForm = this.fb.nonNullable.group({
    text: [''],
    knowledgeCategoryId: [null as number | null],
    type: [''],
  });

  ngOnInit(): void {
    this.categoryApi.list({ isActive: true }, 0, 500).subscribe({
      next: ({ items }) => {
        this.categories = items;
        this.categoryMap = new Map(items.map((c) => [c.id, c.name]));
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

  canDeleteRecord(row: QuestionItem): boolean {
    return this.canDelete() && this.canEditRecord(row.companyId) && row.locked !== true;
  }

  categoryName(id: number): string {
    return this.categoryMap.get(id) ?? '—';
  }

  typeLabel(type: string): string {
    return qquestTypeLabel(type);
  }

  textPreview(text: string): string {
    return text.length > this.textPreviewLength ? `${text.slice(0, this.textPreviewLength)}…` : text;
  }

  load(): void {
    this.loading = true;
    const filters = this.filterForm.getRawValue();
    this.api
      .list(
        {
          text: filters.text.trim() || null,
          knowledgeCategoryId: filters.knowledgeCategoryId,
          type: filters.type || null,
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
          this.snack.open(QQUEST_ERRORS_LIST, QQUEST_SNACK_CLOSE, { duration: 3500 });
        },
      });
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.load();
  }

  clearFilters(): void {
    this.filterForm.reset({ text: '', knowledgeCategoryId: null, type: '' });
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

  openEdit(row: QuestionItem): void {
    const readOnly = row.locked === true || !this.canEditRecord(row.companyId);
    this.openDialog({ questionId: row.id, readOnly });
  }

  private openDialog(data: QuestionFormDialogData): void {
    const ref = this.dialog.open<QuestionFormDialogComponent, QuestionFormDialogData, boolean>(
      QuestionFormDialogComponent,
      { width: '760px', maxWidth: '95vw', data },
    );
    ref
      .afterClosed()
      .pipe(filter((saved): saved is boolean => saved === true))
      .subscribe(() => {
        this.snack.open(QQUEST_SUCCESS_SAVED, QQUEST_SNACK_CLOSE, { duration: 2500 });
        this.load();
      });
  }

  toggle(row: QuestionItem, active: boolean): void {
    if (!this.canEditRecord(row.companyId) || row.locked) {
      return;
    }
    const previous = row.isActive;
    row.isActive = active;
    this.savingId = row.id;
    this.api
      .getById(row.id)
      .pipe(
        switchMap((question) =>
          this.api.update(row.id, {
            knowledgeCategoryId: question.knowledgeCategoryId,
            text: question.text,
            type: question.type,
            explanation: question.explanation ?? undefined,
            correctAnswerText: question.correctAnswerText ?? undefined,
            difficulty: question.difficulty ?? 3,
            status: question.status,
            isActive: active,
            options:
              question.type === 'open'
                ? []
                : (question.options ?? []).map((option, index) => ({
                    optionText: option.optionText,
                    correct: option.correct ?? false,
                    sortOrder: option.sortOrder ?? index,
                  })),
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
          this.snack.open(QQUEST_ERRORS_SAVE, QQUEST_SNACK_CLOSE, { duration: 3500 });
        },
      });
  }

  deleteQuestion(row: QuestionItem): void {
    if (!this.canDeleteRecord(row)) {
      return;
    }
    if (!confirm(qquestDeleteConfirm(this.textPreview(row.text)))) {
      return;
    }
    this.deletingId = row.id;
    this.api.delete(row.id).subscribe({
      next: () => {
        this.deletingId = null;
        this.snack.open(QQUEST_SUCCESS_DELETED, QQUEST_SNACK_CLOSE, { duration: 3000 });
        this.load();
      },
      error: () => {
        this.deletingId = null;
        this.snack.open(QQUEST_ERRORS_DELETE, QQUEST_SNACK_CLOSE, { duration: 3500 });
      },
    });
  }
}
