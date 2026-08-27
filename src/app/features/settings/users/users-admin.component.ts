import { Component, effect, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, switchMap, catchError, map } from 'rxjs';
import { of } from 'rxjs';
import { catalogDialogConfig } from '../../../core/dialog/catalog-dialog.constants';
import { CatalogBranchService } from '../../../core/services/catalog-branch.service';
import { CatalogCompanyAreaService } from '../../../core/services/catalog-company-area.service';
import { CatalogCompanyDepartmentService } from '../../../core/services/catalog-company-department.service';
import {
  CountryDialCodeOption,
  ReferenceDataService,
} from '../../../core/services/reference-data.service';
import { SecurityRoleService } from '../../../core/services/security-role.service';
import { SecurityUserService } from '../../../core/services/security-user.service';
import { SecurityRole } from '../../../shared/models/security-role.model';
import {
  SecurityUser,
  SupervisorOption,
} from '../../../shared/models/security-user.model';
import { CatalogBranch } from '../../../shared/models/catalog-branch.model';
import { CatalogCompanyArea } from '../../../shared/models/catalog-company-area.model';
import { CatalogCompanyDepartment } from '../../../shared/models/catalog-company-department.model';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import { ApiErrorTranslationService } from '../../../core/services/api-error-translation.service';
import { FeedbackDialogService } from '../../../core/feedback/feedback-dialog.service';
import { FEEDBACK_GENERIC_WARNING_TITLE } from '../../../core/i18n/feedback-labels';
import { SNACK_CLOSE_ACTION } from '../../../core/i18n/nav-labels';
import {
  USERS_DELETE_CONFIRM_TITLE,
  USERS_DELETE_ERROR,
  USERS_DELETE_SUCCESS,
  USERS_DIAL_CODES_ERROR,
  USERS_LIST_ERROR,
  USERS_NO,
  USERS_ROLES_ERROR,
  USERS_SAVE,
  USERS_SAVE_ERROR,
  USERS_SAVE_SUCCESS,
  USERS_SAVING,
  USERS_TENANT_CONTEXT_ERROR,
  USERS_YES,
  usersDeleteConfirm,
} from '../../../core/i18n/users-labels';
import { COMMON_CLEAR_FILTERS } from '../../../core/i18n/common-labels';
import { TableRowActionsComponent } from '../../../shared/components/table-row-actions/table-row-actions.component';
import { ShModalActionsDirective } from '../../../shared/components/modal-form/sh-modal-form.component';
import {
  CatalogFormDialogShellComponent,
} from '../catalogs/catalog-form-dialog-shell.component';

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
    MatDialogModule,
    TableRowActionsComponent,
    ShModalActionsDirective,
  ],
  templateUrl: './users-admin.component.html',
  styleUrl: './users-admin.component.scss',
})
export class UsersAdminComponent implements OnInit {
  @ViewChild('userFormTpl') userFormTpl!: TemplateRef<unknown>;

