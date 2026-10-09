import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CandidateApplicationApiService } from '../../../../core/services/candidate-application-api.service';
import { QuestionnaireEvaluationResponse } from '../../../../shared/models/candidate-application.model';
import { FeedbackDialogService } from '../../../../core/feedback/feedback-dialog.service';
import {
  EVAL_DIALOG_ANSWERS_TITLE,
  EVAL_DIALOG_ANSWERED_AT,
  EVAL_DIALOG_AUTO_SCORE,
  EVAL_DIALOG_CLOSE,
  EVAL_DIALOG_CLOSE_ARIA,
  EVAL_DIALOG_ERROR_GENERIC,
  EVAL_DIALOG_ERROR_NOT_ANSWERED,
  EVAL_DIALOG_ERROR_PENDING,
  EVAL_DIALOG_EXPECTED,
  EVAL_DIALOG_OPEN_PENDING,
  EVAL_DIALOG_STATUS_ANSWERED,
  EVAL_DIALOG_STATUS_CORRECT,
  EVAL_DIALOG_STATUS_INCORRECT,
  EVAL_DIALOG_STATUS_PENDING_MANUAL,
  EVAL_DIALOG_TITLE,
  EVAL_DIALOG_TITLE_AI,
  EVAL_DIALOG_TRANSCRIPT_TITLE,
} from '../../../../core/i18n/questionnaire-evaluation-labels';

export interface QuestionnaireEvaluationDialogData {
  applicationId: number;
  candidateName: string;
}

