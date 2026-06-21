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
import { MatTabsModule } from '@angular/material/tabs';
import { CatalogCareerService } from '../../../core/services/catalog-career.service';
import { CatalogBenefitService } from '../../../core/services/catalog-benefit.service';
import { CatalogCurrencyService } from '../../../core/services/catalog-currency.service';
import { CatalogDocumentTypeService } from '../../../core/services/catalog-document-type.service';
import { CatalogGenderService } from '../../../core/services/catalog-gender.service';
import { CatalogGeographyService } from '../../../core/services/catalog-geography.service';
import { CatalogKinshipService } from '../../../core/services/catalog-kinship.service';
import { CatalogLanguageService } from '../../../core/services/catalog-language.service';
import { CatalogShiftService } from '../../../core/services/catalog-shift.service';
import { SettingsService } from '../../../mock/services/settings.service';
import { CatalogCareer } from '../../../shared/models/catalog-career.model';
import { CatalogBenefit } from '../../../shared/models/catalog-benefit.model';
import { CatalogCurrency } from '../../../shared/models/catalog-currency.model';
import { CatalogDocumentType } from '../../../shared/models/catalog-document-type.model';
import { CatalogCountry, CatalogState } from '../../../shared/models/catalog-geography.model';
import { CatalogGender } from '../../../shared/models/catalog-gender.model';
import { CatalogKinship } from '../../../shared/models/catalog-kinship.model';
import { CatalogLanguage } from '../../../shared/models/catalog-language.model';
import { CatalogShift } from '../../../shared/models/catalog-shift.model';
import { CatalogItem } from '../../../shared/models';

@Component({
  selector: 'sh-catalogs-admin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './catalogs-admin.component.html',
  styleUrl: './catalogs-admin.component.scss',
})
export class CatalogsAdminComponent implements OnInit {
  private readonly settings = inject(SettingsService);
  private readonly genderService = inject(CatalogGenderService);
  private readonly kinshipService = inject(CatalogKinshipService);
  private readonly currencyService = inject(CatalogCurrencyService);
  private readonly careerService = inject(CatalogCareerService);
  private readonly languageService = inject(CatalogLanguageService);
  private readonly shiftService = inject(CatalogShiftService);
  private readonly benefitService = inject(CatalogBenefitService);
  private readonly documentTypeService = inject(CatalogDocumentTypeService);
  private readonly geographyService = inject(CatalogGeographyService);
  private readonly snack = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  loadingMock = true;
  allCatalogs: CatalogItem[] = [];
  mockCategories: string[] = [];

  countries: CatalogCountry[] = [];
  selectedCountryId: number | null = null;

  genders: CatalogGender[] = [];
  genderTotal = 0;
  genderPageIndex = 0;
  genderPageSize = 10;
  loadingGenders = false;
  savingGender = false;
  editingGenderId: number | null = null;
  showGenderForm = false;

  kinships: CatalogKinship[] = [];
  kinshipTotal = 0;
  kinshipPageIndex = 0;
  kinshipPageSize = 10;
  loadingKinships = false;
  savingKinship = false;
  editingKinshipId: number | null = null;
  showKinshipForm = false;

  currencies: CatalogCurrency[] = [];
  currencyTotal = 0;
  currencyPageIndex = 0;
  currencyPageSize = 10;
  loadingCurrencies = false;
  savingCurrency = false;
  editingCurrencyId: number | null = null;
  showCurrencyForm = false;

  careers: CatalogCareer[] = [];
  careerTotal = 0;
  careerPageIndex = 0;
  careerPageSize = 10;
  loadingCareers = false;
  savingCareer = false;
  editingCareerId: number | null = null;
  showCareerForm = false;

  languages: CatalogLanguage[] = [];
  languageTotal = 0;
  languagePageIndex = 0;
  languagePageSize = 10;
  loadingLanguages = false;
  savingLanguage = false;
  editingLanguageId: number | null = null;
  showLanguageForm = false;