  private readonly userService = inject(SecurityUserService);
  private readonly roleService = inject(SecurityRoleService);
  private readonly referenceDataService = inject(ReferenceDataService);
  private readonly branchService = inject(CatalogBranchService);
  private readonly areaService = inject(CatalogCompanyAreaService);
  private readonly departmentService = inject(CatalogCompanyDepartmentService);
  private readonly tenantContext = inject(TenantContextService);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly apiErrors = inject(ApiErrorTranslationService);
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);
  private tenantReloadReady = false;
  private formDialogRef: MatDialogRef<CatalogFormDialogShellComponent, boolean> | null = null;

  readonly createTitle = $localize`:@@users.form.createTitle:Nuevo usuario`;
  readonly editTitle = $localize`:@@users.form.editTitle:Editar usuario`;
  readonly saveLabel = USERS_SAVE;
  readonly savingLabel = USERS_SAVING;
  readonly yesLabel = USERS_YES;
  readonly noLabel = USERS_NO;
  readonly clearFiltersLabel = COMMON_CLEAR_FILTERS;

  loading = true;
  saving = false;
  deletingId: number | null = null;
  data: SecurityUser[] = [];
  roleOptions: SecurityRole[] = [];
  dialCodeOptions: CountryDialCodeOption[] = [];
  branchOptions: CatalogBranch[] = [];
  areaOptions: CatalogCompanyArea[] = [];
  departmentOptions: CatalogCompanyDepartment[] = [];
  supervisorOptions: SupervisorOption[] = [];
  tenantCountryId: number | null = null;
  tenantCountryName: string | null = null;
  total = 0;
  pageIndex = 0;
  pageSize = 10;
  editingUserId: number | null = null;

  readonly searchForm = this.fb.nonNullable.group({ search: [''] });
  readonly userForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    phoneCountryCode: [''],
    phone: [''],
    supervisorId: [null as number | null],
    supervisorSearch: [''],
    branchId: [null as number | null],
    companyAreaId: [null as number | null],
    companyDepartmentId: [null as number | null],
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
    this.userForm.controls.supervisorSearch.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => {
          const selectedOption = this.parseSupervisorOption(term);
          if (selectedOption) {
            this.userForm.patchValue(
              { supervisorId: selectedOption.id, supervisorSearch: selectedOption.label },
              { emitEvent: false },
            );
            this.supervisorOptions = [selectedOption];
            return of([selectedOption]);
          }

          const trimmed = typeof term === 'string' ? term.trim() : '';
          if (!trimmed) {
            this.userForm.patchValue({ supervisorId: null }, { emitEvent: false });
            return of([] as SupervisorOption[]);
          }

          const supervisorId = this.userForm.controls.supervisorId.value;
          if (supervisorId != null) {
            const current = this.supervisorOptions.find((o) => o.id === supervisorId);
            if (current?.label.trim() === trimmed) {
              return of([current]);
            }
            this.userForm.patchValue({ supervisorId: null }, { emitEvent: false });
          }
          return this.searchSupervisors(trimmed);
        }),
      )
      .subscribe((options) => {
        this.supervisorOptions = options;
      });
  }

  onSupervisorFocus(): void {
    const trimmed = this.supervisorSearchText(this.userForm.controls.supervisorSearch.value);
    if (trimmed.length > 0) {
      return;
    }
    this.searchSupervisors('').subscribe((options) => {
      this.supervisorOptions = options;
    });
  }

  private searchSupervisors(term: string) {
    return this.userService.list(0, 20, term || undefined).pipe(
      map((res) =>
        res.items
          .filter((u) => u.id !== this.editingUserId)
          .map((u) => ({ id: u.id, label: this.buildUserLabel(u) })),
      ),
      catchError(() => of([] as SupervisorOption[])),
    );
  }

  private loadCatalogData(): void {
    this.referenceDataService.getUserTenantContext().subscribe({
      next: (ctx) => {
        this.tenantCountryId = ctx.countryId;
        this.tenantCountryName = ctx.countryName;
        this.loadDialCodes(ctx.countryId);
        this.loadBranches(ctx.countryId);
        this.loadAreaAndDepartmentOptions();
      },
      error: (err) =>
        this.feedback.showApiError(err, { fallbackMessage: USERS_TENANT_CONTEXT_ERROR }),
    });
  }

  private loadDialCodes(preferredCountryId: number | null): void {
    this.referenceDataService.listCountryDialCodes(preferredCountryId).subscribe({
      next: (options) => {
        this.dialCodeOptions = options;
      },
      error: (err) =>
        this.feedback.showApiError(err, { fallbackMessage: USERS_DIAL_CODES_ERROR }),
    });
  }

  private loadRoles(): void {
    this.roleService.list(0, 200).subscribe({
      next: (res) => {
        this.roleOptions = res.items
          .filter((r) => r.isActive !== false)
          .sort((a, b) => a.name.localeCompare(b.name, 'es'));
      },
      error: (err) => this.feedback.showApiError(err, { fallbackMessage: USERS_ROLES_ERROR }),
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
      error: (err) => {
        this.loading = false;
        this.feedback.showApiError(err, { fallbackMessage: USERS_LIST_ERROR });
      },
    });
  }

  onPage(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.load();
  }

  clearFilters(): void {
    this.searchForm.controls.search.setValue('');
    this.pageIndex = 0;
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

  dialCodeLabel(option: CountryDialCodeOption): string {
    return `${option.dialCode} — ${option.countryName}`;
  }

  private parseSupervisorOption(term: unknown): SupervisorOption | null {
    if (term == null || typeof term !== 'object' || !('id' in term) || !('label' in term)) {
      return null;
    }
    const raw = term as SupervisorOption;
    return typeof raw.id === 'number' && typeof raw.label === 'string' ? raw : null;
  }

  private supervisorSearchText(value: unknown): string {
    const option = this.parseSupervisorOption(value);
    if (option) {
      return option.label.trim();
    }
    return typeof value === 'string' ? value.trim() : '';
  }

  readonly displaySupervisorFn = (option: SupervisorOption | string | null): string =>
    this.displaySupervisor(option);

  onSupervisorSelected(option: SupervisorOption): void {
    this.userForm.patchValue(
      { supervisorId: option.id, supervisorSearch: option.label },
      { emitEvent: false },
    );
    this.supervisorOptions = [option];
  }

  clearSupervisor(): void {
    this.userForm.patchValue({ supervisorId: null, supervisorSearch: '' });
  }

  openCreate(): void {
    this.editingUserId = null;
    const defaultDialCode = this.defaultTenantDialCode();
    this.userForm.reset({
      username: '',
      email: '',
      password: '',
      name: '',
      lastName: '',
      phoneCountryCode: defaultDialCode,
      phone: '',
      supervisorId: null,
      supervisorSearch: '',
      branchId: null,
      companyAreaId: null,
      companyDepartmentId: null,
      address: '',
      legacyR3Username: '',
      legacyAppianProfile: '',
      manpowerPosition: '',
      isActive: true,
      roleIds: [],
    });
    this.userForm.controls.username.enable();
    this.userForm.controls.password.setValidators([Validators.required]);
    this.userForm.controls.password.updateValueAndValidity();
    this.openFormDialog(this.createTitle);
  }

  openEdit(row: SecurityUser): void {
    this.editingUserId = row.id;
    this.userForm.controls.username.disable();
    this.userForm.controls.password.clearValidators();
    this.userForm.controls.password.updateValueAndValidity();
    this.userService.getById(row.id).subscribe({
      next: (user) => {
        this.patchUserForm(user);
        this.openFormDialog(this.editTitle);
      },
      error: () => {
        this.patchUserForm(row);
        this.openFormDialog(this.editTitle);
      },
    });
  }

  private openFormDialog(title: string): void {
    this.formDialogRef?.close(false);
    queueMicrotask(() => {
      if (!this.userFormTpl) {
        return;
      }
      this.formDialogRef = this.dialog.open(CatalogFormDialogShellComponent, {
        ...catalogDialogConfig('720px'),
        data: { title, content: this.userFormTpl },
      });
      this.formDialogRef.afterClosed().subscribe(() => {
        this.formDialogRef = null;
        this.editingUserId = null;
        this.userForm.controls.username.enable();
      });
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
        supervisorId: user.supervisorId ?? null,
        supervisorSearch: user.supervisorLabel ?? '',
        branchId: user.branchId ?? null,
        companyAreaId: user.companyAreaId ?? null,
        companyDepartmentId: user.companyDepartmentId ?? null,
        address: user.address ?? '',
        legacyR3Username: user.legacyR3Username ?? '',
        legacyAppianProfile: user.legacyAppianProfile ?? '',
        manpowerPosition: user.manpowerPosition ?? '',
        isActive: user.isActive,
        roleIds: user.roles?.map((r) => r.id) ?? [],
      },
      { emitEvent: false },
    );
    if (user.supervisorId != null && user.supervisorLabel) {
      this.supervisorOptions = [{ id: user.supervisorId, label: user.supervisorLabel }];
    }
  }

  cancelForm(): void {
    this.formDialogRef?.close(false);
  }

  save(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    const value = this.userForm.getRawValue();
    const supervisorId =
      value.supervisorId ?? this.parseSupervisorOption(value.supervisorSearch)?.id ?? undefined;
    const profilePayload = {
      phoneCountryCode: value.phoneCountryCode || undefined,
      supervisorId,
      branchId: value.branchId ?? undefined,
      companyAreaId: value.companyAreaId ?? undefined,
      companyDepartmentId: value.companyDepartmentId ?? undefined,
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
          error: (err) => this.onSaveError(err),
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
        error: (err) => this.onSaveError(err),
      });
  }

  private onSaveSuccess(): void {
    this.saving = false;
    this.formDialogRef?.close(true);
    this.load();
    this.feedback.showSuccess(USERS_SAVE_SUCCESS);
  }

  private onSaveError(err?: unknown): void {
    this.saving = false;
    this.feedback.showApiError(err, { fallbackMessage: USERS_SAVE_ERROR });
  }

  deleteUser(row: SecurityUser): void {
    const label = row.username || row.email;
    this.feedback
      .confirm({
        title: USERS_DELETE_CONFIRM_TITLE,
        message: usersDeleteConfirm(label),
        confirmLabel: USERS_YES,
        cancelLabel: USERS_NO,
        confirmWarn: true,
      })
      .subscribe((confirmed) => {
        if (!confirmed) {
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
            this.feedback.showSuccess(USERS_DELETE_SUCCESS);
          },
          error: (err) => {
            this.deletingId = null;
            this.feedback.showApiError(err, { fallbackMessage: USERS_DELETE_ERROR });
          },
        });
      });
  }

  private defaultTenantDialCode(): string {
    if (this.tenantCountryId == null) {
      return '';
    }
    return this.dialCodeOptions.find((o) => o.countryId === this.tenantCountryId)?.dialCode ?? '';
  }

  private loadBranches(countryId: number | null): void {
    if (countryId == null) {
      this.branchOptions = [];
      return;
    }
    this.branchService.list(countryId, 0, 300).subscribe({
      next: (res) => {
        this.branchOptions = res.items.filter((b) => b.isActive !== false);
      },
    });
  }

  private loadAreaAndDepartmentOptions(): void {
    const companyId = this.tenantContext.getCompanyId();
    if (!companyId) {
      this.areaOptions = [];
      this.departmentOptions = [];
      return;
    }
    this.areaService.list(companyId, 0, 300).subscribe({
      next: (res) => {
        this.areaOptions = res.items.filter((a) => a.isActive !== false);
      },
    });
    this.departmentService.list(companyId, 0, 300).subscribe({
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
