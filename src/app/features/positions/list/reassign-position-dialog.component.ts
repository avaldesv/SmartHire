import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import {
  POSITIONS_ASSIGN_CONFIRM,
  POSITIONS_ASSIGN_TITLE,
  POSITIONS_ASSIGN_USER,
  POSITIONS_REASON_DIALOG_CANCEL,
  POSITIONS_REASSIGN_CONFIRM,
  POSITIONS_REASSIGN_REASON,
  POSITIONS_REASSIGN_TITLE,
  POSITIONS_REASSIGN_USER,
} from '../../../core/i18n/positions-labels';
import { SecurityUserService } from '../../../core/services/security-user.service';
import { SecurityUser } from '../../../shared/models/security-user.model';

export interface ReassignPositionDialogData {
  currentAssignedUserId?: number | null;
  initialAssign?: boolean;
}

export interface ReassignPositionDialogResult {
  assignedUserId: number;
  reason: string | null;
}

@Component({
  selector: 'sh-reassign-position-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="sh-catalog-dialog-header" mat-dialog-title>
      <span class="sh-catalog-dialog-header__text">{{ title }}</span>
    </div>
    <mat-dialog-content class="sh-catalog-dialog-body">
      <div class="sh-catalog-dialog-gap" aria-hidden="true"></div>
      @if (loading) {
        <div class="loading-wrap"><mat-spinner diameter="32" /></div>
      } @else {
        <form [formGroup]="form" class="form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ userLabel }}</mat-label>
            <mat-select formControlName="assignedUserId">
              @for (user of users; track user.id) {
                <mat-option [value]="user.id">{{ displayName(user) }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ reasonLabel }}</mat-label>
            <textarea matInput rows="3" formControlName="reason"></textarea>
          </mat-form-field>
        </form>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="dialogRef.close(null)">{{ cancelLabel }}</button>
      <button
        mat-flat-button
        color="primary"
        type="button"
        [disabled]="loading || form.invalid"
        (click)="confirm()"
      >
        {{ confirmLabel }}
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .full-width {
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
    }
    .form {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
    }
    .loading-wrap {
      display: flex;
      justify-content: center;
      padding: 24px;
    }
  `,
})
export class ReassignPositionDialogComponent implements OnInit {
  readonly dialogRef = inject(
    MatDialogRef<ReassignPositionDialogComponent, ReassignPositionDialogResult | null>,
  );
  private readonly data = inject<ReassignPositionDialogData>(MAT_DIALOG_DATA, { optional: true });
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(SecurityUserService);

  readonly title = this.data?.initialAssign ? POSITIONS_ASSIGN_TITLE : POSITIONS_REASSIGN_TITLE;
  readonly userLabel = this.data?.initialAssign ? POSITIONS_ASSIGN_USER : POSITIONS_REASSIGN_USER;
  readonly reasonLabel = POSITIONS_REASSIGN_REASON;
  readonly confirmLabel = this.data?.initialAssign ? POSITIONS_ASSIGN_CONFIRM : POSITIONS_REASSIGN_CONFIRM;
  readonly cancelLabel = POSITIONS_REASON_DIALOG_CANCEL;

  loading = true;
  users: SecurityUser[] = [];

  readonly form = this.fb.nonNullable.group({
    assignedUserId: [null as number | null, Validators.required],
    reason: [''],
  });

  ngOnInit(): void {
    this.userService.list(0, 100).subscribe({
      next: (res: { items: SecurityUser[]; total: number }) => {
        this.users = res.items.filter((u: SecurityUser) => u.isActive);
        const current = this.data?.currentAssignedUserId ?? null;
        if (current) {
          this.form.controls.assignedUserId.setValue(current);
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  displayName(user: SecurityUser): string {
    const name = `${user.name ?? ''} ${user.lastName ?? ''}`.trim();
    return name || user.email || user.username;
  }

  confirm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const assignedUserId = this.form.controls.assignedUserId.value!;
    const reason = this.form.controls.reason.value.trim();
    this.dialogRef.close({
      assignedUserId,
      reason: reason || null,
    });
  }
}
