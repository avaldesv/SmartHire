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
import { RequisitionService } from '../../../mock/services/requisition.service';
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { Requisition } from '../../../shared/models';

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
  private readonly reqService = inject(RequisitionService);
  private readonly snack = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  readonly user = this.auth.currentUser;
  loading = true;
  total = 0;
  pageSize = 5;
  pageIndex = 0;
  data: Requisition[] = [];
  clients: string[] = [];

  kpis = { totalPositions: 0, preselected: 0, interested: 0 };

  readonly statusOptions = ['Todos', 'Abierta', 'En Proceso', 'En Revisión', 'Cerrada', 'Selección', 'Análisis'];

  readonly displayedColumns = [
    'requisitionNo',
    'name',
    'ot',
    'createdAt',
    'positionsCount',
    'applicants',
    'preselected',
    'firstDay',
    'recruiter',
    'type',
    'category',
    'brand',
    'client',
    'clientKey',
    'unit',
    'city',
    'state',
    'status',
    'country',
    'actions',
  ];

  readonly filters = this.fb.nonNullable.group({
    search: [''],
    status: ['Todos'],
    client: ['Todos'],
    dateFrom: [''],
    dateTo: [''],
  });

  ngOnInit(): void {
    this.reqService.getKpis().subscribe((k) => (this.kpis = k));
    this.reqService.getClients().subscribe((c) => (this.clients = ['Todos', ...c]));
    this.loadData();
    this.filters.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
      this.pageIndex = 0;
      this.loadData();
    });
  }

  loadData(): void {
    this.loading = true;
    const f = this.filters.getRawValue();
    this.reqService
      .list({
        search: f.search || undefined,
        status: f.status !== 'Todos' ? f.status : undefined,
        client: f.client !== 'Todos' ? f.client : undefined,
        page: this.pageIndex + 1,
        pageSize: this.pageSize,
      })
      .subscribe((res) => {
        this.data = res.items;
        this.total = res.total;
        this.loading = false;
      });
  }

  onPage(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.loadData();
  }

  clearFilters(): void {
    this.filters.reset({ search: '', status: 'Todos', client: 'Todos', dateFrom: '', dateTo: '' });
    this.snack.open('Filtros limpiados', 'Cerrar', { duration: 2500 });
  }

  newRequisition(): void {
    this.snack.open('Redirigiendo a nueva requisición…', 'Cerrar', { duration: 2000 });
  }

  rowAction(action: string, row: Requisition): void {
    this.snack.open(`${action}: ${row.requisitionNo}`, 'Cerrar', { duration: 2500 });
  }
}
