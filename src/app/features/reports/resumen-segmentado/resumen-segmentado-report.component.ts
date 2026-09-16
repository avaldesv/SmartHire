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
import { PositionService } from '../../../core/services/position.service';
import { ReportsApiService } from '../../../core/services/reports-api.service';
import { SecurityRecruiterGroupService } from '../../../core/services/security-recruiter-group.service';
import { SecurityUserService } from '../../../core/services/security-user.service';
import { ClientFilterFieldComponent } from '../../../shared/components/client-filter-field/client-filter-field.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import {
  REPORTS_CLEAR_FILTERS,
  REPORTS_CONS_CHART_STATUS,
  REPORTS_CONS_STATUS_CREATED,
  REPORTS_DIM_NONE,
  REPORTS_FILTER_ALL,
  REPORTS_FILTER_ALL_FEM,
  REPORTS_FILTER_BUSINESS_UNIT_SHORT,
  REPORTS_FILTER_CLIENT,
  REPORTS_FILTER_COUNTRY,
  REPORTS_FILTER_DIMENSION,
  REPORTS_FILTER_END_DAY,
  REPORTS_FILTER_GROUP,
  REPORTS_FILTER_ORDER,
  REPORTS_FILTER_RECRUITER,
  REPORTS_FILTER_RECRUITMENT_TYPE,
  REPORTS_FILTER_SELECT_COUNTRY,
  REPORTS_FILTER_START_DAY,
  REPORTS_FILTER_STATUS,
  REPORTS_FILTER_YEAR,
  REPORTS_PERF_COL_TOTAL,
  REPORTS_PERF_FILTER_MONTH,
  REPORTS_RECRUITMENT_PERMANENT,
  REPORTS_RECRUITMENT_TEMP,
  REPORTS_RECRUITMENT_TEMPORARY,
  REPORTS_SBR_EMPTY,
  REPORTS_SBR_STATUS_CANCELLED,
  REPORTS_SBR_STATUS_COVERED,
  REPORTS_SEG_COL_GROUP_RECRUITER,
  REPORTS_SEG_LOAD_ERROR,
  REPORTS_SEG_SECTION_DAILY,
  REPORTS_SEG_SUBTITLE,
  REPORTS_SEG_TITLE,
  REPORTS_UPDATE,
  reportsConsStatusLabel,
  reportsMonthFullOptions,
  reportsOrderNumber,
} from '../../../core/i18n/reports-i18n-labels';
import { CatalogBusinessUnit } from '../../../shared/models/catalog-business-unit.model';
import { CatalogCountry } from '../../../shared/models/catalog-geography.model';
import { PositionListItem } from '../../../shared/models/position.model';
import {
  ConsolidadoDimensionRowResponse,
  ConsolidadoFilterRequest,
  ConsolidadoStatusRowResponse,
} from '../../../shared/models/report.model';
import { SecurityRecruiterGroup } from '../../../shared/models/security-recruiter-group.model';
import { SecurityUser } from '../../../shared/models/security-user.model';
import { formatReportCell } from '../shared/report-format';
import { armReportTenantReload } from '../shared/report-tenant-reload';

interface SelectOption {
  id: number;
  label: string;
}

