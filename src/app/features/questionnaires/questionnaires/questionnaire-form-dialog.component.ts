import { Component, OnInit, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { FeedbackDialogService } from '../../../core/feedback/feedback-dialog.service';
import { FEEDBACK_GENERIC_WARNING_TITLE } from '../../../core/i18n/feedback-labels';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { AppPermissions } from '../../../core/auth/app-permissions';
import {
  QQN_CANCEL,
  QQN_CATEGORY_MISMATCH,
  QQN_CLOSE,
  QQN_DIALOG_EDIT,
  QQN_DIALOG_NEW,
  QQN_DIALOG_VIEW,
  QQN_ERRORS_LOAD,
  QQN_ERRORS_SAVE,
  QQN_FIELD_CATEGORY,
  QQN_FIELD_DESCRIPTION,
  QQN_FIELD_NAME,
  QQN_FIELD_NO_CATEGORY,
  QQN_FIELD_ACTIVE,
  QQN_ARCHIVE_BUTTON,
  QQN_ARCHIVE_CONFIRM,
  QQN_ARCHIVE_ERROR,
  QQN_ARCHIVE_SUCCESS,
  QQN_ARCHIVED_LOCKED,
  QQN_PUBLISH_BUTTON,
  QQN_PUBLISH_CONFIRM,
  QQN_PUBLISH_ERROR,
  QQN_PUBLISH_SUCCESS,
  QQN_PUBLISHED_LOCKED,
  QQN_QUESTIONS_ADD,
  QQN_QUESTIONS_EMPTY,
  QQN_QUESTIONS_MOVE_DOWN,
  QQN_QUESTIONS_MOVE_UP,
  QQN_QUESTIONS_SELECT,
  QQN_QUESTIONS_TITLE,
  QQN_QUESTIONS_WEIGHT,
  QQN_RECORD_SCOPE,
  QQN_SAVE,
  QQN_SAVING,
  QQN_SCOPE_GLOBAL,
  QQN_SCOPE_TENANT,
  QQN_SNACK_CLOSE,
} from '../../../core/i18n/questionnaire-questionnaires-labels';
import { qquestTypeLabel } from '../../../core/i18n/questionnaire-questions-labels';
import { PermissionService } from '../../../core/services/permission.service';
import { QuestionnaireKnowledgeCategoryApiService } from '../../../core/services/questionnaire-knowledge-category-api.service';
import { QuestionnaireQuestionnaireApiService } from '../../../core/services/questionnaire-questionnaire-api.service';
import { QuestionnaireV2QuestionApiService } from '../../../core/services/questionnaire-v2-question-api.service';
import {
  KnowledgeCategoryItem,
  QuestionItem,
  QuestionnaireItem,
  QuestionnaireQuestionLinkItem,
  TenantDataScope,
} from '../../../shared/models/questionnaire-v2.model';

export interface QuestionnaireFormDialogData {
  questionnaire?: QuestionnaireItem;
  readOnly?: boolean;
}

interface AssignedQuestionRow {
  questionId: number;
  text: string;
  type: string;
  knowledgeCategoryId: number | null;
  sortOrder: number;
  weightOverride: number | null;
}

export type QuestionnaireFormDialogResult = boolean | 'published' | 'archived';

@Component({
  selector: 'sh-questionnaire-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './questionnaire-form-dialog.component.html',
  styleUrl: './questionnaire-form-dialog.component.scss',
})
export class QuestionnaireFormDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<QuestionnaireFormDialogComponent, QuestionnaireFormDialogResult>);
  readonly data = inject<QuestionnaireFormDialogData>(MAT_DIALOG_DATA);
  private readonly api = inject(QuestionnaireQuestionnaireApiService);
  private readonly questionApi = inject(QuestionnaireV2QuestionApiService);
  private readonly categoryApi = inject(QuestionnaireKnowledgeCategoryApiService);
  private readonly permissions = inject(PermissionService);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly fb = inject(FormBuilder);

  readonly isGlobalAdmin = computed(() => this.permissions.isGlobalAdmin());

  loading = true;
  saving = false;
  publishing = false;
  archiving = false;
  readOnly = this.data.readOnly ?? false;
  editingItem = this.data.questionnaire ?? null;
  categories: KnowledgeCategoryItem[] = [];
  availableQuestions: QuestionItem[] = [];
  assignedQuestions: AssignedQuestionRow[] = [];
  selectedQuestionId: number | null = null;

  readonly dialogNew = QQN_DIALOG_NEW;
  readonly dialogEdit = QQN_DIALOG_EDIT;
  readonly dialogView = QQN_DIALOG_VIEW;
  readonly fieldName = QQN_FIELD_NAME;
  readonly fieldDescription = QQN_FIELD_DESCRIPTION;
  readonly fieldCategory = QQN_FIELD_CATEGORY;
  readonly noCategoryLabel = QQN_FIELD_NO_CATEGORY;
  readonly fieldActive = QQN_FIELD_ACTIVE;
  readonly questionsTitle = QQN_QUESTIONS_TITLE;
  readonly addQuestionLabel = QQN_QUESTIONS_ADD;
  readonly selectQuestionLabel = QQN_QUESTIONS_SELECT;
  readonly emptyQuestionsLabel = QQN_QUESTIONS_EMPTY;
  readonly weightLabel = QQN_QUESTIONS_WEIGHT;
  readonly moveUpLabel = QQN_QUESTIONS_MOVE_UP;
  readonly moveDownLabel = QQN_QUESTIONS_MOVE_DOWN;
  readonly categoryMismatchLabel = QQN_CATEGORY_MISMATCH;
  readonly publishedLockedLabel = QQN_PUBLISHED_LOCKED;
  readonly archivedLockedLabel = QQN_ARCHIVED_LOCKED;
  readonly recordScope = QQN_RECORD_SCOPE;
  readonly scopeTenant = QQN_SCOPE_TENANT;
  readonly scopeGlobal = QQN_SCOPE_GLOBAL;
  readonly cancelLabel = QQN_CANCEL;
  readonly closeLabel = QQN_CLOSE;
  readonly savingLabel = QQN_SAVING;
  readonly saveLabel = QQN_SAVE;
  readonly publishLabel = QQN_PUBLISH_BUTTON;
  readonly archiveLabel = QQN_ARCHIVE_BUTTON;

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
    knowledgeCategoryId: [null as number | null],
    isActive: [true],
  });

  readonly createScopeForm = this.fb.nonNullable.group({
    scope: ['TENANT' as TenantDataScope],
  });

  ngOnInit(): void {
    if (this.editingItem?.status === 'published' || this.editingItem?.status === 'archived') {
      this.readOnly = true;
    }

    forkJoin({
      categories: this.categoryApi.list({ isActive: true }, 0, 500),
      questions: this.questionApi.list({ isActive: true }, 0, 500),
    }).subscribe({
      next: ({ categories, questions }) => {
        this.categories = categories.items;
        this.availableQuestions = questions.items;
        if (this.editingItem) {
          this.loadQuestionnaire(this.editingItem);
        } else {
          this.loading = false;
        }
      },
      error: (err) => {
        this.loading = false;
        this.feedback.showApiError(err, { fallbackMessage: QQN_ERRORS_LOAD });
      },
    });
  }

  get title(): string {
    if (this.readOnly) {
      return this.dialogView;
    }
    return this.editingItem ? this.dialogEdit : this.dialogNew;
  }

  get isDraft(): boolean {
    return !this.editingItem || this.editingItem.status === 'draft';
  }

  get showCategoryMismatch(): boolean {
    const categoryId = this.form.controls.knowledgeCategoryId.value;
    if (categoryId == null) {
      return false;
    }
    return this.assignedQuestions.some(
      (q) => q.knowledgeCategoryId != null && q.knowledgeCategoryId !== categoryId,
    );
  }

  get unassignedQuestions(): QuestionItem[] {
    const assignedIds = new Set(this.assignedQuestions.map((q) => q.questionId));
    return this.availableQuestions.filter((q) => !assignedIds.has(q.id));
  }

  get lockedHintLabel(): string {
    if (this.editingItem?.status === 'archived') {
      return this.archivedLockedLabel;
    }
    return this.publishedLockedLabel;
  }

  get isPublished(): boolean {
    return this.editingItem?.status === 'published';
  }

  canPublish(): boolean {
    return (
      !this.readOnly &&
      this.isDraft &&
      !!this.editingItem &&
      this.assignedQuestions.length > 0 &&
      this.permissions.hasAuthority(AppPermissions.QUESTIONNAIRE_PUBLISH)
    );
  }

  canArchive(): boolean {
    return (
      this.readOnly &&
      this.isPublished &&
      !!this.editingItem &&
      this.permissions.hasAuthority(AppPermissions.QUESTIONNAIRE_EDIT)
    );
  }

  typeLabel(type: string): string {
    return qquestTypeLabel(type);
  }

  textPreview(text: string): string {
    return text.length > 80 ? `${text.slice(0, 80)}…` : text;
  }

  private loadQuestionnaire(item: QuestionnaireItem): void {
    this.form.patchValue({
      name: item.name,
      description: item.description ?? '',
      knowledgeCategoryId: item.knowledgeCategoryId,
      isActive: item.isActive,
    });
    this.api.listQuestions(item.id).subscribe({
      next: (links) => {
        this.assignedQuestions = links.map((link, index) => this.toAssignedRow(link, index));
        this.loading = false;
        if (this.readOnly) {
          this.form.disable();
        }
      },
      error: (err) => {
        this.loading = false;
        this.feedback.showApiError(err, { fallbackMessage: QQN_ERRORS_LOAD });
      },
    });
  }

  private toAssignedRow(link: QuestionnaireQuestionLinkItem, index: number): AssignedQuestionRow {
    const question = this.availableQuestions.find((q) => q.id === link.questionId);
    return {
      questionId: link.questionId,
      text: link.text ?? question?.text ?? `#${link.questionId}`,
      type: link.type ?? question?.type ?? '',
      knowledgeCategoryId: link.knowledgeCategoryId ?? question?.knowledgeCategoryId ?? null,
      sortOrder: link.sortOrder ?? index,
      weightOverride: link.weightOverride ?? null,
    };
  }

  addQuestion(): void {
    if (this.readOnly || this.selectedQuestionId == null) {
      return;
    }
    const question = this.availableQuestions.find((q) => q.id === this.selectedQuestionId);
    if (!question) {
      return;
    }
    this.assignedQuestions = [
      ...this.assignedQuestions,
      {
        questionId: question.id,
        text: question.text,
        type: question.type,
        knowledgeCategoryId: question.knowledgeCategoryId,
        sortOrder: this.assignedQuestions.length,
        weightOverride: null,
      },
    ];
    this.selectedQuestionId = null;
    this.renumberSortOrder();
  }

  removeQuestion(index: number): void {
    if (this.readOnly) {
      return;
    }
    this.assignedQuestions = this.assignedQuestions.filter((_, i) => i !== index);
    this.renumberSortOrder();
  }

  moveQuestion(index: number, direction: -1 | 1): void {
    if (this.readOnly) {
      return;
    }
    const target = index + direction;
    if (target < 0 || target >= this.assignedQuestions.length) {
      return;
    }
    const rows = [...this.assignedQuestions];
    [rows[index], rows[target]] = [rows[target], rows[index]];
    this.assignedQuestions = rows;
    this.renumberSortOrder();
  }

  updateWeight(index: number, value: string): void {
    const parsed = value.trim() === '' ? null : Number(value);
    this.assignedQuestions[index].weightOverride =
      parsed == null || Number.isNaN(parsed) ? null : parsed;
  }

  private renumberSortOrder(): void {
    this.assignedQuestions = this.assignedQuestions.map((row, index) => ({
      ...row,
      sortOrder: index,
    }));
  }

  save(): void {
    if (this.readOnly) {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload = {
      name: value.name.trim(),
      description: value.description.trim() || undefined,
      knowledgeCategoryId: value.knowledgeCategoryId ?? null,
      status: 'draft',
      isActive: value.isActive,
    };
    const questionsPayload = {
      questions: this.assignedQuestions.map((row) => ({
        questionId: row.questionId,
        sortOrder: row.sortOrder,
        weightOverride: row.weightOverride,
      })),
    };

    this.saving = true;
    const request$ = this.editingItem
      ? this.api.update(this.editingItem.id, payload).pipe(
          switchMap((updated) =>
            this.api.replaceQuestions(updated.id, questionsPayload).pipe(map(() => updated)),
          ),
        )
      : this.api
          .create({
            ...payload,
            scope: this.isGlobalAdmin() ? this.createScopeForm.getRawValue().scope : undefined,
          })
          .pipe(
            switchMap((created) =>
              questionsPayload.questions.length
                ? this.api.replaceQuestions(created.id, questionsPayload).pipe(map(() => created))
                : of(created),
            ),
          );

    request$.subscribe({
      next: (saved) => {
        this.saving = false;
        this.editingItem = saved;
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.saving = false;
        this.feedback.showApiError(err, { fallbackMessage: QQN_ERRORS_SAVE });
      },
    });
  }

  publish(): void {
    if (!this.canPublish() || !this.editingItem) {
      return;
    }
    this.feedback
      .confirm({
        title: FEEDBACK_GENERIC_WARNING_TITLE,
        message: QQN_PUBLISH_CONFIRM,
        confirmWarn: true,
      })
      .subscribe((ok) => {
        if (!ok) {
          return;
        }
        this.publishing = true;
        this.api.publish(this.editingItem!.id).subscribe({
          next: () => {
            this.publishing = false;
            this.feedback.showSuccess(QQN_PUBLISH_SUCCESS);
            this.dialogRef.close('published');
          },
          error: (err) => {
            this.publishing = false;
            this.feedback.showApiError(err, { fallbackMessage: QQN_PUBLISH_ERROR });
          },
        });
      });
  }

  archive(): void {
    if (!this.canArchive() || !this.editingItem) {
      return;
    }
    this.feedback
      .confirm({
        title: FEEDBACK_GENERIC_WARNING_TITLE,
        message: QQN_ARCHIVE_CONFIRM,
        confirmWarn: true,
      })
      .subscribe((ok) => {
        if (!ok) {
          return;
        }
        this.archiving = true;
        this.api.archive(this.editingItem!.id).subscribe({
          next: () => {
            this.archiving = false;
            this.feedback.showSuccess(QQN_ARCHIVE_SUCCESS);
            this.dialogRef.close('archived');
          },
          error: (err) => {
            this.archiving = false;
            this.feedback.showApiError(err, { fallbackMessage: QQN_ARCHIVE_ERROR });
          },
        });
      });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
