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
import { CatalogBusinessUnit } from '../../../shared/models/catalog-business-unit.model';
import { CatalogCountry } from '../../../shared/models/catalog-geography.model';
import { PositionListItem } from '../../../shared/models/position.model';
import {
  ProcessFunnelBrandResponse,
  ProcessFunnelFilterRequest,
  ProcessFunnelRowResponse,
  ProcessFunnelStageCounts,
} from '../../../shared/models/report.model';
import { SecurityRecruiterGroup } from '../../../shared/models/security-recruiter-group.model';
import { SecurityUser } from '../../../shared/models/security-user.model';
import { formatReportCell } from '../shared/report-format';
import { armReportTenantReload } from '../shared/report-tenant-reload';

interface SelectOption {
  id: number;
  label: string;
}

interface StageBar {
  key: keyof ProcessFunnelStageCounts;
  label: string;
  color: string;
  value: number;
}

const STAGE_META: Array<{ key: keyof ProcessFunnelStageCounts; label: string; color: string }> = [
  { key: 'applicants', label: 'Postulados', color: '#2563eb' },
  { key: 'selected', label: 'Seleccionados', color: '#16a34a' },
  { key: 'interviewed', label: 'Entrevistados', color: '#eab308' },
  { key: 'evaluated', label: 'Evaluados', color: '#ea580c' },
  { key: 'prehired', label: 'Precontratados', color: '#a78bfa' },
  { key: 'hired', label: 'Contratados', color: '#dc2626' },
];

@Component({
  selector: 'sh-process-funnel-report',
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
  templateUrl: './process-funnel-report.component.html',
  styleUrl: './process-funnel-report.component.scss',
})
export class ProcessFunnelReportComponent implements OnInit {
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

  rows: ProcessFunnelRowResponse[] = [];
  totalByStage: ProcessFunnelStageCounts = emptyStages();
  /** All catalog brands in the active tenant result (no UI selector). */
  byBrand: ProcessFunnelBrandResponse[] = [];

  readonly stageMeta = STAGE_META;

  readonly recruitmentTypeOptions = [
    { value: 'TEMP', label: 'Temporal (TEMP)' },
    { value: 'TEMPORARY', label: 'Temporal (TEMPORARY)' },
    { value: 'PERMANENT', label: 'Permanente' },
  ];

  readonly statusOptions = [
    { value: 'COVERED', label: 'Cubierta' },
    { value: 'PARTIALLY_COVERED', label: 'Parcialmente cubierta' },
    { value: 'IN_ANALYSIS', label: 'En análisis' },
    { value: 'IN_SELECTION', label: 'En selección' },
    { value: 'CANCELLED', label: 'Cancelada' },
    { value: 'CANCELLATION_REQUESTED', label: 'Cancelación solicitada' },
    { value: 'IN_PROCESS', label: 'En proceso' },
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

  get totalBars(): StageBar[] {
    return this.toBars(this.totalByStage);
  }

  get totalMax(): number {
    return Math.max(1, ...this.totalBars.map((b) => b.value));
  }

  get brandChartMax(): number {
    let max = 1;
    for (const brand of this.byBrand) {
      for (const meta of STAGE_META) {
        max = Math.max(max, brand[meta.key] ?? 0);
      }
    }
    return max;
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
      .getProcessFunnel(body)
      .pipe(
        catchError(() => {
          this.errorMessage = 'No se pudo cargar el reporte Funnel del proceso. Intenta de nuevo.';
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data) => {
        this.rows = data?.rows ?? [];
        this.totalByStage = data?.totalByStage ?? emptyStages();
        this.byBrand = data?.byBrand ?? [];
        this.loading = false;
      });
  }

  formatCell(value: number | null | undefined): string {
    return formatReportCell(value);
  }

  barWidth(value: number, max: number): string {
    return `${Math.max(0, Math.min(100, (value / max) * 100))}%`;
  }

  stageValue(brand: ProcessFunnelBrandResponse, key: keyof ProcessFunnelStageCounts): number {
    return brand[key] ?? 0;
  }

  private reloadForTenant(): void {
    this.loadIndependentCatalogs();
    this.load();
  }

  private toBars(counts: ProcessFunnelStageCounts): StageBar[] {
    return STAGE_META.map((m) => ({
      ...m,
      value: counts[m.key] ?? 0,
    }));
  }

  private buildRequest(): ProcessFunnelFilterRequest {
    const v = this.filters.getRawValue();
    const clientKey = v.clientKey?.trim() || null;
    return {
      startDate: v.startDate || null,
      endDate: v.endDate || null,
      countryId: v.countryId,
      brandId: null,
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

function emptyStages(): ProcessFunnelStageCounts {
  return {
    applicants: 0,
    selected: 0,
    interviewed: 0,
    evaluated: 0,
    prehired: 0,
    hired: 0,
  };
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
