import { Component, OnInit, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { FeedbackDialogService } from '../../core/feedback/feedback-dialog.service';
import {
  SURVEYS_ADD_QUESTION,
  SURVEYS_ANSWER_TYPE_DATE,
  SURVEYS_ANSWER_TYPE_FILE,
  SURVEYS_ANSWER_TYPE_IMAGE,
  SURVEYS_ANSWER_TYPE_NUMBER,
  SURVEYS_ANSWER_TYPE_TEXT,
  SURVEYS_CANCEL,
  SURVEYS_DIALOG_EDIT,
  SURVEYS_DIALOG_NEW,
  SURVEYS_ERRORS_LOAD,
  SURVEYS_ERRORS_SAVE,
  SURVEYS_FIELD_ACTIVE,
  SURVEYS_FIELD_DESCRIPTION,
  SURVEYS_FIELD_DESCRIPTION_HINT,
  SURVEYS_FIELD_FINAL_MESSAGE,
  SURVEYS_FIELD_FINAL_MESSAGE_HINT,
  SURVEYS_FIELD_NAME,
  SURVEYS_FIELD_QUESTIONS,
  SURVEYS_SECTION_MESSAGES,
  SURVEYS_QUESTION_ORDER,
  SURVEYS_QUESTION_REQUIRED,
  SURVEYS_QUESTION_TEXT,
  SURVEYS_QUESTION_TYPE,
  SURVEYS_QUESTIONS_EMPTY,
  SURVEYS_REMOVE_QUESTION,
  SURVEYS_SAVE,
  SURVEYS_SAVING,
} from '../../core/i18n/survey-labels';
import { SurveyApiService } from '../../core/services/survey-api.service';
import {
  ShModalActionsDirective,
  ShModalFormComponent,
} from '../../shared/components/modal-form/sh-modal-form.component';
import { SURVEY_ANSWER_TYPES, UpsertSurveyRequest } from '../../shared/models/survey.model';

export interface SurveyFormDialogData {
  surveyId?: number;
}

@Component({
  selector: 'sh-survey-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ShModalFormComponent,
    ShModalActionsDirective,
  ],
  templateUrl: './survey-form-dialog.component.html',
  styleUrl: './survey-form-dialog.component.scss',
})
export class SurveyFormDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<SurveyFormDialogComponent, boolean>);
  readonly data = inject<SurveyFormDialogData>(MAT_DIALOG_DATA);
  private readonly api = inject(SurveyApiService);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly fb = inject(FormBuilder);

  loading = !!this.data.surveyId;
  saving = false;
  editingId: number | null = this.data.surveyId ?? null;

  readonly title = this.data.surveyId ? SURVEYS_DIALOG_EDIT : SURVEYS_DIALOG_NEW;
  readonly fieldName = SURVEYS_FIELD_NAME;
  readonly fieldDescription = SURVEYS_FIELD_DESCRIPTION;
  readonly fieldDescriptionHint = SURVEYS_FIELD_DESCRIPTION_HINT;
  readonly fieldFinalMessage = SURVEYS_FIELD_FINAL_MESSAGE;
  readonly fieldFinalMessageHint = SURVEYS_FIELD_FINAL_MESSAGE_HINT;
  readonly sectionMessages = SURVEYS_SECTION_MESSAGES;
  readonly fieldActive = SURVEYS_FIELD_ACTIVE;
  readonly fieldQuestions = SURVEYS_FIELD_QUESTIONS;
  readonly addQuestionLabel = SURVEYS_ADD_QUESTION;
  readonly removeQuestionLabel = SURVEYS_REMOVE_QUESTION;
  readonly questionTextLabel = SURVEYS_QUESTION_TEXT;
  readonly questionTypeLabel = SURVEYS_QUESTION_TYPE;
  readonly questionRequiredLabel = SURVEYS_QUESTION_REQUIRED;
  readonly questionOrderLabel = SURVEYS_QUESTION_ORDER;
  readonly questionsEmptyLabel = SURVEYS_QUESTIONS_EMPTY;
  readonly cancelLabel = SURVEYS_CANCEL;
  readonly saveLabel = SURVEYS_SAVE;
  readonly savingLabel = SURVEYS_SAVING;

  readonly answerTypeOptions = [
    { value: 'TEXT', label: SURVEYS_ANSWER_TYPE_TEXT },
    { value: 'NUMBER', label: SURVEYS_ANSWER_TYPE_NUMBER },
    { value: 'DATE', label: SURVEYS_ANSWER_TYPE_DATE },
    { value: 'IMAGE', label: SURVEYS_ANSWER_TYPE_IMAGE },
    { value: 'FILE', label: SURVEYS_ANSWER_TYPE_FILE },
  ] as const;

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    descriptionText: [''],
    finalMessageText: [''],
    isActive: [true],
    questions: this.fb.array<FormGroup>([]),
  });

  get questions(): FormArray<FormGroup> {
    return this.form.controls.questions;
  }

  ngOnInit(): void {
    if (!this.editingId) {
      this.addQuestion();
      this.loading = false;
      return;
    }
    this.api.getById(this.editingId).subscribe({
      next: (survey) => {
        this.form.patchValue({
          name: survey.name,
          descriptionText: survey.descriptionText ?? '',
          finalMessageText: survey.finalMessageText ?? '',
          isActive: survey.isActive ?? true,
        });
        this.questions.clear();
        const sorted = [...(survey.questions ?? [])].sort(
          (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
        );
        if (sorted.length === 0) {
          this.addQuestion();
        } else {
          for (const q of sorted) {
            this.questions.push(
              this.createQuestionGroup({
                sortOrder: q.sortOrder ?? this.questions.length + 1,
                questionText: q.questionText,
                answerType: SURVEY_ANSWER_TYPES.includes(q.answerType as never)
                  ? q.answerType
                  : 'TEXT',
                isRequired: q.isRequired ?? true,
              }),
            );
          }
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.feedback.showApiError(err, { fallbackMessage: SURVEYS_ERRORS_LOAD });
        this.dialogRef.close(false);
      },
    });
  }

  addQuestion(): void {
    this.questions.push(
      this.createQuestionGroup({
        sortOrder: this.questions.length + 1,
        questionText: '',
        answerType: 'TEXT',
        isRequired: true,
      }),
    );
  }

  removeQuestion(index: number): void {
    if (this.questions.length <= 1) {
      return;
    }
    this.questions.removeAt(index);
    this.reindexSortOrders();
  }

  moveQuestion(index: number, direction: -1 | 1): void {
    const target = index + direction;
    if (target < 0 || target >= this.questions.length) {
      return;
    }
    const current = this.questions.at(index);
    this.questions.removeAt(index);
    this.questions.insert(target, current);
    this.reindexSortOrders();
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  save(): void {
    if (this.form.invalid || this.questions.length === 0) {
      this.form.markAllAsTouched();
      if (this.questions.length === 0) {
        this.feedback.showWarning(SURVEYS_FIELD_QUESTIONS, SURVEYS_QUESTIONS_EMPTY);
      }
      return;
    }
    this.reindexSortOrders();
    const raw = this.form.getRawValue();
    const request: UpsertSurveyRequest = {
      name: raw.name.trim(),
      descriptionText: raw.descriptionText?.trim() || null,
      finalMessageText: raw.finalMessageText?.trim() || null,
      isActive: raw.isActive,
      questions: raw.questions.map((q, index) => ({
        sortOrder: Number(q['sortOrder']) || index + 1,
        questionText: String(q['questionText']).trim(),
        answerType: String(q['answerType']),
        isRequired: !!q['isRequired'],
      })),
    };

    this.saving = true;
    const request$ = this.editingId
      ? this.api.update(this.editingId, request)
      : this.api.create(request);
    request$.subscribe({
      next: () => {
        this.saving = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.saving = false;
        this.feedback.showApiError(err, { fallbackMessage: SURVEYS_ERRORS_SAVE });
      },
    });
  }

  private createQuestionGroup(value: {
    sortOrder: number;
    questionText: string;
    answerType: string;
    isRequired: boolean;
  }): FormGroup {
    return this.fb.nonNullable.group({
      sortOrder: [value.sortOrder, [Validators.required, Validators.min(1)]],
      questionText: [value.questionText, Validators.required],
      answerType: [value.answerType, Validators.required],
      isRequired: [value.isRequired],
    });
  }

  private reindexSortOrders(): void {
    this.questions.controls.forEach((ctrl, index) => {
      ctrl.patchValue({ sortOrder: index + 1 }, { emitEvent: false });
    });
  }
}
