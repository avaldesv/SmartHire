import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FeedbackDialogService } from '../../../core/feedback/feedback-dialog.service';
import {
  PORTAL_CRED_CANCEL,
  PORTAL_CRED_CLOSE,
  PORTAL_CRED_EMPTY,
  PORTAL_CRED_LOAD_ERROR,
  PORTAL_CRED_PASSWORD,
  PORTAL_CRED_PASSWORD_KEEP_HINT,
  PORTAL_CRED_SAVE,
  PORTAL_CRED_SAVE_ERROR,
  PORTAL_CRED_SAVE_SUCCESS,
  PORTAL_CRED_STATUS_CONFIGURED,
  PORTAL_CRED_STATUS_EMPTY,
  PORTAL_CRED_SUBTITLE,
  PORTAL_CRED_TITLE,
  PORTAL_CRED_USERNAME,
} from '../../../core/i18n/portal-credentials-labels';
import { JobPortalCredentialsApiService } from '../../../core/services/job-portal-credentials-api.service';
import { JobPortalCredentialItem } from '../../../shared/models/job-portal-credentials.model';
import {
  ShModalActionsDirective,
  ShModalFormComponent,
} from '../../../shared/components/modal-form/sh-modal-form.component';

@Component({
  selector: 'sh-job-portal-credentials-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ShModalFormComponent,
    ShModalActionsDirective,
  ],
  templateUrl: './job-portal-credentials-dialog.component.html',
  styleUrl: './job-portal-credentials-dialog.component.scss',
})
export class JobPortalCredentialsDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<JobPortalCredentialsDialogComponent>);
  private readonly api = inject(JobPortalCredentialsApiService);
  private readonly fb = inject(FormBuilder);
  private readonly feedback = inject(FeedbackDialogService);

  readonly labels = {
    title: PORTAL_CRED_TITLE,
    subtitle: PORTAL_CRED_SUBTITLE,
    username: PORTAL_CRED_USERNAME,
    password: PORTAL_CRED_PASSWORD,
    configured: PORTAL_CRED_STATUS_CONFIGURED,
    notConfigured: PORTAL_CRED_STATUS_EMPTY,
    close: PORTAL_CRED_CLOSE,
    save: PORTAL_CRED_SAVE,
    cancel: PORTAL_CRED_CANCEL,
    passwordKeepHint: PORTAL_CRED_PASSWORD_KEEP_HINT,
    empty: PORTAL_CRED_EMPTY,
  };

  loading = true;
  saving = false;
  items: JobPortalCredentialItem[] = [];
  showPassword: Record<number, boolean> = {};

  readonly form = this.fb.nonNullable.group({
    rows: this.fb.array([] as ReturnType<JobPortalCredentialsDialogComponent['createRow']>[]),
  });

  get rows(): FormArray {
    return this.form.controls.rows;
  }

  ngOnInit(): void {
    this.api.getMyCredentials().subscribe({
      next: (res) => {
        this.items = res.items ?? [];
        this.rows.clear();
        for (const item of this.items) {
          this.rows.push(this.createRow(item));
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.feedback.showError(PORTAL_CRED_LOAD_ERROR, PORTAL_CRED_LOAD_ERROR);
      },
    });
  }

  createRow(item: JobPortalCredentialItem) {
    return this.fb.nonNullable.group({
      jobPortalId: [item.jobPortalId],
      username: [item.username ?? ''],
      password: [''],
      hasPassword: [item.hasPassword],
    });
  }

  portalName(index: number): string {
    return this.items[index]?.portalName ?? '';
  }

  isConfigured(index: number): boolean {
    const row = this.rows.at(index);
    const username = String(row.get('username')?.value ?? '').trim();
    const password = String(row.get('password')?.value ?? '');
    const hadPassword = Boolean(row.get('hasPassword')?.value);
    return username.length > 0 || password.length > 0 || hadPassword;
  }

  togglePassword(index: number): void {
    this.showPassword[index] = !this.showPassword[index];
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.saving) {
      return;
    }
    this.saving = true;
    const items = this.rows.getRawValue().map((row) => {
      const username = String(row.username ?? '').trim();
      const passwordRaw = String(row.password ?? '');
      const payload: {
        jobPortalId: number;
        username: string | null;
        password?: string | null;
      } = {
        jobPortalId: row.jobPortalId,
        username: username.length ? username : null,
      };
      if (passwordRaw.length > 0) {
        payload.password = passwordRaw;
      } else if (!username && !row.hasPassword) {
        payload.password = '';
      }
      return payload;
    });

    this.api.saveMyCredentials({ items }).subscribe({
      next: () => {
        this.saving = false;
        this.feedback.showSuccess(PORTAL_CRED_SAVE_SUCCESS);
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.saving = false;
        this.feedback.showApiError(err, { fallbackMessage: PORTAL_CRED_SAVE_ERROR });
      },
    });
  }
}
