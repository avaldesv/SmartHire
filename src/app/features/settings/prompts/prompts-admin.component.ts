import { Component, computed, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { debounceTime } from 'rxjs';
import { FeedbackDialogService } from '../../../core/feedback/feedback-dialog.service';
import { COMMON_CLEAR_FILTERS } from '../../../core/i18n/common-labels';
import { FEEDBACK_GENERIC_WARNING_TITLE } from '../../../core/i18n/feedback-labels';
import { AppPermissions } from '../../../core/auth/app-permissions';
import {
  PROMPTS_CANCEL,
  PROMPTS_CLAVE_READONLY_HINT,
  PROMPTS_COL_CLAVE,
  PROMPTS_COL_PROMPT,
  PROMPTS_COL_SCOPE,
  PROMPTS_EDIT_TITLE,
  PROMPTS_EMPTY,
  PROMPTS_ERRORS_DELETE,
  PROMPTS_ERRORS_LIST,
  PROMPTS_ERRORS_SAVE,
  PROMPTS_ERRORS_UPDATE,
  PROMPTS_FIELD_ACTIVE,
  PROMPTS_FIELD_CLAVE,
  PROMPTS_FIELD_DESCRIPTION,
  PROMPTS_FIELD_PROMPT_TEXT,
  PROMPTS_NEW_BUTTON,
  PROMPTS_NEW_TITLE,
  PROMPTS_PAGE_TITLE,
  PROMPTS_RECORD_SCOPE,
  PROMPTS_SAVE,
  PROMPTS_SAVING,
  PROMPTS_SCOPE_GLOBAL,
  PROMPTS_SCOPE_TENANT,
  PROMPTS_SHOW_MORE,
  PROMPTS_SNACK_CLOSE,
  PROMPTS_SUCCESS_DELETED,
  PROMPTS_SUCCESS_SAVED,
  promptsDeleteConfirm,
} from '../../../core/i18n/prompts-i18n-labels';
import { AiPromptApiService } from '../../../core/services/ai-prompt-api.service';
import { PermissionService } from '../../../core/services/permission.service';
import { ScopeBadgeComponent } from '../../../shared/components/scope-badge/scope-badge.component';
import { TableRowActionsComponent } from '../../../shared/components/table-row-actions/table-row-actions.component';
import { AiPromptItem } from '../../../shared/models/ai-prompt.model';
import { TenantDataScope } from '../../../shared/models/tenant-data-scope.model';
import { canEditScopedRecord } from '../../../shared/utils/tenant-scope.util';
import { PromptsImportExportActionsComponent } from './prompts-import-export-actions.component';

@Component({
  selector: 'sh-prompts-admin',
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
    MatCheckboxModule,
    MatRadioModule,
    ScopeBadgeComponent,
    TableRowActionsComponent,
    PromptsImportExportActionsComponent,
  ],
  templateUrl: './prompts-admin.component.html',
  styleUrl: './prompts-admin.component.scss',
})
export class PromptsAdminComponent implements OnInit {
  private readonly aiPromptApi = inject(AiPromptApiService);
  private readonly permissions = inject(PermissionService);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly fb = inject(FormBuilder);

  readonly isGlobalAdmin = computed(() => this.permissions.isGlobalAdmin());

