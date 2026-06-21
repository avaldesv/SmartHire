import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { CandidateApplicationApiService } from '../../../../core/services/candidate-application-api.service';
import { CandidateApplicationListItem } from '../../../../shared/models/candidate-application.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

export interface PositionApplicationsDialogData {
  positionId: number;
  requisitionNo?: string;
  positionName?: string;
}

@Component({
  selector: 'sh-position-applications-dialog',
  standalone: true,
  imports: [
    DatePipe,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    StatusBadgeComponent,
  ],
  templateUrl: './position-applications-dialog.component.html',
  styleUrl: './position-applications-dialog.component.scss',
})
export class PositionApplicationsDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<PositionApplicationsDialogComponent>);
  readonly data = inject<PositionApplicationsDialogData>(MAT_DIALOG_DATA);
  private readonly applicationApi = inject(CandidateApplicationApiService);
  private readonly snack = inject(MatSnackBar);

  loading = true;
  rows: CandidateApplicationListItem[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;

  readonly columns = ['candidate', 'email', 'status', 'source', 'compatibility', 'createdAt'];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.applicationApi.list(this.pageIndex, this.pageSize, { positionId: this.data.positionId }).subscribe({
      next: (res) => {
        this.rows = res.items;
        this.total = res.total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open('No se pudieron cargar las postulaciones', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onPage(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.load();
  }

  close(): void {
    this.dialogRef.close();
  }

  candidateName(row: CandidateApplicationListItem): string {
    const first = row.candidateFirstName ?? '';
    const last = row.candidateLastName ?? '';
    const name = `${first} ${last}`.trim();
    return name || `Candidato #${row.candidateId}`;
  }
}
