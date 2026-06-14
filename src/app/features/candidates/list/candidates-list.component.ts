import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceTime } from 'rxjs';
import { CandidateService } from '../../../mock/services/candidate.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { Candidate } from '../../../shared/models';

@Component({
  selector: 'sh-candidates-list',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    PageHeaderComponent,
  ],
  templateUrl: './candidates-list.component.html',
  styleUrl: './candidates-list.component.scss',
})
export class CandidatesListComponent implements OnInit {
  private readonly candidateService = inject(CandidateService);
  private readonly snack = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  loading = true;
  data: Candidate[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;

  readonly searchForm = this.fb.nonNullable.group({ search: [''] });
  readonly columns = ['id', 'firstName', 'lastName', 'email', 'phone', 'city', 'source', 'active', 'createdAt', 'actions'];

  ngOnInit(): void {
    this.load();
    this.searchForm.controls.search.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.pageIndex = 0;
      this.load();
    });
  }

  load(): void {
    this.loading = true;
    this.candidateService
      .list({ search: this.searchForm.controls.search.value || undefined, page: this.pageIndex + 1, pageSize: this.pageSize })
      .subscribe((res) => {
        this.data = res.items;
        this.total = res.total;
        this.loading = false;
      });
  }

  onPage(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.load();
  }

  deleteCandidate(c: Candidate): void {
    this.snack.open(`Candidato ${c.firstName} ${c.lastName} eliminado (simulado)`, 'Cerrar', { duration: 3000 });
  }
}