  loading = true;
  saving = false;
  savingId: number | null = null;
  deletingId: number | null = null;
  showForm = false;
  editingId: number | null = null;
  /** Full list for client-side search (prompts API has no search param). */
  private allItems: AiPromptItem[] = [];
  data: AiPromptItem[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;

  readonly columns = ['clave', 'promptText', 'description', 'scope', 'active', 'actions'];
  readonly textPreviewLength = 30;
  private readonly expandedPromptTextIds = new Set<number>();
  private readonly expandedDescriptionIds = new Set<number>();

  readonly pageTitle = PROMPTS_PAGE_TITLE;
  readonly clearFiltersLabel = COMMON_CLEAR_FILTERS;
  readonly searchLabel = $localize`:@@prompts.search:Buscar prompt`;
  readonly newButton = PROMPTS_NEW_BUTTON;
  readonly editTitle = PROMPTS_EDIT_TITLE;
  readonly newTitle = PROMPTS_NEW_TITLE;
  readonly fieldClave = PROMPTS_FIELD_CLAVE;
  readonly fieldPromptText = PROMPTS_FIELD_PROMPT_TEXT;
  readonly fieldDescription = PROMPTS_FIELD_DESCRIPTION;
  readonly fieldActive = PROMPTS_FIELD_ACTIVE;
  readonly columnClave = PROMPTS_COL_CLAVE;
  readonly columnPrompt = PROMPTS_COL_PROMPT;
  readonly columnScope = PROMPTS_COL_SCOPE;
  readonly recordScope = PROMPTS_RECORD_SCOPE;
  readonly scopeTenant = PROMPTS_SCOPE_TENANT;
  readonly scopeGlobal = PROMPTS_SCOPE_GLOBAL;
  readonly claveReadonlyHint = PROMPTS_CLAVE_READONLY_HINT;
  readonly emptyLabel = PROMPTS_EMPTY;
  readonly showMoreLabel = PROMPTS_SHOW_MORE;
  readonly cancelLabel = PROMPTS_CANCEL;
  readonly savingLabel = PROMPTS_SAVING;
  readonly saveLabel = PROMPTS_SAVE;

  readonly searchForm = this.fb.nonNullable.group({ search: [''] });

  readonly promptForm = this.fb.nonNullable.group({
    clave: ['', Validators.required],
    promptText: ['', Validators.required],
    description: [''],
    isActive: [true],
  });

  readonly createScopeForm = this.fb.nonNullable.group({
    scope: ['TENANT' as TenantDataScope],
  });

  ngOnInit(): void {
    this.load();
    this.searchForm.controls.search.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.pageIndex = 0;
      this.applyFilter();
    });
  }

  canCreate(): boolean {
    return this.permissions.hasAuthority(AppPermissions.SETTINGS_PROMPTS_CREATE);
  }

  canEdit(): boolean {
    return this.permissions.hasAuthority(AppPermissions.SETTINGS_PROMPTS_EDIT);
  }

  canDelete(): boolean {
    return this.permissions.hasAuthority(AppPermissions.SETTINGS_PROMPTS_DELETE);
  }

  canEditRecord(companyId?: number | null): boolean {
    return this.canEdit() && canEditScopedRecord(companyId, this.isGlobalAdmin());
  }

  canDeleteRecord(row: AiPromptItem): boolean {
    return this.canDelete() && this.canEditRecord(row.companyId);
  }

  load(): void {
    this.loading = true;
    this.expandedPromptTextIds.clear();
    this.expandedDescriptionIds.clear();
    this.aiPromptApi.list(0, 500).subscribe({
      next: ({ items }) => {
        this.allItems = items;
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.feedback.showApiError(err, { fallbackMessage: PROMPTS_ERRORS_LIST });
      },
    });
  }

  private applyFilter(): void {
    const q = this.searchForm.controls.search.value.trim().toLowerCase();
    const filtered = !q
      ? this.allItems
      : this.allItems.filter(
          (r) =>
            r.clave?.toLowerCase().includes(q) ||
            (r.promptText ?? '').toLowerCase().includes(q) ||
            (r.description ?? '').toLowerCase().includes(q),
        );
    this.total = filtered.length;
    const start = this.pageIndex * this.pageSize;
    this.data = filtered.slice(start, start + this.pageSize);
  }

  onPage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilter();
  }

  clearFilters(): void {
    this.searchForm.controls.search.setValue('');
    this.pageIndex = 0;
    this.applyFilter();
  }

  openCreate(): void {
    this.editingId = null;
    this.showForm = true;
    this.promptForm.reset({
      clave: '',
      promptText: '',
      description: '',
      isActive: true,
    });
    this.promptForm.controls.clave.enable();
    this.createScopeForm.reset({ scope: 'TENANT' });
  }

  openEdit(row: AiPromptItem): void {
    if (!this.canEditRecord(row.companyId)) {
      return;
    }
    this.editingId = row.id;
    this.showForm = true;
    this.promptForm.reset({
      clave: row.clave,
      promptText: row.promptText,
      description: row.description ?? '',
      isActive: row.isActive,
    });
    this.promptForm.controls.clave.disable();
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.promptForm.controls.clave.enable();
  }

  saveForm(): void {
    if (this.promptForm.invalid) {
      this.promptForm.markAllAsTouched();
      return;
    }

    const value = this.promptForm.getRawValue();
    const payload = {
      promptText: value.promptText.trim(),
      description: value.description.trim() || undefined,
      isActive: value.isActive,
    };

    this.saving = true;
    const request$ = this.editingId
      ? this.aiPromptApi.update(this.editingId, payload)
      : this.aiPromptApi.create({
          clave: value.clave.trim(),
          ...payload,
          scope: this.isGlobalAdmin() ? this.createScopeForm.getRawValue().scope : undefined,
        });

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.showForm = false;
        this.editingId = null;
        this.promptForm.controls.clave.enable();
        this.feedback.showSuccess(PROMPTS_SUCCESS_SAVED);
        this.load();
      },
      error: (err) => {
        this.saving = false;
        this.feedback.showApiError(err, { fallbackMessage: PROMPTS_ERRORS_SAVE });
      },
    });
  }

  toggle(row: AiPromptItem, active: boolean): void {
    if (!this.canEditRecord(row.companyId)) {
      return;
    }
    const previous = row.isActive;
    row.isActive = active;
    this.savingId = row.id;
    this.aiPromptApi
      .update(row.id, {
        promptText: row.promptText,
        description: row.description ?? undefined,
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
          this.feedback.showApiError(err, { fallbackMessage: PROMPTS_ERRORS_UPDATE });
        },
      });
  }

  isTextTruncated(text: string | null | undefined): boolean {
    return (text ?? '').length > this.textPreviewLength;
  }

  textPreview(text: string | null | undefined): string {
    return (text ?? '').slice(0, this.textPreviewLength);
  }

  isPromptTextExpanded(id: number): boolean {
    return this.expandedPromptTextIds.has(id);
  }

  isDescriptionExpanded(id: number): boolean {
    return this.expandedDescriptionIds.has(id);
  }

  expandPromptText(id: number): void {
    this.expandedPromptTextIds.add(id);
  }

  expandDescription(id: number): void {
    this.expandedDescriptionIds.add(id);
  }

  deletePrompt(row: AiPromptItem): void {
    if (!this.canDeleteRecord(row)) {
      return;
    }
    this.feedback
      .confirm({
        title: FEEDBACK_GENERIC_WARNING_TITLE,
        message: promptsDeleteConfirm(row.clave),
        confirmWarn: true,
      })
      .subscribe((ok) => {
        if (!ok) {
          return;
        }
    this.deletingId = row.id;
    this.aiPromptApi.delete(row.id).subscribe({
      next: () => {
        this.deletingId = null;
        if (this.editingId === row.id) {
          this.cancelForm();
        }
        this.feedback.showSuccess(PROMPTS_SUCCESS_DELETED);
        this.load();
      },
      error: (err) => {
        this.deletingId = null;
        this.feedback.showApiError(err, { fallbackMessage: PROMPTS_ERRORS_DELETE });
      },
    });
      });
  }
}