@Component({
  selector: 'sh-resumen-segmentado-report',
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
  templateUrl: './resumen-segmentado-report.component.html',
  styleUrl: './resumen-segmentado-report.component.scss',
})
export class ResumenSegmentadoReportComponent implements OnInit {
  private readonly reportsApi = inject(ReportsApiService);
  private readonly geography = inject(CatalogGeographyService);
  private readonly businessUnits = inject(CatalogBusinessUnitService);
  private readonly recruiterGroups = inject(SecurityRecruiterGroupService);
  private readonly positions = inject(PositionService);
  private readonly users = inject(SecurityUserService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly armTenantReload = armReportTenantReload(() => this.reloadForTenant());
  readonly ui = {
    title: REPORTS_SEG_TITLE,
    subtitle: REPORTS_SEG_SUBTITLE,
    update: REPORTS_UPDATE,
    clearFilters: REPORTS_CLEAR_FILTERS,
    country: REPORTS_FILTER_COUNTRY,
    recruitmentType: REPORTS_FILTER_RECRUITMENT_TYPE,
    businessUnit: REPORTS_FILTER_BUSINESS_UNIT_SHORT,
    group: REPORTS_FILTER_GROUP,
    recruiter: REPORTS_FILTER_RECRUITER,
    year: REPORTS_FILTER_YEAR,
    month: REPORTS_PERF_FILTER_MONTH,
    startDay: REPORTS_FILTER_START_DAY,
    endDay: REPORTS_FILTER_END_DAY,
    status: REPORTS_FILTER_STATUS,
    order: REPORTS_FILTER_ORDER,
    dimension: REPORTS_FILTER_DIMENSION,
    all: REPORTS_FILTER_ALL,
    allFem: REPORTS_FILTER_ALL_FEM,
    selectCountry: REPORTS_FILTER_SELECT_COUNTRY,
    chartStatus: REPORTS_CONS_CHART_STATUS,
    sectionDaily: REPORTS_SEG_SECTION_DAILY,
    total: REPORTS_PERF_COL_TOTAL,
    empty: REPORTS_SBR_EMPTY,
  };

  loading = false;
  loadingCatalogs = true;
  errorMessage = '';

  countries: CatalogCountry[] = [];
  businessUnitOptions: CatalogBusinessUnit[] = [];
  groupOptions: SecurityRecruiterGroup[] = [];
  positionOptions: SelectOption[] = [];
  recruiterOptions: SelectOption[] = [];
  dayOptions: number[] = [];
  yearOptions: number[] = [];

  readonly monthOptions = reportsMonthFullOptions();
  readonly dimensionOptions = [
    { value: 'NONE', label: REPORTS_DIM_NONE },
    { value: 'GROUP', label: REPORTS_FILTER_GROUP },
    { value: 'CLIENT', label: REPORTS_FILTER_CLIENT },
    { value: 'RECRUITER', label: REPORTS_FILTER_RECRUITER },
  ];

  readonly recruitmentTypeOptions = [
    { value: 'TEMP', label: REPORTS_RECRUITMENT_TEMP },
    { value: 'TEMPORARY', label: REPORTS_RECRUITMENT_TEMPORARY },
    { value: 'PERMANENT', label: REPORTS_RECRUITMENT_PERMANENT },
  ];

  readonly statusOptions = [
    { value: 'CREATED', label: REPORTS_CONS_STATUS_CREATED },
    { value: 'CANCELLED', label: REPORTS_SBR_STATUS_CANCELLED },
    { value: 'COVERED', label: REPORTS_SBR_STATUS_COVERED },
  ];

  statusTotals: ConsolidadoStatusRowResponse[] = [];
  dimensionRows: ConsolidadoDimensionRowResponse[] = [];

  readonly filters = this.fb.nonNullable.group({
    countryId: this.fb.control<number | null>(null),
    recruitmentType: this.fb.control<string | null>(null),
    workplaceId: this.fb.control<number | null>(null),
    recruiterGroupId: this.fb.control<number | null>(null),
    assignedUserId: this.fb.control<number | null>(null),
    year: this.fb.control<number>(currentYear()),
    month: this.fb.control<number>(currentMonth()),
    startDay: this.fb.control<number>(1),
    endDay: this.fb.control<number>(daysInMonth(currentYear(), currentMonth())),
    statusCode: this.fb.control<string | null>(null),
    positionId: this.fb.control<number | null>(null),
    clientKey: this.fb.control<string>(''),
    dimension: this.fb.control<string>('GROUP'),
  });

  ngOnInit(): void {
    const now = new Date();
    const y = now.getFullYear();
    this.yearOptions = [y - 1, y, y + 1];
    this.refreshDayOptions();

    this.filters.controls.workplaceId.disable({ emitEvent: false });
    this.filters.controls.recruiterGroupId.disable({ emitEvent: false });

    this.loadIndependentCatalogs();
    this.filters.controls.countryId.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((countryId) => this.onCountryChange(countryId));
    this.filters.controls.year.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.onYearMonthChange());
    this.filters.controls.month.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.onYearMonthChange());

