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
import { ClientFilterFieldComponent } from '../../../shared/components/client-filter-field/client-filter-field.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { REPORTS_CLEAR_FILTERS, REPORTS_UPDATE } from '../../../core/i18n/reports-i18n-labels';
import { CatalogBusinessUnit } from '../../../shared/models/catalog-business-unit.model';
import { CatalogCountry } from '../../../shared/models/catalog-geography.model';
import { ComportamientoFilterRequest } from '../../../shared/models/report.model';
import { PositionListItem } from '../../../shared/models/position.model';
import { formatReportCell, formatReportPercent } from '../shared/report-format';
import { armReportTenantReload } from '../shared/report-tenant-reload';

export interface ComportamientoFillRate {
  positionsPct: number | null;
  hiredPct: number | null;
  uncoveredPct: number | null;
}

export interface ComportamientoRow {
  requisitionLabel: string;
  createDate: string | null;
  commitmentDate: string | null;
  coverageDate: string | null;
  daysCreateToCoverage: number | null;
  daysCoverageToCommitment: number | null;
  positionsCount: number | null;
  applicants: number | null;
  preselected: number | null;
  selected: number | null;
  evaluated: number | null;
  interviewed: number | null;
  prehired: number | null;
  hired: number | null;
}

interface SelectOption {
  id: number;
  label: string;
}

