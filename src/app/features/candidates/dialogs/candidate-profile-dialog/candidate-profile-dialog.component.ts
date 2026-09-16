import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CANDIDATE_PROFILE_DIALOG_CLOSE } from '../../../../core/i18n/candidate-profile-labels';
import { CandidateProfileViewComponent } from '../../profile/candidate-profile-view.component';

export interface CandidateProfileDialogData {
  candidateId: number;
  candidateName?: string;
}

@Component({
  selector: 'sh-candidate-profile-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CandidateProfileViewComponent],
  templateUrl: './candidate-profile-dialog.component.html',
  styleUrl: './candidate-profile-dialog.component.scss',
})
export class CandidateProfileDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CandidateProfileDialogComponent>);
  readonly data = inject<CandidateProfileDialogData>(MAT_DIALOG_DATA);

  readonly closeLabel = CANDIDATE_PROFILE_DIALOG_CLOSE;

  title(): string {
    return this.data.candidateName?.trim() || `#${this.data.candidateId}`;
  }

  close(): void {
    this.dialogRef.close();
  }
}
