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
import { ReportsApiService } from '../../../core/services/reports-api.service';
import { SecurityRecruiterGroupService } from '../../../core/services/security-recruiter-group.service';
import { SecurityUserService } from '../../../core/services/security-user.service';
import { ClientFilterFieldComponent } from '../../../shared/components/client-filter-field/client-filter-field.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import {
  REPORTS_CLEAR_FILTERS,
  REPORTS_FILTER_ALL,
  REPORTS_FILTER_BUSINESS_UNIT_SHORT,
  REPORTS_FILTER_CLIENT,
  REPORTS_FILTER_COUNTRY,
  REPORTS_FILTER_DIMENSION,
  REPORTS_FILTER_END_DATE,
  REPORTS_FILTER_GROUP,
  REPORTS_FILTER_RECRUITER,
  REPORTS_FILTER_SELECT_COUNTRY,
  REPORTS_FILTER_START_DATE,
  REPORTS_MET_COL_AVG_HIRE_DAYS,
  REPORTS_MET_COL_POSITIONS,
  REPORTS_MET_DIM_BY_BUSINESS_UNIT,
  REPORTS_MET_DIM_BY_CLIENT,
  REPORTS_MET_DIM_BY_GROUP,
  REPORTS_MET_DIM_BY_RECRUITER,
  REPORTS_MET_EMPTY_CHART,
  REPORTS_MET_LOAD_ERROR,
  REPORTS_MET_SUBTITLE,
  REPORTS_PERF_COL_TOTAL,
  REPORTS_SBR_COL_APPLICANTS,
  REPORTS_SBR_COL_HIRED,
  REPORTS_UPDATE,
  reportsMetricsTitleBy,
} from '../../../core/i18n/reports-i18n-labels';
import { CatalogBusinessUnit } from '../../../shared/models/catalog-business-unit.model';
import { CatalogCountry } from '../../../shared/models/catalog-geography.model';
import { MetricasFilterRequest } from '../../../shared/models/report.model';
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
  private readonly reportsApi = inject(ReportsApiService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly armTenantReload = armReportTenantReload(() => this.reloadForTenant());
  readonly ui = {
    subtitle: REPORTS_MET_SUBTITLE,
    update: REPORTS_UPDATE,
    clearFilters: REPORTS_CLEAR_FILTERS,
    startDate: REPORTS_FILTER_START_DATE,
    endDate: REPORTS_FILTER_END_DATE,
    country: REPORTS_FILTER_COUNTRY,
    dimension: REPORTS_FILTER_DIMENSION,
    recruiter: REPORTS_FILTER_RECRUITER,
    group: REPORTS_FILTER_GROUP,
    businessUnit: REPORTS_FILTER_BUSINESS_UNIT_SHORT,
    all: REPORTS_FILTER_ALL,
    selectCountry: REPORTS_FILTER_SELECT_COUNTRY,
    emptyChart: REPORTS_MET_EMPTY_CHART,
    colPositions: REPORTS_MET_COL_POSITIONS,
    colApplicants: REPORTS_SBR_COL_APPLICANTS,
    colHired: REPORTS_SBR_COL_HIRED,
    colAvgHireDays: REPORTS_MET_COL_AVG_HIRE_DAYS,
  };

  loading = false;
  loadingCatalogs = true;
  errorMessage = '';

  countries: CatalogCountry[] = [];
  businessUnitOptions: CatalogBusinessUnit[] = [];
  groupOptions: SecurityRecruiterGroup[] = [];
  recruiterOptions: SelectOption[] = [];

  rows: MetricasRow[] = [];
  totalRow: MetricasRow = emptyTotal(REPORTS_PERF_COL_TOTAL);

  readonly chartSeries = [
    { key: 'positions', label: REPORTS_MET_COL_POSITIONS, color: '#2563eb' },
    { key: 'applicants', label: REPORTS_SBR_COL_APPLICANTS, color: '#16a34a' },
    { key: 'hired', label: REPORTS_SBR_COL_HIRED, color: '#eab308' },
  ] as const;

  readonly dimensionOptions = [
    { value: 'GROUP', label: REPORTS_MET_DIM_BY_GROUP },
    { value: 'RECRUITER', label: REPORTS_MET_DIM_BY_RECRUITER },
    { value: 'CLIENT', label: REPORTS_MET_DIM_BY_CLIENT },
    { value: 'BUSINESS_UNIT', label: REPORTS_MET_DIM_BY_BUSINESS_UNIT },
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
    const suffix = dim?.label?.replace(/^[^\s]+\s+/, '') ?? REPORTS_FILTER_GROUP.toLocaleLowerCase();
    return reportsMetricsTitleBy(suffix);
  }

  get dimensionColumnLabel(): string {
    switch (this.filters.controls.dimension.value) {
      case 'RECRUITER':
        return REPORTS_FILTER_RECRUITER;
      case 'CLIENT':
        return REPORTS_FILTER_CLIENT;
      case 'BUSINESS_UNIT':
        return REPORTS_FILTER_BUSINESS_UNIT_SHORT;
      default:
        return REPORTS_FILTER_GROUP;
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
    this.reportsApi
      .getMetricas(this.buildRequest())
      .pipe(
        catchError(() => {
          this.errorMessage = REPORTS_MET_LOAD_ERROR;
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data) => {
        this.rows = (data?.rows ?? []).map(mapRow);
        this.totalRow = data?.total ? mapRow(data.total) : emptyTotal(REPORTS_PERF_COL_TOTAL);
        this.loading = false;
      });
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

  private buildRequest(): MetricasFilterRequest {
    const v = this.filters.getRawValue();
    return {
      startDate: v.startDate || null,
      endDate: v.endDate || null,
      countryId: v.countryId,
      dimension: v.dimension || 'GROUP',
      assignedUserId: v.assignedUserId,
      clientKey: v.clientKey?.trim() || null,
      recruiterGroupId: v.recruiterGroupId,
      workplaceId: v.workplaceId,
    };
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

function emptyTotal(label: string): MetricasRow {
  return {
    key: 'TOTAL',
    label,
    positions: null,
    applicants: null,
    hired: null,
    avgHireDays: null,
  };
}

function mapRow(row: {
  key: string;
  label: string;
  positions: number;
  applicants: number;
  hired: number;
  avgHireDays: number | null;
}): MetricasRow {
  return {
    key: row.key,
    label: row.label,
    positions: row.positions,
    applicants: row.applicants,
    hired: row.hired,
    avgHireDays: row.avgHireDays,
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