@Component({
  selector: 'sh-questionnaire-evaluation-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, DatePipe],
  template: `
    <div class="sh-catalog-dialog-header" mat-dialog-title>
      <span class="sh-catalog-dialog-header__text">{{ titleLabel }}</span>
      <button mat-icon-button type="button" [attr.aria-label]="closeAria" (click)="close()">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content class="eval-content">
      @if (loading) {
        <div class="loading"><mat-spinner diameter="36" /></div>
      } @else if (error) {
        <p class="error">{{ error }}</p>
      } @else if (evaluation) {
        <div class="candidate-row">
          <div class="avatar">{{ initials }}</div>
          <div class="meta">
            <div class="name">{{ evaluation.candidate.name || data.candidateName }}</div>
            <div class="role">{{ evaluation.position.positionName || '—' }}</div>
          </div>
          <span class="status-chip" [class.ok]="evaluation.inviteStatus === 'ANSWERED'">
            <mat-icon>{{ evaluation.inviteStatus === 'ANSWERED' ? 'check_circle' : 'schedule' }}</mat-icon>
            {{ evaluation.inviteStatus === 'ANSWERED' ? statusAnswered : evaluation.inviteStatus }}
          </span>
        </div>

        @if (!isAiInterview) {
          <div class="score-row">
            <div>
              <span class="label">{{ autoScoreLabel }}</span>
              <strong>{{ scoreLabel }}</strong>
            </div>
            @if (evaluation.answeredAt) {
              <div class="muted">{{ answeredAtLabel }}: {{ evaluation.answeredAt | date: 'medium' }}</div>
            }
            @if ((evaluation.openPendingCount ?? 0) > 0) {
              <div class="muted">{{ openPendingLabel }}: {{ evaluation.openPendingCount }}</div>
            }
          </div>
        } @else if (evaluation.answeredAt) {
          <div class="score-row">
            <div class="muted">{{ answeredAtLabel }}: {{ evaluation.answeredAt | date: 'medium' }}</div>
          </div>
        }

        <h3 class="section-title">{{ answersTitle }}</h3>
        <div class="answers">
          @for (answer of evaluation.answers; track trackAnswer($index, answer); let i = $index) {
            <article class="answer-card">
              <div class="q-head">
                <span class="q-num">{{ i + 1 }}.</span>
                <span class="q-text">{{ answer.questionText }}</span>
                @if (answer.evaluationStatus) {
                  <span class="tag" [class.ok]="answer.correct === true" [class.bad]="answer.correct === false">
                    {{ statusLabel(answer.evaluationStatus) }}
                  </span>
                }
              </div>
              @if (answer.expectedAnswer) {
                <p class="expected">{{ expectedLabel }}: {{ answer.expectedAnswer }}</p>
              }
              <p class="a-text">{{ answer.answerText || '—' }}</p>
              <div class="a-meta">
                @if (answer.weightApplied != null) {
                  <span>Peso: {{ answer.weightApplied }}</span>
                }
                @if (answer.pointsEarned != null) {
                  <span>Puntos: {{ answer.pointsEarned }}</span>
                }
              </div>
            </article>
          }
        </div>

        @if (isAiInterview && (evaluation.transcript?.length ?? 0) > 0) {
          <h3 class="section-title">{{ transcriptTitle }}</h3>
          <div class="transcript">
            @for (line of evaluation.transcript!; track $index) {
              <div class="transcript-line" [class.assistant]="line.role === 'assistant'" [class.user]="line.role !== 'assistant'">
                <span class="role">{{ line.role }}</span>
                <p>{{ line.text }}</p>
              </div>
            }
          </div>
        }
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-flat-button color="primary" type="button" (click)="close()">{{ closeLabel }}</button>
    </mat-dialog-actions>
  `,
  styles: `
    :host {
      display: block;
      min-width: min(920px, 92vw);
    }
    .eval-content {
      padding-top: 0.75rem !important;
      max-height: 70vh;
    }
    .loading {
      display: flex;
      justify-content: center;
      padding: 2rem;
    }
    .error {
      color: #b42318;
    }
    .candidate-row {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      margin-bottom: 1rem;
    }
    .avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #0f766e;
      color: #fff;
      display: grid;
      place-items: center;
      font-weight: 700;
    }
    .meta {
      flex: 1;
      min-width: 0;
    }
    .name {
      font-weight: 700;
    }
    .role {
      color: #64748b;
      font-size: 0.9rem;
    }
    .status-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.55rem;
      border-radius: 999px;
      background: #e2e8f0;
      font-size: 0.85rem;
    }
    .status-chip.ok {
      background: #dcfce7;
      color: #166534;
    }
    .status-chip mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    .score-row {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1rem;
      padding: 0.75rem 1rem;
      background: #f8fafc;
      border-radius: 8px;
    }
    .score-row .label {
      display: block;
      font-size: 0.8rem;
      color: #64748b;
    }
    .muted {
      color: #64748b;
      font-size: 0.9rem;
      align-self: center;
    }
    .section-title {
      margin: 0 0 0.75rem;
      font-size: 1rem;
    }
    .answers {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .answer-card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 0.85rem 1rem;
    }
    .q-head {
      display: flex;
      gap: 0.4rem;
      align-items: flex-start;
      margin-bottom: 0.4rem;
    }
    .q-num {
      font-weight: 700;
    }
    .q-text {
      flex: 1;
      font-weight: 600;
    }
    .tag {
      font-size: 0.75rem;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      background: #e2e8f0;
      white-space: nowrap;
    }
    .tag.ok {
      background: #dcfce7;
      color: #166534;
    }
    .tag.bad {
      background: #fee2e2;
      color: #991b1b;
    }
    .expected {
      margin: 0 0 0.35rem;
      font-size: 0.85rem;
      color: #64748b;
    }
    .a-text {
      margin: 0;
      white-space: pre-wrap;
      color: #334155;
    }
    .a-meta {
      display: flex;
      gap: 1rem;
      margin-top: 0.4rem;
      font-size: 0.8rem;
      color: #64748b;
    }
    .transcript {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }
    .transcript-line {
      border-radius: 8px;
      padding: 0.65rem 0.85rem;
      background: #f1f5f9;
    }
    .transcript-line.assistant {
      background: #ecfeff;
    }
    .transcript-line .role {
      display: block;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 0.25rem;
    }
    .transcript-line p {
      margin: 0;
      white-space: pre-wrap;
    }
  `,
})
export class QuestionnaireEvaluationDialogComponent implements OnInit {
  readonly data = inject<QuestionnaireEvaluationDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<QuestionnaireEvaluationDialogComponent>);
  private readonly applicationApi = inject(CandidateApplicationApiService);
  private readonly feedback = inject(FeedbackDialogService);

  readonly closeAria = EVAL_DIALOG_CLOSE_ARIA;
  readonly closeLabel = EVAL_DIALOG_CLOSE;
  readonly autoScoreLabel = EVAL_DIALOG_AUTO_SCORE;
  readonly answeredAtLabel = EVAL_DIALOG_ANSWERED_AT;
  readonly openPendingLabel = EVAL_DIALOG_OPEN_PENDING;
  readonly answersTitle = EVAL_DIALOG_ANSWERS_TITLE;
  readonly transcriptTitle = EVAL_DIALOG_TRANSCRIPT_TITLE;
  readonly expectedLabel = EVAL_DIALOG_EXPECTED;
  readonly statusAnswered = EVAL_DIALOG_STATUS_ANSWERED;

  loading = true;
  error = '';
  evaluation: QuestionnaireEvaluationResponse | null = null;

  ngOnInit(): void {
    this.applicationApi.getQuestionnaireEvaluation(this.data.applicationId).subscribe({
      next: (res) => {
        this.evaluation = res;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        const status = (err as { status?: number })?.status;
        const msg =
          status === 409
            ? EVAL_DIALOG_ERROR_PENDING
            : status === 404
              ? EVAL_DIALOG_ERROR_NOT_ANSWERED
              : EVAL_DIALOG_ERROR_GENERIC;
        this.error = msg;
        this.feedback.showApiError(err, { fallbackMessage: msg });
      },
    });
  }

  get isAiInterview(): boolean {
    return (this.evaluation?.modality ?? '').toUpperCase() === 'AI_INTERVIEW';
  }

  get titleLabel(): string {
    return this.isAiInterview ? EVAL_DIALOG_TITLE_AI : EVAL_DIALOG_TITLE;
  }

  get initials(): string {
    const name = this.evaluation?.candidate?.name || this.data.candidateName || '';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) {
      return '?';
    }
    return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();
  }

  get scoreLabel(): string {
    const score = this.evaluation?.autoScorePercent;
    if (score == null) {
      return '—';
    }
    return `${score}%`;
  }

  trackAnswer(
    index: number,
    answer: QuestionnaireEvaluationResponse['answers'][number],
  ): string | number {
    return answer.answerId ?? `${answer.questionId ?? 'q'}-${index}`;
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'AUTO_CORRECT':
      case 'correct':
        return EVAL_DIALOG_STATUS_CORRECT;
      case 'AUTO_INCORRECT':
      case 'incorrect':
        return EVAL_DIALOG_STATUS_INCORRECT;
      case 'PENDING_MANUAL':
        return EVAL_DIALOG_STATUS_PENDING_MANUAL;
      default:
        return status;
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
