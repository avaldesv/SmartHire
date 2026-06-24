import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { PermissionService } from '../../../core/services/permission.service';
import { SecurityModulePermissionService } from '../../../core/services/security-module-permission.service';
import { SecurityRoleService } from '../../../core/services/security-role.service';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import { ScopeBadgeComponent } from '../../../shared/components/scope-badge/scope-badge.component';
import { SecurityModulePermission } from '../../../shared/models/security-module-permission.model';
import { SecurityRole } from '../../../shared/models/security-role.model';
import { TenantDataScope } from '../../../shared/models/tenant-data-scope.model';
import { canEditScopedRecord } from '../../../shared/utils/tenant-scope.util';
import { TableRowActionsComponent } from '../../../shared/components/table-row-actions/table-row-actions.component';

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
    MatSelectModule,
    MatSnackBarModule,
    MatRadioModule,
    ScopeBadgeComponent,
    TableRowActionsComponent,
  ],
  templateUrl: './groups-admin.component.html',
  styleUrl: './groups-admin.component.scss',
})
export class GroupsAdminComponent implements OnInit {
  private readonly roleService = inject(SecurityRoleService);
  private readonly permissionService = inject(SecurityModulePermissionService);
  private readonly tenantContext = inject(TenantContextService);
  private readonly appPermissions = inject(PermissionService);
  private readonly snack = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);
  private tenantReloadReady = false;

  readonly isGlobalAdmin = computed(() => this.appPermissions.isGlobalAdmin());

  loading = true;
  saving = false;
  data: SecurityRole[] = [];
  permissionOptions: SecurityModulePermission[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;
  editingRoleId: number | null = null;
  showForm = false;

  readonly roleForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
    isActive: [true],
    modulePermissionIds: [[] as number[]],
  });

  readonly createScopeForm = this.fb.nonNullable.group({
    scope: ['TENANT' as TenantDataScope],
  });

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

  /** Permissions grouped by moduleName for the role form multi-select. */
  get permissionGroups(): { moduleName: string; permissions: SecurityModulePermission[] }[] {
    const grouped = new Map<string, SecurityModulePermission[]>();
    for (const permission of this.permissionOptions) {
      const moduleName = permission.moduleName?.trim() || permission.module?.trim() || 'Otros';
      const list = grouped.get(moduleName) ?? [];
      list.push(permission);
      grouped.set(moduleName, list);
    }
    return Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b, 'es'))
      .map(([moduleName, permissions]) => ({
        moduleName,
        permissions: [...permissions].sort((a, b) => a.name.localeCompare(b.name, 'es')),
      }));
  }

  ngOnInit(): void {
    this.tenantReloadReady = true;
    this.loadPermissions();
    this.load();
  }

  canEditRecord(companyId?: number | null): boolean {
    return canEditScopedRecord(companyId, this.isGlobalAdmin());
  }

  private loadPermissions(): void {
    this.permissionService.list().subscribe({
      next: (permissions) => {
        this.permissionOptions = permissions;
      },
      error: () => this.snack.open('No se pudieron cargar los permisos', 'Cerrar', { duration: 4000 }),
    });
  }

  load(): void {
    this.loading = true;
    this.roleService.list(this.pageIndex, this.pageSize).subscribe({
      next: (res) => {
        this.data = res.items;
        this.total = res.total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open('No se pudieron cargar los grupos', 'Cerrar', { duration: 4000 });
      },
    });
  }

  permissionNames(role: SecurityRole): string[] {
    return (role.permissions ?? [])
      .map((p) => p.modulePermission?.name)
      .filter((name): name is string => !!name);
  }

  onPage(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.load();
  }

  openCreate(): void {
    this.editingRoleId = null;
    this.showForm = true;
    this.createScopeForm.controls.scope.setValue('TENANT');
    this.roleForm.reset({ name: '', description: '', isActive: true, modulePermissionIds: [] });
  }

  openEdit(row: SecurityRole): void {
    if (!this.canEditRecord(row.companyId)) {
      return;
    }
    this.editingRoleId = row.id;
    this.showForm = true;
    this.roleService.getById(row.id).subscribe({
      next: (role) => {
        this.roleForm.patchValue({
          name: role.name,
          description: role.description ?? '',
          isActive: role.isActive,
          modulePermissionIds:
            role.permissions?.map((p) => p.modulePermission?.id).filter((id): id is number => id != null) ?? [],
        });
      },
      error: () => {
        this.roleForm.patchValue({
          name: row.name,
          description: row.description ?? '',
          isActive: row.isActive,
          modulePermissionIds:
            row.permissions?.map((p) => p.modulePermission?.id).filter((id): id is number => id != null) ?? [],
        });
      },
    });
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingRoleId = null;
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
          error: () => this.onSaveError(),
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
        error: () => this.onSaveError(),
      });
  }

  private onSaveSuccess(): void {
    this.saving = false;
    this.cancelForm();
    this.load();
    this.snack.open('Grupo guardado', 'Cerrar', { duration: 3000 });
  }

  private onSaveError(): void {
    this.saving = false;
    this.snack.open('No se pudo guardar el grupo', 'Cerrar', { duration: 4000 });
  }
}
