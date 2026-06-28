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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
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
    MatSnackBarModule,
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
  private readonly snack = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  readonly isGlobalAdmin = computed(() => this.permissions.isGlobalAdmin());

  loading = true;
  saving = false;
  savingId: number | null = null;
  deletingId: number | null = null;
  showForm = false;
  editingId: number | null = null;
  data: AiPromptItem[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;

  readonly columns = ['clave', 'promptText', 'description', 'scope', 'active', 'actions'];
  readonly promptPreviewLength = 80;
  private readonly expandedPromptIds = new Set<number>();

  readonly pageTitle = PROMPTS_PAGE_TITLE;
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
    this.expandedPromptIds.clear();
    this.aiPromptApi.list(this.pageIndex, this.pageSize).subscribe({
      next: ({ items, total }) => {
        this.data = items;
        this.total = total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open(PROMPTS_ERRORS_LIST, PROMPTS_SNACK_CLOSE, { duration: 3500 });
      },
    });
  }

  onPage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.load();
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
        this.snack.open(PROMPTS_SUCCESS_SAVED, PROMPTS_SNACK_CLOSE, { duration: 2500 });
        this.load();
      },
      error: () => {
        this.saving = false;
        this.snack.open(PROMPTS_ERRORS_SAVE, PROMPTS_SNACK_CLOSE, { duration: 3500 });
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
        error: () => {
          row.isActive = previous;
          this.savingId = null;
          this.snack.open(PROMPTS_ERRORS_UPDATE, PROMPTS_SNACK_CLOSE, { duration: 3500 });
        },
      });
  }

  isPromptTruncated(text: string): boolean {
    return text.length > this.promptPreviewLength;
  }

  isPromptExpanded(id: number): boolean {
    return this.expandedPromptIds.has(id);
  }

  promptPreview(text: string): string {
    return text.slice(0, this.promptPreviewLength);
  }

  expandPrompt(id: number): void {
    this.expandedPromptIds.add(id);
  }

  deletePrompt(row: AiPromptItem): void {
    if (!this.canDeleteRecord(row)) {
      return;
    }
    if (!confirm(promptsDeleteConfirm(row.clave))) {
      return;
    }
    this.deletingId = row.id;
    this.aiPromptApi.delete(row.id).subscribe({
      next: () => {
        this.deletingId = null;
        if (this.editingId === row.id) {
          this.cancelForm();
        }
        this.snack.open(PROMPTS_SUCCESS_DELETED, PROMPTS_SNACK_CLOSE, { duration: 3000 });
        this.load();
      },
      error: () => {
        this.deletingId = null;
        this.snack.open(PROMPTS_ERRORS_DELETE, PROMPTS_SNACK_CLOSE, { duration: 3500 });
      },
    });
  }
}
