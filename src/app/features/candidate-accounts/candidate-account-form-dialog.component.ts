import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FeedbackDialogService } from '../../core/feedback/feedback-dialog.service';
import {
  CANDIDATE_ACCOUNTS_CANCEL,
  CANDIDATE_ACCOUNTS_DIALOG_CREATE,
  CANDIDATE_ACCOUNTS_DIALOG_EDIT,
  CANDIDATE_ACCOUNTS_ERRORS_SAVE,
  CANDIDATE_ACCOUNTS_FIELD_EMAIL,
  CANDIDATE_ACCOUNTS_FIELD_MUST_CHANGE,
  CANDIDATE_ACCOUNTS_FIELD_REGISTER_STATUS,
  CANDIDATE_ACCOUNTS_FIELD_SEND_MAIL,
  CANDIDATE_ACCOUNTS_SAVE,
  CANDIDATE_ACCOUNTS_SAVING,
  CANDIDATE_ACCOUNTS_SNACK_CLOSE,
  CANDIDATE_ACCOUNTS_STATUS_EMAIL,
  CANDIDATE_ACCOUNTS_STATUS_PENDING,
  CANDIDATE_ACCOUNTS_STATUS_PHONE,
} from '../../core/i18n/candidate-accounts-labels';
import { CandidateAccountApiService } from '../../core/services/candidate-account-api.service';
import { CandidateAccountItem } from '../../shared/models/candidate-account.model';

export interface CandidateAccountFormDialogData {
  account?: CandidateAccountItem;
}

@Component({
  selector: 'sh-candidate-account-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  templateUrl: './candidate-account-form-dialog.component.html',
  styleUrl: './candidate-account-form-dialog.component.scss',
})
export class CandidateAccountFormDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<CandidateAccountFormDialogComponent, boolean>);
  readonly data = inject<CandidateAccountFormDialogData>(MAT_DIALOG_DATA);
  private readonly api = inject(CandidateAccountApiService);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly fb = inject(FormBuilder);

  saving = false;
  readonly isEdit = !!this.data.account;
  readonly title = this.isEdit ? CANDIDATE_ACCOUNTS_DIALOG_EDIT : CANDIDATE_ACCOUNTS_DIALOG_CREATE;
  readonly fieldEmail = CANDIDATE_ACCOUNTS_FIELD_EMAIL;
  readonly fieldSendMail = CANDIDATE_ACCOUNTS_FIELD_SEND_MAIL;
  readonly fieldMustChange = CANDIDATE_ACCOUNTS_FIELD_MUST_CHANGE;
  readonly fieldRegisterStatus = CANDIDATE_ACCOUNTS_FIELD_REGISTER_STATUS;
  readonly cancelLabel = CANDIDATE_ACCOUNTS_CANCEL;
  readonly saveLabel = CANDIDATE_ACCOUNTS_SAVE;
  readonly savingLabel = CANDIDATE_ACCOUNTS_SAVING;
  readonly statusOptions = [
    { value: 1, label: CANDIDATE_ACCOUNTS_STATUS_PENDING },
    { value: 2, label: CANDIDATE_ACCOUNTS_STATUS_EMAIL },
    { value: 3, label: CANDIDATE_ACCOUNTS_STATUS_PHONE },
  ];

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    sendRegisterEmail: [true],
    mustChangePassword: [true],
    registerStatusId: [1 as number, Validators.required],
  });

  ngOnInit(): void {
    if (this.data.account) {
      this.form.reset({
        email: this.data.account.email,
        sendRegisterEmail: true,
        mustChangePassword: this.data.account.mustChangePassword,
        registerStatusId: this.data.account.registerStatusId,
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.saving = true;
    const request$ = this.isEdit && this.data.account
      ? this.api.update(this.data.account.id, {
          email: value.email.trim(),
          mustChangePassword: value.mustChangePassword,
          registerStatusId: value.registerStatusId,
        })
      : this.api.create({
          email: value.email.trim(),
          sendRegisterEmail: value.sendRegisterEmail,
        });

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.saving = false;
        this.feedback.showApiError(err, { fallbackMessage: CANDIDATE_ACCOUNTS_ERRORS_SAVE });
      },
    });
  }
}