@Component({
  selector: 'sh-comportamiento-report',
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
  templateUrl: './comportamiento-report.component.html',
  styleUrl: './comportamiento-report.component.scss',
})
export class ComportamientoReportComponent implements OnInit {
  private readonly geography = inject(CatalogGeographyService);
  private readonly businessUnits = inject(CatalogBusinessUnitService);
  private readonly positions = inject(PositionService);
  private readonly reportsApi = inject(ReportsApiService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly armTenantReload = armReportTenantReload(() => this.reloadForTenant());
  readonly updateLabel = REPORTS_UPDATE;
  readonly clearFiltersLabel = REPORTS_CLEAR_FILTERS;

  loading = false;
  loadingCatalogs = true;
  errorMessage = '';

  countries: CatalogCountry[] = [];
  businessUnitOptions: CatalogBusinessUnit[] = [];
  positionOptions: SelectOption[] = [];

  fillRate: ComportamientoFillRate = { positionsPct: 0, hiredPct: 0, uncoveredPct: 0 };
  stageValues: number[] = [0, 0, 0, 0, 0, 0, 0];
  rows: ComportamientoRow[] = [];

  readonly stageLabels = [
    'Postulados',
    'Preseleccionados',
    'Seleccionados',
    'Evaluados',
    'Entrevistados',
    'Precontratados',
    'Contratados',
  ];

  /** Q6-A: universo fijo COVERED — selector informativo. */
  readonly statusOptions = [{ value: 'COVERED', label: 'Cubierta' }];

  readonly filters = this.fb.nonNullable.group({
    startDate: this.fb.control<string>(todayIso()),
    endDate: this.fb.control<string>(todayIso()),
    countryId: this.fb.control<number | null>(null),
    status: this.fb.control<string | null>('COVERED'),
    clientKey: this.fb.control<string>(''),
    positionId: this.fb.control<number | null>(null),
    workplaceId: this.fb.control<number | null>(null),
  });

  ngOnInit(): void {
    this.filters.controls.workplaceId.disable({ emitEvent: false });
    this.filters.controls.status.disable({ emitEvent: false });
    this.loadIndependentCatalogs();
    this.filters.controls.countryId.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((countryId) => this.onCountryChange(countryId));
    this.load();
    this.armTenantReload();
  }

  get chartMax(): number {
    const vals = [this.fillRate.positionsPct, this.fillRate.hiredPct, this.fillRate.uncoveredPct]
      .filter((v): v is number => v != null);
    return Math.max(1, ...vals, 100);
  }

  get stageChartMax(): number {
    return Math.max(1, ...this.stageValues);
  }

  get hasStageData(): boolean {
    return this.stageValues.some((v) => v > 0);
  }

  clearFilters(): void {
    this.filters.reset({
      startDate: todayIso(),
      endDate: todayIso(),
      countryId: null,
      status: 'COVERED',
      clientKey: '',
      positionId: null,
      workplaceId: null,
    });
    this.filters.controls.workplaceId.disable({ emitEvent: false });
    this.filters.controls.status.disable({ emitEvent: false });
    this.businessUnitOptions = [];
    this.load();
  }

  load(): void {
    this.loading = true;
    this.errorMessage = '';
    this.reportsApi
      .getComportamiento(this.buildRequest())
      .pipe(
        catchError(() => {
          this.errorMessage = 'No se pudo cargar el reporte Comportamiento. Intenta de nuevo.';
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data) => {
        this.fillRate = data?.fillRate ?? { positionsPct: 0, hiredPct: 0, uncoveredPct: 0 };
        const s = data?.stageTotals;
        this.stageValues = s
          ? [s.applicants, s.preselected, s.selected, s.evaluated, s.interviewed, s.prehired, s.hired]
          : [0, 0, 0, 0, 0, 0, 0];
        this.rows = (data?.rows ?? []).map((r) => ({
          requisitionLabel: r.requisitionLabel,
          createDate: r.createDate,
          commitmentDate: r.commitmentDate,
          coverageDate: r.coverageDate,
          daysCreateToCoverage: r.daysCreateToCoverage,
          daysCoverageToCommitment: r.daysCoverageToCommitment,
          positionsCount: r.positionsCount,
          applicants: r.applicants,
          preselected: r.preselected,
          selected: r.selected,
          evaluated: r.evaluated,
          interviewed: r.interviewed,
          prehired: r.prehired,
          hired: r.hired,
        }));
        this.loading = false;
      });
  }

  formatCell(value: number | null | undefined): string {
    return formatReportCell(value);
  }

  formatPercent(value: number | null | undefined): string {
    return formatReportPercent(value);
  }

  barWidth(value: number | null | undefined): string {
    if (value == null) {
      return '0%';
    }
    return `${Math.max(0, Math.min(100, (value / this.chartMax) * 100))}%`;
  }

  stageBarHeight(value: number): string {
    if (value <= 0) {
      return '0%';
    }
    return `${Math.max(4, Math.min(100, (value / this.stageChartMax) * 100))}%`;
  }

  private buildRequest(): ComportamientoFilterRequest {
    const v = this.filters.getRawValue();
    return {
      startDate: v.startDate || null,
      endDate: v.endDate || null,
      countryId: v.countryId,
      status: 'COVERED',
      clientKey: v.clientKey?.trim() || null,
      positionId: v.positionId,
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
      positions: this.positions.list(0, 100, {}).pipe(
        catchError(() => of({ items: [] as PositionListItem[], total: 0 })),
      ),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ countries, positions }) => {
        this.countries = countries;
        this.positionOptions = positions.items.map((p) => ({
          id: p.id,
          label: [p.ot || p.requisitionNo, p.name].filter(Boolean).join(' — ') || `Orden #${p.id}`,
        }));
        this.loadingCatalogs = false;
      });
  }

  private onCountryChange(countryId: number | null): void {
    this.filters.controls.workplaceId.setValue(null, { emitEvent: false });
    this.businessUnitOptions = [];
    if (countryId == null) {
      this.filters.controls.workplaceId.disable({ emitEvent: false });
      return;
    }
    this.filters.controls.workplaceId.enable({ emitEvent: false });
    this.businessUnits
      .list(countryId, 0, 200)
      .pipe(
        catchError(() => of({ items: [] as CatalogBusinessUnit[], total: 0 })),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((res) => {
        this.businessUnitOptions = res.items;
      });
  }
}

function todayIso(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}
