import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FeedbackDialogService } from '../../core/feedback/feedback-dialog.service';
import {
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
  SURVEYS_FIELD_FINAL_MESSAGE,
  SURVEYS_FIELD_FINAL_MESSAGE_HINT,
  SURVEYS_FIELD_NAME,
  SURVEYS_FIELD_QUESTIONS,
  SURVEYS_QUESTION_ORDER,
  SURVEYS_QUESTION_REQUIRED,
  SURVEYS_QUESTION_TARGET_COLUMN,
  SURVEYS_QUESTION_TARGET_HINT,
  SURVEYS_QUESTION_TARGET_OPTIONAL,
  SURVEYS_QUESTION_TARGET_SECTION,
  SURVEYS_QUESTION_TARGET_TABLE,
  SURVEYS_QUESTION_TEXT,
  SURVEYS_QUESTION_TYPE,
  SURVEYS_QUESTIONS_ADD_FIRST,
  SURVEYS_QUESTIONS_ADD_MORE,
  SURVEYS_QUESTIONS_EMPTY,
  SURVEYS_QUESTIONS_EMPTY_TITLE,
  SURVEYS_REMOVE_QUESTION,
  SURVEYS_SAVE,
  SURVEYS_SAVING,
} from '../../core/i18n/survey-labels';
import { SurveyApiService } from '../../core/services/survey-api.service';
import {
  ShModalActionsDirective,
  ShModalFormComponent,
} from '../../shared/components/modal-form/sh-modal-form.component';
import {
  SURVEY_ANSWER_TYPES,
  SURVEY_MAPPABLE_ANSWER_TYPES,
  SurveyFieldMappingField,
  SurveyFieldMappingTable,
  UpsertSurveyRequest,
} from '../../shared/models/survey.model';

export interface SurveyFormDialogData {
  surveyId?: number;
}

