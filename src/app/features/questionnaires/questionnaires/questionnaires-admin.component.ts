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
import { MatTableModule } from '@angular/material/table';
import { FeedbackDialogService } from '../../../core/feedback/feedback-dialog.service';
import { FEEDBACK_GENERIC_WARNING_TITLE } from '../../../core/i18n/feedback-labels';
import { AppPermissions } from '../../../core/auth/app-permissions';
import {
  QQN_COL_CATEGORY,
  QQN_COL_NAME,
  QQN_COL_SCOPE,
  QQN_COL_STATUS,
  QQN_EMPTY,
  QQN_ERRORS_DELETE,
  QQN_ERRORS_LIST,
  QQN_ERRORS_SAVE,
  QQN_FIELD_ACTIVE,
  QQN_FILTER_ALL,
  QQN_FILTER_APPLY,
  QQN_FILTER_CATEGORY,
  QQN_FILTER_CLEAR,
  QQN_FILTER_NAME,
  QQN_FILTER_STATUS,
  QQN_NEW_BUTTON,
  QQN_ARCHIVE_BUTTON,
  QQN_ARCHIVE_CONFIRM,
  QQN_ARCHIVE_ERROR,
  QQN_ARCHIVE_SUCCESS,
  QQN_DUPLICATE_BUTTON,
  QQN_DUPLICATE_CONFIRM,
  QQN_DUPLICATE_ERROR,
  QQN_DUPLICATE_SUCCESS,
  QQN_PUBLISH_BUTTON,
  QQN_PUBLISH_CONFIRM,
  QQN_PUBLISH_ERROR,
  QQN_PUBLISH_SUCCESS,
  QQN_SNACK_CLOSE,
  QQN_STATUS_ARCHIVED,
  QQN_STATUS_DRAFT,
  QQN_STATUS_PUBLISHED,
  QQN_SUCCESS_DELETED,
  QQN_SUCCESS_SAVED,
  qqnDeleteConfirm,
  qqnStatusLabel,
} from '../../../core/i18n/questionnaire-questionnaires-labels';
import { PermissionService } from '../../../core/services/permission.service';
import { QuestionnaireKnowledgeCategoryApiService } from '../../../core/services/questionnaire-knowledge-category-api.service';
import { QuestionnaireQuestionnaireApiService } from '../../../core/services/questionnaire-questionnaire-api.service';
import { QUESTIONNAIRE_CSV_PANELS } from '../../../core/questionnaire/questionnaire-import-export.registry';
import { QuestionnaireImportExportActionsComponent } from '../shared/questionnaire-import-export-actions.component';
import { ScopeBadgeComponent } from '../../../shared/components/scope-badge/scope-badge.component';
import { TableRowActionsComponent } from '../../../shared/components/table-row-actions/table-row-actions.component';
import { KnowledgeCategoryItem, QuestionnaireItem } from '../../../shared/models/questionnaire-v2.model';
import { canEditScopedRecord } from '../../../shared/utils/tenant-scope.util';
import {
  QuestionnaireFormDialogComponent,
  QuestionnaireFormDialogData,
  QuestionnaireFormDialogResult,
} from './questionnaire-form-dialog.component';

