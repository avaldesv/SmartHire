import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { CatalogGeographyService } from '../../../core/services/catalog-geography.service';
import { PositionService } from '../../../core/services/position.service';
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { CatalogCountry } from '../../../shared/models/catalog-geography.model';
import { PositionListItem } from '../../../shared/models/position.model';

@Component({
  selector: 'sh-dashboard',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    KpiCardComponent,
    StatusBadgeComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly positionService = inject(PositionService);
  private readonly geographyService = inject(CatalogGeographyService);
  private readonly snack = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  readonly user = this.auth.currentUser;
  loading = true;
  total = 0;
  pageSize = 10;
  pageIndex = 0;
  data: PositionListItem[] = [];
  countryOptions: CatalogCountry[] = [];

  kpis = { totalPositions: 0, preselected: 0, interested: 0 };

  readonly statusOptions = ['Todos', 'DRAFT'];

  readonly displayedColumns = [
    'requisitionNo',
    'name',
    'ot',
    'client',
    'clientKey',
    'positionsCount',
    'city',
    'state',
    'brand',
    'type',
    'category',
    'country',
    'startDate',
    'status',
    'recruiter',
    'createdAt',
    'actions',
  ];

  readonly filters = this.fb.nonNullable.group({
    search: [''],
    status: ['Todos'],
    countryId: [0],
    recruiter: [''],
    dateFrom: [''],
    dateTo: [''],
  });

  ngOnInit(): void {
    this.geographyService.listCountries(0, 200).subscribe({
      next: (countries) => {
        this.countryOptions = countries.filter((c) => c.isActive);
      },
    });
    this.loadKpis();
    this.loadData();
    this.filters.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
      this.pageIndex = 0;
      this.loadData();
    });
  }

  loadKpis(): void {
    this.positionService.getDashboardKpis().subscribe({
      next: (res) => {
        this.kpis = {
          totalPositions: res.totalPositions,
          preselected: res.preselectedCandidates,
          interested: res.interestedCandidates,
        };
      },
      error: () => {
        this.snack.open('No se pudieron cargar los KPIs', 'Cerrar', { duration: 4000 });
      },
    });
  }

  loadData(): void {
    this.loading = true;
    const status = this.filters.controls.status.value;
    const search = this.filters.controls.search.value;
    const dateFrom = this.filters.controls.dateFrom.value || null;
    const dateTo = this.filters.controls.dateTo.value || null;
    const countryId = this.filters.controls.countryId.value;
    const recruiter = this.filters.controls.recruiter.value;
    this.positionService
      .list(
        this.pageIndex,
        this.pageSize,
        status !== 'Todos' ? status : null,
        search,
        dateFrom,
        dateTo,
        countryId > 0 ? countryId : null,
        recruiter,
      )
      .subscribe({
        next: (res) => {
          this.data = res.items;
          this.total = res.total;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.snack.open('No se pudieron cargar las solicitudes', 'Cerrar', { duration: 4000 });
        },
      });
  }

  onPage(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.loadData();
  }

  clearFilters(): void {
    this.filters.reset({ search: '', status: 'Todos', countryId: 0, recruiter: '', dateFrom: '', dateTo: '' });
    this.snack.open('Filtros limpiados', 'Cerrar', { duration: 2500 });
  }

  duplicatePosition(row: PositionListItem): void {
    this.positionService.duplicate(row.id).subscribe({
      next: (res) => {
        this.loadKpis();
        this.loadData();
        this.snack.open(`Posición duplicada: REQ-${res.id}`, 'Cerrar', { duration: 4000 });
      },
      error: () => {
        this.snack.open('No se pudo duplicar la posición', 'Cerrar', { duration: 4000 });
      },
    });
  }
}
