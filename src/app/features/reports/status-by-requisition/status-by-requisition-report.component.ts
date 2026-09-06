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
  REPORTS_FILTER_ALL,
  REPORTS_FILTER_ALL_FEM,
  REPORTS_FILTER_BUSINESS_UNIT_SHORT,
  REPORTS_FILTER_COUNTRY,
  REPORTS_FILTER_END_DATE,
  REPORTS_FILTER_GROUP,
  REPORTS_FILTER_RECRUITER,
  REPORTS_FILTER_RECRUITMENT_TYPE,
  REPORTS_FILTER_REQUISITION,
  REPORTS_FILTER_SELECT_COUNTRY,
  REPORTS_FILTER_START_DATE,
  REPORTS_FILTER_STATUS,
  REPORTS_RECRUITMENT_PERMANENT,
  REPORTS_RECRUITMENT_TEMP,
  REPORTS_RECRUITMENT_TEMPORARY,
  REPORTS_SBR_CHART_TITLE,
  REPORTS_SBR_COL_APPLICANTS,
  REPORTS_SBR_COL_COMPLIANCE,
  REPORTS_SBR_COL_DIGITAL_DOCS,
  REPORTS_SBR_COL_EVALUATED,
  REPORTS_SBR_COL_HIRED,
  REPORTS_SBR_COL_INTERVIEWED,
  REPORTS_SBR_COL_POSITIONS,
  REPORTS_SBR_COL_PREHIRED,
  REPORTS_SBR_COL_PRESELECTED,
  REPORTS_SBR_COL_REQUISITIONS,
  REPORTS_SBR_COL_SELECTED,
  REPORTS_SBR_COL_STATUS,
  REPORTS_SBR_COL_UNCOVERED,
  REPORTS_SBR_EMPTY,
  REPORTS_SBR_LOAD_ERROR,
  REPORTS_SBR_STATUS_CANCELLED,
  REPORTS_SBR_STATUS_CANCELLATION_REQUESTED,
  REPORTS_SBR_STATUS_COVERED,
  REPORTS_SBR_STATUS_IN_ANALYSIS,
  REPORTS_SBR_STATUS_IN_PROCESS,
  REPORTS_SBR_STATUS_IN_SELECTION,
  REPORTS_SBR_STATUS_PARTIALLY_COVERED,
  REPORTS_SBR_SUBTITLE,
  REPORTS_SBR_TITLE,
  REPORTS_UPDATE,
  reportsOrderNumber,
  reportsSbrStatusLabel,
} from '../../../core/i18n/reports-i18n-labels';
import { CatalogBusinessUnit } from '../../../shared/models/catalog-business-unit.model';
import { CatalogCountry } from '../../../shared/models/catalog-geography.model';
import { PositionListItem } from '../../../shared/models/position.model';
import {
  StatusByRequisitionFilterRequest,
  StatusByRequisitionRowResponse,
} from '../../../shared/models/report.model';
import { SecurityRecruiterGroup } from '../../../shared/models/security-recruiter-group.model';
import { SecurityUser } from '../../../shared/models/security-user.model';
import { formatReportCell, formatReportPercent } from '../shared/report-format';
import { armReportTenantReload } from '../shared/report-tenant-reload';

interface SelectOption {
  id: number;
  label: string;
}

