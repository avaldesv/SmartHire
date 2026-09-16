import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { catchError, forkJoin, of } from 'rxjs';
import { CatalogBusinessUnitService } from '../../../core/services/catalog-business-unit.service';
import { CatalogGeographyService } from '../../../core/services/catalog-geography.service';
import { PositionService } from '../../../core/services/position.service';
import { ReportsApiService } from '../../../core/services/reports-api.service';
import { SecurityRecruiterGroupService } from '../../../core/services/security-recruiter-group.service';
import { SecurityUserService } from '../../../core/services/security-user.service';
import {
  REPORTS_CLEAR_FILTERS,
  REPORTS_EMPTY_MATRIX,
  REPORTS_FILTER_ALL,
  REPORTS_FILTER_ALL_FEM,
  REPORTS_FILTER_BUSINESS_UNIT,
  REPORTS_FILTER_COUNTRY,
  REPORTS_FILTER_GROUP,
  REPORTS_FILTER_ORDER,
  REPORTS_FILTER_RECRUITER,
  REPORTS_FILTER_RECRUITMENT_TYPE,
  REPORTS_FILTER_SELECT_COUNTRY,
  REPORTS_FILTER_YEAR,
  REPORTS_INDICATORS,
  REPORTS_KPI_FILL_CURRENT,
  REPORTS_KPI_FILL_PRIOR,
  REPORTS_KPI_FILL_YTD,
  REPORTS_PERF_COL_ASSOCIATE_STARTS,
  REPORTS_PERF_COL_CANCEL_RATE,
  REPORTS_PERF_COL_CANCELLATIONS,
  REPORTS_PERF_COL_FILL_RATE,
  REPORTS_PERF_COL_MONTH_END,
  REPORTS_PERF_COL_OPENING,
  REPORTS_PERF_COL_RECRUITER,
  REPORTS_PERF_COL_TEMP,
  REPORTS_PERF_COL_TOTAL,
  REPORTS_PERF_FILTER_MONTH,
  REPORTS_PERF_KPI_TITLE,
  REPORTS_PERF_LOAD_ERROR,
  REPORTS_PERF_SUBTITLE,
  REPORTS_PERF_TITLE,
  REPORTS_RECRUITMENT_PERMANENT,
  REPORTS_RECRUITMENT_TEMP,
  REPORTS_RECRUITMENT_TEMPORARY,
  REPORTS_UPDATE,
} from '../../../core/i18n/reports-i18n-labels';
import { ClientFilterFieldComponent } from '../../../shared/components/client-filter-field/client-filter-field.component';
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { YearStepperFieldComponent } from '../../../shared/components/year-stepper-field/year-stepper-field.component';
import { CatalogBusinessUnit } from '../../../shared/models/catalog-business-unit.model';
import { CatalogCountry } from '../../../shared/models/catalog-geography.model';
import { PositionListItem } from '../../../shared/models/position.model';
import {
  RecruiterPerformanceFilterRequest,
  RecruiterPerformanceResponse,
  RecruiterPerformanceRowResponse,
  ReportKpisResponse,
} from '../../../shared/models/report.model';
import { SecurityRecruiterGroup } from '../../../shared/models/security-recruiter-group.model';
import { SecurityUser } from '../../../shared/models/security-user.model';
import { formatReportCell, formatReportPercent } from '../shared/report-format';
import { armReportTenantReload } from '../shared/report-tenant-reload';

interface SelectOption {
  id: number;
  label: string;
}

const MONTH_OPTIONS = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' },
];

