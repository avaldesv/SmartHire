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
import { CatalogCurrencyService } from '../../../core/services/catalog-currency.service';
import { CatalogGenderService } from '../../../core/services/catalog-gender.service';
import { CatalogGeographyService } from '../../../core/services/catalog-geography.service';
import { CatalogKinshipService } from '../../../core/services/catalog-kinship.service';
import { SettingsService } from '../../../mock/services/settings.service';
import { CatalogCurrency } from '../../../shared/models/catalog-currency.model';
import { CatalogCountry } from '../../../shared/models/catalog-geography.model';
import { CatalogGender } from '../../../shared/models/catalog-gender.model';
import { CatalogKinship } from '../../../shared/models/catalog-kinship.model';
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

  readonly mockColumns = ['key1', 'key2', 'name', 'description', 'active'];
  readonly genderColumns = ['code', 'name', 'value', 'active', 'actions'];
  readonly kinshipColumns = ['code', 'name', 'active', 'actions'];
  readonly currencyColumns = ['code', 'name', 'symbol', 'denomination', 'active', 'actions'];

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

  ngOnInit(): void {
    this.settings.getCatalogs().subscribe((items) => {
      this.allCatalogs = items;
      this.mockCategories = [...new Set(items.map((c) => c.category))];
      this.loadingMock = false;
    });
    this.loadKinships();
    this.geographyService.listCountries().subscribe({
      next: (countries) => {
        this.countries = countries;
        const mexico = countries.find((c) => c.code === 'MX');
        if (mexico) {
          this.selectedCountryId = mexico.id;
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
  }

  onCountryChange(countryId: number): void {
    this.selectedCountryId = countryId;
    this.genderPageIndex = 0;
    this.currencyPageIndex = 0;
    this.cancelGenderForm();
    this.cancelCurrencyForm();
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
}
