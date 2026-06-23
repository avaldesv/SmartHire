import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface PreselectionCompatibilityDialogData {
  candidateName: string;
  currentCompatibility: number;
}

@Component({
  selector: 'sh-preselection-compatibility-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './preselection-compatibility-dialog.component.html',
  styleUrl: './preselection-compatibility-dialog.component.scss',
})
export class PreselectionCompatibilityDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<PreselectionCompatibilityDialogComponent, number | undefined>);
  readonly data = inject<PreselectionCompatibilityDialogData>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    compatibilityPercent: [
      this.data.currentCompatibility,
      [Validators.required, Validators.min(0), Validators.max(100)],
    ],
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.form.controls.compatibilityPercent.value);
  }

  cancel(): void {
    this.dialogRef.close(undefined);
  }
}
