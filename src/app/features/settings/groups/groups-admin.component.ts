import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { SecurityModulePermissionService } from '../../../core/services/security-module-permission.service';
import { SecurityRoleService } from '../../../core/services/security-role.service';
import { SecurityModulePermission } from '../../../shared/models/security-module-permission.model';
import { SecurityRole } from '../../../shared/models/security-role.model';
import { TenantContextService } from '../../../core/services/tenant-context.service';

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
  ],
  templateUrl: './groups-admin.component.html',
  styleUrl: './groups-admin.component.scss',
})
export class GroupsAdminComponent implements OnInit {
  private readonly roleService = inject(SecurityRoleService);
  private readonly permissionService = inject(SecurityModulePermissionService);
  private readonly tenantContext = inject(TenantContextService);
  private readonly snack = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

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

  readonly columns = ['name', 'description', 'permissions', 'active', 'actions'];

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
    this.loadPermissions();
    this.load();
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
    this.roleForm.reset({ name: '', description: '', isActive: true, modulePermissionIds: [] });
  }

  openEdit(row: SecurityRole): void {
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
        companyId: this.tenantContext.getCompanyId(),
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