  shifts: CatalogShift[] = [];
  shiftTotal = 0;
  shiftPageIndex = 0;
  shiftPageSize = 10;
  loadingShifts = false;
  savingShift = false;
  editingShiftId: number | null = null;
  showShiftForm = false;

  benefits: CatalogBenefit[] = [];
  benefitTotal = 0;
  benefitPageIndex = 0;
  benefitPageSize = 10;
  loadingBenefits = false;
  savingBenefit = false;
  editingBenefitId: number | null = null;
  showBenefitForm = false;

  documentTypes: CatalogDocumentType[] = [];
  documentTypeTotal = 0;
  documentTypePageIndex = 0;
  documentTypePageSize = 10;
  loadingDocumentTypes = false;
  savingDocumentType = false;
  editingDocumentTypeId: number | null = null;
  showDocumentTypeForm = false;

  countryRecords: CatalogCountry[] = [];
  countryRecordTotal = 0;
  countryPageIndex = 0;
  countryPageSize = 10;
  loadingCountryRecords = false;
  savingCountry = false;
  editingCountryId: number | null = null;
  showCountryForm = false;

  states: CatalogState[] = [];
  stateTotal = 0;
  statePageIndex = 0;
  statePageSize = 10;
  loadingStates = false;
  savingState = false;
  editingStateId: number | null = null;
  showStateForm = false;

  readonly mockColumns = ['key1', 'key2', 'name', 'description', 'active'];
  readonly genderColumns = ['code', 'name', 'value', 'active', 'actions'];
  readonly kinshipColumns = ['code', 'name', 'active', 'actions'];
  readonly currencyColumns = ['code', 'name', 'symbol', 'denomination', 'active', 'actions'];
  readonly careerColumns = ['code', 'name', 'active', 'actions'];
  readonly languageColumns = ['code', 'name', 'active', 'actions'];
  readonly shiftColumns = ['code', 'name', 'active', 'actions'];
  readonly benefitColumns = ['code', 'name', 'active', 'actions'];
  readonly documentTypeColumns = ['code', 'name', 'documentType', 'validatesWithAi', 'active', 'actions'];
  readonly countryColumns = ['code', 'secondaryCode', 'name', 'active', 'actions'];
  readonly stateColumns = ['code', 'name', 'shortDescription', 'active', 'actions'];

  private readonly apiCatalogCategories = new Set(['Carrera', 'País', 'Entidad Federativa']);

  readonly genderForm = this.fb.nonNullable.group({
    countryId: [null as number | null, Validators.required],
    code: ['', Validators.required],
    name: ['', Validators.required],
    value: [''],
    isActive: [true],
  });