    this.load();
    this.armTenantReload();
  }

  get chartMax(): number {
    const totals = this.statusTotals
      .filter((r) => r.defined && r.total != null)
      .map((r) => r.total as number);
    return Math.max(1, ...totals);
  }

  get dimensionColumnLabel(): string {
    const dim = this.filters.controls.dimension.value;
    if (dim === 'CLIENT') {
      return REPORTS_FILTER_CLIENT;
    }
    if (dim === 'RECRUITER') {
      return REPORTS_FILTER_RECRUITER;
    }
    if (dim === 'GROUP') {
      return REPORTS_FILTER_GROUP;
    }
    return REPORTS_SEG_COL_GROUP_RECRUITER;
  }

  clearFilters(): void {
    const y = currentYear();
    const m = currentMonth();
    this.filters.reset({
      countryId: null,
      recruitmentType: null,
      workplaceId: null,
      recruiterGroupId: null,
      assignedUserId: null,
      year: y,
      month: m,
      startDay: 1,
      endDay: daysInMonth(y, m),
      statusCode: null,
      positionId: null,
      clientKey: '',
      dimension: 'GROUP',
    });
    this.filters.controls.workplaceId.disable({ emitEvent: false });
    this.filters.controls.recruiterGroupId.disable({ emitEvent: false });
    this.businessUnitOptions = [];
    this.groupOptions = [];
    this.refreshDayOptions();
    this.load();
  }

  load(): void {
    this.loading = true;
    this.errorMessage = '';
    this.reportsApi
      .getConsolidado(this.buildRequest())
      .pipe(
        catchError(() => {
          this.errorMessage = REPORTS_SEG_LOAD_ERROR;
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data) => {
        this.statusTotals = data?.statusTotals ?? [];
        this.dimensionRows = data?.dimensionRows ?? [];
        this.loading = false;
      });
  }

  formatCell(value: number | null | undefined, defined = true): string {
    return formatReportCell(value, defined);
  }

  formatKpi(value: number | null | undefined): string {
    return formatReportCell(value);
  }

  statusLabel(row: ConsolidadoStatusRowResponse): string {
    return reportsConsStatusLabel(row.statusCode, row.status);
  }

  barWidth(value: number | null | undefined): string {
    if (value == null) {
      return '0%';
    }
    return `${Math.max(0, Math.min(100, (value / this.chartMax) * 100))}%`;
  }

  private reloadForTenant(): void {
    this.loadIndependentCatalogs();
    this.load();
  }

  private buildRequest(): ConsolidadoFilterRequest {
    const v = this.filters.getRawValue();
    return {
      countryId: v.countryId,
      recruitmentType: v.recruitmentType || null,
      workplaceId: v.workplaceId,
      recruiterGroupId: v.recruiterGroupId,
      assignedUserId: v.assignedUserId,
      year: v.year,
      month: v.month,
      startDay: v.startDay,
      endDay: v.endDay,
      positionId: v.positionId,
      clientKey: v.clientKey?.trim() || null,
      dimension: v.dimension || 'GROUP',
      statusCode: v.statusCode || null,
    };
  }

  private onYearMonthChange(): void {
    this.refreshDayOptions();
    const last = this.dayOptions[this.dayOptions.length - 1] ?? 31;
    const endDay = this.filters.controls.endDay.value ?? last;
    const startDay = this.filters.controls.startDay.value ?? 1;
    if (endDay > last) {
      this.filters.controls.endDay.setValue(last, { emitEvent: false });
    }
    if (startDay > last) {
      this.filters.controls.startDay.setValue(1, { emitEvent: false });
    }
  }

  private refreshDayOptions(): void {
    const y = this.filters.controls.year.value ?? new Date().getFullYear();
    const m = this.filters.controls.month.value ?? new Date().getMonth() + 1;
    const last = daysInMonth(y, m);
    this.dayOptions = Array.from({ length: last }, (_, i) => i + 1);
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
          label: [p.ot || p.requisitionNo, p.name].filter(Boolean).join(' — ') || reportsOrderNumber(p.id),
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

function currentYear(): number {
  return new Date().getFullYear();
}

function currentMonth(): number {
  return new Date().getMonth() + 1;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}
