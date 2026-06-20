import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { CatalogGeographyService } from '../../../core/services/catalog-geography.service';
import { CatalogPositionService } from '../../../core/services/catalog-position.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import {
  CatalogCountry,
  CatalogMunicipality,
  CatalogNeighborhood,
  CatalogState,
} from '../../../shared/models/catalog-geography.model';
import {
  CatalogBenefit,
  CatalogBrand,
  CatalogCoverageType,
  CatalogLanguage,
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
  private readonly snack = inject(MatSnackBar);
  private readonly geographyService = inject(CatalogGeographyService);
  private readonly catalogService = inject(CatalogPositionService);
  private readonly destroyRef = inject(DestroyRef);

  countries: CatalogCountry[] = [];
  states: CatalogState[] = [];
  municipalities: CatalogMunicipality[] = [];
  neighborhoods: CatalogNeighborhood[] = [];
  brands: CatalogBrand[] = [];
  coverageTypes: CatalogCoverageType[] = [];
  shifts: CatalogShift[] = [];
  benefits: CatalogBenefit[] = [];
  languages: CatalogLanguage[] = [];

  loadingCatalog = {
    countries: false,
    brands: false,
    coverageTypes: false,
    shifts: false,
    benefits: false,
    languages: false,
  };

  loadingGeo = {
    states: false,
    municipalities: false,
    neighborhoods: false,
  };

  readonly clientForm = this.fb.nonNullable.group({
    countryId: [null as number | null, Validators.required],
    brandId: [null as number | null, Validators.required],
    recruitmentType: ['Reclutamiento Puro', Validators.required],
    coverageTypeId: [null as number | null, Validators.required],
    ot: ['', Validators.required],
    clientKey: ['', Validators.required],
    legalName: ['', Validators.required],
    contactName: ['', Validators.required],
    clientPosition: ['', Validators.required],
  });

  readonly generalForm = this.fb.nonNullable.group({
    generalNotes: [''],
    contractType: ['Indeterminado', Validators.required],
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
    contractType: ['Temporal', Validators.required],
    benefitId: [null as number | null, Validators.required],
    probationDays: [30, Validators.required],
  });

  readonly languagesForm = this.fb.nonNullable.group({
    primaryLanguageId: [null as number | null, Validators.required],
    secondaryLanguageId: [null as number | null],
    levelRequired: ['Intermedio', Validators.required],
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
    education: ['Licenciatura', Validators.required],
    experienceYears: [2, Validators.required],
  });

  readonly documentsForm = this.fb.nonNullable.group({
    ine: [true],
    curp: [true],
    rfc: [false],
    comprobante: [true],
  });

  ngOnInit(): void {
    this.setupCountryCascade();
    this.setupAddressCascade();
    this.loadCountries();
    this.loadLanguages();
  }

  private loadCountries(): void {
    this.loadingCatalog.countries = true;
    this.geographyService.listCountries().subscribe({
      next: (items) => {
        this.countries = items;
        this.loadingCatalog.countries = false;
        const mexico = items.find((c) => c.code === 'MX');
        if (mexico) {
          this.clientForm.patchValue({ countryId: mexico.id });
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
        const spanish = items.find((l) => l.code === 'ES' || l.name.toLowerCase().includes('espa'));
        if (spanish) {
          this.languagesForm.patchValue({ primaryLanguageId: spanish.id });
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
        this.clientForm.patchValue({ brandId: null, coverageTypeId: null }, { emitEvent: false });
        this.generalForm.patchValue({ shiftId: null }, { emitEvent: false });
        this.hiringForm.patchValue({ benefitId: null }, { emitEvent: false });
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

  exportJson(): void {
    const payload = {
      ...this.clientForm.getRawValue(),
      ...this.generalForm.getRawValue(),
      ...this.manpowerForm.getRawValue(),
      ...this.hiringForm.getRawValue(),
      ...this.languagesForm.getRawValue(),
      ...this.addressForm.getRawValue(),
      ...this.requirementsForm.getRawValue(),
      documents: Object.entries(this.documentsForm.getRawValue())
        .filter(([, v]) => v)
        .map(([k]) => k),
    };
    console.log('JSON export:', payload);
    this.snack.open('JSON exportado a consola', 'Cerrar', { duration: 3000 });
  }

  sendAts(): void {
    this.snack.open('Enviado a ATS (simulado)', 'Cerrar', { duration: 3000 });
  }

  create(): void {
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
    this.snack.open('Requisición creada correctamente', 'Cerrar', { duration: 3000 });
    this.router.navigate(['/positions']);
  }

  cancel(): void {
    this.router.navigate(['/positions']);
  }
}
