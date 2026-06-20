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
import { CatalogGenderService } from '../../../core/services/catalog-gender.service';
import { CatalogGeographyService } from '../../../core/services/catalog-geography.service';
import { SettingsService } from '../../../mock/services/settings.service';
import { CatalogCountry } from '../../../shared/models/catalog-geography.model';
import { CatalogGender } from '../../../shared/models/catalog-gender.model';
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
  private readonly geographyService = inject(CatalogGeographyService);
  private readonly snack = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  loadingMock = true;
  allCatalogs: CatalogItem[] = [];
  mockCategories: string[] = [];

  countries: CatalogCountry[] = [];
  genders: CatalogGender[] = [];
  genderTotal = 0;
  genderPageIndex = 0;
  genderPageSize = 10;
  loadingGenders = false;
  savingGender = false;
  editingGenderId: number | null = null;
  showGenderForm = false;
  selectedCountryId: number | null = null;

  readonly mockColumns = ['key1', 'key2', 'name', 'description', 'active'];
  readonly genderColumns = ['code', 'name', 'value', 'active', 'actions'];

  readonly genderForm = this.fb.nonNullable.group({
    countryId: [null as number | null, Validators.required],
    code: ['', Validators.required],
    name: ['', Validators.required],
    value: [''],
    isActive: [true],
  });

  ngOnInit(): void {
    this.settings.getCatalogs().subscribe((items) => {
      this.allCatalogs = items;
      this.mockCategories = [...new Set(items.map((c) => c.category))];
      this.loadingMock = false;
    });
    this.geographyService.listCountries().subscribe({
      next: (countries) => {
        this.countries = countries;
        const mexico = countries.find((c) => c.code === 'MX');
        if (mexico) {
          this.selectedCountryId = mexico.id;
          this.loadGenders();
        }
      },
      error: () => this.snack.open('No se pudieron cargar los países', 'Cerrar', { duration: 4000 }),
    });
  }

  getByCategory(cat: string): CatalogItem[] {
    return this.allCatalogs.filter((c) => c.category === cat);
  }

  loadGenders(): void {
    if (this.selectedCountryId == null) {
      return;
    }
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

  onGenderPage(e: PageEvent): void {
    this.genderPageIndex = e.pageIndex;
    this.genderPageSize = e.pageSize;
    this.loadGenders();
  }

  onCountryChange(countryId: number): void {
    this.selectedCountryId = countryId;
    this.genderPageIndex = 0;
    this.cancelGenderForm();
    this.loadGenders();
  }

  openCreateGender(): void {
    this.editingGenderId = null;
    this.showGenderForm = true;
    this.genderForm.reset({
      countryId: this.selectedCountryId,
      code: '',
      name: '',
      value: '',
      isActive: true,
    });
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
}
