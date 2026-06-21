import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { debounceTime } from 'rxjs';
import { CatalogGeographyService } from '../../../core/services/catalog-geography.service';
import { PositionService } from '../../../core/services/position.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { CatalogCountry } from '../../../shared/models/catalog-geography.model';
import { PositionListItem } from '../../../shared/models/position.model';

@Component({
  selector: 'sh-positions-list',
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
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatMenuModule,
    PageHeaderComponent,
    StatusBadgeComponent,
  ],
  templateUrl: './positions-list.component.html',
  styleUrl: './positions-list.component.scss',
})
export class PositionsListComponent implements OnInit {
  private readonly positionService = inject(PositionService);
  private readonly geographyService = inject(CatalogGeographyService);
  private readonly snack = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  loading = true;
  data: PositionListItem[] = [];
  countryOptions: CatalogCountry[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;

  readonly statusOptions = ['Todos', 'DRAFT', 'PENDING_CANCELLATION'];

  readonly filters = this.fb.nonNullable.group({
    search: [''],
    status: ['Todos'],
    countryId: [0],
    recruiter: [''],
    dateFrom: [''],
    dateTo: [''],
  });

  readonly columns = [
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

  ngOnInit(): void {
    this.geographyService.listCountries(0, 200).subscribe({
      next: (countries) => {
        this.countryOptions = countries.filter((c) => c.isActive);
      },
    });
    this.load();
    this.filters.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.pageIndex = 0;
      this.load();
    });
  }

  load(): void {
    this.loading = true;
    const status = this.filters.controls.status.value;
    const countryId = this.filters.controls.countryId.value;
    const dateFrom = this.filters.controls.dateFrom.value || null;
    const dateTo = this.filters.controls.dateTo.value || null;
    this.positionService
      .list(
        this.pageIndex,
        this.pageSize,
        status !== 'Todos' ? status : null,
        this.filters.controls.search.value,
        dateFrom,
        dateTo,
        countryId > 0 ? countryId : null,
        this.filters.controls.recruiter.value,
      )
      .subscribe({
        next: (res) => {
          this.data = res.items;
          this.total = res.total;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.snack.open('No se pudieron cargar las posiciones', 'Cerrar', { duration: 4000 });
        },
      });
  }

  onPage(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.load();
  }

  clearFilters(): void {
    this.filters.reset({ search: '', status: 'Todos', countryId: 0, recruiter: '', dateFrom: '', dateTo: '' });
    this.snack.open('Filtros limpiados', 'Cerrar', { duration: 2500 });
  }

  duplicatePosition(row: PositionListItem): void {
    this.positionService.duplicate(row.id).subscribe({
      next: (res) => {
        this.load();
        this.snack.open(`Posición duplicada: REQ-${res.id}`, 'Cerrar', { duration: 4000 });
      },
      error: () => {
        this.snack.open('No se pudo duplicar la posición', 'Cerrar', { duration: 4000 });
      },
    });
  }

  cancelPosition(row: PositionListItem): void {
    if (!confirm(`¿Cancelar directamente la requisición ${row.requisitionNo}? Esta acción no se puede deshacer.`)) {
      return;
    }
    this.positionService.delete(row.id).subscribe({
      next: () => {
        this.load();
        this.snack.open('Requisición cancelada', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.snack.open('No se pudo cancelar la requisición', 'Cerrar', { duration: 4000 });
      },
    });
  }

  requestCancellation(row: PositionListItem): void {
    if (row.status !== 'DRAFT') {
      return;
    }
    if (!confirm(`¿Solicitar cancelación de ${row.requisitionNo}? Quedará pendiente de aprobación.`)) {
      return;
    }
    this.positionService.requestCancellation(row.id).subscribe({
      next: () => {
        this.load();
        this.snack.open('Solicitud de cancelación enviada', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.snack.open('No se pudo solicitar la cancelación', 'Cerrar', { duration: 4000 });
      },
    });
  }

  approveCancellation(row: PositionListItem): void {
    if (row.status !== 'PENDING_CANCELLATION') {
      return;
    }
    if (!confirm(`¿Aprobar cancelación de ${row.requisitionNo}? La requisición será eliminada.`)) {
      return;
    }
    this.positionService.approveCancellation(row.id).subscribe({
      next: () => {
        this.load();
        this.snack.open('Cancelación aprobada', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.snack.open('No se pudo aprobar la cancelación', 'Cerrar', { duration: 4000 });
      },
    });
  }

  rejectCancellation(row: PositionListItem): void {
    if (row.status !== 'PENDING_CANCELLATION') {
      return;
    }
    if (!confirm(`¿Rechazar solicitud de cancelación de ${row.requisitionNo}? Volverá a borrador.`)) {
      return;
    }
    this.positionService.rejectCancellation(row.id).subscribe({
      next: () => {
        this.load();
        this.snack.open('Solicitud de cancelación rechazada', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.snack.open('No se pudo rechazar la solicitud', 'Cerrar', { duration: 4000 });
      },
    });
  }
}
