import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { debounceTime, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CandidateApiService } from '../../../../core/services/candidate-api.service';
import { CandidateApplicationApiService } from '../../../../core/services/candidate-application-api.service';
import { CandidateListItem } from '../../../../shared/models/candidate.model';

export interface CandidatePoolDialogData {
  positionId: number;
  requisitionNo?: string;
}

@Component({
  selector: 'sh-candidate-pool-dialog',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './candidate-pool-dialog.component.html',
  styleUrl: './candidate-pool-dialog.component.scss',
})
export class CandidatePoolDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<CandidatePoolDialogComponent>);
  readonly data = inject<CandidatePoolDialogData>(MAT_DIALOG_DATA);
  private readonly candidateApi = inject(CandidateApiService);
  private readonly applicationApi = inject(CandidateApplicationApiService);
  private readonly snack = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  loading = true;
  submitting = false;
  rows: (CandidateListItem & { selected: boolean })[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;
  selectedIds = new Set<number>();

  readonly searchForm = this.fb.nonNullable.group({ search: [''] });
  readonly columns = ['select', 'firstName', 'lastName', 'email', 'phone', 'source', 'createdAt'];

  ngOnInit(): void {
    this.load();
    this.searchForm.controls.search.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.pageIndex = 0;
      this.load();
    });
  }

  load(): void {
    this.loading = true;
    this.candidateApi.list(this.pageIndex, this.pageSize, this.searchForm.controls.search.value, true).subscribe({
      next: (res) => {
        this.rows = res.items.map((item) => ({
          ...item,
          selected: this.selectedIds.has(item.id),
        }));
        this.total = res.total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open('No se pudo cargar el pool de candidatos', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onPage(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.load();
  }

  toggleRow(row: CandidateListItem & { selected: boolean }): void {
    if (this.selectedIds.has(row.id)) {
      this.selectedIds.delete(row.id);
      row.selected = false;
    } else {
      this.selectedIds.add(row.id);
      row.selected = true;
    }
  }

  toggleAll(checked: boolean): void {
    for (const row of this.rows) {
      row.selected = checked;
      if (checked) {
        this.selectedIds.add(row.id);
      } else {
        this.selectedIds.delete(row.id);
      }
    }
  }

  submit(): void {
    if (this.selectedIds.size === 0) {
      this.snack.open('Selecciona al menos un candidato', 'Cerrar', { duration: 3000 });
      return;
    }
    this.submitting = true;
    const requests = [...this.selectedIds].map((candidateId) =>
      this.applicationApi
        .create({ candidateId, positionId: this.data.positionId, source: 'POOL' })
        .pipe(catchError(() => of(null))),
    );
    forkJoin(requests).subscribe({
      next: (results) => {
        const created = results.filter((r) => r != null).length;
        const skipped = results.length - created;
        this.submitting = false;
        if (created > 0) {
          this.dialogRef.close({ created, skipped });
        } else {
          this.snack.open('Ningún candidato pudo postularse (¿ya estaban postulados?)', 'Cerrar', { duration: 4000 });
        }
      },
      error: () => {
        this.submitting = false;
        this.snack.open('Error al postular candidatos', 'Cerrar', { duration: 4000 });
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  get selectedCount(): number {
    return this.selectedIds.size;
  }
}
