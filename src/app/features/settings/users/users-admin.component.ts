import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { debounceTime } from 'rxjs';
import { SecurityRoleService } from '../../../core/services/security-role.service';
import { SecurityUserService } from '../../../core/services/security-user.service';
import { SecurityRole } from '../../../shared/models/security-role.model';
import { SecurityUser } from '../../../shared/models/security-user.model';
import { TenantContextService } from '../../../core/services/tenant-context.service';

@Component({
  selector: 'sh-users-admin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './users-admin.component.html',
  styleUrl: './users-admin.component.scss',
})
export class UsersAdminComponent implements OnInit {
  private readonly userService = inject(SecurityUserService);
  private readonly roleService = inject(SecurityRoleService);
  private readonly tenantContext = inject(TenantContextService);
  private readonly snack = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  loading = true;
  saving = false;
  deletingId: number | null = null;
  data: SecurityUser[] = [];
  roleOptions: SecurityRole[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;
  editingUserId: number | null = null;
  showForm = false;

  readonly searchForm = this.fb.nonNullable.group({ search: [''] });
  readonly userForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: [''],
    isActive: [true],
    roleIds: [[] as number[]],
  });

  readonly columns = ['username', 'name', 'lastName', 'email', 'roles', 'active', 'actions'];

  ngOnInit(): void {
    this.loadRoles();
    this.load();
    this.searchForm.controls.search.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.pageIndex = 0;
      this.load();
    });
  }

  private loadRoles(): void {
    this.roleService.list(0, 200).subscribe({
      next: (res) => {
        // Treat null isActive as active (legacy ADMIN seed had is_active NULL).
        this.roleOptions = res.items
          .filter((r) => r.isActive !== false)
          .sort((a, b) => a.name.localeCompare(b.name, 'es'));
      },
      error: () => this.snack.open('No se pudieron cargar los roles', 'Cerrar', { duration: 4000 }),
    });
  }

  load(): void {
    this.loading = true;
    const search = this.searchForm.controls.search.value;
    this.userService.list(this.pageIndex, this.pageSize, search).subscribe({
      next: (res) => {
        this.data = res.items;
        this.total = res.total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open('No se pudieron cargar los usuarios', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onPage(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.load();
  }

  roleNames(user: SecurityUser): string {
    return user.roles?.length ? user.roles.map((r) => r.name).join(', ') : '—';
  }

  openCreate(): void {
    this.editingUserId = null;
    this.showForm = true;
    this.userForm.reset({
      username: '',
      email: '',
      password: '',
      name: '',
      lastName: '',
      phone: '',
      isActive: true,
      roleIds: [],
    });
    this.userForm.controls.username.enable();
    this.userForm.controls.password.setValidators([Validators.required]);
    this.userForm.controls.password.updateValueAndValidity();
  }

  openEdit(row: SecurityUser): void {
    this.editingUserId = row.id;
    this.showForm = true;
    this.userForm.controls.username.disable();
    this.userForm.controls.password.clearValidators();
    this.userForm.controls.password.updateValueAndValidity();
    this.userService.getById(row.id).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          username: user.username,
          email: user.email,
          password: '',
          name: user.name,
          lastName: user.lastName,
          phone: user.phone ?? '',
          isActive: user.isActive,
          roleIds: user.roles?.map((r) => r.id) ?? [],
        });
      },
      error: () => {
        this.userForm.patchValue({
          username: row.username,
          email: row.email,
          password: '',
          name: row.name,
          lastName: row.lastName,
          phone: row.phone ?? '',
          isActive: row.isActive,
          roleIds: row.roles?.map((r) => r.id) ?? [],
        });
      },
    });
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingUserId = null;
    this.userForm.controls.username.enable();
  }

  save(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    const value = this.userForm.getRawValue();
    this.saving = true;

    if (this.editingUserId != null) {
      this.userService
        .update(this.editingUserId, {
          email: value.email,
          name: value.name,
          lastName: value.lastName,
          phone: value.phone || undefined,
          isActive: value.isActive,
          roleIds: value.roleIds,
        })
        .subscribe({
          next: () => this.onSaveSuccess(),
          error: () => this.onSaveError(),
        });
      return;
    }

    this.userService
      .create({
        username: value.username,
        email: value.email,
        password: value.password,
        name: value.name,
        lastName: value.lastName,
        phone: value.phone || undefined,
        companyId: this.tenantContext.getCompanyId(),
        isActive: value.isActive,
        roleIds: value.roleIds,
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
    this.snack.open('Usuario guardado', 'Cerrar', { duration: 3000 });
  }

  private onSaveError(): void {
    this.saving = false;
    this.snack.open('No se pudo guardar el usuario', 'Cerrar', { duration: 4000 });
  }

  deleteUser(row: SecurityUser): void {
    const label = row.username || row.email;
    if (!confirm(`¿Eliminar el usuario "${label}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    this.deletingId = row.id;
    this.userService.delete(row.id).subscribe({
      next: () => {
        this.deletingId = null;
        if (this.editingUserId === row.id) {
          this.cancelForm();
        }
        this.load();
        this.snack.open('Usuario eliminado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.deletingId = null;
        this.snack.open('No se pudo eliminar el usuario', 'Cerrar', { duration: 4000 });
      },
    });
  }
}
