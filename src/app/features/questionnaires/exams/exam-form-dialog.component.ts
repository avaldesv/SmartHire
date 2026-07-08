import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  QEXAM_CANCEL,
  QEXAM_CLOSE,
  QEXAM_DIALOG_EDIT,
  QEXAM_DIALOG_NEW,
  QEXAM_ERRORS_LOAD,
  QEXAM_ERRORS_MAX_ATTEMPTS,
  QEXAM_ERRORS_SAVE,
  QEXAM_FIELD_ACCEPTANCE,
  QEXAM_FIELD_DEFAULT_WEIGHT,
  QEXAM_FIELD_DESCRIPTION,
  QEXAM_FIELD_END_DATE,
  QEXAM_FIELD_GENERATION_CONFIG,
  QEXAM_FIELD_MAX_ATTEMPTS,
  QEXAM_FIELD_MAX_ATTEMPTS_HINT,
  QEXAM_FIELD_NAME,
  QEXAM_FIELD_NUMBER_OF_QUESTIONS,
  QEXAM_FIELD_QUESTIONNAIRE,
  QEXAM_FIELD_RANDOM_SEED,
  QEXAM_RANDOM_SEED_EXAMPLE_EMPTY,
  QEXAM_RANDOM_SEED_EXAMPLE_FIXED,
  QEXAM_RANDOM_SEED_HINT_EXAMPLE_TITLE,
  QEXAM_RANDOM_SEED_HINT_BODY,
  QEXAM_RANDOM_SEED_HINT_TITLE,
  QEXAM_FIELD_RETRY_DELAY,
  QEXAM_FIELD_START_DATE,
  QEXAM_FIELD_STATUS,
  QEXAM_FIELD_TIME_LIMIT,
  QEXAM_FIELD_TOTAL_TIME,
  QEXAM_FIELD_ACTIVE,
  QEXAM_NO_PUBLISHED_QUESTIONNAIRES,
  QEXAM_QUESTIONS_AVAILABLE,
  QEXAM_ELIGIBLE_QUESTIONS,
  qexamInsufficientEligibleError,
  QEXAM_SAVE,
  QEXAM_SAVING,
  QEXAM_SNACK_CLOSE,
  QEXAM_STATUS_ARCHIVED,
  QEXAM_STATUS_DRAFT,
  QEXAM_STATUS_PUBLISHED,
} from '../../../core/i18n/questionnaire-exams-labels';
import { QuestionnaireExamApiService } from '../../../core/services/questionnaire-exam-api.service';
import { QuestionnaireQuestionnaireApiService } from '../../../core/services/questionnaire-questionnaire-api.service';
import { ExamItem, QuestionnaireItem, QuestionnaireQuestionLinkItem } from '../../../shared/models/questionnaire-v2.model';
import { ExamGenerationConfigPanelComponent } from './exam-generation-config-panel.component';
import { countEligibleQuestions } from './exam-generation-config.util';
import { maxAttemptsValidator, toDateTimeLocalValue, toIsoDateTime } from './exam-form.util';

export interface ExamFormDialogData {
  examId?: number;
}

