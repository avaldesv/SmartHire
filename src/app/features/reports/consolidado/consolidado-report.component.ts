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
  ConsolidadoDimensionRowResponse,
  ConsolidadoFilterRequest,
  ConsolidadoKpisResponse,
  ConsolidadoStatusRowResponse,
} from '../../../shared/models/report.model';
import { SecurityRecruiterGroup } from '../../../shared/models/security-recruiter-group.model';
import { SecurityUser } from '../../../shared/models/security-user.model';

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
  selector: 'sh-consolidado-report',
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
  templateUrl: './consolidado-report.component.html',
  styleUrl: './consolidado-report.component.scss',
})
export class ConsolidadoReportComponent implements OnInit {
  private readonly reportsApi = inject(ReportsApiService);
  private readonly geography = inject(CatalogGeographyService);
  private readonly businessUnits = inject(CatalogBusinessUnitService);
  private readonly recruiterGroups = inject(SecurityRecruiterGroupService);
  private readonly positions = inject(PositionService);
  private readonly users = inject(SecurityUserService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

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

  readonly monthOptions = MONTH_OPTIONS;
  readonly dimensionOptions = [
    { value: 'NONE', label: 'Resumen (sin dimensión)' },
    { value: 'GROUP', label: 'Grupo' },
    { value: 'CLIENT', label: 'Cliente' },
    { value: 'RECRUITER', label: 'Reclutador' },
  ];

  readonly recruitmentTypeOptions = [
    { value: 'TEMP', label: 'Temporal (TEMP)' },
    { value: 'TEMPORARY', label: 'Temporal (TEMPORARY)' },
    { value: 'PERMANENT', label: 'Permanente' },
  ];

  kpis: ConsolidadoKpisResponse = { totalRequisitions: 0, recruiters: 0, requisitionsPerRecruiter: null };
  days: number[] = [];
  statusTotals: ConsolidadoStatusRowResponse[] = [];
  matrix: ConsolidadoStatusRowResponse[] = [];
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
    positionId: this.fb.control<number | null>(null),
    clientKey: this.fb.control<string>(''),
    dimension: this.fb.control<string>('NONE'),
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
  }

  get chartMax(): number {
    const totals = this.statusTotals
      .filter((r) => r.defined && r.total != null)
      .map((r) => r.total as number);
    return Math.max(1, ...totals);
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
      positionId: null,
      clientKey: '',
      dimension: 'NONE',
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
          this.errorMessage = 'No se pudo cargar el reporte Consolidado. Intenta de nuevo.';
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data) => {
        this.kpis = data?.kpis ?? { totalRequisitions: 0, recruiters: 0, requisitionsPerRecruiter: null };
        this.days = data?.days ?? [];
        this.statusTotals = data?.statusTotals ?? [];
        this.matrix = data?.matrix ?? [];
        this.dimensionRows = data?.dimensionRows ?? [];
        this.loading = false;
      });
  }

  formatCell(value: number | null | undefined, defined = true): string {
    if (!defined || value == null) {
      return '';
    }
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
  }

  formatKpi(value: number | null | undefined): string {
    if (value == null || Number.isNaN(value)) {
      return '—';
    }
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
  }

  barWidth(value: number | null | undefined): string {
    if (value == null) {
      return '0%';
    }
    return `${Math.max(0, Math.min(100, (value / this.chartMax) * 100))}%`;
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
      dimension: v.dimension || 'NONE',
    };
  }

  private onYearMonthChange(): void {
    this.refreshDayOptions();
    const last = this.dayOptions[this.dayOptions.length - 1] ?? 31;
    if (this.filters.controls.endDay.value > last) {
      this.filters.controls.endDay.setValue(last, { emitEvent: false });
    }
    if (this.filters.controls.startDay.value > last) {
      this.filters.controls.startDay.setValue(1, { emitEvent: false });
    }
  }

  private refreshDayOptions(): void {
    const y = this.filters.controls.year.value;
    const m = this.filters.controls.month.value;
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

function currentYear(): number {
  return new Date().getFullYear();
}

function currentMonth(): number {
  return new Date().getMonth() + 1;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}
