import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { catchError, forkJoin, of } from 'rxjs';
import { CatalogBusinessUnitService } from '../../../core/services/catalog-business-unit.service';
import { CatalogGeographyService } from '../../../core/services/catalog-geography.service';
import { SecurityRecruiterGroupService } from '../../../core/services/security-recruiter-group.service';
import { ClientFilterFieldComponent } from '../../../shared/components/client-filter-field/client-filter-field.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { CatalogBusinessUnit } from '../../../shared/models/catalog-business-unit.model';
import { CatalogCountry } from '../../../shared/models/catalog-geography.model';
import { SecurityRecruiterGroup } from '../../../shared/models/security-recruiter-group.model';
import { armReportTenantReload } from '../shared/report-tenant-reload';

/** Row for tops tables — metrics TBD until PO confirms formulas. */
export interface TopsIncidenciaRow {
  label: string;
  requisitions: number;
}

@Component({
  selector: 'sh-tops-incidencias-report',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    PageHeaderComponent,
    ClientFilterFieldComponent,
  ],
  templateUrl: './tops-incidencias-report.component.html',
  styleUrl: './tops-incidencias-report.component.scss',
})
export class TopsIncidenciasReportComponent implements OnInit {
  private readonly geography = inject(CatalogGeographyService);
  private readonly businessUnits = inject(CatalogBusinessUnitService);
  private readonly recruiterGroups = inject(SecurityRecruiterGroupService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly armTenantReload = armReportTenantReload(() => this.reloadForTenant());

  loading = false;
  loadingCatalogs = true;
  errorMessage = '';

  countries: CatalogCountry[] = [];
  businessUnitOptions: CatalogBusinessUnit[] = [];
  groupOptions: SecurityRecruiterGroup[] = [];

  /** Empty until BE/metrics defined (Q1–Q7). */
  coordinatorRows: TopsIncidenciaRow[] = [];
  businessUnitRows: TopsIncidenciaRow[] = [];

  readonly dimensionOptions = [
    { value: 'PENDING_ASSIGNMENT', label: 'Pendientes por asignar' },
  ];

  readonly filters = this.fb.nonNullable.group({
    startDate: this.fb.control<string>(todayIso()),
    endDate: this.fb.control<string>(todayIso()),
    countryId: this.fb.control<number | null>(null),
    dimension: this.fb.control<string>('PENDING_ASSIGNMENT'),
    clientKey: this.fb.control<string>(''),
    recruiterGroupId: this.fb.control<number | null>(null),
    workplaceId: this.fb.control<number | null>(null),
  });

  ngOnInit(): void {
    this.filters.controls.workplaceId.disable({ emitEvent: false });
    this.filters.controls.recruiterGroupId.disable({ emitEvent: false });

    this.loadCountries();
    this.filters.controls.countryId.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((countryId) => this.onCountryChange(countryId));

    this.load();
    this.armTenantReload();
  }

  get pageTitle(): string {
    const dim = this.dimensionOptions.find((d) => d.value === this.filters.controls.dimension.value);
    const suffix = dim?.label ?? 'Pendientes por asignar';
    return `Tops de incidencias - Requisiciones ${suffix.toLowerCase()}`;
  }

  clearFilters(): void {
    this.filters.reset({
      startDate: todayIso(),
      endDate: todayIso(),
      countryId: null,
      dimension: 'PENDING_ASSIGNMENT',
      clientKey: '',
      recruiterGroupId: null,
      workplaceId: null,
    });
    this.filters.controls.workplaceId.disable({ emitEvent: false });
    this.filters.controls.recruiterGroupId.disable({ emitEvent: false });
    this.businessUnitOptions = [];
    this.groupOptions = [];
    this.load();
  }

  load(): void {
    this.loading = true;
    this.errorMessage = '';
    // Metrics TBD — keep empty tables until API exists.
    this.coordinatorRows = [];
    this.businessUnitRows = [];
    this.loading = false;
  }

  private reloadForTenant(): void {
    this.loadCountries();
    this.load();
  }

  private loadCountries(): void {
    this.loadingCatalogs = true;
    this.geography
      .listCountries()
      .pipe(
        catchError(() => of([] as CatalogCountry[])),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((countries) => {
        this.countries = countries;
        this.loadingCatalogs = false;
      });
  }

  private onCountryChange(countryId: number | null): void {
    this.filters.controls.workplaceId.setValue(null, { emitEvent: false });
    this.filters.controls.recruiterGroupId.setValue(null, { emitEvent: false });
    this.businessUnitOptions = [];
    this.groupOptions = [];
    if (countryId == null) {
      this.filters.controls.workplaceId.disable({ emitEvent: false });
      this.filters.controls.recruiterGroupId.disable({ emitEvent: false });
      return;
    }
    this.filters.controls.workplaceId.enable({ emitEvent: false });
    this.filters.controls.recruiterGroupId.enable({ emitEvent: false });
    forkJoin({
      businessUnits: this.businessUnits.list(countryId, 0, 200).pipe(
        catchError(() => of({ items: [] as CatalogBusinessUnit[], total: 0 })),
      ),
      groups: this.recruiterGroups.list(countryId, 0, 200).pipe(
        catchError(() => of({ items: [] as SecurityRecruiterGroup[], total: 0 })),
      ),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ businessUnits, groups }) => {
        this.businessUnitOptions = businessUnits.items;
        this.groupOptions = groups.items;
      });
  }
}

function todayIso(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}
