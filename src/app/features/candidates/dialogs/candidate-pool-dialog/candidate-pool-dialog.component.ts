import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { catalogDialogConfig } from '../../../../core/dialog/catalog-dialog.constants';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { FeedbackDialogService } from '../../../../core/feedback/feedback-dialog.service';
import { debounceTime, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CandidateApiService } from '../../../../core/services/candidate-api.service';
import { CandidateApplicationApiService } from '../../../../core/services/candidate-application-api.service';
import { CandidateListItem } from '../../../../shared/models/candidate.model';
import { ShPaginatorComponent } from '../../../../shared/components/paginator/sh-paginator.component';
import {
  ShModalActionsDirective,
  ShModalFormComponent,
} from '../../../../shared/components/modal-form/sh-modal-form.component';

export interface CandidatePoolDialogData {
  positionId: number;
  requisitionNo?: string;
}

/** Dialog width: former 760px + 40% to avoid horizontal scroll. */
export const CANDIDATE_POOL_DIALOG_WIDTH = '1064px';

/** Fixed height so filter/load does not collapse or resize the modal. */
export const CANDIDATE_POOL_DIALOG_HEIGHT = '850px';

export function candidatePoolDialogConfig(extra: MatDialogConfig = {}): MatDialogConfig {
  return catalogDialogConfig(CANDIDATE_POOL_DIALOG_WIDTH, {
    height: CANDIDATE_POOL_DIALOG_HEIGHT,
    maxHeight: CANDIDATE_POOL_DIALOG_HEIGHT,
    maxWidth: '96vw',
    panelClass: ['sh-catalog-form-dialog-panel', 'sh-candidate-pool-dialog-panel'],
    ...extra,
  });
}

@Component({
  selector: 'sh-candidate-pool-dialog',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatDialogModule,
    MatTableModule,
    ShPaginatorComponent,
    ShModalFormComponent,
    ShModalActionsDirective,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
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
  private readonly feedback = inject(FeedbackDialogService);
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
      error: (err) => {
        this.loading = false;
        this.feedback.showSuccess('No se pudo cargar el pool de candidatos');
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
      this.feedback.showSuccess('Selecciona al menos un candidato');
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
          this.feedback.showSuccess('Ningún candidato pudo postularse (¿ya estaban postulados?)');
        }
      },
      error: (err) => {
        this.submitting = false;
        this.feedback.showSuccess('Error al postular candidatos');
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
