import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  Subject,
  Subscription,
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  switchMap,
} from 'rxjs';
import {
  RG_ADD,
  RG_ADD_SELECTED,
  RG_AVAILABLE,
  RG_AVAILABLE_SEARCH_PH,
  RG_CLEAR_MANAGER,
  RG_DIALOG_CANCEL,
  RG_DIALOG_EDIT_TITLE,
  RG_DIALOG_NEW_TITLE,
  RG_DIALOG_SAVE,
  RG_DIALOG_SAVING,
  RG_ERR_MANAGER_CONFLICT,
  RG_ERR_MANAGER_REQUIRED,
  RG_ERR_SAVE,
  RG_FIELD_ACTIVE,
  RG_FIELD_ALL_COUNTRIES,
  RG_FIELD_CODE,
  RG_FIELD_CORE_APPIAN,
  RG_FIELD_CORE_ATS,
  RG_FIELD_COUNTRY,
  RG_FIELD_DESCRIPTION,
  RG_FIELD_MANAGER,
  RG_FIELD_MP,
  RG_FIELD_RECRUITERS,
  RG_LOADING_USERS,
  RG_MANAGER_HINT,
  RG_MANAGER_SEARCH_PH,
  RG_NO_AVAILABLE,
  RG_NO_SELECTED,
  RG_REMOVE,
  RG_REMOVE_SELECTED,
  RG_SCOPE_GLOBAL,
  RG_SCOPE_LABEL,
  RG_SCOPE_TENANT,
  RG_SECTION_GROUP,
  RG_SECTION_PEOPLE,
  RG_SELECTED,
} from '../../../core/i18n/recruiter-group-dialog-labels';
import { CATALOG_MSG_SNACK_CLOSE } from '../../../core/i18n/catalog-messages-labels';
import { SecurityRecruiterGroupService } from '../../../core/services/security-recruiter-group.service';
import { SecurityUserService } from '../../../core/services/security-user.service';
import { CatalogCountry } from '../../../shared/models/catalog-geography.model';
import {
  RecruiterGroupUserSummary,
  SecurityRecruiterGroup,
} from '../../../shared/models/security-recruiter-group.model';
import { SecurityUser } from '../../../shared/models/security-user.model';
import { TenantDataScope } from '../../../shared/models/tenant-data-scope.model';

export interface RecruiterGroupFormDialogData {
  groupId?: number | null;
  selectedCountryId: number | null;
  countries: CatalogCountry[];
  isGlobalAdmin: boolean;
}

export interface RecruiterGroupUserOption {
  id: number;
  label: string;
  name?: string | null;
  lastName?: string | null;
  email?: string | null;
}

