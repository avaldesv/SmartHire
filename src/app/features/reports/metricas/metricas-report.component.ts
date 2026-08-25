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
import { SecurityUserService } from '../../../core/services/security-user.service';
import { ClientFilterFieldComponent } from '../../../shared/components/client-filter-field/client-filter-field.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { CatalogBusinessUnit } from '../../../shared/models/catalog-business-unit.model';
import { CatalogCountry } from '../../../shared/models/catalog-geography.model';
import { SecurityRecruiterGroup } from '../../../shared/models/security-recruiter-group.model';
import { SecurityUser } from '../../../shared/models/security-user.model';
import { formatReportCell } from '../shared/report-format';
import { armReportTenantReload } from '../shared/report-tenant-reload';

export interface MetricasRow {
  key: string;
  label: string;
  positions: number | null;
  applicants: number | null;
  hired: number | null;
  avgHireDays: number | null;
}

interface SelectOption {
  id: number;
  label: string;
}

@Component({
  selector: 'sh-metricas-report',
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
  templateUrl: './metricas-report.component.html',
  styleUrl: './metricas-report.component.scss',
})
export class MetricasReportComponent implements OnInit {
  private readonly geography = inject(CatalogGeographyService);
  private readonly businessUnits = inject(CatalogBusinessUnitService);
  private readonly recruiterGroups = inject(SecurityRecruiterGroupService);
  private readonly users = inject(SecurityUserService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly armTenantReload = armReportTenantReload(() => this.reloadForTenant());

  loading = false;
  loadingCatalogs = true;
  errorMessage = '';

  countries: CatalogCountry[] = [];
  businessUnitOptions: CatalogBusinessUnit[] = [];
  groupOptions: SecurityRecruiterGroup[] = [];
  recruiterOptions: SelectOption[] = [];

  rows: MetricasRow[] = [];
  totalRow: MetricasRow = emptyTotal();

  readonly chartSeries = [
    { key: 'positions', label: 'Posiciones', color: '#2563eb' },
    { key: 'applicants', label: 'Postulados', color: '#16a34a' },
    { key: 'hired', label: 'Contratados', color: '#eab308' },
  ] as const;

  readonly dimensionOptions = [
    { value: 'GROUP', label: 'Por grupo' },
    { value: 'RECRUITER', label: 'Por reclutador' },
    { value: 'CLIENT', label: 'Por cliente' },
    { value: 'BUSINESS_UNIT', label: 'Por U. Negocio' },
  ];

  readonly filters = this.fb.nonNullable.group({
    startDate: this.fb.control<string>(currentMonthStart()),
    endDate: this.fb.control<string>(currentMonthEnd()),
    countryId: this.fb.control<number | null>(null),
    dimension: this.fb.control<string>('GROUP'),
    assignedUserId: this.fb.control<number | null>(null),
    clientKey: this.fb.control<string>(''),
    recruiterGroupId: this.fb.control<number | null>(null),
    workplaceId: this.fb.control<number | null>(null),
  });

  ngOnInit(): void {
    this.filters.controls.workplaceId.disable({ emitEvent: false });
    this.filters.controls.recruiterGroupId.disable({ emitEvent: false });

    this.loadIndependentCatalogs();
    this.filters.controls.countryId.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((countryId) => this.onCountryChange(countryId));

    this.load();
    this.armTenantReload();
  }

  get pageTitle(): string {
    const dim = this.dimensionOptions.find((d) => d.value === this.filters.controls.dimension.value);
    const suffix = dim?.label?.replace(/^Por /i, '') ?? 'grupo';
    return `Métricas de requisiciones cubiertas por ${suffix}`;
  }

  get dimensionColumnLabel(): string {
    switch (this.filters.controls.dimension.value) {
      case 'RECRUITER':
        return 'Reclutador';
      case 'CLIENT':
        return 'Cliente';
      case 'BUSINESS_UNIT':
        return 'U. Negocio';
      default:
        return 'Grupo';
    }
  }

  get chartMax(): number {
    const values = [
      this.totalRow.positions,
      this.totalRow.applicants,
      this.totalRow.hired,
      ...this.rows.flatMap((r) => [r.positions, r.applicants, r.hired]),
    ].filter((v): v is number => v != null);
    return Math.max(1, ...values);
  }

  clearFilters(): void {
    this.filters.reset({
      startDate: currentMonthStart(),
      endDate: currentMonthEnd(),
      countryId: null,
      dimension: 'GROUP',
      assignedUserId: null,
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
    // API pending — empty UI until metrics endpoint exists.
    this.rows = [];
    this.totalRow = emptyTotal();
    this.loading = false;
  }

  formatCell(value: number | null | undefined): string {
    return formatReportCell(value);
  }

  barHeight(value: number | null | undefined): string {
    if (value == null || value <= 0) {
      return '0%';
    }
    return `${Math.max(4, Math.min(100, (value / this.chartMax) * 100))}%`;
  }

  private reloadForTenant(): void {
    this.loadIndependentCatalogs();
    this.load();
  }

  private loadIndependentCatalogs(): void {
    this.loadingCatalogs = true;
    forkJoin({
      countries: this.geography.listCountries().pipe(catchError(() => of([] as CatalogCountry[]))),
      users: this.users.list(0, 100).pipe(
        catchError(() => of({ items: [] as SecurityUser[], total: 0 })),
      ),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ countries, users }) => {
        this.countries = countries;
        this.recruiterOptions = users.items.map((u) => ({
          id: u.id,
          label: [u.name, u.lastName].filter(Boolean).join(' ').trim() || u.email || u.username,
        }));
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

function emptyTotal(): MetricasRow {
  return {
    key: 'TOTAL',
    label: 'TOTAL GENERAL',
    positions: null,
    applicants: null,
    hired: null,
    avgHireDays: null,
  };
}

function currentMonthStart(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${d.getFullYear()}-${m}-01`;
}

function currentMonthEnd(): string {
  const d = new Date();
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${String(last).padStart(2, '0')}`;
}
