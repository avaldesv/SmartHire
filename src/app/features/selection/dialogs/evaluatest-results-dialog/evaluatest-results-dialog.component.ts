import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PositionService } from '../../../../core/services/position.service';
import { FeedbackDialogService } from '../../../../core/feedback/feedback-dialog.service';
import {
  EVALUATEST_RESULTS_CLOSE,
  EVALUATEST_RESULTS_CLOSE_ARIA,
  EVALUATEST_RESULTS_DIALOG_TITLE,
  EVALUATEST_RESULTS_DOWNLOAD_PDF,
  EVALUATEST_RESULTS_EMPTY,
  EVALUATEST_RESULTS_ERROR,
  EVALUATEST_RESULTS_LEVEL,
  EVALUATEST_RESULTS_LOADING,
  EVALUATEST_RESULTS_PDF_ERROR,
  EVALUATEST_RESULTS_PDF_SUCCESS,
  EVALUATEST_RESULTS_PERCENT,
  EVALUATEST_RESULTS_SCORE,
} from '../../../../core/i18n/evaluatest-results-labels';
import { EvaluatestResultsResponse } from '../../../../shared/models/evaluatest-results.model';

export interface EvaluatestResultsDialogData {
  positionId: number;
  applicationId: number;
  candidateName: string;
}

@Component({
  selector: 'sh-evaluatest-results-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, DatePipe],
  template: `
    <div class="sh-catalog-dialog-header" mat-dialog-title>
      <span class="sh-catalog-dialog-header__text">{{ titleLabel }}</span>
      <button mat-icon-button type="button" [attr.aria-label]="closeAria" (click)="close()">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content class="et-content">
      @if (loading) {
        <div class="loading">
          <mat-spinner diameter="36" />
          <span>{{ loadingLabel }}</span>
        </div>
      } @else if (error) {
        <p class="error">{{ error }}</p>
      } @else if (results) {
        <div class="candidate-row">
          <div class="avatar">{{ initials }}</div>
          <div class="meta">
            <div class="name">{{ data.candidateName }}</div>
            @if (results.evaluatedAt) {
              <div class="muted">{{ results.evaluatedAt | date: 'medium' }}</div>
            }
          </div>
        </div>

        @if (results.variables.length === 0) {
          <p class="muted">{{ emptyLabel }}</p>
        } @else {
          <div class="variables">
            @for (variable of results.variables; track trackVar($index, variable)) {
              <article class="variable-card">
                <div class="v-head">
                  <strong>{{ variable.nameVariableEvaluated || variable.shortNameVariableEvaluated || '—' }}</strong>
                  @if (variable.shortNameVariableEvaluated) {
                    <span class="chip">{{ variable.shortNameVariableEvaluated }}</span>
                  }
                </div>
                <div class="v-metrics">
                  @if (variable.score != null) {
                    <span>{{ scoreLabel }}: <strong>{{ variable.score }}</strong></span>
                  }
                  @if (variable.domainLevel) {
                    <span>{{ levelLabel }}: <strong>{{ variable.domainLevel }}</strong></span>
                  }
                  @if (variable.domainPercentage != null) {
                    <span>{{ percentLabel }}: <strong>{{ variable.domainPercentage }}%</strong></span>
                  }
                </div>
                @if (variable.interpretationForEvaluator) {
                  <p class="interpretation">{{ variable.interpretationForEvaluator }}</p>
                }
              </article>
            }
          </div>
        }
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="close()">{{ closeLabel }}</button>
      <button
        mat-flat-button
        color="primary"
        type="button"
        [disabled]="!results || downloading"
        (click)="downloadPdf()"
      >
        <mat-icon>download</mat-icon>
        {{ downloadLabel }}
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .et-content {
      min-width: min(720px, 90vw);
      max-height: 70vh;
    }
    .loading {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 24px 0;
    }
    .error {
      color: #b3261e;
    }
    .candidate-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #e8eef7;
      display: grid;
      place-items: center;
      font-weight: 600;
    }
    .name {
      font-weight: 600;
    }
    .muted {
      color: #667085;
      font-size: 0.875rem;
    }
    .variables {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .variable-card {
      border: 1px solid #e4e7ec;
      border-radius: 8px;
      padding: 12px 14px;
    }
    .v-head {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    .chip {
      font-size: 0.75rem;
      background: #eef2ff;
      color: #3538cd;
      padding: 2px 8px;
      border-radius: 999px;
    }
    .v-metrics {
      display: flex;
      flex-wrap: wrap;
      gap: 12px 16px;
      font-size: 0.875rem;
      margin-bottom: 8px;
    }
    .interpretation {
      white-space: pre-wrap;
      font-size: 0.875rem;
      line-height: 1.45;
      margin: 0;
      color: #344054;
    }
  `,
})
export class EvaluatestResultsDialogComponent implements OnInit {
  readonly data = inject<EvaluatestResultsDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<EvaluatestResultsDialogComponent>);
  private readonly positionService = inject(PositionService);
  private readonly feedback = inject(FeedbackDialogService);

  readonly titleLabel = EVALUATEST_RESULTS_DIALOG_TITLE;
  readonly closeAria = EVALUATEST_RESULTS_CLOSE_ARIA;
  readonly closeLabel = EVALUATEST_RESULTS_CLOSE;
  readonly downloadLabel = EVALUATEST_RESULTS_DOWNLOAD_PDF;
  readonly loadingLabel = EVALUATEST_RESULTS_LOADING;
  readonly emptyLabel = EVALUATEST_RESULTS_EMPTY;
  readonly scoreLabel = EVALUATEST_RESULTS_SCORE;
  readonly levelLabel = EVALUATEST_RESULTS_LEVEL;
  readonly percentLabel = EVALUATEST_RESULTS_PERCENT;

  loading = true;
  downloading = false;
  error: string | null = null;
  results: EvaluatestResultsResponse | null = null;

  get initials(): string {
    const parts = (this.data.candidateName || '').trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) {
      return '?';
    }
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  ngOnInit(): void {
    this.positionService
      .getEvaluatestResults(this.data.positionId, this.data.applicationId)
      .subscribe({
        next: (results) => {
          this.results = results;
          this.loading = false;
        },
        error: () => {
          this.error = EVALUATEST_RESULTS_ERROR;
          this.loading = false;
        },
      });
  }

  trackVar(index: number, variable: { idVariable: number | null }): number | string {
    return variable.idVariable ?? index;
  }

  downloadPdf(): void {
    if (!this.results || this.downloading) {
      return;
    }
    this.downloading = true;
    this.positionService
      .downloadEvaluatestResultsPdf(this.data.positionId, this.data.applicationId)
      .subscribe({
        next: ({ blob, filename }) => {
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = filename;
          anchor.click();
          URL.revokeObjectURL(url);
          this.downloading = false;
          this.feedback.showSuccess(EVALUATEST_RESULTS_PDF_SUCCESS);
        },
        error: (err) => {
          this.downloading = false;
          this.feedback.showApiError(err, { fallbackMessage: EVALUATEST_RESULTS_PDF_ERROR });
        },
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}
