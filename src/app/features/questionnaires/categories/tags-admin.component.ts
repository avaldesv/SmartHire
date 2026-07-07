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
  QCAT_CANCEL,
  QCAT_COL_DESCRIPTION,
  QCAT_COL_NAME,
  QCAT_COL_SCOPE,
  QCAT_FIELD_ACTIVE,
  QCAT_RECORD_SCOPE,
  QCAT_SAVE,
  QCAT_SAVING,
  QCAT_SCOPE_GLOBAL,
  QCAT_SCOPE_TENANT,
  QCAT_SNACK_CLOSE,
  QTAG_EDIT_TITLE,
  QTAG_EMPTY,
  QTAG_ERRORS_DELETE,
  QTAG_ERRORS_LIST,
  QTAG_ERRORS_SAVE,
  QTAG_FIELD_DESCRIPTION,
  QTAG_FIELD_NAME,
  QTAG_NEW_BUTTON,
  QTAG_NEW_TITLE,
  QTAG_SUCCESS_DELETED,
  QTAG_SUCCESS_SAVED,
  qtagDeleteConfirm,
} from '../../../core/i18n/questionnaire-categories-labels';
import { PermissionService } from '../../../core/services/permission.service';
import { QuestionnaireTagApiService } from '../../../core/services/questionnaire-tag-api.service';
import { ScopeBadgeComponent } from '../../../shared/components/scope-badge/scope-badge.component';
import { TableRowActionsComponent } from '../../../shared/components/table-row-actions/table-row-actions.component';
import { TagItem, TenantDataScope } from '../../../shared/models/questionnaire-v2.model';
import { canEditScopedRecord } from '../../../shared/utils/tenant-scope.util';

@Component({
  selector: 'sh-tags-admin',
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
  ],
  templateUrl: './tags-admin.component.html',
  styleUrl: './questionnaire-admin.component.scss',
})
export class TagsAdminComponent implements OnInit {
  private readonly api = inject(QuestionnaireTagApiService);
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
  data: TagItem[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;

  readonly columns = ['name', 'description', 'scope', 'active', 'actions'];

  readonly newButton = QTAG_NEW_BUTTON;
  readonly newTitle = QTAG_NEW_TITLE;
  readonly editTitle = QTAG_EDIT_TITLE;
  readonly fieldName = QTAG_FIELD_NAME;
  readonly fieldDescription = QTAG_FIELD_DESCRIPTION;
  readonly fieldActive = QCAT_FIELD_ACTIVE;
  readonly columnName = QCAT_COL_NAME;
  readonly columnDescription = QCAT_COL_DESCRIPTION;
  readonly columnScope = QCAT_COL_SCOPE;
  readonly recordScope = QCAT_RECORD_SCOPE;
  readonly scopeTenant = QCAT_SCOPE_TENANT;
  readonly scopeGlobal = QCAT_SCOPE_GLOBAL;
  readonly emptyLabel = QTAG_EMPTY;
  readonly cancelLabel = QCAT_CANCEL;
  readonly savingLabel = QCAT_SAVING;
  readonly saveLabel = QCAT_SAVE;

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
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

  canDeleteRecord(row: TagItem): boolean {
    return this.canDelete() && this.canEditRecord(row.companyId);
  }

  load(): void {
    this.loading = true;
    this.api.list({}, this.pageIndex, this.pageSize).subscribe({
      next: ({ items, total }) => {
        this.data = items;
        this.total = total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open(QTAG_ERRORS_LIST, QCAT_SNACK_CLOSE, { duration: 3500 });
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
    this.form.reset({ name: '', description: '', isActive: true });
    this.createScopeForm.reset({ scope: 'TENANT' });
  }

  openEdit(row: TagItem): void {
    if (!this.canEditRecord(row.companyId)) {
      return;
    }
    this.editingId = row.id;
    this.showForm = true;
    this.form.reset({
      name: row.name,
      description: row.description ?? '',
      isActive: row.isActive,
    });
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingId = null;
  }

  saveForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload = {
      name: value.name.trim(),
      description: value.description.trim() || undefined,
      isActive: value.isActive,
    };

    this.saving = true;
    const request$ = this.editingId
      ? this.api.update(this.editingId, payload)
      : this.api.create({
          ...payload,
          scope: this.isGlobalAdmin() ? this.createScopeForm.getRawValue().scope : undefined,
        });

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.showForm = false;
        this.editingId = null;
        this.snack.open(QTAG_SUCCESS_SAVED, QCAT_SNACK_CLOSE, { duration: 2500 });
        this.load();
      },
      error: () => {
        this.saving = false;
        this.snack.open(QTAG_ERRORS_SAVE, QCAT_SNACK_CLOSE, { duration: 3500 });
      },
    });
  }

  toggle(row: TagItem, active: boolean): void {
    if (!this.canEditRecord(row.companyId)) {
      return;
    }
    const previous = row.isActive;
    row.isActive = active;
    this.savingId = row.id;
    this.api
      .update(row.id, {
        name: row.name,
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
          this.snack.open(QTAG_ERRORS_SAVE, QCAT_SNACK_CLOSE, { duration: 3500 });
        },
      });
  }

  deleteTag(row: TagItem): void {
    if (!this.canDeleteRecord(row)) {
      return;
    }
    if (!confirm(qtagDeleteConfirm(row.name))) {
      return;
    }
    this.deletingId = row.id;
    this.api.delete(row.id).subscribe({
      next: () => {
        this.deletingId = null;
        if (this.editingId === row.id) {
          this.cancelForm();
        }
        this.snack.open(QTAG_SUCCESS_DELETED, QCAT_SNACK_CLOSE, { duration: 3000 });
        this.load();
      },
      error: () => {
        this.deletingId = null;
        this.snack.open(QTAG_ERRORS_DELETE, QCAT_SNACK_CLOSE, { duration: 3500 });
      },
    });
  }
}