@Component({
  selector: 'sh-survey-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DragDropModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
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

  readonly messageMaxLength = 500;

  loading = true;
  saving = false;
  editingId: number | null = this.data.surveyId ?? null;
  mappingTables: SurveyFieldMappingTable[] = [];

  readonly title = this.data.surveyId ? SURVEYS_DIALOG_EDIT : SURVEYS_DIALOG_NEW;
  readonly fieldName = SURVEYS_FIELD_NAME;
  readonly fieldDescription = SURVEYS_FIELD_DESCRIPTION;
  readonly fieldFinalMessage = SURVEYS_FIELD_FINAL_MESSAGE;
  readonly fieldFinalMessageHint = SURVEYS_FIELD_FINAL_MESSAGE_HINT;
  readonly fieldActive = SURVEYS_FIELD_ACTIVE;
  readonly fieldQuestions = SURVEYS_FIELD_QUESTIONS;
  readonly removeQuestionLabel = SURVEYS_REMOVE_QUESTION;
  readonly questionTextLabel = SURVEYS_QUESTION_TEXT;
  readonly questionTypeLabel = SURVEYS_QUESTION_TYPE;
  readonly questionRequiredLabel = SURVEYS_QUESTION_REQUIRED;
  readonly questionOrderLabel = SURVEYS_QUESTION_ORDER;
  readonly targetSectionLabel = SURVEYS_QUESTION_TARGET_SECTION;
  readonly targetTableLabel = SURVEYS_QUESTION_TARGET_TABLE;
  readonly targetColumnLabel = SURVEYS_QUESTION_TARGET_COLUMN;
  readonly targetHintLabel = SURVEYS_QUESTION_TARGET_HINT;
  readonly targetOptionalLabel = SURVEYS_QUESTION_TARGET_OPTIONAL;
  readonly questionsEmptyTitle = SURVEYS_QUESTIONS_EMPTY_TITLE;
  readonly addFirstQuestionLabel = SURVEYS_QUESTIONS_ADD_FIRST;
  readonly addMoreQuestionLabel = SURVEYS_QUESTIONS_ADD_MORE;
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
    descriptionText: ['', Validators.maxLength(this.messageMaxLength)],
    finalMessageText: ['', Validators.maxLength(this.messageMaxLength)],
    isActive: [true],
    questions: this.fb.array<FormGroup>([]),
  });

  get questions(): FormArray<FormGroup> {
    return this.form.controls.questions;
  }

  get descriptionLength(): number {
    return (this.form.controls.descriptionText.value ?? '').length;
  }

  get finalMessageLength(): number {
    return (this.form.controls.finalMessageText.value ?? '').length;
  }

  ngOnInit(): void {
    const survey$ = this.editingId
      ? this.api.getById(this.editingId)
      : of(null);
    const mappings$ = this.api.fieldMappings().pipe(
      catchError(() => of({ tables: [] as SurveyFieldMappingTable[] })),
    );

    forkJoin({ survey: survey$, mappings: mappings$ }).subscribe({
      next: ({ survey, mappings }) => {
        this.mappingTables = mappings.tables ?? [];
        if (survey) {
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
          for (const q of sorted) {
            this.questions.push(
              this.createQuestionGroup({
                sortOrder: q.sortOrder ?? this.questions.length + 1,
                questionText: q.questionText,
                answerType: SURVEY_ANSWER_TYPES.includes(q.answerType as never)
                  ? q.answerType
                  : 'TEXT',
                isRequired: q.isRequired ?? true,
                targetTable: q.targetTable ?? null,
                targetColumn: q.targetColumn ?? null,
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
        targetTable: null,
        targetColumn: null,
      }),
    );
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
    this.reindexSortOrders();
  }

  toggleRequired(index: number): void {
    const ctrl = this.questions.at(index);
    ctrl.patchValue({ isRequired: !ctrl.value.isRequired });
  }

  dropQuestion(event: CdkDragDrop<FormGroup[]>): void {
    if (event.previousIndex === event.currentIndex) {
      return;
    }
    const item = this.questions.at(event.previousIndex);
    this.questions.removeAt(event.previousIndex);
    this.questions.insert(event.currentIndex, item);
    this.reindexSortOrders();
  }

  isMappingEnabled(index: number): boolean {
    const type = String(this.questions.at(index).value.answerType ?? '').toUpperCase();
    return SURVEY_MAPPABLE_ANSWER_TYPES.includes(type as never);
  }

  fieldsForQuestion(index: number): SurveyFieldMappingField[] {
    const tableName = this.questions.at(index).value.targetTable as string | null;
    if (!tableName) {
      return [];
    }
    return this.mappingTables.find((t) => t.table === tableName)?.fields ?? [];
  }

  onAnswerTypeChange(index: number): void {
    if (!this.isMappingEnabled(index)) {
      this.questions.at(index).patchValue({ targetTable: null, targetColumn: null });
    }
  }

  onTargetTableChange(index: number): void {
    this.questions.at(index).patchValue({ targetColumn: null });
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
      questions: raw.questions.map((q, index) => {
        const answerType = String(q['answerType']);
        const mappable = SURVEY_MAPPABLE_ANSWER_TYPES.includes(answerType as never);
        const targetTable = mappable ? ((q['targetTable'] as string | null) || null) : null;
        const targetColumn = mappable ? ((q['targetColumn'] as string | null) || null) : null;
        return {
          sortOrder: Number(q['sortOrder']) || index + 1,
          questionText: String(q['questionText']).trim(),
          answerType,
          isRequired: !!q['isRequired'],
          targetTable,
          targetColumn,
        };
      }),
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
    targetTable: string | null;
    targetColumn: string | null;
  }): FormGroup {
    return this.fb.group({
      sortOrder: [value.sortOrder, [Validators.required, Validators.min(1)]],
      questionText: [value.questionText, Validators.required],
      answerType: [value.answerType, Validators.required],
      isRequired: [value.isRequired],
      targetTable: [value.targetTable],
      targetColumn: [value.targetColumn],
    });
  }

  private reindexSortOrders(): void {
    this.questions.controls.forEach((ctrl, index) => {
      ctrl.patchValue({ sortOrder: index + 1 }, { emitEvent: false });
    });
  }
}
