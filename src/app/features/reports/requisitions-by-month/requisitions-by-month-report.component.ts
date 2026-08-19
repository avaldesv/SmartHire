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
  REPORTS_INDICATOR_COL,
  REPORTS_INDICATORS,
  REPORTS_KPI_FILL_CURRENT,
  REPORTS_KPI_FILL_PRIOR,
  REPORTS_KPI_FILL_YTD,
  REPORTS_RBM_LOAD_ERROR,
  REPORTS_RBM_SUBTITLE,
  REPORTS_RBM_TITLE,
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
import { ReportFilterRequest, ReportGroupResponse, ReportKpisResponse } from '../../../shared/models/report.model';
import { formatReportCell } from '../shared/report-format';
import { armReportTenantReload } from '../shared/report-tenant-reload';
import { SecurityRecruiterGroup } from '../../../shared/models/security-recruiter-group.model';
import { SecurityUser } from '../../../shared/models/security-user.model';

interface SelectOption {
  id: number;
  label: string;
}

@Component({
  selector: 'sh-requisitions-by-month-report',
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
  templateUrl: './requisitions-by-month-report.component.html',
  styleUrl: './requisitions-by-month-report.component.scss',
})
export class RequisitionsByMonthReportComponent implements OnInit {
  private readonly reportsApi = inject(ReportsApiService);
  private readonly geography = inject(CatalogGeographyService);
  private readonly businessUnits = inject(CatalogBusinessUnitService);
  private readonly recruiterGroups = inject(SecurityRecruiterGroupService);
  private readonly positions = inject(PositionService);
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
  positionOptions: SelectOption[] = [];
  recruiterOptions: SelectOption[] = [];

  /** Static options for recruitmentType (backend uses TEMP / TEMPORARY). */
  readonly recruitmentTypeOptions = [
    { value: 'TEMP', label: REPORTS_RECRUITMENT_TEMP },
    { value: 'TEMPORARY', label: REPORTS_RECRUITMENT_TEMPORARY },
    { value: 'PERMANENT', label: REPORTS_RECRUITMENT_PERMANENT },
  ];

  readonly ui = {
    title: REPORTS_RBM_TITLE,
    subtitle: REPORTS_RBM_SUBTITLE,
    update: REPORTS_UPDATE,
    clearFilters: REPORTS_CLEAR_FILTERS,
    country: REPORTS_FILTER_COUNTRY,
    recruitmentType: REPORTS_FILTER_RECRUITMENT_TYPE,
    businessUnit: REPORTS_FILTER_BUSINESS_UNIT,
    group: REPORTS_FILTER_GROUP,
    year: REPORTS_FILTER_YEAR,
    order: REPORTS_FILTER_ORDER,
    recruiter: REPORTS_FILTER_RECRUITER,
    all: REPORTS_FILTER_ALL,
    allFem: REPORTS_FILTER_ALL_FEM,
    selectCountry: REPORTS_FILTER_SELECT_COUNTRY,
    kpiCurrent: REPORTS_KPI_FILL_CURRENT,
    kpiPrior: REPORTS_KPI_FILL_PRIOR,
    kpiYtd: REPORTS_KPI_FILL_YTD,
    indicators: REPORTS_INDICATORS,
    indicatorCol: REPORTS_INDICATOR_COL,
    empty: REPORTS_EMPTY_MATRIX,
  };

  months = [
    $localize`:@@reports.month.jan:Ene`,
    $localize`:@@reports.month.feb:Feb`,
    $localize`:@@reports.month.mar:Mar`,
    $localize`:@@reports.month.apr:Abr`,
    $localize`:@@reports.month.may:May`,
    $localize`:@@reports.month.jun:Jun`,
    $localize`:@@reports.month.jul:Jul`,
    $localize`:@@reports.month.aug:Ago`,
    $localize`:@@reports.month.sep:Sep`,
    $localize`:@@reports.month.oct:Oct`,
    $localize`:@@reports.month.nov:Nov`,
    $localize`:@@reports.month.dec:Dic`,
  ];

  kpis: ReportKpisResponse = { currentMonth: null, priorMonth: null, ytd: null };
  groups: ReportGroupResponse[] = [];

  readonly filters = this.fb.nonNullable.group({
    countryId: this.fb.control<number | null>(null),
    recruitmentType: this.fb.control<string | null>(null),
    workplaceId: this.fb.control<number | null>(null),
    recruiterGroupId: this.fb.control<number | null>(null),
    year: this.fb.control<number>(new Date().getFullYear(), {
      validators: [Validators.required, Validators.min(2000), Validators.max(2100)],
    }),
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
    if (this.filters.controls.year.invalid) {
      this.filters.controls.year.markAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    const body = this.buildRequest();

    this.reportsApi
      .getRequisitionsByMonth(body)
      .pipe(
        catchError(() => {
          this.errorMessage = REPORTS_RBM_LOAD_ERROR;
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data) => {
        if (data) {
          this.kpis = data.kpis ?? { currentMonth: null, priorMonth: null, ytd: null };
          this.groups = data.groups ?? [];
        } else {
          this.kpis = { currentMonth: null, priorMonth: null, ytd: null };
          this.groups = [];
        }
        this.loading = false;
      });
  }

  formatKpi(value: number | null | undefined): string {
    if (value == null || Number.isNaN(value)) {
      return '';
    }
    return `${value.toFixed(1)}%`;
  }

  formatCell(value: number | null | undefined): string {
    return formatReportCell(value);
  }

  private reloadForTenant(): void {
    this.loadIndependentCatalogs();
    this.load();
  }

  private buildRequest(): ReportFilterRequest {
    const v = this.filters.getRawValue();
    const clientKey = v.clientKey?.trim() || null;
    return {
      countryId: v.countryId,
      recruitmentType: v.recruitmentType || null,
      requisitionTypeId: null,
      workplaceId: v.workplaceId,
      recruiterGroupId: v.recruiterGroupId,
      year: Number(v.year),
      positionId: v.positionId,
      clientKey,
      assignedUserId: v.assignedUserId,
    };
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
