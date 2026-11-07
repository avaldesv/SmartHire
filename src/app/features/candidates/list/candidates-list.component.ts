import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PageEvent } from '@angular/material/paginator';
import { ShPaginatorComponent } from '../../../shared/components/paginator/sh-paginator.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
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
import {
  CANDIDATE_BLOCK_BLOCKED,
  CANDIDATE_BLOCK_COL_STATUS,
  CANDIDATE_BLOCK_RELEASED,
  CANDIDATE_BLOCK_UPDATE_ERROR,
  CANDIDATE_CHANGE_LOG_ACTION,
} from '../../../core/i18n/candidate-block-labels';
import { AppPermissions } from '../../../core/auth/app-permissions';
import { PermissionService } from '../../../core/services/permission.service';
import {
  CandidateChangeLogDialogComponent,
  candidateChangeLogDialogConfig,
} from '../dialogs/candidate-change-log-dialog/candidate-change-log-dialog.component';
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
    ShPaginatorComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSlideToggle,
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
  private readonly dialog = inject(MatDialog);
  private readonly permissions = inject(PermissionService);

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
    colBlock: CANDIDATE_BLOCK_COL_STATUS,
    blocked: CANDIDATE_BLOCK_BLOCKED,
    released: CANDIDATE_BLOCK_RELEASED,
    history: CANDIDATE_CHANGE_LOG_ACTION,
    yes: CANDIDATES_LIST_YES,
    no: CANDIDATES_LIST_NO,
  };
  readonly sourceLabel = candidatesSourceLabel;

  /** Only CANDIDATE_EDIT can move the block toggle; CANDIDATE_READ sees it disabled. */
  get canEditBlock(): boolean {
    return this.permissions.hasAuthority(AppPermissions.CANDIDATE_EDIT);
  }
  private readonly blockSavingIds = new Set<number>();

  loading = true;
  data: CandidateListItem[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;

  readonly searchForm = this.fb.nonNullable.group({ search: [''] });
  readonly columns = ['id', 'firstName', 'lastName', 'email', 'phone', 'city', 'source', 'active', 'createdAt', 'blockStatus', 'actions'];

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

  isBlockSaving(id: number): boolean {
    return this.blockSavingIds.has(id);
  }

  onBlockToggle(row: CandidateListItem, event: MatSlideToggleChange): void {
    if (!this.canEditBlock || this.blockSavingIds.has(row.id)) {
      event.source.checked = row.blocked === true;
      return;
    }
    const previous = row.blocked === true;
    const next = event.checked;
    row.blocked = next;
    this.blockSavingIds.add(row.id);
    this.candidateService.setBlockOverride(row.id, next).subscribe({
      next: (res) => {
        this.blockSavingIds.delete(row.id);
        row.blocked = res.blocked;
        event.source.checked = res.blocked;
      },
      error: (err) => {
        this.blockSavingIds.delete(row.id);
        row.blocked = previous;
        event.source.checked = previous;
        this.feedback.showApiError(err, { fallbackMessage: CANDIDATE_BLOCK_UPDATE_ERROR });
      },
    });
  }

  openHistory(row: CandidateListItem): void {
    this.dialog.open(
      CandidateChangeLogDialogComponent,
      candidateChangeLogDialogConfig({
        candidateId: row.id,
        firstName: row.firstName,
        lastName: row.lastName,
      }),
    );
  }
}
