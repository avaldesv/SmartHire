import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceTime, distinctUntilChanged, filter, forkJoin, switchMap } from 'rxjs';
import { CatalogGeographyService } from '../../../core/services/catalog-geography.service';
import { CatalogPositionService } from '../../../core/services/catalog-position.service';
import { PositionService } from '../../../core/services/position.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { CreatePositionRequest, PositionDetail } from '../../../shared/models/position.model';
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
    PageHeaderComponent,
  ],
  templateUrl: './position-wizard.component.html',
  styleUrl: './position-wizard.component.scss',
})
export class PositionWizardComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly snack = inject(MatSnackBar);
  private readonly geographyService = inject(CatalogGeographyService);
  private readonly catalogService = inject(CatalogPositionService);
  private readonly positionService = inject(PositionService);
  private readonly destroyRef = inject(DestroyRef);

  creating = false;
  loadingPosition = false;
  editPositionId: number | null = null;
  requisitionNo: string | null = null;
  private suppressCountryCascade = false;

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
    brandId: [null as number | null, Validators.required],
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

  ngOnInit(): void {
    this.setupCountryCascade();
    this.setupAddressCascade();
    this.loadCountries();
    this.loadLanguages();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.loadPositionForEdit(Number(idParam));
    }
  }

  private loadCountries(): void {
    this.loadingCatalog.countries = true;
    this.geographyService.listCountries().subscribe({
      next: (items) => {
        this.countries = items;
        this.loadingCatalog.countries = false;
        if (!this.isEditMode) {
          const mexico = items.find((c) => c.code === 'MX');
          if (mexico) {
            this.clientForm.patchValue({ countryId: mexico.id });
          }
        }
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
        this.clientForm.patchValue({ brandId: null, coverageTypeId: null, requisitionTypeId: null }, { emitEvent: false });
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
        this.loadingCatalog.brands = false;
      },
      error: () => {
        this.brands = [];
        this.loadingCatalog.brands = false;
      },
    });
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
        this.hydrateForms(position);
      },
      error: () => {
        this.loadingPosition = false;
        this.snack.open('No se pudo cargar la requisición', 'Cerrar', { duration: 4000 });
        this.router.navigate(['/positions']);
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
          this.clientForm.patchValue({
            countryId: position.countryId,
            brandId: position.brandId,
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
    console.log('JSON export:', this.buildCreatePayload());
    this.snack.open('JSON exportado a consola', 'Cerrar', { duration: 3000 });
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
      brandId: client.brandId!,
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

  create(): void {
    this.save();
  }

  cancel(): void {
    this.router.navigate(['/positions']);
  }
}