@Component({
  selector: 'sh-exam-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    ExamGenerationConfigPanelComponent,
  ],
  templateUrl: './exam-form-dialog.component.html',
  styleUrl: './exam-form-dialog.component.scss',
})
export class ExamFormDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<ExamFormDialogComponent, boolean>);
  readonly data = inject<ExamFormDialogData>(MAT_DIALOG_DATA);
  private readonly api = inject(QuestionnaireExamApiService);
  private readonly questionnaireApi = inject(QuestionnaireQuestionnaireApiService);
  private readonly snack = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  loading = true;
  saving = false;
  editingId: number | null = this.data.examId ?? null;
  publishedQuestionnaires: QuestionnaireItem[] = [];
  questionnaireLinks: QuestionnaireQuestionLinkItem[] = [];
  availableQuestions = 0;
  eligibleQuestions = 0;

  readonly dialogNew = QEXAM_DIALOG_NEW;
  readonly dialogEdit = QEXAM_DIALOG_EDIT;
  readonly fieldQuestionnaire = QEXAM_FIELD_QUESTIONNAIRE;
  readonly fieldName = QEXAM_FIELD_NAME;
  readonly fieldDescription = QEXAM_FIELD_DESCRIPTION;
  readonly fieldNumberOfQuestions = QEXAM_FIELD_NUMBER_OF_QUESTIONS;
  readonly fieldDefaultWeight = QEXAM_FIELD_DEFAULT_WEIGHT;
  readonly fieldTimeLimit = QEXAM_FIELD_TIME_LIMIT;
  readonly fieldTotalTime = QEXAM_FIELD_TOTAL_TIME;
  readonly fieldAcceptance = QEXAM_FIELD_ACCEPTANCE;
  readonly fieldMaxAttempts = QEXAM_FIELD_MAX_ATTEMPTS;
  readonly maxAttemptsHint = QEXAM_FIELD_MAX_ATTEMPTS_HINT;
  readonly fieldRetryDelay = QEXAM_FIELD_RETRY_DELAY;
  readonly fieldStartDate = QEXAM_FIELD_START_DATE;
  readonly fieldEndDate = QEXAM_FIELD_END_DATE;
  readonly fieldGenerationConfig = QEXAM_FIELD_GENERATION_CONFIG;
  readonly fieldRandomSeed = QEXAM_FIELD_RANDOM_SEED;
  readonly randomSeedHintTitle = QEXAM_RANDOM_SEED_HINT_TITLE;
  readonly randomSeedHintBody = QEXAM_RANDOM_SEED_HINT_BODY;
  readonly randomSeedExampleTitle = QEXAM_RANDOM_SEED_HINT_EXAMPLE_TITLE;
  readonly randomSeedExampleEmpty = QEXAM_RANDOM_SEED_EXAMPLE_EMPTY;
  readonly randomSeedExampleFixed = QEXAM_RANDOM_SEED_EXAMPLE_FIXED;
  readonly fieldStatus = QEXAM_FIELD_STATUS;
  readonly fieldActive = QEXAM_FIELD_ACTIVE;
  readonly questionsAvailableLabel = QEXAM_QUESTIONS_AVAILABLE;
  readonly eligibleQuestionsLabel = QEXAM_ELIGIBLE_QUESTIONS;
  readonly noPublishedLabel = QEXAM_NO_PUBLISHED_QUESTIONNAIRES;
  readonly cancelLabel = QEXAM_CANCEL;
  readonly closeLabel = QEXAM_CLOSE;
  readonly savingLabel = QEXAM_SAVING;
  readonly saveLabel = QEXAM_SAVE;

  readonly statusOptions = [
    { value: 'draft', label: QEXAM_STATUS_DRAFT },
    { value: 'published', label: QEXAM_STATUS_PUBLISHED },
    { value: 'archived', label: QEXAM_STATUS_ARCHIVED },
  ];

  readonly form = this.fb.nonNullable.group({
    questionnaireId: [null as number | null, Validators.required],
    name: ['', Validators.required],
    description: [''],
    numberOfQuestions: [
      1,
      [Validators.required, Validators.min(1), (control: AbstractControl) => this.validateEligibleQuestions(control)],
    ],
    defaultWeight: [''],
    defaultTimeLimitSeconds: [''],
    totalTimeMinutes: [''],
    acceptancePercent: [''],
    maxAttempts: ['', maxAttemptsValidator()],
    retryDelayDays: [''],
    startDate: [''],
    endDate: [''],
    generationConfig: [null as string | null],
    randomSeed: [''],
    status: ['draft'],
    isActive: [true],
  });

  ngOnInit(): void {
    this.questionnaireApi.list({ status: 'published', isActive: true }, 0, 500).subscribe({
      next: ({ items }) => {
        this.publishedQuestionnaires = items;
        if (this.editingId) {
          this.loadExam(this.editingId);
        } else {
          this.loading = false;
        }
      },
      error: () => {
        this.loading = false;
        this.snack.open(QEXAM_ERRORS_LOAD, QEXAM_SNACK_CLOSE, { duration: 3500 });
      },
    });

    this.form.controls.questionnaireId.valueChanges.subscribe((id) => {
      if (id != null) {
        this.refreshAvailableQuestions(id);
      } else {
        this.availableQuestions = 0;
        this.eligibleQuestions = 0;
        this.questionnaireLinks = [];
        this.form.controls.numberOfQuestions.updateValueAndValidity({ emitEvent: false });
      }
    });

    this.form.controls.generationConfig.valueChanges.subscribe(() => {
      this.recalculateEligibleQuestions();
    });
  }

  get insufficientEligibleMessage(): string {
    const requested = this.form.controls.numberOfQuestions.value;
    return qexamInsufficientEligibleError(this.eligibleQuestions, requested);
  }

  private validateEligibleQuestions(control: AbstractControl): ValidationErrors | null {
    const requested = Number(control.value);
    if (!Number.isFinite(requested) || requested < 1) {
      return null;
    }
    if (this.eligibleQuestions > 0 && requested > this.eligibleQuestions) {
      return { insufficientEligible: true };
    }
    if (this.eligibleQuestions === 0 && this.questionnaireLinks.length > 0 && requested > 0) {
      return { insufficientEligible: true };
    }
    return null;
  }

  private recalculateEligibleQuestions(): void {
    this.eligibleQuestions = countEligibleQuestions(
      this.questionnaireLinks,
      this.form.controls.generationConfig.value,
    );
    this.form.controls.numberOfQuestions.updateValueAndValidity({ emitEvent: false });
  }

  get title(): string {
    return this.editingId ? this.dialogEdit : this.dialogNew;
  }

  private loadExam(id: number): void {
    this.api.getById(id).subscribe({
      next: (exam) => {
        this.form.patchValue({
          questionnaireId: exam.questionnaireId,
          name: exam.name,
          description: exam.description ?? '',
          numberOfQuestions: exam.numberOfQuestions,
          defaultWeight: exam.defaultWeight != null ? String(exam.defaultWeight) : '',
          defaultTimeLimitSeconds:
            exam.defaultTimeLimitSeconds != null ? String(exam.defaultTimeLimitSeconds) : '',
          totalTimeMinutes: exam.totalTimeMinutes != null ? String(exam.totalTimeMinutes) : '',
          acceptancePercent: exam.acceptancePercent != null ? String(exam.acceptancePercent) : '',
          maxAttempts: exam.maxAttempts != null ? String(exam.maxAttempts) : '',
          retryDelayDays: exam.retryDelayDays != null ? String(exam.retryDelayDays) : '',
          startDate: toDateTimeLocalValue(exam.startDate),
          endDate: toDateTimeLocalValue(exam.endDate),
          generationConfig: exam.generationConfig ?? null,
          randomSeed: exam.randomSeed != null ? String(exam.randomSeed) : '',
          status: exam.status ?? 'draft',
          isActive: exam.isActive,
        });
        this.refreshAvailableQuestions(exam.questionnaireId);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open(QEXAM_ERRORS_LOAD, QEXAM_SNACK_CLOSE, { duration: 3500 });
      },
    });
  }

  private refreshAvailableQuestions(questionnaireId: number): void {
    this.questionnaireApi.listQuestions(questionnaireId).subscribe({
      next: (links) => {
        this.questionnaireLinks = links;
        this.availableQuestions = links.length;
        this.recalculateEligibleQuestions();
      },
      error: () => {
        this.questionnaireLinks = [];
        this.availableQuestions = 0;
        this.eligibleQuestions = 0;
        this.form.controls.numberOfQuestions.updateValueAndValidity({ emitEvent: false });
      },
    });
  }

  private parseOptionalNumber(value: string): number | null {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }
    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? null : parsed;
  }

  save(): void {
    this.recalculateEligibleQuestions();
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      if (this.form.controls.maxAttempts.invalid) {
        this.snack.open(QEXAM_ERRORS_MAX_ATTEMPTS, QEXAM_SNACK_CLOSE, { duration: 3500 });
      } else if (this.form.controls.numberOfQuestions.hasError('insufficientEligible')) {
        this.snack.open(this.insufficientEligibleMessage, QEXAM_SNACK_CLOSE, { duration: 4500 });
      }
      return;
    }

    const value = this.form.getRawValue();
    const maxAttemptsRaw = value.maxAttempts.trim();
    const payload = {
      questionnaireId: value.questionnaireId!,
      name: value.name.trim(),
      description: value.description.trim() || undefined,
      numberOfQuestions: value.numberOfQuestions,
      defaultWeight: this.parseOptionalNumber(value.defaultWeight),
      defaultTimeLimitSeconds: this.parseOptionalNumber(value.defaultTimeLimitSeconds),
      totalTimeMinutes: this.parseOptionalNumber(value.totalTimeMinutes),
      acceptancePercent: this.parseOptionalNumber(value.acceptancePercent),
      maxAttempts: maxAttemptsRaw ? Number(maxAttemptsRaw) : null,
      retryDelayDays: this.parseOptionalNumber(value.retryDelayDays),
      startDate: toIsoDateTime(value.startDate),
      endDate: toIsoDateTime(value.endDate),
      generationConfig: value.generationConfig?.trim() || null,
      randomSeed: this.parseOptionalNumber(value.randomSeed),
      status: value.status || 'draft',
      isActive: value.isActive,
    };

    this.saving = true;
    const request$ = this.editingId ? this.api.update(this.editingId, payload) : this.api.create(payload);
    request$.subscribe({
      next: () => {
        this.saving = false;
        this.dialogRef.close(true);
      },
      error: () => {
        this.saving = false;
        this.snack.open(QEXAM_ERRORS_SAVE, QEXAM_SNACK_CLOSE, { duration: 3500 });
      },
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
