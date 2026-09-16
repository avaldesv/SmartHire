import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FeedbackDialogService } from '../../core/feedback/feedback-dialog.service';
import { FEEDBACK_GENERIC_WARNING_TITLE } from '../../core/i18n/feedback-labels';
import {
  CANDIDATE_ACCOUNTS_CANCEL,
  CANDIDATE_ACCOUNTS_COL_EMAIL,
  CANDIDATE_ACCOUNTS_ERRORS_HARD,
  CANDIDATE_ACCOUNTS_HARD_CONFIRM,
  CANDIDATE_ACCOUNTS_HARD_HINT,
  CANDIDATE_ACCOUNTS_HARD_TITLE,
  CANDIDATE_ACCOUNTS_SNACK_CLOSE,
} from '../../core/i18n/candidate-accounts-labels';
import { CandidateAccountApiService } from '../../core/services/candidate-account-api.service';
import { CandidateAccountItem } from '../../shared/models/candidate-account.model';
import {
  ShModalActionsDirective,
  ShModalFormComponent,
} from '../../shared/components/modal-form/sh-modal-form.component';

export interface CandidateAccountHardDeleteDialogData {
  account: CandidateAccountItem;
}

@Component({
  selector: 'sh-candidate-account-hard-delete-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ShModalFormComponent,
    ShModalActionsDirective,
  ],
  templateUrl: './candidate-account-hard-delete-dialog.component.html',
  styleUrl: './candidate-account-hard-delete-dialog.component.scss',
})
export class CandidateAccountHardDeleteDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CandidateAccountHardDeleteDialogComponent, boolean>);
  readonly data = inject<CandidateAccountHardDeleteDialogData>(MAT_DIALOG_DATA);
  private readonly api = inject(CandidateAccountApiService);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly fb = inject(FormBuilder);

  deleting = false;
  readonly title = CANDIDATE_ACCOUNTS_HARD_TITLE;
  readonly hint = CANDIDATE_ACCOUNTS_HARD_HINT;
  readonly confirmLabel = CANDIDATE_ACCOUNTS_HARD_CONFIRM;
  readonly cancelLabel = CANDIDATE_ACCOUNTS_CANCEL;
  readonly emailLabel = CANDIDATE_ACCOUNTS_COL_EMAIL;
  readonly expectedEmail = this.data.account.email;

  readonly form = this.fb.nonNullable.group({
    confirmEmail: ['', [Validators.required, Validators.email]],
  });

  get matches(): boolean {
    return this.form.controls.confirmEmail.value.trim().toLowerCase() === this.expectedEmail.toLowerCase();
  }

  confirm(): void {
    if (!this.matches) {
      this.form.controls.confirmEmail.markAsTouched();
      return;
    }
    this.deleting = true;
    this.api.hardDelete(this.data.account.id, { confirmEmail: this.form.controls.confirmEmail.value.trim() }).subscribe({
      next: () => {
        this.deleting = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.deleting = false;
        this.feedback.showApiError(err, { fallbackMessage: CANDIDATE_ACCOUNTS_ERRORS_HARD });
      },
    });
  }
}
