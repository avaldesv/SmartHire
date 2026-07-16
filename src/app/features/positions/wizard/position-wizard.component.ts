import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepper, MatStepperModule, StepperSelectionEvent } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  forkJoin,
  map,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { CatalogGeographyService } from '../../../core/services/catalog-geography.service';
import { CatalogPositionService } from '../../../core/services/catalog-position.service';
import { DynamicRequisitionWizardService } from '../../../core/services/dynamic-requisition-wizard.service';
import { PositionService } from '../../../core/services/position.service';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { CreatePositionRequest, PositionDetail } from '../../../shared/models/position.model';
import { ResolvedRequisitionFormConfig } from '../../../shared/models/requisition-wizard.model';
import {
  buildDynamicCreatePayload,
  flattenDynamicFormValues,
  hydrateDynamicFormValues,
  patchDynamicForm,
} from './dynamic-wizard-payload.util';
import { resolveWizardStepLabel } from './requisition-wizard-labels';
import { DynamicWizardStepComponent } from './dynamic-wizard-step/dynamic-wizard-step.component';
import {
  RequisitionScopeDialogComponent,
  RequisitionScopeDialogResult,
} from './requisition-scope-dialog/requisition-scope-dialog.component';
import {
  CatalogCountry,
  CatalogMunicipality,
  CatalogNeighborhood,
  CatalogState,
} from '../../../shared/models/catalog-geography.model';
import {
  CatalogBenefit,
  CatalogBrand,
  CatalogContractType,
  CatalogCoverageType,
  CatalogDocumentType,
  CatalogEducationLevel,
  CatalogLanguage,
  CatalogLanguageLevel,
  CatalogRequisitionType,
  CatalogShift,
} from '../../../shared/models/catalog-position.model';