@Component({
  selector: 'sh-status-by-requisition-report',
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
  templateUrl: './status-by-requisition-report.component.html',
  styleUrl: './status-by-requisition-report.component.scss',
})
export class StatusByRequisitionReportComponent implements OnInit {
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
    title: REPORTS_SBR_TITLE,
    subtitle: REPORTS_SBR_SUBTITLE,
    update: REPORTS_UPDATE,
    clearFilters: REPORTS_CLEAR_FILTERS,
    startDate: REPORTS_FILTER_START_DATE,
    endDate: REPORTS_FILTER_END_DATE,
    country: REPORTS_FILTER_COUNTRY,
    requisition: REPORTS_FILTER_REQUISITION,
    status: REPORTS_FILTER_STATUS,
    recruiter: REPORTS_FILTER_RECRUITER,
    group: REPORTS_FILTER_GROUP,
    businessUnit: REPORTS_FILTER_BUSINESS_UNIT_SHORT,
    recruitmentType: REPORTS_FILTER_RECRUITMENT_TYPE,
    all: REPORTS_FILTER_ALL,
    allFem: REPORTS_FILTER_ALL_FEM,
    selectCountry: REPORTS_FILTER_SELECT_COUNTRY,
    chartTitle: REPORTS_SBR_CHART_TITLE,
    empty: REPORTS_SBR_EMPTY,
    colStatus: REPORTS_SBR_COL_STATUS,
    colRequisitions: REPORTS_SBR_COL_REQUISITIONS,
    colPositions: REPORTS_SBR_COL_POSITIONS,
    colApplicants: REPORTS_SBR_COL_APPLICANTS,
    colPreselected: REPORTS_SBR_COL_PRESELECTED,
    colSelected: REPORTS_SBR_COL_SELECTED,
    colEvaluated: REPORTS_SBR_COL_EVALUATED,
    colInterviewed: REPORTS_SBR_COL_INTERVIEWED,
    colPrehired: REPORTS_SBR_COL_PREHIRED,
    colHired: REPORTS_SBR_COL_HIRED,
    colUncovered: REPORTS_SBR_COL_UNCOVERED,
    colCompliance: REPORTS_SBR_COL_COMPLIANCE,
    colDigitalDocs: REPORTS_SBR_COL_DIGITAL_DOCS,
  };

  loading = false;
  loadingCatalogs = true;
  errorMessage = '';

  countries: CatalogCountry[] = [];
  businessUnitOptions: CatalogBusinessUnit[] = [];
  groupOptions: SecurityRecruiterGroup[] = [];
  positionOptions: SelectOption[] = [];
  recruiterOptions: SelectOption[] = [];
  rows: StatusByRequisitionRowResponse[] = [];

  readonly recruitmentTypeOptions = [
    { value: 'TEMP', label: REPORTS_RECRUITMENT_TEMP },
    { value: 'TEMPORARY', label: REPORTS_RECRUITMENT_TEMPORARY },
    { value: 'PERMANENT', label: REPORTS_RECRUITMENT_PERMANENT },
  ];

  readonly statusOptions = [
    { value: 'COVERED', label: REPORTS_SBR_STATUS_COVERED },
    { value: 'PARTIALLY_COVERED', label: REPORTS_SBR_STATUS_PARTIALLY_COVERED },
    { value: 'IN_ANALYSIS', label: REPORTS_SBR_STATUS_IN_ANALYSIS },
    { value: 'IN_SELECTION', label: REPORTS_SBR_STATUS_IN_SELECTION },
    { value: 'CANCELLED', label: REPORTS_SBR_STATUS_CANCELLED },
    { value: 'CANCELLATION_REQUESTED', label: REPORTS_SBR_STATUS_CANCELLATION_REQUESTED },
    { value: 'IN_PROCESS', label: REPORTS_SBR_STATUS_IN_PROCESS },
  ];

  readonly filters = this.fb.nonNullable.group({
    startDate: this.fb.control<string>(currentMonthStart()),
    endDate: this.fb.control<string>(currentMonthEnd()),
    countryId: this.fb.control<number | null>(null),
    positionId: this.fb.control<number | null>(null),
    status: this.fb.control<string | null>(null),
    assignedUserId: this.fb.control<number | null>(null),
    clientKey: this.fb.control<string>(''),
    recruiterGroupId: this.fb.control<number | null>(null),
    workplaceId: this.fb.control<number | null>(null),
    recruitmentType: this.fb.control<string | null>(null),
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
      startDate: currentMonthStart(),
      endDate: currentMonthEnd(),
      countryId: null,
      positionId: null,
      status: null,
      assignedUserId: null,
      clientKey: '',
      recruiterGroupId: null,
      workplaceId: null,
      recruitmentType: null,
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
    const body = this.buildRequest();

    this.reportsApi
      .getStatusByRequisition(body)
      .pipe(
        catchError(() => {
          this.errorMessage = REPORTS_SBR_LOAD_ERROR;
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data) => {
        this.rows = data?.rows ?? [];
        this.loading = false;
      });
  }

  formatCell(value: number | null | undefined): string {
    return formatReportCell(value);
  }

  formatPercent(value: number | null | undefined): string {
    return formatReportPercent(value);
  }

  get chartMax(): number {
    const totals = this.rows.map((r) => r.requisitions ?? 0);
    return Math.max(1, ...totals);
  }

  barWidth(value: number | null | undefined): string {
    if (value == null) {
      return '0%';
    }
    return `${Math.max(0, Math.min(100, (value / this.chartMax) * 100))}%`;
  }

  statusLabel(row: StatusByRequisitionRowResponse): string {
    return reportsSbrStatusLabel(row.statusCode, row.status);
  }

  private reloadForTenant(): void {
    this.loadIndependentCatalogs();
    this.load();
  }

  private buildRequest(): StatusByRequisitionFilterRequest {
    const v = this.filters.getRawValue();
    const clientKey = v.clientKey?.trim() || null;
    return {
      startDate: v.startDate || null,
      endDate: v.endDate || null,
      countryId: v.countryId,
      positionId: v.positionId,
      status: v.status || null,
      assignedUserId: v.assignedUserId,
      clientKey,
      recruiterGroupId: v.recruiterGroupId,
      workplaceId: v.workplaceId,
      recruitmentType: v.recruitmentType || null,
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

/** First day of current month as `yyyy-MM-dd` (input type=date). */
function currentMonthStart(): string {
  const now = new Date();
  return formatLocalDate(new Date(now.getFullYear(), now.getMonth(), 1));
}

/** Last day of current month as `yyyy-MM-dd` (input type=date). */
function currentMonthEnd(): string {
  const now = new Date();
  return formatLocalDate(new Date(now.getFullYear(), now.getMonth() + 1, 0));
}

function formatLocalDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
