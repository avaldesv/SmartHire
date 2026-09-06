import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { catchError, of } from 'rxjs';
import { CatalogGeographyService } from '../../../core/services/catalog-geography.service';
import { ReportsApiService } from '../../../core/services/reports-api.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import {
  REPORTS_CLEAR_FILTERS,
  REPORTS_FILTER_ALL,
  REPORTS_FILTER_CLIENT,
  REPORTS_FILTER_COUNTRY,
  REPORTS_PERF_COL_TOTAL,
  REPORTS_RIP_ARIA_PIE,
  REPORTS_RIP_ARIA_YEAR_BARS,
  REPORTS_RIP_CHART_BY_YEAR,
  REPORTS_RIP_CHART_ON_TIME_VS_EXPIRED,
  REPORTS_RIP_CLIENTS,
  REPORTS_RIP_COL_IN_PROCESS,
  REPORTS_RIP_EMPTY_YEAR,
  REPORTS_RIP_EXPIRED,
  REPORTS_RIP_LOAD_ERROR,
  REPORTS_RIP_ON_TIME,
  REPORTS_RIP_SUBTITLE,
  REPORTS_RIP_TITLE,
  REPORTS_SBR_COL_APPLICANTS,
  REPORTS_SBR_COL_HIRED,
  REPORTS_SBR_COL_POSITIONS,
  REPORTS_SBR_COL_REQUISITIONS,
  REPORTS_SBR_COL_UNCOVERED,
  REPORTS_SBR_EMPTY,
  REPORTS_UPDATE,
  reportsPagerRange,
} from '../../../core/i18n/reports-i18n-labels';
import { CatalogCountry } from '../../../shared/models/catalog-geography.model';
import {
  RequisitionsInProcessClientResponse,
  RequisitionsInProcessFilterRequest,
  RequisitionsInProcessYearResponse,
} from '../../../shared/models/report.model';
import { formatReportCell } from '../shared/report-format';
import { armReportTenantReload } from '../shared/report-tenant-reload';

interface YearBarSeries {
  key: keyof Pick<
    RequisitionsInProcessYearResponse,
    'requisitions' | 'positions' | 'applicants' | 'hired' | 'uncovered'
  >;
  label: string;
  color: string;
}

interface YearBarGroup {
  year: number;
  bars: Array<{ key: string; label: string; color: string; value: number; heightPct: number }>;
}

