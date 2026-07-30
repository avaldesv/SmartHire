import { Component, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { AppPermissions } from '../../core/auth/app-permissions';
import {
  CANDIDATE_ACCOUNTS_COL_ACTIVE,
  CANDIDATE_ACCOUNTS_COL_CANDIDATE,
  CANDIDATE_ACCOUNTS_COL_EMAIL,
  CANDIDATE_ACCOUNTS_COL_LAST_LOGIN,
  CANDIDATE_ACCOUNTS_COL_STATUS,
  CANDIDATE_ACCOUNTS_EMPTY,
  CANDIDATE_ACCOUNTS_ERRORS_ACTIVE,
  CANDIDATE_ACCOUNTS_ERRORS_DELETE,
  CANDIDATE_ACCOUNTS_ERRORS_LIST,
  CANDIDATE_ACCOUNTS_FILTER_EMAIL,
  CANDIDATE_ACCOUNTS_HARD_BUTTON,
  CANDIDATE_ACCOUNTS_NEW_BUTTON,
  CANDIDATE_ACCOUNTS_PAGE_TITLE,
  CANDIDATE_ACCOUNTS_SNACK_CLOSE,
  CANDIDATE_ACCOUNTS_SUCCESS_DELETED,
  CANDIDATE_ACCOUNTS_SUCCESS_HARD,
  CANDIDATE_ACCOUNTS_SUCCESS_SAVED,
  candidateAccountsRegisterStatusLabel,
  candidateAccountsSoftDeleteConfirm,
} from '../../core/i18n/candidate-accounts-labels';
import { CandidateAccountApiService } from '../../core/services/candidate-account-api.service';
import { PermissionService } from '../../core/services/permission.service';
import { TableRowActionsComponent } from '../../shared/components/table-row-actions/table-row-actions.component';
import { CandidateAccountItem } from '../../shared/models/candidate-account.model';
import {
  CandidateAccountFormDialogComponent,
  CandidateAccountFormDialogData,
} from './candidate-account-form-dialog.component';
import {
  CandidateAccountHardDeleteDialogComponent,
  CandidateAccountHardDeleteDialogData,
} from './candidate-account-hard-delete-dialog.component';

@Component({
  selector: 'sh-candidate-accounts-admin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    TableRowActionsComponent,
  ],
  templateUrl: './candidate-accounts-admin.component.html',
  styleUrl: './candidate-accounts-admin.component.scss',
})
export class CandidateAccountsAdminComponent implements OnInit {
  private readonly api = inject(CandidateAccountApiService);
  private readonly permissions = inject(PermissionService);
  private readonly snack = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  loading = true;
  savingId: number | null = null;
  deletingId: number | null = null;
  data: CandidateAccountItem[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;

  readonly emailFilter = new FormControl('', { nonNullable: true });
  readonly columns = ['email', 'candidate', 'status', 'active', 'lastLogin', 'actions'];

  readonly pageTitle = CANDIDATE_ACCOUNTS_PAGE_TITLE;
  readonly newButton = CANDIDATE_ACCOUNTS_NEW_BUTTON;
  readonly filterEmail = CANDIDATE_ACCOUNTS_FILTER_EMAIL;
  readonly columnEmail = CANDIDATE_ACCOUNTS_COL_EMAIL;
  readonly columnCandidate = CANDIDATE_ACCOUNTS_COL_CANDIDATE;
  readonly columnStatus = CANDIDATE_ACCOUNTS_COL_STATUS;
  readonly columnActive = CANDIDATE_ACCOUNTS_COL_ACTIVE;
  readonly columnLastLogin = CANDIDATE_ACCOUNTS_COL_LAST_LOGIN;
  readonly emptyLabel = CANDIDATE_ACCOUNTS_EMPTY;
  readonly hardButton = CANDIDATE_ACCOUNTS_HARD_BUTTON;

  ngOnInit(): void {
    this.emailFilter.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
      this.pageIndex = 0;
      this.load();
    });
    this.load();
  }

  canCreate(): boolean {
    return this.permissions.hasAuthority(AppPermissions.CANDIDATE_ACCOUNT_CREATE);
  }

  canEdit(): boolean {
    return this.permissions.hasAuthority(AppPermissions.CANDIDATE_ACCOUNT_EDIT);
  }

  canDelete(): boolean {
    return this.permissions.hasAuthority(AppPermissions.CANDIDATE_ACCOUNT_DELETE);
  }

  canHardDelete(): boolean {
    return this.permissions.hasAuthority(AppPermissions.CANDIDATE_ACCOUNT_HARD_DELETE);
  }

  candidateName(row: CandidateAccountItem): string {
    const name = [row.candidateFirstName, row.candidateLastName].filter(Boolean).join(' ').trim();
    return name || `ACCT-${row.candidateId}`;
  }

  statusLabel(row: CandidateAccountItem): string {
    return candidateAccountsRegisterStatusLabel(row.registerStatusId);
  }

  formatLastLogin(value?: string | null): string {
    if (!value) {
      return '—';
    }
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString();
  }

  load(): void {
    this.loading = true;
    const email = this.emailFilter.value.trim();
    this.api
      .list(this.pageIndex, this.pageSize, {
        email: email || null,
        isActive: null,
        registerStatusId: null,
      })
      .subscribe({
        next: ({ items, total }) => {
          this.data = items;
          this.total = total;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.snack.open(CANDIDATE_ACCOUNTS_ERRORS_LIST, CANDIDATE_ACCOUNTS_SNACK_CLOSE, { duration: 3500 });
        },
      });
  }

  onPage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.load();
  }

  openCreate(): void {
    this.openFormDialog({});
  }

  openEdit(row: CandidateAccountItem): void {
    this.openFormDialog({ account: row });
  }

  private openFormDialog(data: CandidateAccountFormDialogData): void {
    const ref = this.dialog.open<CandidateAccountFormDialogComponent, CandidateAccountFormDialogData, boolean>(
      CandidateAccountFormDialogComponent,
      { width: '480px', maxWidth: '96vw', data },
    );
    ref
      .afterClosed()
      .pipe(filter((saved): saved is boolean => saved === true))
      .subscribe(() => {
        this.snack.open(CANDIDATE_ACCOUNTS_SUCCESS_SAVED, CANDIDATE_ACCOUNTS_SNACK_CLOSE, { duration: 2500 });
        this.load();
      });
  }

  toggle(row: CandidateAccountItem, isActive: boolean): void {
    if (!this.canEdit()) {
      return;
    }
    this.savingId = row.id;
    this.api.updateActive(row.id, { isActive }).subscribe({
      next: (updated) => {
        row.isActive = updated.isActive;
        this.savingId = null;
      },
      error: () => {
        this.savingId = null;
        this.snack.open(CANDIDATE_ACCOUNTS_ERRORS_ACTIVE, CANDIDATE_ACCOUNTS_SNACK_CLOSE, { duration: 3500 });
        this.load();
      },
    });
  }

  softDelete(row: CandidateAccountItem): void {
    if (!this.canDelete()) {
      return;
    }
    if (!confirm(candidateAccountsSoftDeleteConfirm(row.email))) {
      return;
    }
    this.deletingId = row.id;
    this.api.softDelete(row.id).subscribe({
      next: () => {
        this.deletingId = null;
        this.snack.open(CANDIDATE_ACCOUNTS_SUCCESS_DELETED, CANDIDATE_ACCOUNTS_SNACK_CLOSE, { duration: 2500 });
        this.load();
      },
      error: () => {
        this.deletingId = null;
        this.snack.open(CANDIDATE_ACCOUNTS_ERRORS_DELETE, CANDIDATE_ACCOUNTS_SNACK_CLOSE, { duration: 3500 });
      },
    });
  }

  openHardDelete(row: CandidateAccountItem): void {
    if (!this.canHardDelete()) {
      return;
    }
    const ref = this.dialog.open<
      CandidateAccountHardDeleteDialogComponent,
      CandidateAccountHardDeleteDialogData,
      boolean
    >(CandidateAccountHardDeleteDialogComponent, {
      width: '480px',
      maxWidth: '96vw',
      data: { account: row },
    });
    ref
      .afterClosed()
      .pipe(filter((ok): ok is boolean => ok === true))
      .subscribe(() => {
        this.snack.open(CANDIDATE_ACCOUNTS_SUCCESS_HARD, CANDIDATE_ACCOUNTS_SNACK_CLOSE, { duration: 2500 });
        this.load();
      });
  }
}