@Component({
  selector: 'sh-recruiter-performance-report',
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
    KpiCardComponent,
    ClientFilterFieldComponent,
    YearStepperFieldComponent,
  ],
  templateUrl: './recruiter-performance-report.component.html',
  styleUrl: './recruiter-performance-report.component.scss',
})
export class RecruiterPerformanceReportComponent implements OnInit {
  private readonly reportsApi = inject(ReportsApiService);
  private readonly geography = inject(CatalogGeographyService);
  private readonly businessUnits = inject(CatalogBusinessUnitService);
  private readonly recruiterGroups = inject(SecurityRecruiterGroupService);
  private readonly positions = inject(PositionService);
  private readonly users = inject(SecurityUserService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly armTenantReload = armReportTenantReload(() => this.reloadForTenant());

  readonly labels = {
    title: REPORTS_PERF_TITLE,
    subtitle: REPORTS_PERF_SUBTITLE,
    update: REPORTS_UPDATE,
    clear: REPORTS_CLEAR_FILTERS,
    indicators: REPORTS_INDICATORS,
    kpiTitle: REPORTS_PERF_KPI_TITLE,
    kpiCurrent: REPORTS_KPI_FILL_CURRENT,
    kpiPrior: REPORTS_KPI_FILL_PRIOR,
    kpiYtd: REPORTS_KPI_FILL_YTD,
    empty: REPORTS_EMPTY_MATRIX,
    colRecruiter: REPORTS_PERF_COL_RECRUITER,
    colOpening: REPORTS_PERF_COL_OPENING,
    colTemp: REPORTS_PERF_COL_TEMP,
    colCancel: REPORTS_PERF_COL_CANCELLATIONS,
    colStarts: REPORTS_PERF_COL_ASSOCIATE_STARTS,
    colMonthEnd: REPORTS_PERF_COL_MONTH_END,
    colFill: REPORTS_PERF_COL_FILL_RATE,
    colCancelRate: REPORTS_PERF_COL_CANCEL_RATE,
    total: REPORTS_PERF_COL_TOTAL,
    filterCountry: REPORTS_FILTER_COUNTRY,
    filterRecruitment: REPORTS_FILTER_RECRUITMENT_TYPE,
    filterBu: REPORTS_FILTER_BUSINESS_UNIT,
    filterGroup: REPORTS_FILTER_GROUP,
    filterYear: REPORTS_FILTER_YEAR,
    filterMonth: REPORTS_PERF_FILTER_MONTH,
    filterOrder: REPORTS_FILTER_ORDER,
    filterRecruiter: REPORTS_FILTER_RECRUITER,
    all: REPORTS_FILTER_ALL,
    allFem: REPORTS_FILTER_ALL_FEM,
    selectCountry: REPORTS_FILTER_SELECT_COUNTRY,
  };

  loading = false;
  loadingCatalogs = true;
  errorMessage = '';

  countries: CatalogCountry[] = [];
  businessUnitOptions: CatalogBusinessUnit[] = [];
  groupOptions: SecurityRecruiterGroup[] = [];
  positionOptions: SelectOption[] = [];
  recruiterOptions: SelectOption[] = [];
  readonly monthOptions = MONTH_OPTIONS;

  readonly recruitmentTypeOptions = [
    { value: 'TEMP', label: REPORTS_RECRUITMENT_TEMP },
    { value: 'TEMPORARY', label: REPORTS_RECRUITMENT_TEMPORARY },
    { value: 'PERMANENT', label: REPORTS_RECRUITMENT_PERMANENT },
  ];

  kpis: ReportKpisResponse = { currentMonth: null, priorMonth: null, ytd: null };
  rows: RecruiterPerformanceRowResponse[] = [];
  total: RecruiterPerformanceRowResponse | null = null;

  readonly filters = this.fb.nonNullable.group({
    countryId: this.fb.control<number | null>(null),
    recruitmentType: this.fb.control<string | null>(null),
    workplaceId: this.fb.control<number | null>(null),
    recruiterGroupId: this.fb.control<number | null>(null),
    year: this.fb.control<number>(new Date().getFullYear(), { validators: [Validators.required] }),
    month: this.fb.control<number>(new Date().getMonth() + 1, { validators: [Validators.required] }),
    positionId: this.fb.control<number | null>(null),
    clientKey: this.fb.control<string>(''),
    assignedUserId: this.fb.control<number | null>(null),
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

  clearFilters(): void {
    this.filters.reset({
      countryId: null,
      recruitmentType: null,
      workplaceId: null,
      recruiterGroupId: null,
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      positionId: null,
      clientKey: '',
      assignedUserId: null,
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
    const v = this.filters.getRawValue();
    const body: RecruiterPerformanceFilterRequest = {
      year: v.year ?? new Date().getFullYear(),
      month: v.month ?? new Date().getMonth() + 1,
      countryId: v.countryId,
      recruitmentType: v.recruitmentType,
      workplaceId: v.workplaceId,
      recruiterGroupId: v.recruiterGroupId,
      positionId: v.positionId,
      clientKey: v.clientKey?.trim() || null,
      assignedUserId: v.assignedUserId,
    };
    this.reportsApi.getRecruiterPerformance(body).subscribe({
      next: (res: RecruiterPerformanceResponse) => {
        this.kpis = res.kpis ?? { currentMonth: null, priorMonth: null, ytd: null };
        this.rows = res.rows ?? [];
        this.total = res.total ?? null;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = REPORTS_PERF_LOAD_ERROR;
        this.rows = [];
        this.total = null;
        this.loading = false;
      },
    });
  }

  formatCell = formatReportCell;
  formatPercent = formatReportPercent;

  formatKpi(value: number | null | undefined): string {
    if (value == null) {
      return '—';
    }
    return `${formatReportPercent(value)}`;
  }

  fillClass(rate: number | null | undefined): string {
    if (rate == null) {
      return '';
    }
    return rate <= 0 ? 'rate-zero' : '';
  }

  private reloadForTenant(): void {
    this.loadIndependentCatalogs();
    this.load();
  }

  private loadIndependentCatalogs(): void {
    this.loadingCatalogs = true;
    forkJoin({
      countries: this.geography.listCountries().pipe(catchError(() => of([] as CatalogCountry[]))),
      positions: this.positions.list(0, 100, {}).pipe(
        catchError(() => of({ items: [] as PositionListItem[], total: 0 })),
      ),
      users: this.users.list(0, 100).pipe(
        catchError(() => of({ items: [] as SecurityUser[], total: 0 })),
      ),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ countries, positions, users }) => {
        this.countries = countries;
        this.positionOptions = positions.items.map((p) => ({
          id: p.id,
          label: [p.ot || p.requisitionNo, p.name].filter(Boolean).join(' — ') || `Orden #${p.id}`,
        }));
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
