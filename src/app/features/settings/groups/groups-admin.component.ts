import { Component, computed, effect, inject, OnInit, signal, TemplateRef, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { catalogTallDialogConfig, CATALOG_FORM_DIALOG_PANEL_CLASS, CATALOG_TALL_DIALOG_PANEL_CLASS } from '../../../core/dialog/catalog-dialog.constants';
import { FeedbackDialogService } from '../../../core/feedback/feedback-dialog.service';
import { FEEDBACK_GENERIC_WARNING_TITLE } from '../../../core/i18n/feedback-labels';
import { PermissionService } from '../../../core/services/permission.service';
import { SecurityModulePermissionService } from '../../../core/services/security-module-permission.service';
import { SecurityRoleService } from '../../../core/services/security-role.service';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import { ScopeBadgeComponent } from '../../../shared/components/scope-badge/scope-badge.component';
import { ShModalActionsDirective } from '../../../shared/components/modal-form/sh-modal-form.component';
import { SecurityModulePermission } from '../../../shared/models/security-module-permission.model';
import { SecurityRole } from '../../../shared/models/security-role.model';
import { TenantDataScope } from '../../../shared/models/tenant-data-scope.model';
import { canEditScopedRecord } from '../../../shared/utils/tenant-scope.util';
import { COMMON_CLEAR_FILTERS, COMMON_OTHERS } from '../../../core/i18n/common-labels';
import { debounceTime, startWith } from 'rxjs';
import { TableRowActionsComponent } from '../../../shared/components/table-row-actions/table-row-actions.component';
import { CatalogFormDialogShellComponent } from '../catalogs/catalog-form-dialog-shell.component';
import {
  GROUPS_CANCEL,
  GROUPS_COLUMN_GROUP,
  GROUPS_COLUMN_PERMISSIONS,
  GROUPS_EDIT_TITLE,
  GROUPS_FIELD_ACTIVE,
  GROUPS_FIELD_ACTIVE_GROUP,
  GROUPS_FIELD_DESCRIPTION,
  GROUPS_FIELD_NAME,
  GROUPS_FIELD_SCOPE,
  GROUPS_FORM_SUBTITLE,
  GROUPS_NEW_BUTTON,
  GROUPS_NEW_TITLE,
  GROUPS_NO,
  GROUPS_PAGE_TITLE,
  GROUPS_PERMISSION_SEARCH,
  GROUPS_PERMISSIONS_HINT,
  GROUPS_RECORD_SCOPE,
  GROUPS_SAVE_GROUP,
  GROUPS_SAVING,
  GROUPS_SCOPE_GLOBAL,
  GROUPS_SCOPE_TENANT,
  GROUPS_SELECTED_HEADING,
  GROUPS_YES,
  GROUPS_DELETE_ERROR,
  GROUPS_DELETE_SUCCESS,
  GROUPS_LOAD_ERROR,
  GROUPS_LOAD_PERMISSIONS_ERROR,
  GROUPS_SAVE_ERROR,
  GROUPS_SAVE_SUCCESS,
  groupsDeleteConfirm,
  groupsModuleSelectLabel,
  groupsSelectedCountLabel,
} from '../../../core/i18n/groups-labels';

interface PermissionModuleGroup {
  moduleName: string;
  permissions: SecurityModulePermission[];
}

interface SelectedPermissionChip {
  id: number;
  label: string;
}

@Component({
  selector: 'sh-groups-admin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDialogModule,
    ScopeBadgeComponent,
    TableRowActionsComponent,
    ShModalActionsDirective,
  ],
  templateUrl: './groups-admin.component.html',
  styleUrl: './groups-admin.component.scss',
})
export class GroupsAdminComponent implements OnInit {
  @ViewChild('groupFormTpl') groupFormTpl!: TemplateRef<unknown>;

