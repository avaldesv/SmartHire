import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FeedbackDialogService } from '../../../core/feedback/feedback-dialog.service';
import { debounceTime } from 'rxjs';
import {
  CANDIDATES_LIST_COL_ACTIVE,
  CANDIDATES_LIST_COL_CITY,
  CANDIDATES_LIST_COL_CREATED,
  CANDIDATES_LIST_COL_EMAIL,
  CANDIDATES_LIST_COL_FIRST_NAME,
  CANDIDATES_LIST_COL_ID,
  CANDIDATES_LIST_COL_LAST_NAME,
  CANDIDATES_LIST_COL_PHONE,
  CANDIDATES_LIST_COL_SOURCE,
  CANDIDATES_LIST_LOAD_ERROR,
  CANDIDATES_LIST_NEW,
  CANDIDATES_LIST_NO,
  CANDIDATES_LIST_SEARCH,
  CANDIDATES_LIST_SEARCH_PLACEHOLDER,
  CANDIDATES_LIST_SUBTITLE,
  CANDIDATES_LIST_TITLE,
  CANDIDATES_LIST_YES,
  candidatesSourceLabel,
} from '../../../core/i18n/candidates-labels';
import { CandidateApiService } from '../../../core/services/candidate-api.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { CandidateListItem } from '../../../shared/models/candidate.model';
import { TableRowActionsComponent } from '../../../shared/components/table-row-actions/table-row-actions.component';

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
    MatProgressSpinnerModule,
    PageHeaderComponent,
    TableRowActionsComponent,
  ],
  templateUrl: './candidates-list.component.html',
  styleUrl: './candidates-list.component.scss',
})
export class CandidatesListComponent implements OnInit {
  private readonly candidateService = inject(CandidateApiService);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly fb = inject(FormBuilder);

  readonly ui = {
    title: CANDIDATES_LIST_TITLE,
    subtitle: CANDIDATES_LIST_SUBTITLE,
    newCandidate: CANDIDATES_LIST_NEW,
    search: CANDIDATES_LIST_SEARCH,
    searchPlaceholder: CANDIDATES_LIST_SEARCH_PLACEHOLDER,
    colId: CANDIDATES_LIST_COL_ID,
    colFirstName: CANDIDATES_LIST_COL_FIRST_NAME,
    colLastName: CANDIDATES_LIST_COL_LAST_NAME,
    colEmail: CANDIDATES_LIST_COL_EMAIL,
    colPhone: CANDIDATES_LIST_COL_PHONE,
    colCity: CANDIDATES_LIST_COL_CITY,
    colSource: CANDIDATES_LIST_COL_SOURCE,
    colActive: CANDIDATES_LIST_COL_ACTIVE,
    colCreated: CANDIDATES_LIST_COL_CREATED,
    yes: CANDIDATES_LIST_YES,
    no: CANDIDATES_LIST_NO,
  };
  readonly sourceLabel = candidatesSourceLabel;

  loading = true;
  data: CandidateListItem[] = [];
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
    this.candidateService.list(this.pageIndex, this.pageSize, this.searchForm.controls.search.value).subscribe({
      next: (res) => {
        this.data = res.items;
        this.total = res.total;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.feedback.showSuccess(CANDIDATES_LIST_LOAD_ERROR);
      },
    });
  }

  onPage(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.load();
  }
}
