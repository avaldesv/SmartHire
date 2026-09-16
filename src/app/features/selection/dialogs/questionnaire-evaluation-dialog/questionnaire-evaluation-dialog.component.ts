import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CandidateApplicationApiService } from '../../../../core/services/candidate-application-api.service';
import { QuestionnaireEvaluationResponse } from '../../../../shared/models/candidate-application.model';
import { FeedbackDialogService } from '../../../../core/feedback/feedback-dialog.service';

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
      <span class="sh-catalog-dialog-header__text">Evaluación del cuestionario</span>
      <button mat-icon-button type="button" aria-label="Cerrar" (click)="close()">
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
            {{ evaluation.inviteStatus === 'ANSWERED' ? 'Respondido' : evaluation.inviteStatus }}
          </span>
        </div>

        <div class="score-row">
          <div>
            <span class="label">Puntaje automático</span>
            <strong>{{ scoreLabel }}</strong>
          </div>
          @if (evaluation.answeredAt) {
            <div class="muted">Respondido: {{ evaluation.answeredAt | date: 'medium' }}</div>
          }
          @if ((evaluation.openPendingCount ?? 0) > 0) {
            <div class="muted">Abiertas pendientes: {{ evaluation.openPendingCount }}</div>
          }
        </div>

        <h3 class="section-title">Respuestas del candidato</h3>
        <div class="answers">
          @for (answer of evaluation.answers; track answer.answerId; let i = $index) {
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
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-flat-button color="primary" type="button" (click)="close()">Cerrar</button>
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
    .name {
      font-weight: 700;
    }
    .role {
      color: #64748b;
      font-size: 0.9rem;
    }
    .status-chip {
      margin-left: auto;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.65rem;
      border-radius: 999px;
      background: #f1f5f9;
      font-size: 0.85rem;
      font-weight: 600;
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
  `,
})
export class QuestionnaireEvaluationDialogComponent implements OnInit {
  readonly data = inject<QuestionnaireEvaluationDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<QuestionnaireEvaluationDialogComponent>);
  private readonly applicationApi = inject(CandidateApplicationApiService);
  private readonly feedback = inject(FeedbackDialogService);

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
            ? 'Disponible cuando el candidato responda'
            : status === 404
              ? 'El candidato aún no ha respondido el cuestionario'
              : 'No se pudo cargar la evaluación';
        this.error = msg;
        this.feedback.showApiError(err, { fallbackMessage: msg });
      },
    });
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

  statusLabel(status: string): string {
    switch (status) {
      case 'AUTO_CORRECT':
        return 'Correcta';
      case 'AUTO_INCORRECT':
        return 'Incorrecta';
      case 'PENDING_MANUAL':
        return 'Pendiente';
      default:
        return status;
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