  private readonly roleService = inject(SecurityRoleService);
  private readonly permissionService = inject(SecurityModulePermissionService);
  private readonly tenantContext = inject(TenantContextService);
  private readonly appPermissions = inject(PermissionService);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);
  private tenantReloadReady = false;
  private formDialogRef: MatDialogRef<CatalogFormDialogShellComponent, boolean> | null = null;

  readonly isGlobalAdmin = computed(() => this.appPermissions.isGlobalAdmin());

  readonly groupsPageTitle = GROUPS_PAGE_TITLE;
  readonly groupsNewButton = GROUPS_NEW_BUTTON;
  readonly groupsEditTitle = GROUPS_EDIT_TITLE;
  readonly groupsNewTitle = GROUPS_NEW_TITLE;
  readonly groupsFormSubtitle = GROUPS_FORM_SUBTITLE;
  readonly groupsRecordScope = GROUPS_RECORD_SCOPE;
  readonly groupsScopeTenant = GROUPS_SCOPE_TENANT;
  readonly groupsScopeGlobal = GROUPS_SCOPE_GLOBAL;
  readonly groupsFieldName = GROUPS_FIELD_NAME;
  readonly groupsFieldDescription = GROUPS_FIELD_DESCRIPTION;
  readonly groupsFieldActive = GROUPS_FIELD_ACTIVE;
  readonly groupsFieldActiveGroup = GROUPS_FIELD_ACTIVE_GROUP;
  readonly groupsSelectedHeading = GROUPS_SELECTED_HEADING;
  readonly groupsPermissionSearch = GROUPS_PERMISSION_SEARCH;
  readonly groupsPermissionsHint = GROUPS_PERMISSIONS_HINT;
  readonly groupsFieldScope = GROUPS_FIELD_SCOPE;
  readonly groupsColumnGroup = GROUPS_COLUMN_GROUP;
  readonly groupsColumnPermissions = GROUPS_COLUMN_PERMISSIONS;
  readonly groupsCancel = GROUPS_CANCEL;
  readonly groupsSaving = GROUPS_SAVING;
  readonly groupsSaveGroup = GROUPS_SAVE_GROUP;
  readonly groupsYes = GROUPS_YES;
  readonly groupsNo = GROUPS_NO;
  readonly clearFiltersLabel = COMMON_CLEAR_FILTERS;
  readonly groupsSearchLabel = $localize`:@@groups.search:Buscar grupo`;

  loading = true;
  saving = false;
  /** Full list for client-side search (roles API has no search param). */
  private allItems: SecurityRole[] = [];
  data: SecurityRole[] = [];
  permissionOptions: SecurityModulePermission[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;
  editingRoleId: number | null = null;
  deletingRoleId: number | null = null;

  readonly searchForm = this.fb.nonNullable.group({ search: [''] });
  readonly roleForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
    isActive: [true],
    modulePermissionIds: [[] as number[]],
  });

  readonly createScopeForm = this.fb.nonNullable.group({
    scope: ['TENANT' as TenantDataScope],
  });

  readonly permissionSearchControl = this.fb.nonNullable.control('');
  private readonly permissionSearchQuery = toSignal(
    this.permissionSearchControl.valueChanges.pipe(startWith(''), debounceTime(150)),
    { initialValue: '' },
  );
  private readonly selectedPermissionIds = toSignal(
    this.roleForm.controls.modulePermissionIds.valueChanges.pipe(
      startWith(this.roleForm.controls.modulePermissionIds.value),
    ),
    { initialValue: [] as number[] },
  );
  private readonly expandedModules = signal<Set<string>>(new Set());

  readonly columns = ['name', 'description', 'scope', 'permissions', 'active', 'actions'];

  constructor() {
    effect(() => {
      this.tenantContext.activeCompanyId();
      if (!this.tenantReloadReady) {
        return;
      }
      this.cancelForm();
      this.pageIndex = 0;
      this.load();
    });
  }

  /** Permissions grouped by moduleName for the role form picker. */
  get permissionGroups(): PermissionModuleGroup[] {
    return this.buildPermissionGroups(this.permissionOptions);
  }

  get filteredPermissionGroups(): PermissionModuleGroup[] {
    const query = this.permissionSearchQuery().trim().toLowerCase();
    if (!query) {
      return this.permissionGroups;
    }
    return this.permissionGroups
      .map((group) => {
        const moduleMatch = group.moduleName.toLowerCase().includes(query);
        const permissions = moduleMatch
          ? group.permissions
          : group.permissions.filter(
              (permission) =>
                permission.name.toLowerCase().includes(query) ||
                permission.authority.toLowerCase().includes(query),
            );
        return { moduleName: group.moduleName, permissions };
      })
      .filter((group) => group.permissions.length > 0);
  }

  get selectedPermissionChips(): SelectedPermissionChip[] {
    const selected = new Set(this.selectedPermissionIds());
    const chips: SelectedPermissionChip[] = [];
    for (const group of this.permissionGroups) {
      for (const permission of group.permissions) {
        if (!selected.has(permission.id)) {
          continue;
        }
        chips.push({
          id: permission.id,
          label: this.permissionChipLabel(group.moduleName, permission),
        });
      }
    }
    return chips;
  }

  get selectedCountLabel(): string {
    return groupsSelectedCountLabel(this.selectedPermissionIds().length);
  }

  ngOnInit(): void {
    this.tenantReloadReady = true;
    this.loadPermissions();
    this.load();
    this.searchForm.controls.search.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.pageIndex = 0;
      this.applyFilter();
    });
  }

  canEditRecord(companyId?: number | null): boolean {
    return canEditScopedRecord(companyId, this.isGlobalAdmin());
  }

  canDeleteRole(role: SecurityRole): boolean {
    if (!this.canEditRecord(role.companyId)) {
      return false;
    }
    return role.name?.trim().toUpperCase() !== 'GLOBAL_ADMIN';
  }

  moduleSelectLabel(moduleName: string): string {
    return groupsModuleSelectLabel(moduleName);
  }

  isModuleExpanded(moduleName: string): boolean {
    return this.expandedModules().has(moduleName);
  }

  toggleModuleExpanded(moduleName: string): void {
    const next = new Set(this.expandedModules());
    if (next.has(moduleName)) {
      next.delete(moduleName);
    } else {
      next.add(moduleName);
    }
    this.expandedModules.set(next);
  }

  isPermissionSelected(permissionId: number): boolean {
    return this.selectedPermissionIds().includes(permissionId);
  }

  moduleSelectionCount(group: PermissionModuleGroup): number {
    const selected = new Set(this.selectedPermissionIds());
    return group.permissions.filter((permission) => selected.has(permission.id)).length;
  }

  isModuleFullySelected(group: PermissionModuleGroup): boolean {
    return group.permissions.length > 0 && this.moduleSelectionCount(group) === group.permissions.length;
  }

  isModulePartiallySelected(group: PermissionModuleGroup): boolean {
    const count = this.moduleSelectionCount(group);
    return count > 0 && count < group.permissions.length;
  }

  togglePermission(permissionId: number, checked: boolean): void {
    const current = this.roleForm.controls.modulePermissionIds.value;
    const next = checked
      ? Array.from(new Set([...current, permissionId]))
      : current.filter((id) => id !== permissionId);
    this.roleForm.controls.modulePermissionIds.setValue(next);
    this.roleForm.controls.modulePermissionIds.markAsDirty();
  }

  toggleModule(group: PermissionModuleGroup, checked: boolean): void {
    const current = new Set(this.roleForm.controls.modulePermissionIds.value);
    for (const permission of group.permissions) {
      if (checked) {
        current.add(permission.id);
      } else {
        current.delete(permission.id);
      }
    }
    this.roleForm.controls.modulePermissionIds.setValue(Array.from(current));
    this.roleForm.controls.modulePermissionIds.markAsDirty();
    if (checked && !this.isModuleExpanded(group.moduleName)) {
      this.toggleModuleExpanded(group.moduleName);
    }
  }

  private loadPermissions(): void {
    this.permissionService.list().subscribe({
      next: (permissions) => {
        this.permissionOptions = permissions;
        if (this.formDialogRef) {
          this.expandDefaultModules(this.roleForm.controls.modulePermissionIds.value);
        }
      },
      error: (err) => this.feedback.showApiError(err, { fallbackMessage: GROUPS_LOAD_PERMISSIONS_ERROR }),
    });
  }

  load(): void {
    this.loading = true;
    this.roleService.list(0, 500).subscribe({
      next: (res) => {
        this.allItems = res.items;
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.feedback.showApiError(err, { fallbackMessage: GROUPS_LOAD_ERROR });
      },
    });
  }

  private applyFilter(): void {
    const q = this.searchForm.controls.search.value.trim().toLowerCase();
    const filtered = !q
      ? this.allItems
      : this.allItems.filter(
          (r) =>
            r.name?.toLowerCase().includes(q) ||
            (r.description ?? '').toLowerCase().includes(q),
        );
    this.total = filtered.length;
    const start = this.pageIndex * this.pageSize;
    this.data = filtered.slice(start, start + this.pageSize);
  }

  permissionNames(role: SecurityRole): string[] {
    return (role.permissions ?? [])
      .map((p) => p.modulePermission?.name)
      .filter((name): name is string => !!name);
  }

  onPage(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.applyFilter();
  }

  clearFilters(): void {
    this.searchForm.controls.search.setValue('');
    this.pageIndex = 0;
    this.applyFilter();
  }

  openCreate(): void {
    this.editingRoleId = null;
    this.createScopeForm.controls.scope.setValue('TENANT');
    this.roleForm.reset({ name: '', description: '', isActive: true, modulePermissionIds: [] });
    this.permissionSearchControl.setValue('');
    this.expandDefaultModules([]);
    this.openFormDialog(this.groupsNewTitle);
  }

  openEdit(row: SecurityRole): void {
    if (!this.canEditRecord(row.companyId)) {
      return;
    }
    this.editingRoleId = row.id;
    this.roleService.getById(row.id).subscribe({
      next: (role) => {
        const ids =
          role.permissions?.map((p) => p.modulePermission?.id).filter((id): id is number => id != null) ?? [];
        this.roleForm.patchValue({
          name: role.name,
          description: role.description ?? '',
          isActive: role.isActive,
          modulePermissionIds: ids,
        });
        this.permissionSearchControl.setValue('');
        this.expandDefaultModules(ids);
        this.openFormDialog(this.groupsEditTitle);
      },
      error: () => {
        const ids =
          row.permissions?.map((p) => p.modulePermission?.id).filter((id): id is number => id != null) ?? [];
        this.roleForm.patchValue({
          name: row.name,
          description: row.description ?? '',
          isActive: row.isActive,
          modulePermissionIds: ids,
        });
        this.permissionSearchControl.setValue('');
        this.expandDefaultModules(ids);
        this.openFormDialog(this.groupsEditTitle);
      },
    });
  }

  private openFormDialog(title: string): void {
    this.formDialogRef?.close(false);
    queueMicrotask(() => {
      if (!this.groupFormTpl) {
        return;
      }
      this.formDialogRef = this.dialog.open(CatalogFormDialogShellComponent, {
        ...catalogTallDialogConfig('1080px', {
          panelClass: [CATALOG_FORM_DIALOG_PANEL_CLASS, CATALOG_TALL_DIALOG_PANEL_CLASS, 'sh-groups-form-dialog-panel'],
        }),
        data: {
          title,
          subtitle: this.groupsFormSubtitle,
          content: this.groupFormTpl,
          contentClass: 'group-form-dialog-body',
        },
      });
      this.formDialogRef.afterClosed().subscribe(() => {
        this.formDialogRef = null;
        this.editingRoleId = null;
        this.permissionSearchControl.setValue('');
      });
    });
  }

  cancelForm(): void {
    this.formDialogRef?.close(false);
  }

  save(): void {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }
    const value = this.roleForm.getRawValue();
    this.saving = true;

    if (this.editingRoleId != null) {
      this.roleService
        .update(this.editingRoleId, {
          name: value.name,
          description: value.description || undefined,
          isActive: value.isActive,
          modulePermissionIds: value.modulePermissionIds,
        })
        .subscribe({
          next: () => this.onSaveSuccess(),
          error: (err) => this.onSaveError(err),
        });
      return;
    }

    this.roleService
      .create({
        name: value.name,
        description: value.description || undefined,
        isActive: value.isActive,
        scope: this.isGlobalAdmin() ? this.createScopeForm.controls.scope.value : 'TENANT',
        modulePermissionIds: value.modulePermissionIds,
      })
      .subscribe({
        next: () => this.onSaveSuccess(),
        error: (err) => this.onSaveError(err),
      });
  }

  private onSaveSuccess(): void {
    this.saving = false;
    this.formDialogRef?.close(true);
    this.load();
    this.feedback.showSuccess(GROUPS_SAVE_SUCCESS);
  }

  private onSaveError(err?: unknown): void {
    this.saving = false;
    this.feedback.showApiError(err, { fallbackMessage: GROUPS_SAVE_ERROR });
  }

  deleteRole(row: SecurityRole): void {
    if (!this.canDeleteRole(row)) {
      return;
    }
    this.feedback
      .confirm({
        title: FEEDBACK_GENERIC_WARNING_TITLE,
        message: groupsDeleteConfirm(row.name),
        confirmWarn: true,
      })
      .subscribe((ok) => {
        if (!ok) {
          return;
        }
        this.deletingRoleId = row.id;
        this.roleService.delete(row.id).subscribe({
          next: () => {
            this.deletingRoleId = null;
            if (this.editingRoleId === row.id) {
              this.cancelForm();
            }
            this.load();
            this.feedback.showSuccess(GROUPS_DELETE_SUCCESS);
          },
          error: (err) => {
            this.deletingRoleId = null;
            this.feedback.showApiError(err, { fallbackMessage: GROUPS_DELETE_ERROR });
          },
        });
      });
  }

  private buildPermissionGroups(permissions: SecurityModulePermission[]): PermissionModuleGroup[] {
    const grouped = new Map<string, SecurityModulePermission[]>();
    for (const permission of permissions) {
      const moduleName = permission.moduleName?.trim() || permission.module?.trim() || COMMON_OTHERS;
      const list = grouped.get(moduleName) ?? [];
      list.push(permission);
      grouped.set(moduleName, list);
    }
    return Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b, 'es'))
      .map(([moduleName, modulePermissions]) => ({
        moduleName,
        permissions: [...modulePermissions].sort((a, b) => a.name.localeCompare(b.name, 'es')),
      }));
  }

  private expandDefaultModules(selectedIds: number[]): void {
    const groups = this.permissionGroups;
    const selected = new Set(selectedIds);
    const expanded = new Set<string>();
    for (const group of groups) {
      if (group.permissions.some((permission) => selected.has(permission.id))) {
        expanded.add(group.moduleName);
      }
    }
    for (const group of groups.slice(0, 2)) {
      expanded.add(group.moduleName);
    }
    this.expandedModules.set(expanded);
  }

  private permissionChipLabel(moduleName: string, permission: SecurityModulePermission): string {
    const short = permission.name.trim().split(/\s+/)[0] || permission.name;
    return `${moduleName} · ${short}`;
  }
}
