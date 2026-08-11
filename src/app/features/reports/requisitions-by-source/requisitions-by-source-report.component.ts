import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { catchError, forkJoin, of } from 'rxjs';
import { CatalogGeographyService } from '../../../core/services/catalog-geography.service';
import { CatalogWorkplaceService } from '../../../core/services/catalog-workplace.service';
import { ReportsApiService } from '../../../core/services/reports-api.service';
import { SecurityRecruiterGroupService } from '../../../core/services/security-recruiter-group.service';
import { SecurityUserService } from '../../../core/services/security-user.service';
import { CatalogCountry } from '../../../shared/models/catalog-geography.model';
import { CatalogWorkplace } from '../../../shared/models/catalog-workplace.model';
import {
  RequisitionsBySourceFilterRequest,
  RequisitionsBySourceRowResponse,
} from '../../../shared/models/report.model';
import { SecurityRecruiterGroup } from '../../../shared/models/security-recruiter-group.model';
import { SecurityUser } from '../../../shared/models/security-user.model';

interface SelectOption {
  id: number;
  label: string;
}

@Component({
  selector: 'sh-requisitions-by-source-report',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './requisitions-by-source-report.component.html',
  styleUrl: './requisitions-by-source-report.component.scss',
})
export class RequisitionsBySourceReportComponent implements OnInit {
  private readonly reportsApi = inject(ReportsApiService);
  private readonly geography = inject(CatalogGeographyService);
  private readonly workplaces = inject(CatalogWorkplaceService);
  private readonly recruiterGroups = inject(SecurityRecruiterGroupService);
  private readonly users = inject(SecurityUserService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  loading = false;
  loadingCatalogs = true;
  errorMessage = '';

  countries: CatalogCountry[] = [];
  workplaceOptions: CatalogWorkplace[] = [];
  groupOptions: SecurityRecruiterGroup[] = [];
  recruiterOptions: SelectOption[] = [];
  rows: RequisitionsBySourceRowResponse[] = [];
  total: RequisitionsBySourceRowResponse | null = null;

  readonly filters = this.fb.nonNullable.group({
    startDate: this.fb.control<string>(''),
    endDate: this.fb.control<string>(''),
    countryId: this.fb.control<number | null>(null),
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
  }

  clearFilters(): void {
    this.filters.reset({
      startDate: '',
      endDate: '',
      countryId: null,
      assignedUserId: null,
      clientKey: '',
      recruiterGroupId: null,
      workplaceId: null,
    });
    this.filters.controls.workplaceId.disable({ emitEvent: false });
    this.filters.controls.recruiterGroupId.disable({ emitEvent: false });
    this.workplaceOptions = [];
    this.groupOptions = [];
    this.load();
  }

  load(): void {
    this.loading = true;
    this.errorMessage = '';
    const body = this.buildRequest();

    this.reportsApi
      .getRequisitionsBySource(body)
      .pipe(
        catchError(() => {
          this.errorMessage =
            'No se pudo cargar el reporte Requisiciones por fuente de reclutamiento. Intenta de nuevo.';
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data) => {
        this.rows = data?.rows ?? [];
        this.total = data?.total ?? null;
        this.loading = false;
      });
  }

  formatCell(value: number | null | undefined): string {
    if (value == null || Number.isNaN(value)) {
      return '-';
    }
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
  }

  formatPercent(value: number | null | undefined): string {
    if (value == null || Number.isNaN(value)) {
      return '-';
    }
    return `${value.toFixed(1)}%`;
  }

  private buildRequest(): RequisitionsBySourceFilterRequest {
    const v = this.filters.getRawValue();
    const clientKey = v.clientKey?.trim() || null;
    return {
      startDate: v.startDate || null,
      endDate: v.endDate || null,
      countryId: v.countryId,
      assignedUserId: v.assignedUserId,
      clientKey,
      recruiterGroupId: v.recruiterGroupId,
      workplaceId: v.workplaceId,
    };
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