@Component({
  selector: 'sh-position-wizard',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    PageHeaderComponent,
    DynamicWizardStepComponent,
  ],
  templateUrl: './position-wizard.component.html',
  styleUrl: './position-wizard.component.scss',
})
export class PositionWizardComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly snack = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly geographyService = inject(CatalogGeographyService);
  private readonly catalogService = inject(CatalogPositionService);
  private readonly positionService = inject(PositionService);
  private readonly tenantContext = inject(TenantContextService);
  private readonly dynamicWizardService = inject(DynamicRequisitionWizardService);
  private readonly destroyRef = inject(DestroyRef);

  useDynamicWizard = false;
  resolvingConfig = false;
  resolvedConfig: ResolvedRequisitionFormConfig | null = null;
  dynamicForm: FormGroup | null = null;

  @ViewChild('dynamicStepper') dynamicStepper?: MatStepper;
  creating = false;
  tenantBrandId: number | null = null;
  tenantBrandName: string | null = null;
  loadingPosition = false;
  editPositionId: number | null = null;
  requisitionNo: string | null = null;
  dynamicSelectedIndex = 0;
  private suppressCountryCascade = false;
  private suppressScopeResolve = false;
  private activeScopeKey: string | null = null;
  private readonly scopeResolve$ = new Subject<{
    countryId: number;
    coverageTypeId: number;
    preserveValues: boolean;
  }>();
  private readonly dynamicUiStop$ = new Subject<void>();

  get isEditMode(): boolean {
    return this.editPositionId != null;
  }

  countries: CatalogCountry[] = [];
  states: CatalogState[] = [];
  municipalities: CatalogMunicipality[] = [];
  neighborhoods: CatalogNeighborhood[] = [];
  brands: CatalogBrand[] = [];
  coverageTypes: CatalogCoverageType[] = [];
  shifts: CatalogShift[] = [];
  benefits: CatalogBenefit[] = [];
  languages: CatalogLanguage[] = [];
  languageLevels: CatalogLanguageLevel[] = [];
  documentTypes: CatalogDocumentType[] = [];
  educationLevels: CatalogEducationLevel[] = [];
  contractTypes: CatalogContractType[] = [];
  requisitionTypes: CatalogRequisitionType[] = [];

  loadingCatalog = {
    countries: false,
    brands: false,
    requisitionTypes: false,
    coverageTypes: false,
    shifts: false,
    benefits: false,
    languages: false,
    languageLevels: false,
    documentTypes: false,
    educationLevels: false,
    contractTypes: false,
  };

  loadingGeo = {
    states: false,
    municipalities: false,
    neighborhoods: false,
  };

  readonly clientForm = this.fb.nonNullable.group({
    countryId: [null as number | null, Validators.required],
    requisitionTypeId: [null as number | null, Validators.required],
    coverageTypeId: [null as number | null, Validators.required],
    ot: ['', Validators.required],
    clientKey: ['', Validators.required],
    legalName: ['', Validators.required],
    contactName: ['', Validators.required],
    clientPosition: ['', Validators.required],
  });

  readonly generalForm = this.fb.nonNullable.group({
    generalNotes: [''],
    contractTypeId: [null as number | null, Validators.required],
    shiftId: [null as number | null, Validators.required],
    salary: [0, [Validators.required, Validators.min(1)]],
    workDays: ['L-V', Validators.required],
  });

  readonly manpowerForm = this.fb.nonNullable.group({
    positionsCount: [1, [Validators.required, Validators.min(1)]],
    headcount: [1, Validators.required],
    startDate: ['', Validators.required],
  });

  readonly hiringForm = this.fb.nonNullable.group({
    hiringContractTypeId: [null as number | null, Validators.required],
    benefitId: [null as number | null, Validators.required],
    probationDays: [30, Validators.required],
  });

  readonly languagesForm = this.fb.nonNullable.group({
    primaryLanguageId: [null as number | null, Validators.required],
    secondaryLanguageId: [null as number | null],
    languageLevelId: [null as number | null, Validators.required],
  });

  readonly addressForm = this.fb.nonNullable.group({
    address: ['', Validators.required],
    stateId: [{ value: null as number | null, disabled: true }, Validators.required],
    municipalityId: [{ value: null as number | null, disabled: true }, Validators.required],
    postalCode: ['', [Validators.required, Validators.pattern(/^\d{4,5}$/)]],
    neighborhoodId: [{ value: null as number | null, disabled: true }, Validators.required],
    city: ['', Validators.required],
  });

  readonly requirementsForm = this.fb.nonNullable.group({
    requirements: ['', Validators.required],
    educationLevelId: [null as number | null, Validators.required],
    experienceYears: [2, Validators.required],
  });

  readonly selectedDocumentTypeIds = this.fb.nonNullable.control<number[]>([]);

  get wizardSubtitle(): string {
    const steps = this.useDynamicWizard
      ? (this.resolvedConfig?.steps.length ?? 0)
      : 8;
    const suffix = `Asistente en ${steps} pasos`;
    return this.isEditMode && this.requisitionNo ? `${this.requisitionNo} — ${suffix}` : `Asistente de creación en ${steps} pasos`;
  }

  get dynamicCountryId(): number | null {
    if (!this.dynamicForm) {
      return null;
    }
    const clientStep = this.dynamicForm.get('client') as FormGroup | null;
    return (clientStep?.get('countryId')?.value as number | null) ?? this.getDynamicScalarValue('countryId');
  }

  ngOnInit(): void {
    this.setupScopeResolvePipeline();
    this.setupCountryCascade();
    this.setupResolveWatch();
    this.setupAddressCascade();
    this.loadCountries();
    this.loadLanguages();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.loadPositionForEdit(Number(idParam));
      return;
    }
    this.beginCreateFlow();
  }

  private beginCreateFlow(): void {
    const countryId = Number(this.route.snapshot.queryParamMap.get('countryId'));
    const coverageTypeId = Number(this.route.snapshot.queryParamMap.get('coverageTypeId'));
    if (Number.isFinite(countryId) && countryId > 0 && Number.isFinite(coverageTypeId) && coverageTypeId > 0) {
      this.applyInitialScope(countryId, coverageTypeId);
      return;
    }
    this.openScopeDialogForCreate();
  }

  private openScopeDialogForCreate(): void {
    this.dialog
      .open(RequisitionScopeDialogComponent, {
        width: '480px',
        disableClose: true,
        data: {},
      })
      .afterClosed()
      .subscribe((result: RequisitionScopeDialogResult | null | undefined) => {
        if (!result) {
          void this.router.navigate(['/positions']);
          return;
        }
        void this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {
            countryId: result.countryId,
            coverageTypeId: result.coverageTypeId,
          },
          replaceUrl: true,
        });
        this.applyInitialScope(result.countryId, result.coverageTypeId);
      });
  }

  private applyInitialScope(countryId: number, coverageTypeId: number): void {
    this.suppressCountryCascade = true;
    this.clientForm.patchValue({ countryId, coverageTypeId }, { emitEvent: false });
    this.loadCountryCatalogs(countryId);
    this.loadAddressStates(countryId);
    this.suppressCountryCascade = false;
    this.requestScopeResolve(countryId, coverageTypeId, false);
  }

  private setupScopeResolvePipeline(): void {
    this.scopeResolve$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(
          (a, b) =>
            a.countryId === b.countryId &&
            a.coverageTypeId === b.coverageTypeId &&
            a.preserveValues === b.preserveValues,
        ),
        tap(() => {
          this.resolvingConfig = true;
        }),
        switchMap(({ countryId, coverageTypeId, preserveValues }) => {
          const preserved = preserveValues ? this.collectPreservedValues() : {};
          preserved['countryId'] = countryId;
          preserved['coverageTypeId'] = coverageTypeId;
          const scopeKey = `${countryId}:${coverageTypeId}`;
          if (scopeKey === this.activeScopeKey && this.useDynamicWizard && this.dynamicForm) {
            this.resolvingConfig = false;
            return of(null);
          }
          return this.dynamicWizardService.resolve(countryId, coverageTypeId).pipe(
            map((config) => ({ config, countryId, coverageTypeId, preserved, scopeKey })),
            catchError(() => of({ config: null, countryId, coverageTypeId, preserved, scopeKey })),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        if (!result) {
          return;
        }
        this.resolvingConfig = false;
        this.activeScopeKey = result.scopeKey;
        if (!this.isEditMode) {
          void this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
              countryId: result.countryId,
              coverageTypeId: result.coverageTypeId,
            },
            replaceUrl: true,
          });
        }
        if (result.config) {
          this.activateDynamicWizard(result.config, result.preserved);
        } else {
          this.deactivateDynamicWizard(result.preserved);
        }
      });
  }

  private requestScopeResolve(countryId: number, coverageTypeId: number, preserveValues: boolean): void {
    this.scopeResolve$.next({ countryId, coverageTypeId, preserveValues });
  }

  private collectPreservedValues(): Record<string, unknown> {
    if (this.useDynamicWizard && this.dynamicForm) {
      return flattenDynamicFormValues(this.dynamicForm);
    }
    const client = this.clientForm.getRawValue();
    const general = this.generalForm.getRawValue();
    const manpower = this.manpowerForm.getRawValue();
    const hiring = this.hiringForm.getRawValue();
    const languages = this.languagesForm.getRawValue();
    const address = this.addressForm.getRawValue();
    const requirements = this.requirementsForm.getRawValue();
    return {
      ...client,
      ...general,
      ...manpower,
      ...hiring,
      ...languages,
      ...address,
      ...requirements,
      documentTypeIds: this.selectedDocumentTypeIds.value,
    };
  }

  private loadCountries(): void {
    this.loadingCatalog.countries = true;
    this.geographyService.listCountries().subscribe({
      next: (items) => {
        this.countries = items;
        this.loadingCatalog.countries = false;
      },
      error: () => {
        this.loadingCatalog.countries = false;
        this.snack.open('No se pudieron cargar los países', 'Cerrar', { duration: 4000 });
      },
    });
  }

  private loadLanguages(): void {
    this.loadingCatalog.languages = true;
    this.catalogService.listLanguages().subscribe({
      next: (items) => {
        this.languages = items;
        this.loadingCatalog.languages = false;
        if (!this.isEditMode) {
          const spanish = items.find((l) => l.code === 'ES' || l.name.toLowerCase().includes('espa'));
          if (spanish) {
            this.languagesForm.patchValue({ primaryLanguageId: spanish.id });
          }
        }
      },
      error: () => {
        this.loadingCatalog.languages = false;
        this.snack.open('No se pudieron cargar los idiomas', 'Cerrar', { duration: 4000 });
      },
    });
  }

  stepLabel(_stepKey: string, _labelI18nKey: string): string {
    return '';
  }

  stepTitle(stepKey: string, labelI18nKey: string): string {
    return resolveWizardStepLabel(stepKey, labelI18nKey);
  }

  get currentDynamicStepTitle(): string {
    const steps = this.resolvedConfig?.steps;
    if (!steps?.length) {
      return '';
    }
    const step = steps[this.dynamicSelectedIndex] ?? steps[0];
    return this.stepTitle(step.stepKey, step.labelI18nKey);
  }

  goToDynamicStep(index: number): void {
    if (!this.dynamicStepper || index < 0 || index >= this.dynamicStepper.steps.length) {
      return;
    }
    this.dynamicStepper.selectedIndex = index;
    this.dynamicSelectedIndex = index;
  }

  isDynamicStepActive(index: number): boolean {
    return this.dynamicSelectedIndex === index;
  }

  isDynamicStepCompleted(index: number): boolean {
    return index < this.dynamicSelectedIndex;
  }

  onDynamicStepSelectionChange(event: StepperSelectionEvent): void {
    this.dynamicSelectedIndex = event.selectedIndex;
  }

  stepProgressAriaLabel(index: number, stepKey: string, labelI18nKey: string): string {
    const title = this.stepTitle(stepKey, labelI18nKey);
    const total = this.resolvedConfig?.steps.length ?? 0;
    if (this.isDynamicStepCompleted(index)) {
      return `Paso ${index + 1} de ${total}: ${title} (completado)`;
    }
    if (this.isDynamicStepActive(index)) {
      return `Paso ${index + 1} de ${total}: ${title} (actual)`;
    }
    return `Paso ${index + 1} de ${total}: ${title}`;
  }

  dynamicStepForm(stepKey: string): FormGroup {
    return this.dynamicForm!.get(stepKey) as FormGroup;
  }

  private setupResolveWatch(): void {
    combineLatest([
      this.clientForm.controls.countryId.valueChanges,
      this.clientForm.controls.coverageTypeId.valueChanges,
    ])
      .pipe(
        debounceTime(200),
        distinctUntilChanged(([a, b], [c, d]) => a === c && b === d),
        filter(([countryId, coverageTypeId]) => countryId != null && coverageTypeId != null),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(([countryId, coverageTypeId]) => {
        if (this.suppressCountryCascade || this.suppressScopeResolve || this.useDynamicWizard) {
          return;
        }
        this.requestScopeResolve(countryId!, coverageTypeId!, true);
      });
  }

  private bindDynamicScopeWatch(): void {
    if (!this.dynamicForm || !this.resolvedConfig) {
      return;
    }
    const countryCtrl = this.findDynamicControl('countryId');
    const coverageCtrl = this.findDynamicControl('coverageTypeId');
    if (!countryCtrl || !coverageCtrl) {
      return;
    }
    combineLatest([countryCtrl.valueChanges, coverageCtrl.valueChanges])
      .pipe(
        debounceTime(250),
        distinctUntilChanged(([a, b], [c, d]) => a === c && b === d),
        filter(([countryId, coverageTypeId]) => countryId != null && coverageTypeId != null),
        takeUntil(this.dynamicUiStop$),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(([countryId, coverageTypeId]) => {
        if (this.suppressScopeResolve || this.suppressCountryCascade) {
          return;
        }
        const scopeKey = `${countryId}:${coverageTypeId}`;
        if (scopeKey === this.activeScopeKey) {
          return;
        }
        this.requestScopeResolve(countryId as number, coverageTypeId as number, true);
      });
  }

  private findDynamicControl(fieldKey: string) {
    if (!this.dynamicForm || !this.resolvedConfig) {
      return null;
    }
    for (const step of this.resolvedConfig.steps) {
      const stepGroup = this.dynamicForm.get(step.stepKey) as FormGroup | null;
      const control = stepGroup?.get(fieldKey);
      if (control) {
        return control;
      }
    }
    return null;
  }

  private activateDynamicWizard(
    config: ResolvedRequisitionFormConfig,
    preservedValues: Record<string, unknown> = {},
  ): void {
    this.suppressScopeResolve = true;
    this.dynamicUiStop$.next();
    this.useDynamicWizard = true;
    this.resolvedConfig = config;
    this.dynamicForm = this.dynamicWizardService.buildForm(config);
    this.dynamicSelectedIndex = 0;
    patchDynamicForm(this.dynamicForm, preservedValues, config);
    this.dynamicWizardService.refreshValidators(this.dynamicForm, config);
    this.bindDynamicScopeWatch();
    this.dynamicForm.valueChanges
      .pipe(takeUntil(this.dynamicUiStop$), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.dynamicForm && this.resolvedConfig) {
          this.dynamicWizardService.refreshValidators(this.dynamicForm, this.resolvedConfig);
          const countryId = this.dynamicCountryId;
          if (countryId != null) {
            this.loadBrands(countryId);
          }
        }
      });
    const countryId =
      (preservedValues['countryId'] as number | null | undefined) ?? this.dynamicCountryId;
    if (countryId != null) {
      this.loadBrands(countryId);
      this.loadCountryCatalogs(countryId);
    }
    this.suppressScopeResolve = false;
  }

  private deactivateDynamicWizard(preservedValues: Record<string, unknown> = {}): void {
    this.suppressScopeResolve = true;
    this.dynamicUiStop$.next();
    this.useDynamicWizard = false;
    this.resolvedConfig = null;
    this.dynamicForm = null;
    this.applyPreservedValuesToLegacy(preservedValues);
    this.suppressScopeResolve = false;
  }

  private applyPreservedValuesToLegacy(values: Record<string, unknown>): void {
    const asNumber = (key: string): number | null => {
      const raw = values[key];
      return typeof raw === 'number' ? raw : null;
    };
    const asString = (key: string, fallback = ''): string => {
      const raw = values[key];
      return typeof raw === 'string' ? raw : fallback;
    };
    const countryId = asNumber('countryId');
    const coverageTypeId = asNumber('coverageTypeId');
    this.clientForm.patchValue(
      {
        countryId,
        coverageTypeId,
        requisitionTypeId: asNumber('requisitionTypeId'),
        ot: asString('ot'),
        clientKey: asString('clientKey'),
        legalName: asString('legalName'),
        contactName: asString('contactName'),
        clientPosition: asString('clientPosition') || asString('clientContactPosition'),
      },
      { emitEvent: false },
    );
    this.generalForm.patchValue(
      {
        generalNotes: asString('generalNotes'),
        contractTypeId: asNumber('contractTypeId'),
        shiftId: asNumber('shiftId'),
        salary: typeof values['salary'] === 'number' ? (values['salary'] as number) : 0,
        workDays: asString('workDays', 'L-V'),
      },
      { emitEvent: false },
    );
    this.manpowerForm.patchValue(
      {
        positionsCount:
          typeof values['positionsCount'] === 'number' ? (values['positionsCount'] as number) : 1,
        headcount: typeof values['headcount'] === 'number' ? (values['headcount'] as number) : 1,
        startDate: asString('startDate'),
      },
      { emitEvent: false },
    );
    this.hiringForm.patchValue(
      {
        hiringContractTypeId: asNumber('hiringContractTypeId'),
        benefitId: asNumber('benefitId'),
        probationDays:
          typeof values['probationDays'] === 'number' ? (values['probationDays'] as number) : 30,
      },
      { emitEvent: false },
    );
    this.languagesForm.patchValue(
      {
        primaryLanguageId: asNumber('primaryLanguageId'),
        secondaryLanguageId: asNumber('secondaryLanguageId'),
        languageLevelId: asNumber('languageLevelId'),
      },
      { emitEvent: false },
    );
    this.addressForm.patchValue(
      {
        address: asString('address') || asString('addressLine'),
        stateId: asNumber('stateId'),
        municipalityId: asNumber('municipalityId'),
        postalCode: asString('postalCode'),
        neighborhoodId: asNumber('neighborhoodId'),
        city: asString('city'),
      },
      { emitEvent: false },
    );
    this.requirementsForm.patchValue(
      {
        requirements: asString('requirements'),
        educationLevelId: asNumber('educationLevelId'),
        experienceYears:
          typeof values['experienceYears'] === 'number' ? (values['experienceYears'] as number) : 2,
      },
      { emitEvent: false },
    );
    if (Array.isArray(values['documentTypeIds'])) {
      this.selectedDocumentTypeIds.setValue(values['documentTypeIds'] as number[]);
    }
    if (countryId != null) {
      this.loadCountryCatalogs(countryId);
      this.loadAddressStates(countryId);
    }
  }

  private getDynamicScalarValue(fieldKey: string): number | null {
    if (!this.dynamicForm || !this.resolvedConfig) {
      return null;
    }
    for (const step of this.resolvedConfig.steps) {
      const stepGroup = this.dynamicForm.get(step.stepKey) as FormGroup | null;
      const control = stepGroup?.get(fieldKey);
      if (control) {
        return control.value as number | null;
      }
    }
    return null;
  }

  private setupCountryCascade(): void {
    this.clientForm.controls.countryId.valueChanges
      .pipe(
        filter((id): id is number => id != null),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((countryId) => {
        if (this.suppressCountryCascade) {
          this.loadCountryCatalogs(countryId);
          this.loadAddressStates(countryId);
          return;
        }
        this.resetTenantBrand();
        this.clientForm.patchValue({ coverageTypeId: null, requisitionTypeId: null }, { emitEvent: false });
        this.generalForm.patchValue({ shiftId: null, contractTypeId: null }, { emitEvent: false });
        this.hiringForm.patchValue({ benefitId: null, hiringContractTypeId: null }, { emitEvent: false });
        this.requirementsForm.patchValue({ educationLevelId: null }, { emitEvent: false });
        this.languagesForm.patchValue({ languageLevelId: null }, { emitEvent: false });
        this.selectedDocumentTypeIds.setValue([]);
        this.resetAddressGeo();
        this.loadCountryCatalogs(countryId);
        this.loadAddressStates(countryId);
      });
  }

  private setupAddressCascade(): void {
    this.addressForm.controls.stateId.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((stateId) => {
      this.resetAddressMunicipalities();
      this.resetAddressNeighborhoods();
      if (stateId == null) {
        this.addressForm.controls.municipalityId.disable();
        return;
      }
      this.addressForm.controls.municipalityId.enable();
      this.loadAddressMunicipalities(stateId);
    });

    this.addressForm.controls.municipalityId.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((municipalityId) => {
      this.resetAddressNeighborhoods();
      if (municipalityId == null) {
        return;
      }
      const municipality = this.municipalities.find((m) => m.id === municipalityId);
      this.addressForm.patchValue({ city: municipality?.name ?? '' }, { emitEvent: false });
      const postalCode = this.addressForm.controls.postalCode.value;
      if (postalCode.length >= 4) {
        this.loadAddressNeighborhoods(postalCode);
      }
    });

    this.addressForm.controls.postalCode.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        filter((cp) => !!cp && cp.length >= 4),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((postalCode) => {
        this.resetAddressNeighborhoods();
        this.loadAddressNeighborhoods(postalCode);
      });
  }

  private loadAddressStates(countryId: number): void {
    this.loadingGeo.states = true;
    this.addressForm.controls.stateId.enable();
    this.geographyService.listStates(countryId).subscribe({
      next: (items) => {
        this.states = items;
        this.loadingGeo.states = false;
      },
      error: () => {
        this.states = [];
        this.loadingGeo.states = false;
        this.snack.open('No se pudieron cargar los estados', 'Cerrar', { duration: 4000 });
      },
    });
  }

  private loadAddressMunicipalities(stateId: number): void {
    this.loadingGeo.municipalities = true;
    this.geographyService.listMunicipalities(stateId).subscribe({
      next: (items) => {
        this.municipalities = items;
        this.loadingGeo.municipalities = false;
      },
      error: () => {
        this.municipalities = [];
        this.loadingGeo.municipalities = false;
        this.snack.open('No se pudieron cargar los municipios', 'Cerrar', { duration: 4000 });
      },
    });
  }

  private loadAddressNeighborhoods(postalCode: string): void {
    this.loadingGeo.neighborhoods = true;
    this.addressForm.controls.neighborhoodId.disable();
    this.geographyService.listNeighborhoodsByPostalCode(postalCode).subscribe({
      next: (items) => {
        this.neighborhoods = items;
        this.loadingGeo.neighborhoods = false;
        if (items.length) {
          this.addressForm.controls.neighborhoodId.enable();
        } else {
          this.snack.open('Sin colonias para ese código postal', 'Cerrar', { duration: 3000 });
        }
      },
      error: () => {
        this.loadingGeo.neighborhoods = false;
        this.snack.open('No se pudieron cargar las colonias', 'Cerrar', { duration: 4000 });
      },
    });
  }

  private resetAddressGeo(): void {
    this.states = [];
    this.municipalities = [];
    this.neighborhoods = [];
    this.addressForm.patchValue(
      { stateId: null, municipalityId: null, neighborhoodId: null, city: '', postalCode: '' },
      { emitEvent: false },
    );
    this.addressForm.controls.stateId.disable();
    this.addressForm.controls.municipalityId.disable();
    this.addressForm.controls.neighborhoodId.disable();
  }

  private resetAddressMunicipalities(): void {
    this.municipalities = [];
    this.addressForm.controls.municipalityId.disable();
    this.addressForm.patchValue({ municipalityId: null, city: '' }, { emitEvent: false });
  }

  private resetAddressNeighborhoods(): void {
    this.neighborhoods = [];
    this.addressForm.controls.neighborhoodId.disable();
    this.addressForm.patchValue({ neighborhoodId: null }, { emitEvent: false });
  }

  private loadCountryCatalogs(countryId: number): void {
    this.loadBrands(countryId);
    this.loadCoverageTypes(countryId);
    this.loadShifts(countryId);
    this.loadBenefits(countryId);
    this.loadDocumentTypes(countryId);
    this.loadEducationLevels(countryId);
    this.loadContractTypes(countryId);
    this.loadLanguageLevels(countryId);
    this.loadRequisitionTypes(countryId);
  }

  private loadBrands(countryId: number): void {
    this.loadingCatalog.brands = true;
    this.catalogService.listBrands(countryId).subscribe({
      next: (items) => {
        this.brands = items;
        this.applyTenantBrand(items);
        this.loadingCatalog.brands = false;
      },
      error: () => {
        this.brands = [];
        this.resetTenantBrand();
        this.loadingCatalog.brands = false;
      },
    });
  }

  private resetTenantBrand(): void {
    this.tenantBrandId = null;
    this.tenantBrandName = null;
  }

  private applyTenantBrand(brands: CatalogBrand[], fallbackBrandId?: number | null): void {
    const tenantId = this.tenantContext.getCompanyId();
    const tenantBrand = brands.find((brand) => brand.companyId === tenantId);
    if (tenantBrand) {
      this.tenantBrandId = tenantBrand.id;
      this.tenantBrandName = tenantBrand.name;
      return;
    }
    if (fallbackBrandId != null) {
      const fallbackBrand = brands.find((brand) => brand.id === fallbackBrandId);
      this.tenantBrandId = fallbackBrandId;
      this.tenantBrandName = fallbackBrand?.name ?? null;
      return;
    }
    this.resetTenantBrand();
    if (!this.isEditMode) {
      this.snack.open('No hay marca configurada para este tenant en el país seleccionado', 'Cerrar', {
        duration: 4000,
      });
    }
  }

  private loadCoverageTypes(countryId: number): void {
    this.loadingCatalog.coverageTypes = true;
    this.catalogService.listCoverageTypes(countryId).subscribe({
      next: (items) => {
        this.coverageTypes = items;
        this.loadingCatalog.coverageTypes = false;
      },
      error: () => {
        this.coverageTypes = [];
        this.loadingCatalog.coverageTypes = false;
      },
    });
  }

  private loadShifts(countryId: number): void {
    this.loadingCatalog.shifts = true;
    this.catalogService.listShifts(countryId).subscribe({
      next: (items) => {
        this.shifts = items;
        this.loadingCatalog.shifts = false;
      },
      error: () => {
        this.shifts = [];
        this.loadingCatalog.shifts = false;
      },
    });
  }

  private loadBenefits(countryId: number): void {
    this.loadingCatalog.benefits = true;
    this.catalogService.listBenefits(countryId).subscribe({
      next: (items) => {
        this.benefits = items;
        this.loadingCatalog.benefits = false;
      },
      error: () => {
        this.benefits = [];
        this.loadingCatalog.benefits = false;
      },
    });
  }

  private loadDocumentTypes(countryId: number): void {
    this.loadingCatalog.documentTypes = true;
    this.catalogService.listDocumentTypes(countryId).subscribe({
      next: (items) => {
        this.documentTypes = items;
        this.loadingCatalog.documentTypes = false;
      },
      error: () => {
        this.documentTypes = [];
        this.loadingCatalog.documentTypes = false;
      },
    });
  }

  private loadEducationLevels(countryId: number): void {
    this.loadingCatalog.educationLevels = true;
    this.catalogService.listEducationLevels(countryId).subscribe({
      next: (items) => {
        this.educationLevels = items;
        this.loadingCatalog.educationLevels = false;
      },
      error: () => {
        this.educationLevels = [];
        this.loadingCatalog.educationLevels = false;
      },
    });
  }

  private loadContractTypes(countryId: number): void {
    this.loadingCatalog.contractTypes = true;
    this.catalogService.listContractTypes(countryId).subscribe({
      next: (items) => {
        this.contractTypes = items;
        this.loadingCatalog.contractTypes = false;
      },
      error: () => {
        this.contractTypes = [];
        this.loadingCatalog.contractTypes = false;
      },
    });
  }

  private loadRequisitionTypes(countryId: number): void {
    this.loadingCatalog.requisitionTypes = true;
    this.catalogService.listRequisitionTypes(countryId).subscribe({
      next: (items) => {
        this.requisitionTypes = items;
        this.loadingCatalog.requisitionTypes = false;
      },
      error: () => {
        this.requisitionTypes = [];
        this.loadingCatalog.requisitionTypes = false;
      },
    });
  }

  private loadLanguageLevels(countryId: number): void {
    this.loadingCatalog.languageLevels = true;
    this.catalogService.listLanguageLevels(countryId).subscribe({
      next: (items) => {
        this.languageLevels = items;
        this.loadingCatalog.languageLevels = false;
      },
      error: () => {
        this.languageLevels = [];
        this.loadingCatalog.languageLevels = false;
      },
    });
  }

  private loadPositionForEdit(id: number): void {
    this.loadingPosition = true;
    this.positionService.getById(id).subscribe({
      next: (position) => {
        this.editPositionId = id;
        this.requisitionNo = position.requisitionNo;
        this.dynamicWizardService.resolve(position.countryId, position.coverageTypeId).subscribe({
          next: (config) => {
            this.activeScopeKey = `${position.countryId}:${position.coverageTypeId}`;
            if (config) {
              this.activateDynamicWizard(config);
              this.hydrateDynamicForms(position, config);
            } else {
              this.deactivateDynamicWizard();
              this.hydrateForms(position);
            }
          },
          error: () => {
            this.activeScopeKey = `${position.countryId}:${position.coverageTypeId}`;
            this.deactivateDynamicWizard();
            this.hydrateForms(position);
          },
        });
      },
      error: () => {
        this.loadingPosition = false;
        this.snack.open('No se pudo cargar la requisición', 'Cerrar', { duration: 4000 });
        this.router.navigate(['/positions']);
      },
    });
  }

  private hydrateDynamicForms(position: PositionDetail, config: ResolvedRequisitionFormConfig): void {
    this.suppressCountryCascade = true;
    if (!this.dynamicForm) {
      this.dynamicForm = this.dynamicWizardService.buildForm(config);
    }
    const values = hydrateDynamicFormValues(position, config);
    patchDynamicForm(this.dynamicForm, values, config);
    this.catalogService.listBrands(position.countryId).subscribe({
      next: (brands) => {
        this.brands = brands;
        this.applyTenantBrand(brands, position.brandId);
        this.suppressCountryCascade = false;
        this.loadingPosition = false;
      },
      error: () => {
        this.suppressCountryCascade = false;
        this.loadingPosition = false;
        this.snack.open('Error al cargar catálogos de la requisición', 'Cerrar', { duration: 4000 });
      },
    });
  }

  private hydrateForms(position: PositionDetail): void {
    this.suppressCountryCascade = true;
    forkJoin({
      brands: this.catalogService.listBrands(position.countryId),
      coverageTypes: this.catalogService.listCoverageTypes(position.countryId),
      shifts: this.catalogService.listShifts(position.countryId),
      benefits: this.catalogService.listBenefits(position.countryId),
      documentTypes: this.catalogService.listDocumentTypes(position.countryId),
      educationLevels: this.catalogService.listEducationLevels(position.countryId),
      contractTypes: this.catalogService.listContractTypes(position.countryId),
      languageLevels: this.catalogService.listLanguageLevels(position.countryId),
      requisitionTypes: this.catalogService.listRequisitionTypes(position.countryId),
      states: this.geographyService.listStates(position.countryId),
    })
      .pipe(
        switchMap((catalogs) => {
          this.brands = catalogs.brands;
          this.coverageTypes = catalogs.coverageTypes;
          this.shifts = catalogs.shifts;
          this.benefits = catalogs.benefits;
          this.documentTypes = catalogs.documentTypes;
          this.educationLevels = catalogs.educationLevels;
          this.contractTypes = catalogs.contractTypes;
          this.languageLevels = catalogs.languageLevels;
          this.requisitionTypes = catalogs.requisitionTypes;
          this.states = catalogs.states;
          this.addressForm.controls.stateId.enable();
          return this.geographyService.listMunicipalities(position.stateId);
        }),
        switchMap((municipalities) => {
          this.municipalities = municipalities;
          this.addressForm.controls.municipalityId.enable();
          return this.geographyService.listNeighborhoodsByPostalCode(position.postalCode);
        }),
      )
      .subscribe({
        next: (neighborhoods) => {
          this.neighborhoods = neighborhoods;
          if (neighborhoods.length) {
            this.addressForm.controls.neighborhoodId.enable();
          }
          this.applyTenantBrand(this.brands, position.brandId);
          this.clientForm.patchValue({
            countryId: position.countryId,
            requisitionTypeId: position.requisitionTypeId,
            coverageTypeId: position.coverageTypeId,
            ot: position.ot,
            clientKey: position.clientKey,
            legalName: position.legalName,
            contactName: position.contactName,
            clientPosition: position.clientPosition,
          });
          this.generalForm.patchValue({
            generalNotes: position.generalNotes ?? '',
            contractTypeId: position.contractTypeId,
            shiftId: position.shiftId,
            salary: Number(position.salary),
            workDays: position.workDays,
          });
          this.manpowerForm.patchValue({
            positionsCount: position.positionsCount,
            headcount: position.headcount,
            startDate: position.startDate,
          });
          this.hiringForm.patchValue({
            hiringContractTypeId: position.hiringContractTypeId,
            benefitId: position.benefitId,
            probationDays: position.probationDays,
          });
          this.languagesForm.patchValue({
            primaryLanguageId: position.primaryLanguageId,
            secondaryLanguageId: position.secondaryLanguageId,
            languageLevelId: position.languageLevelId,
          });
          this.addressForm.patchValue(
            {
              address: position.address,
              stateId: position.stateId,
              municipalityId: position.municipalityId,
              postalCode: position.postalCode,
              neighborhoodId: position.neighborhoodId,
              city: position.city,
            },
            { emitEvent: false },
          );
          this.requirementsForm.patchValue({
            requirements: position.requirements,
            educationLevelId: position.educationLevelId,
            experienceYears: position.experienceYears,
          });
          this.selectedDocumentTypeIds.setValue(position.documentTypeIds ?? []);
          this.suppressCountryCascade = false;
          this.loadingPosition = false;
        },
        error: () => {
          this.suppressCountryCascade = false;
          this.loadingPosition = false;
          this.snack.open('Error al cargar catálogos de la requisición', 'Cerrar', { duration: 4000 });
        },
      });
  }

  isDocumentTypeSelected(id: number): boolean {
    return this.selectedDocumentTypeIds.value.includes(id);
  }

  toggleDocumentType(id: number, checked: boolean): void {
    const current = this.selectedDocumentTypeIds.value;
    this.selectedDocumentTypeIds.setValue(
      checked ? [...current, id] : current.filter((itemId) => itemId !== id),
    );
  }

  exportJson(): void {
    const payload = this.useDynamicWizard ? this.buildDynamicPayload() : this.buildCreatePayload();
    console.log('JSON export:', payload);
    this.snack.open('JSON exportado a consola', 'Cerrar', { duration: 3000 });
  }

  private buildDynamicPayload(): CreatePositionRequest {
    if (!this.dynamicForm || !this.resolvedConfig || this.tenantBrandId == null) {
      throw new Error('Dynamic wizard not ready');
    }
    return buildDynamicCreatePayload(
      this.dynamicWizardService.getFlatValues(this.dynamicForm),
      this.tenantBrandId,
      this.resolvedConfig,
    );
  }

  private buildCreatePayload(): CreatePositionRequest {
    const address = this.addressForm.getRawValue();
    const client = this.clientForm.getRawValue();
    const general = this.generalForm.getRawValue();
    const manpower = this.manpowerForm.getRawValue();
    const hiring = this.hiringForm.getRawValue();
    const languages = this.languagesForm.getRawValue();
    const requirements = this.requirementsForm.getRawValue();

    return {
      countryId: client.countryId!,
      brandId: this.tenantBrandId!,
      requisitionTypeId: client.requisitionTypeId!,
      coverageTypeId: client.coverageTypeId!,
      ot: client.ot,
      clientKey: client.clientKey,
      legalName: client.legalName,
      contactName: client.contactName,
      clientPosition: client.clientPosition,
      generalNotes: general.generalNotes,
      contractTypeId: general.contractTypeId!,
      shiftId: general.shiftId!,
      salary: general.salary,
      workDays: general.workDays,
      positionsCount: manpower.positionsCount,
      headcount: manpower.headcount,
      startDate: manpower.startDate,
      hiringContractTypeId: hiring.hiringContractTypeId!,
      benefitId: hiring.benefitId!,
      probationDays: hiring.probationDays,
      primaryLanguageId: languages.primaryLanguageId!,
      secondaryLanguageId: languages.secondaryLanguageId,
      languageLevelId: languages.languageLevelId!,
      address: address.address,
      stateId: address.stateId!,
      municipalityId: address.municipalityId!,
      postalCode: address.postalCode,
      neighborhoodId: address.neighborhoodId!,
      city: address.city,
      requirements: requirements.requirements,
      educationLevelId: requirements.educationLevelId!,
      experienceYears: requirements.experienceYears,
      documentTypeIds: this.selectedDocumentTypeIds.value,
    };
  }

  sendAts(): void {
    this.snack.open('Enviado a ATS (simulado)', 'Cerrar', { duration: 3000 });
  }

  save(): void {
    if (this.useDynamicWizard) {
      this.saveDynamic();
      return;
    }
    const forms = [
      this.clientForm,
      this.generalForm,
      this.manpowerForm,
      this.hiringForm,
      this.languagesForm,
      this.addressForm,
      this.requirementsForm,
    ];
    if (forms.some((f) => f.invalid)) {
      forms.forEach((f) => f.markAllAsTouched());
      this.snack.open('Complete los campos obligatorios', 'Cerrar', { duration: 3000 });
      return;
    }
    if (this.tenantBrandId == null) {
      this.snack.open('No hay marca configurada para este tenant en el país seleccionado', 'Cerrar', {
        duration: 4000,
      });
      return;
    }
    if (this.creating) {
      return;
    }
    this.creating = true;
    const payload = this.buildCreatePayload();
    const request$ =
      this.isEditMode && this.editPositionId != null
        ? this.positionService.update(this.editPositionId, payload)
        : this.positionService.create(payload);

    request$.subscribe({
      next: () => {
        this.creating = false;
        this.snack.open(
          this.isEditMode ? 'Requisición actualizada correctamente' : 'Requisición creada correctamente',
          'Cerrar',
          { duration: 3000 },
        );
        this.router.navigate(['/positions']);
      },
      error: () => {
        this.creating = false;
        this.snack.open(
          this.isEditMode ? 'No se pudo actualizar la requisición' : 'No se pudo crear la requisición',
          'Cerrar',
          { duration: 4000 },
        );
      },
    });
  }

  private saveDynamic(): void {
    if (!this.dynamicForm || !this.resolvedConfig) {
      return;
    }
    this.dynamicWizardService.refreshValidators(this.dynamicForm, this.resolvedConfig);
    if (this.dynamicForm.invalid) {
      this.dynamicForm.markAllAsTouched();
      this.snack.open('Complete los campos obligatorios', 'Cerrar', { duration: 3000 });
      return;
    }
    if (this.tenantBrandId == null) {
      this.snack.open('No hay marca configurada para este tenant en el país seleccionado', 'Cerrar', {
        duration: 4000,
      });
      return;
    }
    if (this.creating) {
      return;
    }
    this.creating = true;
    const payload = this.buildDynamicPayload();
    const request$ =
      this.isEditMode && this.editPositionId != null
        ? this.positionService.update(this.editPositionId, payload)
        : this.positionService.create(payload);

    request$.subscribe({
      next: () => {
        this.creating = false;
        this.snack.open(
          this.isEditMode ? 'Requisición actualizada correctamente' : 'Requisición creada correctamente',
          'Cerrar',
          { duration: 3000 },
        );
        this.router.navigate(['/positions']);
      },
      error: () => {
        this.creating = false;
        this.snack.open(
          this.isEditMode ? 'No se pudo actualizar la requisición' : 'No se pudo crear la requisición',
          'Cerrar',
          { duration: 4000 },
        );
      },
    });
  }

  create(): void {
    this.save();
  }

  cancel(): void {
    this.router.navigate(['/positions']);
  }
}
