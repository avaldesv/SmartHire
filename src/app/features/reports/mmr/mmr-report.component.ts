import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { catchError, forkJoin, of } from 'rxjs';
import { CatalogGeographyService } from '../../../core/services/catalog-geography.service';
import { CatalogWorkplaceService } from '../../../core/services/catalog-workplace.service';
import { PositionService } from '../../../core/services/position.service';
import { ReportsApiService } from '../../../core/services/reports-api.service';
import { SecurityRecruiterGroupService } from '../../../core/services/security-recruiter-group.service';
import { SecurityUserService } from '../../../core/services/security-user.service';
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card.component';
import { CatalogCountry } from '../../../shared/models/catalog-geography.model';
import { CatalogWorkplace } from '../../../shared/models/catalog-workplace.model';
import { PositionListItem } from '../../../shared/models/position.model';
import { ReportFilterRequest, ReportGroupResponse, ReportKpisResponse } from '../../../shared/models/report.model';
import { SecurityRecruiterGroup } from '../../../shared/models/security-recruiter-group.model';
import { SecurityUser } from '../../../shared/models/security-user.model';

interface SelectOption {
  id: number;
  label: string;
}

@Component({
  selector: 'sh-mmr-report',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    KpiCardComponent,
  ],
  templateUrl: './mmr-report.component.html',
  styleUrl: './mmr-report.component.scss',
})
export class MmrReportComponent implements OnInit {
  private readonly reportsApi = inject(ReportsApiService);
  private readonly geography = inject(CatalogGeographyService);
  private readonly workplaces = inject(CatalogWorkplaceService);
  private readonly recruiterGroups = inject(SecurityRecruiterGroupService);
  private readonly positions = inject(PositionService);
  private readonly users = inject(SecurityUserService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  loading = false;
  loadingCatalogs = true;
  errorMessage = '';

  countries: CatalogCountry[] = [];
  workplaceOptions: CatalogWorkplace[] = [];
  groupOptions: SecurityRecruiterGroup[] = [];
  positionOptions: SelectOption[] = [];
  recruiterOptions: SelectOption[] = [];

  /** Static options for recruitmentType (backend uses TEMP / TEMPORARY). */
  readonly recruitmentTypeOptions = [
    { value: 'TEMP', label: 'Temporal (TEMP)' },
    { value: 'TEMPORARY', label: 'Temporal (TEMPORARY)' },
    { value: 'PERMANENT', label: 'Permanente' },
  ];

  months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  yearOptions: number[] = [];

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
    const currentYear = new Date().getFullYear();
    this.yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);

    this.filters.controls.workplaceId.disable({ emitEvent: false });
    this.filters.controls.recruiterGroupId.disable({ emitEvent: false });

    this.loadIndependentCatalogs();
    this.filters.controls.countryId.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((countryId) => this.onCountryChange(countryId));

    this.load();
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
    this.workplaceOptions = [];
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
      .getMmr(body)
      .pipe(
        catchError(() => {
          this.errorMessage = 'No se pudo cargar el reporte MMR. Intenta de nuevo.';
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
      return '—';
    }
    return `${value.toFixed(1)}%`;
  }

  formatCell(value: number | null | undefined): string {
    if (value == null || Number.isNaN(value)) {
      return '—';
    }
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
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
    this.workplaceOptions = [];
    this.groupOptions = [];

    if (countryId == null) {
      this.filters.controls.workplaceId.disable({ emitEvent: false });
      this.filters.controls.recruiterGroupId.disable({ emitEvent: false });
      return;
    }

    this.filters.controls.workplaceId.enable({ emitEvent: false });
    this.filters.controls.recruiterGroupId.enable({ emitEvent: false });

    forkJoin({
      workplaces: this.workplaces.list(countryId, 0, 200).pipe(
        catchError(() => of({ items: [] as CatalogWorkplace[], total: 0 })),
      ),
      groups: this.recruiterGroups.list(countryId, 0, 200).pipe(
        catchError(() => of({ items: [] as SecurityRecruiterGroup[], total: 0 })),
      ),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ workplaces, groups }) => {
        this.workplaceOptions = workplaces.items;
        this.groupOptions = groups.items;
      });
  }
}