@Component({
  selector: 'sh-recruiter-group-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './recruiter-group-form-dialog.component.html',
  styleUrl: './recruiter-group-form-dialog.component.scss',
})
export class RecruiterGroupFormDialogComponent implements OnInit, OnDestroy {
  private readonly dialogRef = inject(MatDialogRef<RecruiterGroupFormDialogComponent, boolean>);
  readonly data = inject<RecruiterGroupFormDialogData>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);
  private readonly snack = inject(MatSnackBar);
  private readonly recruiterGroupService = inject(SecurityRecruiterGroupService);
  private readonly userService = inject(SecurityUserService);

  readonly isEdit = this.data.groupId != null;
  readonly title = this.isEdit ? RG_DIALOG_EDIT_TITLE : RG_DIALOG_NEW_TITLE;
  readonly labels = {
    cancel: RG_DIALOG_CANCEL,
    save: RG_DIALOG_SAVE,
    saving: RG_DIALOG_SAVING,
    sectionGroup: RG_SECTION_GROUP,
    sectionPeople: RG_SECTION_PEOPLE,
    country: RG_FIELD_COUNTRY,
    allCountries: RG_FIELD_ALL_COUNTRIES,
    code: RG_FIELD_CODE,
    description: RG_FIELD_DESCRIPTION,
    mp: RG_FIELD_MP,
    coreAts: RG_FIELD_CORE_ATS,
    coreAppian: RG_FIELD_CORE_APPIAN,
    active: RG_FIELD_ACTIVE,
    manager: RG_FIELD_MANAGER,
    recruiters: RG_FIELD_RECRUITERS,
    scopeLabel: RG_SCOPE_LABEL,
    scopeTenant: RG_SCOPE_TENANT,
    scopeGlobal: RG_SCOPE_GLOBAL,
    managerPh: RG_MANAGER_SEARCH_PH,
    managerHint: RG_MANAGER_HINT,
    clearManager: RG_CLEAR_MANAGER,
    available: RG_AVAILABLE,
    selected: RG_SELECTED,
    availablePh: RG_AVAILABLE_SEARCH_PH,
    add: RG_ADD,
    remove: RG_REMOVE,
    addSelected: RG_ADD_SELECTED,
    removeSelected: RG_REMOVE_SELECTED,
    noAvailable: RG_NO_AVAILABLE,
    noSelected: RG_NO_SELECTED,
    loadingUsers: RG_LOADING_USERS,
  };

  saving = false;
  loadingDetail = false;
  searchingManager = false;
  searchingAvailable = false;

  managerOptions: RecruiterGroupUserOption[] = [];
  selectedManager: RecruiterGroupUserOption | null = null;

  availableUsers: RecruiterGroupUserOption[] = [];
  selectedRecruiters: RecruiterGroupUserOption[] = [];
  checkedAvailableIds = new Set<number>();
  checkedSelectedIds = new Set<number>();

  private readonly managerSearch$ = new Subject<string>();
  private readonly availableSearch$ = new Subject<string>();
  private readonly subs = new Subscription();

  readonly scopeForm = this.fb.nonNullable.group({
    scope: ['TENANT' as TenantDataScope],
  });

  readonly form = this.fb.nonNullable.group({
    countryId: [null as number | null],
    code: ['', Validators.required],
    description: ['', Validators.required],
    legacyManpowerId: [null as number | null, Validators.required],
    coreAts: [''],
    coreAppian: ['', Validators.required],
    isActive: [true],
    managerSearch: [''],
    availableSearch: [''],
  });

  ngOnInit(): void {
    this.form.patchValue({ countryId: this.data.selectedCountryId });
    this.wireManagerSearch();
    this.wireAvailableSearch();

    if (this.isEdit && this.data.groupId != null) {
      this.loadingDetail = true;
      this.recruiterGroupService.getById(this.data.groupId).subscribe({
        next: (detail) => {
          this.patchFromDetail(detail);
          this.loadingDetail = false;
          this.refreshAvailable('');
        },
        error: () => {
          this.loadingDetail = false;
          this.snack.open(RG_ERR_SAVE, CATALOG_MSG_SNACK_CLOSE, { duration: 4000 });
          this.dialogRef.close(false);
        },
      });
    } else {
      this.refreshAvailable('');
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onManagerInput(value: string): void {
    this.managerSearch$.next(value ?? '');
  }

  onAvailableInput(value: string): void {
    this.availableSearch$.next(value ?? '');
  }

  onManagerSelected(event: MatAutocompleteSelectedEvent): void {
    const option = event.option.value as RecruiterGroupUserOption;
    this.selectedManager = option;
    this.form.patchValue({ managerSearch: option.label }, { emitEvent: false });
    this.selectedRecruiters = this.selectedRecruiters.filter((u) => u.id !== option.id);
    this.checkedSelectedIds.delete(option.id);
    this.refreshAvailable(this.form.controls.availableSearch.value ?? '');
  }

  clearManager(): void {
    this.selectedManager = null;
    this.form.patchValue({ managerSearch: '' }, { emitEvent: false });
    this.managerOptions = [];
    this.refreshAvailable(this.form.controls.availableSearch.value ?? '');
  }

  toggleAvailable(id: number, checked: boolean): void {
    if (checked) {
      this.checkedAvailableIds.add(id);
    } else {
      this.checkedAvailableIds.delete(id);
    }
  }

  toggleSelected(id: number, checked: boolean): void {
    if (checked) {
      this.checkedSelectedIds.add(id);
    } else {
      this.checkedSelectedIds.delete(id);
    }
  }

  isAvailableChecked(id: number): boolean {
    return this.checkedAvailableIds.has(id);
  }

  isSelectedChecked(id: number): boolean {
    return this.checkedSelectedIds.has(id);
  }

  addOne(user: RecruiterGroupUserOption): void {
    if (this.selectedManager?.id === user.id) {
      this.snack.open(RG_ERR_MANAGER_CONFLICT, CATALOG_MSG_SNACK_CLOSE, { duration: 3500 });
      return;
    }
    if (this.selectedRecruiters.some((u) => u.id === user.id)) {
      return;
    }
    this.selectedRecruiters = [...this.selectedRecruiters, user];
    this.checkedAvailableIds.delete(user.id);
    this.refreshAvailable(this.form.controls.availableSearch.value ?? '');
  }

  removeOne(user: RecruiterGroupUserOption): void {
    this.selectedRecruiters = this.selectedRecruiters.filter((u) => u.id !== user.id);
    this.checkedSelectedIds.delete(user.id);
    this.refreshAvailable(this.form.controls.availableSearch.value ?? '');
  }

  addChecked(): void {
    const toAdd = this.availableUsers.filter((u) => this.checkedAvailableIds.has(u.id));
    for (const user of toAdd) {
      this.addOne(user);
    }
    this.checkedAvailableIds.clear();
  }

  removeChecked(): void {
    const removeIds = new Set(this.checkedSelectedIds);
    this.selectedRecruiters = this.selectedRecruiters.filter((u) => !removeIds.has(u.id));
    this.checkedSelectedIds.clear();
    this.refreshAvailable(this.form.controls.availableSearch.value ?? '');
  }

  displayManagerFn = (value: RecruiterGroupUserOption | string | null): string => {
    if (value == null) {
      return '';
    }
    if (typeof value === 'string') {
      return value;
    }
    return value.label;
  };

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.selectedManager == null) {
      this.snack.open(RG_ERR_MANAGER_REQUIRED, CATALOG_MSG_SNACK_CLOSE, { duration: 4000 });
      return;
    }
    const recruiterUserIds = this.selectedRecruiters.map((u) => u.id);
    if (recruiterUserIds.includes(this.selectedManager.id)) {
      this.snack.open(RG_ERR_MANAGER_CONFLICT, CATALOG_MSG_SNACK_CLOSE, { duration: 4000 });
      return;
    }

    const value = this.form.getRawValue();
    const payload = {
      countryId: value.countryId ?? null,
      code: value.code.trim(),
      description: value.description.trim(),
      legacyManpowerId: value.legacyManpowerId!,
      coreAts: value.coreAts?.trim() || undefined,
      coreAppian: value.coreAppian.trim(),
      isActive: value.isActive,
      responsibleManagerUserId: this.selectedManager.id,
      recruiterUserIds,
    };

    this.saving = true;
    const request$ =
      this.isEdit && this.data.groupId != null
        ? this.recruiterGroupService.update(this.data.groupId, payload)
        : this.recruiterGroupService.create({
            ...payload,
            scope: this.data.isGlobalAdmin ? this.scopeForm.controls.scope.value : 'TENANT',
          });

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.dialogRef.close(true);
      },
      error: () => {
        this.saving = false;
        this.snack.open(RG_ERR_SAVE, CATALOG_MSG_SNACK_CLOSE, { duration: 4000 });
      },
    });
  }

  private patchFromDetail(detail: SecurityRecruiterGroup): void {
    this.form.patchValue({
      countryId: detail.countryId ?? this.data.selectedCountryId,
      code: detail.code,
      description: detail.description,
      legacyManpowerId: detail.legacyManpowerId,
      coreAts: detail.coreAts ?? '',
      coreAppian: detail.coreAppian,
      isActive: detail.isActive,
    });
    if (detail.responsibleManager) {
      this.selectedManager = this.toOptionFromSummary(detail.responsibleManager);
      this.form.patchValue({ managerSearch: this.selectedManager.label }, { emitEvent: false });
    }
    this.selectedRecruiters = (detail.recruiters ?? []).map((r) => this.toOptionFromSummary(r));
  }

  private wireManagerSearch(): void {
    this.subs.add(
      this.managerSearch$
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap((term) => {
            const trimmed = term.trim();
            if (this.selectedManager && this.selectedManager.label === trimmed) {
              return of(this.managerOptions);
            }
            if (trimmed.length > 0 && trimmed.length < 2) {
              this.managerOptions = [];
              return of([] as RecruiterGroupUserOption[]);
            }
            this.searchingManager = true;
            return this.searchUsers(trimmed).pipe(
              catchError(() => of([] as RecruiterGroupUserOption[])),
            );
          }),
        )
        .subscribe((options) => {
          const selectedIds = new Set(this.selectedRecruiters.map((u) => u.id));
          this.managerOptions = options.filter((u) => !selectedIds.has(u.id));
          this.searchingManager = false;
        }),
    );
  }

  private wireAvailableSearch(): void {
    this.subs.add(
      this.availableSearch$
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe((term) => this.refreshAvailable(term)),
    );
  }

  private refreshAvailable(term: string): void {
    const trimmed = (term ?? '').trim();
    this.searchingAvailable = true;
    this.searchUsers(trimmed.length >= 2 || trimmed.length === 0 ? trimmed : '').subscribe({
      next: (options) => {
        const exclude = new Set<number>([
          ...this.selectedRecruiters.map((u) => u.id),
          ...(this.selectedManager ? [this.selectedManager.id] : []),
        ]);
        this.availableUsers = options.filter((u) => !exclude.has(u.id));
        this.searchingAvailable = false;
      },
      error: () => {
        this.availableUsers = [];
        this.searchingAvailable = false;
      },
    });
  }

  private searchUsers(term: string) {
    return this.userService.list(0, 40, term || undefined).pipe(
      map((res) =>
        (res.items ?? [])
          .filter((u) => u.isActive)
          .map((u) => this.toOptionFromSecurity(u)),
      ),
    );
  }

  private toOptionFromSecurity(user: SecurityUser): RecruiterGroupUserOption {
    return {
      id: user.id,
      label: this.buildLabel(user.name, user.lastName, user.email, user.username),
      name: user.name,
      lastName: user.lastName,
      email: user.email,
    };
  }

  private toOptionFromSummary(user: RecruiterGroupUserSummary): RecruiterGroupUserOption {
    return {
      id: user.id,
      label: this.buildLabel(user.name, user.lastName, user.email, null),
      name: user.name,
      lastName: user.lastName,
      email: user.email,
    };
  }

  private buildLabel(
    name?: string | null,
    lastName?: string | null,
    email?: string | null,
    username?: string | null,
  ): string {
    const fullName = [name, lastName].filter(Boolean).join(' ').trim();
    if (fullName && email) {
      return `${fullName} (${email})`;
    }
    return email ?? fullName ?? username ?? String(name ?? '');
  }
}
