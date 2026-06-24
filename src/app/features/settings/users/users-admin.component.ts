import { Component, effect, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { of } from 'rxjs';
import { CatalogBranchService } from '../../../core/services/catalog-branch.service';
import { CatalogClientCompanyService } from '../../../core/services/catalog-client-company.service';
import { CatalogCompanyAreaService } from '../../../core/services/catalog-company-area.service';
import { CatalogCompanyDepartmentService } from '../../../core/services/catalog-company-department.service';
import { CatalogCompanyService } from '../../../core/services/catalog-company.service';
import { CatalogGeographyService } from '../../../core/services/catalog-geography.service';
import { SecurityRoleService } from '../../../core/services/security-role.service';
import { SecurityUserService } from '../../../core/services/security-user.service';
import { SecurityRole } from '../../../shared/models/security-role.model';
import {
  SecurityUser,
  SupervisorOption,
} from '../../../shared/models/security-user.model';
import { CatalogBranch } from '../../../shared/models/catalog-branch.model';
import { CatalogClientCompany } from '../../../shared/models/catalog-client-company.model';
import { CatalogCompanyArea } from '../../../shared/models/catalog-company-area.model';
import { CatalogCompanyDepartment } from '../../../shared/models/catalog-company-department.model';
import { CatalogCountry } from '../../../shared/models/catalog-geography.model';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import { TableRowActionsComponent } from '../../../shared/components/table-row-actions/table-row-actions.component';

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
    MatAutocompleteModule,
    MatSnackBarModule,
    TableRowActionsComponent,
  ],
  templateUrl: './users-admin.component.html',
  styleUrl: './users-admin.component.scss',
})
export class UsersAdminComponent implements OnInit {
  private readonly userService = inject(SecurityUserService);
  private readonly roleService = inject(SecurityRoleService);
  private readonly geographyService = inject(CatalogGeographyService);
  private readonly branchService = inject(CatalogBranchService);
  private readonly areaService = inject(CatalogCompanyAreaService);
  private readonly departmentService = inject(CatalogCompanyDepartmentService);
  private readonly clientCompanyService = inject(CatalogClientCompanyService);
  private readonly catalogCompanyService = inject(CatalogCompanyService);
  private readonly tenantContext = inject(TenantContextService);
  private readonly snack = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);
  private tenantReloadReady = false;

  loading = true;
  saving = false;
  deletingId: number | null = null;
  data: SecurityUser[] = [];
  roleOptions: SecurityRole[] = [];
  countryOptions: CatalogCountry[] = [];
  branchOptions: CatalogBranch[] = [];
  areaOptions: CatalogCompanyArea[] = [];
  departmentOptions: CatalogCompanyDepartment[] = [];
  clientCompanyOptions: CatalogClientCompany[] = [];
  supervisorOptions: SupervisorOption[] = [];
  catalogCompanyId: number | null = null;
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
    phoneCountryCode: [''],
    phone: [''],
    countryId: [null as number | null],
    supervisorId: [null as number | null],
    supervisorSearch: [''],
    branchId: [null as number | null],
    companyAreaId: [null as number | null],
    companyDepartmentId: [null as number | null],
    clientCompanyIds: [[] as number[]],
    address: [''],
    legacyR3Username: [''],
    legacyAppianProfile: [''],
    manpowerPosition: [''],
    isActive: [true],
    roleIds: [[] as number[]],
  });

  readonly columns = ['username', 'name', 'lastName', 'email', 'roles', 'active', 'actions'];

  constructor() {
    effect(() => {
      this.tenantContext.activeCompanyId();
      if (!this.tenantReloadReady) {
        return;
      }
      this.cancelForm();
      this.pageIndex = 0;
      this.loadCatalogData();
      this.loadRoles();
      this.load();
    });
  }

  ngOnInit(): void {
    this.tenantReloadReady = true;
    this.loadCatalogData();
    this.loadRoles();
    this.load();
    this.searchForm.controls.search.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.pageIndex = 0;
      this.load();
    });
    this.userForm.controls.countryId.valueChanges.subscribe((countryId) => {
      this.onCountryChanged(countryId);
    });
    this.userForm.controls.supervisorSearch.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => {
          const trimmed = term?.trim() ?? '';
          if (trimmed.length < 2) {
            return of([] as SupervisorOption[]);
          }
          return this.userService.list(0, 20, trimmed).pipe(
            switchMap((res) =>
              of(
                res.items
                  .filter((u) => u.id !== this.editingUserId)
                  .map((u) => ({ id: u.id, label: this.buildUserLabel(u) })),
              ),
            ),
          );
        }),
      )
      .subscribe((options) => {
        this.supervisorOptions = options;
      });
  }

  private loadCatalogData(): void {
    this.geographyService.listCountries(0, 300).subscribe({
      next: (countries) => {
        this.countryOptions = countries.filter((c) => c.isActive !== false);
      },
      error: () => this.snack.open('No se pudieron cargar los países', 'Cerrar', { duration: 4000 }),
    });
    this.catalogCompanyService.list(0, 50).subscribe({
      next: (res) => {
        const active = res.items.filter((c) => c.isActive !== false);
        this.catalogCompanyId = active[0]?.id ?? null;
        this.loadAreaAndDepartmentOptions();
      },
    });
  }

  private loadRoles(): void {
    this.roleService.list(0, 200).subscribe({
      next: (res) => {
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

  displaySupervisor(option: SupervisorOption | string | null): string {
    if (!option) {
      return '';
    }
    return typeof option === 'string' ? option : option.label;
  }

  readonly displaySupervisorFn = (option: SupervisorOption | string | null): string =>
    this.displaySupervisor(option);

  onSupervisorSelected(option: SupervisorOption): void {
    this.userForm.patchValue({ supervisorId: option.id, supervisorSearch: option.label });
  }

  clearSupervisor(): void {
    this.userForm.patchValue({ supervisorId: null, supervisorSearch: '' });
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
      phoneCountryCode: '',
      phone: '',
      countryId: null,
      supervisorId: null,
      supervisorSearch: '',
      branchId: null,
      companyAreaId: null,
      companyDepartmentId: null,
      clientCompanyIds: [],
      address: '',
      legacyR3Username: '',
      legacyAppianProfile: '',
      manpowerPosition: '',
      isActive: true,
      roleIds: [],
    });
    this.branchOptions = [];
    this.clientCompanyOptions = [];
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
      next: (user) => this.patchUserForm(user),
      error: () => this.patchUserForm(row),
    });
  }

  private patchUserForm(user: SecurityUser): void {
    this.userForm.patchValue(
      {
        username: user.username,
        email: user.email,
        password: '',
        name: user.name,
        lastName: user.lastName,
        phoneCountryCode: user.phoneCountryCode ?? '',
        phone: user.phone ?? '',
        countryId: user.countryId ?? null,
        supervisorId: user.supervisorId ?? null,
        supervisorSearch: user.supervisorLabel ?? '',
        branchId: user.branchId ?? null,
        companyAreaId: user.companyAreaId ?? null,
        companyDepartmentId: user.companyDepartmentId ?? null,
        clientCompanyIds: user.clientCompanyIds ?? [],
        address: user.address ?? '',
        legacyR3Username: user.legacyR3Username ?? '',
        legacyAppianProfile: user.legacyAppianProfile ?? '',
        manpowerPosition: user.manpowerPosition ?? '',
        isActive: user.isActive,
        roleIds: user.roles?.map((r) => r.id) ?? [],
      },
      { emitEvent: false },
    );
    if (user.countryId) {
      this.loadBranchesAndClientCompanies(user.countryId);
    }
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
    const profilePayload = {
      countryId: value.countryId ?? undefined,
      phoneCountryCode: value.phoneCountryCode || undefined,
      supervisorId: value.supervisorId ?? undefined,
      branchId: value.branchId ?? undefined,
      companyAreaId: value.companyAreaId ?? undefined,
      companyDepartmentId: value.companyDepartmentId ?? undefined,
      clientCompanyIds: value.clientCompanyIds?.length ? value.clientCompanyIds : undefined,
      address: value.address || undefined,
      legacyR3Username: value.legacyR3Username || undefined,
      legacyAppianProfile: value.legacyAppianProfile || undefined,
      manpowerPosition: value.manpowerPosition || undefined,
    };
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
          ...profilePayload,
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
        ...profilePayload,
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

  private onCountryChanged(countryId: number | null): void {
    const country = this.countryOptions.find((c) => c.id === countryId);
    if (country?.secondaryCode && !this.userForm.controls.phoneCountryCode.value) {
      this.userForm.patchValue({ phoneCountryCode: country.secondaryCode });
    }
    this.userForm.patchValue({ branchId: null, clientCompanyIds: [] });
    if (countryId) {
      this.loadBranchesAndClientCompanies(countryId);
    } else {
      this.branchOptions = [];
      this.clientCompanyOptions = [];
    }
  }

  private loadBranchesAndClientCompanies(countryId: number): void {
    this.branchService.list(countryId, 0, 300).subscribe({
      next: (res) => {
        this.branchOptions = res.items.filter((b) => b.isActive !== false);
      },
    });
    this.clientCompanyService.list(countryId, 0, 300).subscribe({
      next: (res) => {
        this.clientCompanyOptions = res.items.filter((c) => c.isActive !== false);
      },
    });
  }

  private loadAreaAndDepartmentOptions(): void {
    if (!this.catalogCompanyId) {
      this.areaOptions = [];
      this.departmentOptions = [];
      return;
    }
    this.areaService.list(this.catalogCompanyId, 0, 300).subscribe({
      next: (res) => {
        this.areaOptions = res.items.filter((a) => a.isActive !== false);
      },
    });
    this.departmentService.list(this.catalogCompanyId, 0, 300).subscribe({
      next: (res) => {
        this.departmentOptions = res.items.filter((d) => d.isActive !== false);
      },
    });
  }

  private buildUserLabel(user: SecurityUser): string {
    const name = [user.name, user.lastName].filter(Boolean).join(' ').trim();
    if (name) {
      return `${name} (${user.email || user.username})`;
    }
    return user.email || user.username;
  }
}