@Component({
  selector: 'sh-questionnaires-admin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSlideToggleModule,
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
  templateUrl: './questionnaires-admin.component.html',
  styleUrl: './questionnaires-admin.component.scss',
})
export class QuestionnairesAdminComponent implements OnInit {
  private readonly api = inject(QuestionnaireQuestionnaireApiService);
  private readonly categoryApi = inject(QuestionnaireKnowledgeCategoryApiService);
  private readonly permissions = inject(PermissionService);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);

  readonly csvQuestionnaires = QUESTIONNAIRE_CSV_PANELS.questionnaires;
  readonly csvQuestionnaireQuestions = QUESTIONNAIRE_CSV_PANELS.questionnaireQuestions;
  readonly csvPublish = QUESTIONNAIRE_CSV_PANELS.publish;

  readonly isGlobalAdmin = computed(() => this.permissions.isGlobalAdmin());

  loading = true;
  savingId: number | null = null;
  deletingId: number | null = null;
  publishingId: number | null = null;
  archivingId: number | null = null;
  duplicatingId: number | null = null;
  data: QuestionnaireItem[] = [];
  categories: KnowledgeCategoryItem[] = [];
  categoryMap = new Map<number, string>();
  total = 0;
  pageIndex = 0;
  pageSize = 10;

  readonly columns = ['name', 'category', 'status', 'scope', 'active', 'actions'];

  readonly newButton = QQN_NEW_BUTTON;
  readonly emptyLabel = QQN_EMPTY;
  readonly filterName = QQN_FILTER_NAME;
  readonly filterCategory = QQN_FILTER_CATEGORY;
  readonly filterStatus = QQN_FILTER_STATUS;
  readonly filterAll = QQN_FILTER_ALL;
  readonly filterApply = QQN_FILTER_APPLY;
  readonly filterClear = QQN_FILTER_CLEAR;
  readonly columnName = QQN_COL_NAME;
  readonly columnCategory = QQN_COL_CATEGORY;
  readonly columnStatus = QQN_COL_STATUS;
  readonly columnScope = QQN_COL_SCOPE;
  readonly fieldActive = QQN_FIELD_ACTIVE;
  readonly publishLabel = QQN_PUBLISH_BUTTON;
  readonly archiveLabel = QQN_ARCHIVE_BUTTON;
  readonly duplicateLabel = QQN_DUPLICATE_BUTTON;

  readonly statusOptions = [
    { value: '', label: QQN_FILTER_ALL },
    { value: 'draft', label: QQN_STATUS_DRAFT },
    { value: 'published', label: QQN_STATUS_PUBLISHED },
    { value: 'archived', label: QQN_STATUS_ARCHIVED },
  ];

  readonly filterForm = this.fb.nonNullable.group({
    name: [''],
    knowledgeCategoryId: [null as number | null],
    status: [''],
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

  canPublish(): boolean {
    return this.permissions.hasAuthority(AppPermissions.QUESTIONNAIRE_PUBLISH);
  }

  canEditRecord(companyId?: number | null): boolean {
    return this.canEdit() && canEditScopedRecord(companyId, this.isGlobalAdmin());
  }

  canDeleteRecord(row: QuestionnaireItem): boolean {
    return this.canDelete() && this.canEditRecord(row.companyId) && row.status === 'draft';
  }

  canPublishRecord(row: QuestionnaireItem): boolean {
    return this.canPublish() && this.canEditRecord(row.companyId) && row.status === 'draft';
  }

  canArchiveRecord(row: QuestionnaireItem): boolean {
    return this.canEdit() && this.canEditRecord(row.companyId) && row.status === 'published';
  }

  canDuplicateRecord(row: QuestionnaireItem): boolean {
    return this.canCreate() && this.canEditRecord(row.companyId);
  }

  isLocked(row: QuestionnaireItem): boolean {
    return row.status === 'published' || row.status === 'archived';
  }

  isPublished(row: QuestionnaireItem): boolean {
    return row.status === 'published';
  }

  categoryName(id: number | null): string {
    if (id == null) {
      return '—';
    }
    return this.categoryMap.get(id) ?? '—';
  }

  statusLabel(status: string): string {
    return qqnStatusLabel(status);
  }

  load(): void {
    this.loading = true;
    const filters = this.filterForm.getRawValue();
    this.api
      .list(
        {
          name: filters.name.trim() || null,
          knowledgeCategoryId: filters.knowledgeCategoryId,
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
        error: (err) => {
          this.loading = false;
          this.feedback.showApiError(err, { fallbackMessage: QQN_ERRORS_LIST });
        },
      });
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.load();
  }

  clearFilters(): void {
    this.filterForm.reset({ name: '', knowledgeCategoryId: null, status: '' });
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

  openEdit(row: QuestionnaireItem): void {
    const readOnly = this.isLocked(row) || !this.canEditRecord(row.companyId);
    this.openDialog({ questionnaire: row, readOnly });
  }

  private openDialog(data: QuestionnaireFormDialogData): void {
    const ref = this.dialog.open<
      QuestionnaireFormDialogComponent,
      QuestionnaireFormDialogData,
      QuestionnaireFormDialogResult
    >(QuestionnaireFormDialogComponent, { width: '800px', maxWidth: '95vw', data });
    ref.afterClosed().subscribe((result) => {
      if (result === true) {
        this.feedback.showSuccess(QQN_SUCCESS_SAVED);
        this.load();
      } else if (result === 'published') {
        this.feedback.showSuccess(QQN_PUBLISH_SUCCESS);
        this.load();
      } else if (result === 'archived') {
        this.feedback.showSuccess(QQN_ARCHIVE_SUCCESS);
        this.load();
      }
    });
  }

  publish(row: QuestionnaireItem): void {
    if (!this.canPublishRecord(row)) {
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
        this.publishingId = row.id;
        this.api.publish(row.id).subscribe({
          next: (updated) => {
            Object.assign(row, updated);
            this.publishingId = null;
            this.feedback.showSuccess(QQN_PUBLISH_SUCCESS);
          },
          error: (err) => {
            this.publishingId = null;
            this.feedback.showApiError(err, { fallbackMessage: QQN_PUBLISH_ERROR });
          },
        });
      });
  }

  archive(row: QuestionnaireItem): void {
    if (!this.canArchiveRecord(row)) {
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
        this.archivingId = row.id;
        this.api.archive(row.id).subscribe({
          next: (updated) => {
            Object.assign(row, updated);
            this.archivingId = null;
            this.feedback.showSuccess(QQN_ARCHIVE_SUCCESS);
          },
          error: (err) => {
            this.archivingId = null;
            this.feedback.showApiError(err, { fallbackMessage: QQN_ARCHIVE_ERROR });
          },
        });
      });
  }

  duplicate(row: QuestionnaireItem): void {
    if (!this.canDuplicateRecord(row)) {
      return;
    }
    this.feedback
      .confirm({
        title: FEEDBACK_GENERIC_WARNING_TITLE,
        message: QQN_DUPLICATE_CONFIRM,
        confirmWarn: true,
      })
      .subscribe((ok) => {
        if (!ok) {
          return;
        }
        this.duplicatingId = row.id;
        this.api.duplicate(row.id).subscribe({
          next: (created) => {
            this.duplicatingId = null;
            this.feedback.showSuccess(QQN_DUPLICATE_SUCCESS);
            this.openDialog({ questionnaire: created, readOnly: false });
            this.load();
          },
          error: (err) => {
            this.duplicatingId = null;
            this.feedback.showApiError(err, { fallbackMessage: QQN_DUPLICATE_ERROR });
          },
        });
      });
  }

  toggle(row: QuestionnaireItem, active: boolean): void {
    if (!this.canEditRecord(row.companyId) || this.isLocked(row)) {
      return;
    }
    const previous = row.isActive;
    row.isActive = active;
    this.savingId = row.id;
    this.api
      .update(row.id, {
        knowledgeCategoryId: row.knowledgeCategoryId,
        name: row.name,
        description: row.description ?? undefined,
        status: row.status,
        isActive: active,
      })
      .subscribe({
        next: (updated) => {
          Object.assign(row, updated);
          this.savingId = null;
        },
        error: (err) => {
          row.isActive = previous;
          this.savingId = null;
          this.feedback.showApiError(err, { fallbackMessage: QQN_ERRORS_SAVE });
        },
      });
  }

  deleteQuestionnaire(row: QuestionnaireItem): void {
    if (!this.canDeleteRecord(row)) {
      return;
    }
    this.feedback
      .confirm({
        title: FEEDBACK_GENERIC_WARNING_TITLE,
        message: qqnDeleteConfirm(row.name),
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
            this.feedback.showSuccess(QQN_SUCCESS_DELETED);
            this.load();
          },
          error: (err) => {
            this.deletingId = null;
            this.feedback.showApiError(err, { fallbackMessage: QQN_ERRORS_DELETE });
          },
        });
      });
  }
}