@Component({
  selector: 'sh-requisitions-in-process-report',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    PageHeaderComponent,
  ],
  templateUrl: './requisitions-in-process-report.component.html',
  styleUrl: './requisitions-in-process-report.component.scss',
})
export class RequisitionsInProcessReportComponent implements OnInit {
  private readonly reportsApi = inject(ReportsApiService);
  private readonly geography = inject(CatalogGeographyService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly armTenantReload = armReportTenantReload(() => this.reloadForTenant());
  readonly ui = {
    title: REPORTS_RIP_TITLE,
    subtitle: REPORTS_RIP_SUBTITLE,
    update: REPORTS_UPDATE,
    clearFilters: REPORTS_CLEAR_FILTERS,
    country: REPORTS_FILTER_COUNTRY,
    all: REPORTS_FILTER_ALL,
    chartOnTimeVsExpired: REPORTS_RIP_CHART_ON_TIME_VS_EXPIRED,
    ariaPie: REPORTS_RIP_ARIA_PIE,
    onTime: REPORTS_RIP_ON_TIME,
    expired: REPORTS_RIP_EXPIRED,
    total: REPORTS_PERF_COL_TOTAL,
    chartByYear: REPORTS_RIP_CHART_BY_YEAR,
    emptyYear: REPORTS_RIP_EMPTY_YEAR,
    ariaYearBars: REPORTS_RIP_ARIA_YEAR_BARS,
    clients: REPORTS_RIP_CLIENTS,
    colClient: REPORTS_FILTER_CLIENT,
    colInProcess: REPORTS_RIP_COL_IN_PROCESS,
    empty: REPORTS_SBR_EMPTY,
  };

  loading = false;
  loadingCatalogs = true;
  errorMessage = '';

  countries: CatalogCountry[] = [];
  onTimeCount = 0;
  expiredCount = 0;
  years: RequisitionsInProcessYearResponse[] = [];
  clients: RequisitionsInProcessClientResponse[] = [];

  pageIndex = 0;
  pageSize = 15;
  totalClients = 0;

  readonly yearSeries: YearBarSeries[] = [
    { key: 'requisitions', label: REPORTS_SBR_COL_REQUISITIONS, color: '#2563eb' },
    { key: 'positions', label: REPORTS_SBR_COL_POSITIONS, color: '#16a34a' },
    { key: 'applicants', label: REPORTS_SBR_COL_APPLICANTS, color: '#eab308' },
    { key: 'hired', label: REPORTS_SBR_COL_HIRED, color: '#ea580c' },
    { key: 'uncovered', label: REPORTS_SBR_COL_UNCOVERED, color: '#7c3aed' },
  ];

  readonly filters = this.fb.nonNullable.group({
    countryId: this.fb.control<number | null>(null),
  });

  ngOnInit(): void {
    this.loadCountries();
    this.load();
    this.armTenantReload();
  }

  clearFilters(): void {
    this.filters.reset({ countryId: null });
    this.pageIndex = 0;
    this.load();
  }

  load(): void {
    this.loading = true;
    this.errorMessage = '';
    const body = this.buildRequest();

    this.reportsApi
      .getRequisitionsInProcess(body, this.pageIndex, this.pageSize)
      .pipe(
        catchError(() => {
          this.errorMessage = REPORTS_RIP_LOAD_ERROR;
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data) => {
        if (data) {
          this.onTimeCount = data.onTimeCount ?? 0;
          this.expiredCount = data.expiredCount ?? 0;
          this.years = data.years ?? [];
          this.clients = data.clients?.data ?? [];
          this.totalClients = data.clients?.pagination?.total ?? 0;
          this.pageIndex = data.clients?.pagination?.page ?? this.pageIndex;
          this.pageSize = data.clients?.pagination?.pageSize ?? this.pageSize;
        } else {
          this.onTimeCount = 0;
          this.expiredCount = 0;
          this.years = [];
          this.clients = [];
          this.totalClients = 0;
        }
        this.loading = false;
      });
  }

  onPage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.load();
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.load();
  }

  get pieTotal(): number {
    return this.onTimeCount + this.expiredCount;
  }

  get onTimePct(): number {
    const total = this.pieTotal;
    if (total <= 0) {
      return 0;
    }
    return Math.round((this.onTimeCount / total) * 100);
  }

  get expiredPct(): number {
    const total = this.pieTotal;
    if (total <= 0) {
      return 0;
    }
    return Math.round((this.expiredCount / total) * 100);
  }

  /** Circumference for r=54 donut. */
  readonly pieCircumference = 2 * Math.PI * 54;

  get onTimeDash(): string {
    const total = this.pieTotal;
    if (total <= 0) {
      return `0 ${this.pieCircumference}`;
    }
    const len = (this.onTimeCount / total) * this.pieCircumference;
    return `${len} ${this.pieCircumference - len}`;
  }

  get expiredDash(): string {
    const total = this.pieTotal;
    if (total <= 0) {
      return `0 ${this.pieCircumference}`;
    }
    const len = (this.expiredCount / total) * this.pieCircumference;
    return `${len} ${this.pieCircumference - len}`;
  }

  get expiredOffset(): number {
    const total = this.pieTotal;
    if (total <= 0) {
      return 0;
    }
    return -((this.onTimeCount / total) * this.pieCircumference);
  }

  get yearBarGroups(): YearBarGroup[] {
    const max = Math.max(
      1,
      ...this.years.flatMap((y) =>
        this.yearSeries.map((s) => Number(y[s.key] ?? 0)),
      ),
    );

    return this.years.map((y) => ({
      year: y.year,
      bars: this.yearSeries.map((s) => {
        const value = Number(y[s.key] ?? 0);
        return {
          key: s.key,
          label: s.label,
          color: s.color,
          value,
          heightPct: Math.max(0, (value / max) * 100),
        };
      }),
    }));
  }

  get rangeLabel(): string {
    if (this.totalClients <= 0) {
      return reportsPagerRange(0, 0, 0);
    }
    const from = this.pageIndex * this.pageSize + 1;
    const to = Math.min((this.pageIndex + 1) * this.pageSize, this.totalClients);
    return reportsPagerRange(from, to, this.totalClients);
  }

  formatCell(value: number | null | undefined): string {
    return formatReportCell(value);
  }

  private reloadForTenant(): void {
    this.loadCountries();
    this.load();
  }

  private buildRequest(): RequisitionsInProcessFilterRequest {
    return { countryId: this.filters.getRawValue().countryId };
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
}