  readonly kinshipForm = this.fb.nonNullable.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
    isActive: [true],
  });

  readonly currencyForm = this.fb.nonNullable.group({
    countryId: [null as number | null, Validators.required],
    code: ['', Validators.required],
    name: ['', Validators.required],
    symbol: [''],
    denomination: [''],
    isActive: [true],
  });

  readonly careerForm = this.fb.nonNullable.group({
    countryId: [null as number | null, Validators.required],
    code: ['', Validators.required],
    name: ['', Validators.required],
    isActive: [true],
  });

  readonly languageForm = this.fb.nonNullable.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
    isActive: [true],
  });

  readonly shiftForm = this.fb.nonNullable.group({
    countryId: [null as number | null, Validators.required],
    code: ['', Validators.required],
    name: ['', Validators.required],
    isActive: [true],
  });

  readonly benefitForm = this.fb.nonNullable.group({
    countryId: [null as number | null, Validators.required],
    code: ['', Validators.required],
    name: ['', Validators.required],
    isActive: [true],
  });

  readonly documentTypeForm = this.fb.nonNullable.group({
    countryId: [null as number | null, Validators.required],
    code: ['', Validators.required],
    name: ['', Validators.required],
    documentType: ['', Validators.required],
    validatesWithAi: [false],
    isActive: [true],
  });

  readonly countryForm = this.fb.nonNullable.group({
    code: ['', Validators.required],
    secondaryCode: [''],
    name: ['', Validators.required],
    isActive: [true],
  });

  readonly stateForm = this.fb.nonNullable.group({
    countryId: [null as number | null, Validators.required],
    code: ['', Validators.required],
    name: ['', Validators.required],
    shortDescription: [''],
    isActive: [true],
  });

  ngOnInit(): void {
    this.settings.getCatalogs().subscribe((items) => {
      this.allCatalogs = items;
      this.mockCategories = [...new Set(items.map((c) => c.category))].filter(
        (cat) => !this.apiCatalogCategories.has(cat),
      );
      this.loadingMock = false;
    });
    this.loadKinships();
    this.loadLanguages();
    this.loadCountryRecords();
    this.reloadCountryDropdown();
  }

  private reloadCountryDropdown(): void {
    this.geographyService.listCountries().subscribe({
      next: (countries) => {
        this.countries = countries;
        const mexico = countries.find((c) => c.code === 'MX');
        if (mexico && this.selectedCountryId == null) {
          this.selectedCountryId = mexico.id;
          this.loadCountryCatalogs();
        } else if (this.selectedCountryId != null) {
          this.loadCountryCatalogs();
        }
      },
      error: () => this.snack.open('No se pudieron cargar los países', 'Cerrar', { duration: 4000 }),
    });
  }

  getByCategory(cat: string): CatalogItem[] {
    return this.allCatalogs.filter((c) => c.category === cat);
  }

  private loadCountryCatalogs(): void {
    this.loadGenders();
    this.loadCurrencies();
    this.loadCareers();
    this.loadShifts();
    this.loadBenefits();
    this.loadDocumentTypes();
    this.loadStates();
  }

  onCountryChange(countryId: number): void {
    this.selectedCountryId = countryId;
    this.genderPageIndex = 0;
    this.currencyPageIndex = 0;
    this.careerPageIndex = 0;
    this.shiftPageIndex = 0;
    this.benefitPageIndex = 0;
    this.documentTypePageIndex = 0;
    this.statePageIndex = 0;
    this.cancelGenderForm();
    this.cancelCurrencyForm();
    this.cancelCareerForm();
    this.cancelShiftForm();
    this.cancelBenefitForm();
    this.cancelDocumentTypeForm();
    this.cancelStateForm();
    this.loadCountryCatalogs();
  }

  loadGenders(): void {
    if (this.selectedCountryId == null) return;
    this.loadingGenders = true;
    this.genderService.list(this.selectedCountryId, this.genderPageIndex, this.genderPageSize).subscribe({
      next: (res) => {
        this.genders = res.items;
        this.genderTotal = res.total;
        this.loadingGenders = false;
      },
      error: () => {
        this.loadingGenders = false;
        this.snack.open('No se pudieron cargar los géneros', 'Cerrar', { duration: 4000 });
      },
    });
  }

  loadKinships(): void {
    this.loadingKinships = true;
    this.kinshipService.list(this.kinshipPageIndex, this.kinshipPageSize).subscribe({
      next: (res) => {
        this.kinships = res.items;
        this.kinshipTotal = res.total;
        this.loadingKinships = false;
      },
      error: () => {
        this.loadingKinships = false;
        this.snack.open('No se pudieron cargar los parentescos', 'Cerrar', { duration: 4000 });
      },
    });
  }

  loadCurrencies(): void {
    if (this.selectedCountryId == null) return;
    this.loadingCurrencies = true;
    this.currencyService.list(this.selectedCountryId, this.currencyPageIndex, this.currencyPageSize).subscribe({
      next: (res) => {
        this.currencies = res.items;
        this.currencyTotal = res.total;
        this.loadingCurrencies = false;
      },
      error: () => {
        this.loadingCurrencies = false;
        this.snack.open('No se pudieron cargar las monedas', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onGenderPage(e: PageEvent): void {
    this.genderPageIndex = e.pageIndex;
    this.genderPageSize = e.pageSize;
    this.loadGenders();
  }

  onKinshipPage(e: PageEvent): void {
    this.kinshipPageIndex = e.pageIndex;
    this.kinshipPageSize = e.pageSize;
    this.loadKinships();
  }

  onCurrencyPage(e: PageEvent): void {
    this.currencyPageIndex = e.pageIndex;
    this.currencyPageSize = e.pageSize;
    this.loadCurrencies();
  }

  loadCareers(): void {
    if (this.selectedCountryId == null) return;
    this.loadingCareers = true;
    this.careerService.list(this.selectedCountryId, this.careerPageIndex, this.careerPageSize).subscribe({
      next: (res) => {
        this.careers = res.items;
        this.careerTotal = res.total;
        this.loadingCareers = false;
      },
      error: () => {
        this.loadingCareers = false;
        this.snack.open('No se pudieron cargar las carreras', 'Cerrar', { duration: 4000 });
      },
    });
  }

  loadLanguages(): void {
    this.loadingLanguages = true;
    this.languageService.list(this.languagePageIndex, this.languagePageSize).subscribe({
      next: (res) => {
        this.languages = res.items;
        this.languageTotal = res.total;
        this.loadingLanguages = false;
      },
      error: () => {
        this.loadingLanguages = false;
        this.snack.open('No se pudieron cargar los idiomas', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onCareerPage(e: PageEvent): void {
    this.careerPageIndex = e.pageIndex;
    this.careerPageSize = e.pageSize;
    this.loadCareers();
  }

  onLanguagePage(e: PageEvent): void {
    this.languagePageIndex = e.pageIndex;
    this.languagePageSize = e.pageSize;
    this.loadLanguages();
  }

  loadShifts(): void {
    if (this.selectedCountryId == null) return;
    this.loadingShifts = true;
    this.shiftService.list(this.selectedCountryId, this.shiftPageIndex, this.shiftPageSize).subscribe({
      next: (res) => {
        this.shifts = res.items;
        this.shiftTotal = res.total;
        this.loadingShifts = false;
      },
      error: () => {
        this.loadingShifts = false;
        this.snack.open('No se pudieron cargar los turnos', 'Cerrar', { duration: 4000 });
      },
    });
  }

  loadBenefits(): void {
    if (this.selectedCountryId == null) return;
    this.loadingBenefits = true;
    this.benefitService.list(this.selectedCountryId, this.benefitPageIndex, this.benefitPageSize).subscribe({
      next: (res) => {
        this.benefits = res.items;
        this.benefitTotal = res.total;
        this.loadingBenefits = false;
      },
      error: () => {
        this.loadingBenefits = false;
        this.snack.open('No se pudieron cargar las prestaciones', 'Cerrar', { duration: 4000 });
      },
    });
  }

  loadDocumentTypes(): void {
    if (this.selectedCountryId == null) return;
    this.loadingDocumentTypes = true;
    this.documentTypeService.list(this.selectedCountryId, this.documentTypePageIndex, this.documentTypePageSize).subscribe({
      next: (res) => {
        this.documentTypes = res.items;
        this.documentTypeTotal = res.total;
        this.loadingDocumentTypes = false;
      },
      error: () => {
        this.loadingDocumentTypes = false;
        this.snack.open('No se pudieron cargar los tipos de documento', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onShiftPage(e: PageEvent): void {
    this.shiftPageIndex = e.pageIndex;
    this.shiftPageSize = e.pageSize;
    this.loadShifts();
  }

  onBenefitPage(e: PageEvent): void {
    this.benefitPageIndex = e.pageIndex;
    this.benefitPageSize = e.pageSize;
    this.loadBenefits();
  }

  onDocumentTypePage(e: PageEvent): void {
    this.documentTypePageIndex = e.pageIndex;
    this.documentTypePageSize = e.pageSize;
    this.loadDocumentTypes();
  }

  openCreateGender(): void {
    this.editingGenderId = null;
    this.showGenderForm = true;
    this.genderForm.reset({ countryId: this.selectedCountryId, code: '', name: '', value: '', isActive: true });
  }

  openEditGender(row: CatalogGender): void {
    this.editingGenderId = row.id;
    this.showGenderForm = true;
    this.genderForm.patchValue({
      countryId: row.countryId,
      code: row.code,
      name: row.name,
      value: row.value ?? '',
      isActive: row.isActive,
    });
  }

  cancelGenderForm(): void {
    this.showGenderForm = false;
    this.editingGenderId = null;
  }

  saveGender(): void {
    if (this.genderForm.invalid) {
      this.genderForm.markAllAsTouched();
      return;
    }
    const value = this.genderForm.getRawValue();
    const payload = {
      countryId: value.countryId!,
      code: value.code,
      name: value.name,
      value: value.value || undefined,
      isActive: value.isActive,
    };
    this.savingGender = true;
    const request$ =
      this.editingGenderId != null
        ? this.genderService.update(this.editingGenderId, payload)
        : this.genderService.create(payload);
    request$.subscribe({
      next: () => {
        this.savingGender = false;
        this.cancelGenderForm();
        this.loadGenders();
        this.snack.open('Género guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingGender = false;
        this.snack.open('No se pudo guardar el género', 'Cerrar', { duration: 4000 });
      },
    });
  }

  openCreateKinship(): void {
    this.editingKinshipId = null;
    this.showKinshipForm = true;
    this.kinshipForm.reset({ code: '', name: '', isActive: true });
  }

  openEditKinship(row: CatalogKinship): void {
    this.editingKinshipId = row.id;
    this.showKinshipForm = true;
    this.kinshipForm.patchValue({ code: row.code, name: row.name, isActive: row.isActive });
  }

  cancelKinshipForm(): void {
    this.showKinshipForm = false;
    this.editingKinshipId = null;
  }

  saveKinship(): void {
    if (this.kinshipForm.invalid) {
      this.kinshipForm.markAllAsTouched();
      return;
    }
    const value = this.kinshipForm.getRawValue();
    this.savingKinship = true;
    const request$ =
      this.editingKinshipId != null
        ? this.kinshipService.update(this.editingKinshipId, value)
        : this.kinshipService.create(value);
    request$.subscribe({
      next: () => {
        this.savingKinship = false;
        this.cancelKinshipForm();
        this.loadKinships();
        this.snack.open('Parentesco guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingKinship = false;
        this.snack.open('No se pudo guardar el parentesco', 'Cerrar', { duration: 4000 });
      },
    });
  }

  openCreateCurrency(): void {
    this.editingCurrencyId = null;
    this.showCurrencyForm = true;
    this.currencyForm.reset({
      countryId: this.selectedCountryId,
      code: '',
      name: '',
      symbol: '',
      denomination: '',
      isActive: true,
    });
  }

  openEditCurrency(row: CatalogCurrency): void {
    this.editingCurrencyId = row.id;
    this.showCurrencyForm = true;
    this.currencyForm.patchValue({
      countryId: row.countryId,
      code: row.code,
      name: row.name,
      symbol: row.symbol ?? '',
      denomination: row.denomination ?? '',
      isActive: row.isActive,
    });
  }

  cancelCurrencyForm(): void {
    this.showCurrencyForm = false;
    this.editingCurrencyId = null;
  }

  saveCurrency(): void {
    if (this.currencyForm.invalid) {
      this.currencyForm.markAllAsTouched();
      return;
    }
    const value = this.currencyForm.getRawValue();
    const payload = {
      countryId: value.countryId!,
      code: value.code,
      name: value.name,
      symbol: value.symbol || undefined,
      denomination: value.denomination || undefined,
      isActive: value.isActive,
    };
    this.savingCurrency = true;
    const request$ =
      this.editingCurrencyId != null
        ? this.currencyService.update(this.editingCurrencyId, payload)
        : this.currencyService.create(payload);
    request$.subscribe({
      next: () => {
        this.savingCurrency = false;
        this.cancelCurrencyForm();
        this.loadCurrencies();
        this.snack.open('Moneda guardada', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingCurrency = false;
        this.snack.open('No se pudo guardar la moneda', 'Cerrar', { duration: 4000 });
      },
    });
  }

  openCreateCareer(): void {
    this.editingCareerId = null;
    this.showCareerForm = true;
    this.careerForm.reset({ countryId: this.selectedCountryId, code: '', name: '', isActive: true });
  }

  openEditCareer(row: CatalogCareer): void {
    this.editingCareerId = row.id;
    this.showCareerForm = true;
    this.careerForm.patchValue({
      countryId: row.countryId,
      code: row.code,
      name: row.name,
      isActive: row.isActive,
    });
  }

  cancelCareerForm(): void {
    this.showCareerForm = false;
    this.editingCareerId = null;
  }

  saveCareer(): void {
    if (this.careerForm.invalid) {
      this.careerForm.markAllAsTouched();
      return;
    }
    const value = this.careerForm.getRawValue();
    const payload = {
      countryId: value.countryId!,
      code: value.code,
      name: value.name,
      isActive: value.isActive,
    };
    this.savingCareer = true;
    const request$ =
      this.editingCareerId != null
        ? this.careerService.update(this.editingCareerId, payload)
        : this.careerService.create(payload);
    request$.subscribe({
      next: () => {
        this.savingCareer = false;
        this.cancelCareerForm();
        this.loadCareers();
        this.snack.open('Carrera guardada', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingCareer = false;
        this.snack.open('No se pudo guardar la carrera', 'Cerrar', { duration: 4000 });
      },
    });
  }

  openCreateLanguage(): void {
    this.editingLanguageId = null;
    this.showLanguageForm = true;
    this.languageForm.reset({ code: '', name: '', isActive: true });
  }

  openEditLanguage(row: CatalogLanguage): void {
    this.editingLanguageId = row.id;
    this.showLanguageForm = true;
    this.languageForm.patchValue({ code: row.code, name: row.name, isActive: row.isActive });
  }

  cancelLanguageForm(): void {
    this.showLanguageForm = false;
    this.editingLanguageId = null;
  }

  saveLanguage(): void {
    if (this.languageForm.invalid) {
      this.languageForm.markAllAsTouched();
      return;
    }
    const value = this.languageForm.getRawValue();
    this.savingLanguage = true;
    const request$ =
      this.editingLanguageId != null
        ? this.languageService.update(this.editingLanguageId, value)
        : this.languageService.create(value);
    request$.subscribe({
      next: () => {
        this.savingLanguage = false;
        this.cancelLanguageForm();
        this.loadLanguages();
        this.snack.open('Idioma guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingLanguage = false;
        this.snack.open('No se pudo guardar el idioma', 'Cerrar', { duration: 4000 });
      },
    });
  }

  openCreateShift(): void {
    this.editingShiftId = null;
    this.showShiftForm = true;
    this.shiftForm.reset({ countryId: this.selectedCountryId, code: '', name: '', isActive: true });
  }

  openEditShift(row: CatalogShift): void {
    this.editingShiftId = row.id;
    this.showShiftForm = true;
    this.shiftForm.patchValue({
      countryId: row.countryId,
      code: row.code,
      name: row.name,
      isActive: row.isActive,
    });
  }

  cancelShiftForm(): void {
    this.showShiftForm = false;
    this.editingShiftId = null;
  }

  saveShift(): void {
    if (this.shiftForm.invalid) {
      this.shiftForm.markAllAsTouched();
      return;
    }
    const value = this.shiftForm.getRawValue();
    const payload = {
      countryId: value.countryId!,
      code: value.code,
      name: value.name,
      isActive: value.isActive,
    };
    this.savingShift = true;
    const request$ =
      this.editingShiftId != null
        ? this.shiftService.update(this.editingShiftId, payload)
        : this.shiftService.create(payload);
    request$.subscribe({
      next: () => {
        this.savingShift = false;
        this.cancelShiftForm();
        this.loadShifts();
        this.snack.open('Turno guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingShift = false;
        this.snack.open('No se pudo guardar el turno', 'Cerrar', { duration: 4000 });
      },
    });
  }

  openCreateBenefit(): void {
    this.editingBenefitId = null;
    this.showBenefitForm = true;
    this.benefitForm.reset({ countryId: this.selectedCountryId, code: '', name: '', isActive: true });
  }

  openEditBenefit(row: CatalogBenefit): void {
    this.editingBenefitId = row.id;
    this.showBenefitForm = true;
    this.benefitForm.patchValue({
      countryId: row.countryId,
      code: row.code,
      name: row.name,
      isActive: row.isActive,
    });
  }

  cancelBenefitForm(): void {
    this.showBenefitForm = false;
    this.editingBenefitId = null;
  }

  saveBenefit(): void {
    if (this.benefitForm.invalid) {
      this.benefitForm.markAllAsTouched();
      return;
    }
    const value = this.benefitForm.getRawValue();
    const payload = {
      countryId: value.countryId!,
      code: value.code,
      name: value.name,
      isActive: value.isActive,
    };
    this.savingBenefit = true;
    const request$ =
      this.editingBenefitId != null
        ? this.benefitService.update(this.editingBenefitId, payload)
        : this.benefitService.create(payload);
    request$.subscribe({
      next: () => {
        this.savingBenefit = false;
        this.cancelBenefitForm();
        this.loadBenefits();
        this.snack.open('Prestación guardada', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingBenefit = false;
        this.snack.open('No se pudo guardar la prestación', 'Cerrar', { duration: 4000 });
      },
    });
  }

  openCreateDocumentType(): void {
    this.editingDocumentTypeId = null;
    this.showDocumentTypeForm = true;
    this.documentTypeForm.reset({
      countryId: this.selectedCountryId,
      code: '',
      name: '',
      documentType: '',
      validatesWithAi: false,
      isActive: true,
    });
  }

  openEditDocumentType(row: CatalogDocumentType): void {
    this.editingDocumentTypeId = row.id;
    this.showDocumentTypeForm = true;
    this.documentTypeForm.patchValue({
      countryId: row.countryId,
      code: row.code,
      name: row.name,
      documentType: row.documentType,
      validatesWithAi: row.validatesWithAi,
      isActive: row.isActive,
    });
  }

  cancelDocumentTypeForm(): void {
    this.showDocumentTypeForm = false;
    this.editingDocumentTypeId = null;
  }

  saveDocumentType(): void {
    if (this.documentTypeForm.invalid) {
      this.documentTypeForm.markAllAsTouched();
      return;
    }
    const value = this.documentTypeForm.getRawValue();
    const payload = {
      countryId: value.countryId!,
      code: value.code,
      name: value.name,
      documentType: value.documentType,
      validatesWithAi: value.validatesWithAi,
      isActive: value.isActive,
    };
    this.savingDocumentType = true;
    const request$ =
      this.editingDocumentTypeId != null
        ? this.documentTypeService.update(this.editingDocumentTypeId, payload)
        : this.documentTypeService.create(payload);
    request$.subscribe({
      next: () => {
        this.savingDocumentType = false;
        this.cancelDocumentTypeForm();
        this.loadDocumentTypes();
        this.snack.open('Tipo de documento guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingDocumentType = false;
        this.snack.open('No se pudo guardar el tipo de documento', 'Cerrar', { duration: 4000 });
      },
    });
  }

  loadCountryRecords(): void {
    this.loadingCountryRecords = true;
    this.geographyService.listCountriesPage(this.countryPageIndex, this.countryPageSize).subscribe({
      next: (res) => {
        this.countryRecords = res.items;
        this.countryRecordTotal = res.total;
        this.loadingCountryRecords = false;
      },
      error: () => {
        this.loadingCountryRecords = false;
        this.snack.open('No se pudieron cargar los países', 'Cerrar', { duration: 4000 });
      },
    });
  }

  loadStates(): void {
    if (this.selectedCountryId == null) return;
    this.loadingStates = true;
    this.geographyService.listStatesPage(this.selectedCountryId, this.statePageIndex, this.statePageSize).subscribe({
      next: (res) => {
        this.states = res.items;
        this.stateTotal = res.total;
        this.loadingStates = false;
      },
      error: () => {
        this.loadingStates = false;
        this.snack.open('No se pudieron cargar las entidades federativas', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onCountryPage(e: PageEvent): void {
    this.countryPageIndex = e.pageIndex;
    this.countryPageSize = e.pageSize;
    this.loadCountryRecords();
  }

  onStatePage(e: PageEvent): void {
    this.statePageIndex = e.pageIndex;
    this.statePageSize = e.pageSize;
    this.loadStates();
  }

  openCreateCountry(): void {
    this.editingCountryId = null;
    this.showCountryForm = true;
    this.countryForm.reset({ code: '', secondaryCode: '', name: '', isActive: true });
  }

  openEditCountry(row: CatalogCountry): void {
    this.editingCountryId = row.id;
    this.showCountryForm = true;
    this.countryForm.patchValue({
      code: row.code,
      secondaryCode: row.secondaryCode ?? '',
      name: row.name,
      isActive: row.isActive,
    });
  }

  cancelCountryForm(): void {
    this.showCountryForm = false;
    this.editingCountryId = null;
  }

  saveCountry(): void {
    if (this.countryForm.invalid) {
      this.countryForm.markAllAsTouched();
      return;
    }
    const value = this.countryForm.getRawValue();
    this.savingCountry = true;
    const request$ =
      this.editingCountryId != null
        ? this.geographyService.updateCountry(this.editingCountryId, value)
        : this.geographyService.createCountry(value);
    request$.subscribe({
      next: () => {
        this.savingCountry = false;
        this.cancelCountryForm();
        this.loadCountryRecords();
        this.reloadCountryDropdown();
        this.snack.open('País guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingCountry = false;
        this.snack.open('No se pudo guardar el país', 'Cerrar', { duration: 4000 });
      },
    });
  }

  openCreateState(): void {
    this.editingStateId = null;
    this.showStateForm = true;
    this.stateForm.reset({
      countryId: this.selectedCountryId,
      code: '',
      name: '',
      shortDescription: '',
      isActive: true,
    });
  }

  openEditState(row: CatalogState): void {
    this.editingStateId = row.id;
    this.showStateForm = true;
    this.stateForm.patchValue({
      countryId: row.countryId,
      code: row.code,
      name: row.name,
      shortDescription: row.shortDescription ?? '',
      isActive: row.isActive,
    });
  }

  cancelStateForm(): void {
    this.showStateForm = false;
    this.editingStateId = null;
  }

  saveState(): void {
    if (this.stateForm.invalid) {
      this.stateForm.markAllAsTouched();
      return;
    }
    const value = this.stateForm.getRawValue();
    const payload = {
      countryId: value.countryId!,
      code: value.code,
      name: value.name,
      shortDescription: value.shortDescription,
      isActive: value.isActive,
    };
    this.savingState = true;
    const request$ =
      this.editingStateId != null
        ? this.geographyService.updateState(this.editingStateId, payload)
        : this.geographyService.createState(payload);
    request$.subscribe({
      next: () => {
        this.savingState = false;
        this.cancelStateForm();
        this.loadStates();
        this.snack.open('Entidad federativa guardada', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.savingState = false;
        this.snack.open('No se pudo guardar la entidad federativa', 'Cerrar', { duration: 4000 });
      },
    });
  }
}
