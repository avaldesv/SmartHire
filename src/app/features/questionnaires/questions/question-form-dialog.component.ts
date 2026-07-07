import { Component, OnInit, computed, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, map, of, switchMap } from 'rxjs';
import {
  QQUEST_CANCEL,
  QQUEST_CLOSE,
  QQUEST_DIALOG_EDIT,
  QQUEST_DIALOG_NEW,
  QQUEST_DIALOG_VIEW,
  QQUEST_ERRORS_LOAD,
  QQUEST_ERRORS_OPTIONS,
  QQUEST_ERRORS_SAVE,
  QQUEST_FIELD_CATEGORY,
  QQUEST_FIELD_CORRECT_ANSWER,
  QQUEST_FIELD_DIFFICULTY,
  QQUEST_FIELD_EXPLANATION,
  QQUEST_FIELD_NO_TAGS,
  QQUEST_FIELD_TAGS,
  QQUEST_FIELD_TEXT,
  QQUEST_FIELD_TYPE,
  QQUEST_LOCKED_HINT,
  QQUEST_OPTION_ADD,
  QQUEST_OPTION_CORRECT,
  QQUEST_OPTION_TEXT,
  QQUEST_OPTIONS_TITLE,
  QQUEST_RECORD_SCOPE,
  QQUEST_SAVE,
  QQUEST_SAVING,
  QQUEST_SCOPE_GLOBAL,
  QQUEST_SCOPE_TENANT,
  QQUEST_SNACK_CLOSE,
  QQUEST_TYPE_MULTIPLE,
  QQUEST_TYPE_OPEN,
  QQUEST_TYPE_SINGLE,
  QQUEST_TYPE_YES_NO,
} from '../../../core/i18n/questionnaire-questions-labels';
import { PermissionService } from '../../../core/services/permission.service';
import { QuestionnaireKnowledgeCategoryApiService } from '../../../core/services/questionnaire-knowledge-category-api.service';
import { QuestionnaireTagApiService } from '../../../core/services/questionnaire-tag-api.service';
import { QuestionnaireV2QuestionApiService } from '../../../core/services/questionnaire-v2-question-api.service';
import {
  KnowledgeCategoryItem,
  QuestionItem,
  QuestionOptionItem,
  TagItem,
  TenantDataScope,
} from '../../../shared/models/questionnaire-v2.model';

export interface QuestionFormDialogData {
  questionId?: number;
  readOnly?: boolean;
}

@Component({
  selector: 'sh-question-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './question-form-dialog.component.html',
  styleUrl: './question-form-dialog.component.scss',
})
export class QuestionFormDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<QuestionFormDialogComponent, boolean>);
  readonly data = inject<QuestionFormDialogData>(MAT_DIALOG_DATA);
  private readonly api = inject(QuestionnaireV2QuestionApiService);
  private readonly categoryApi = inject(QuestionnaireKnowledgeCategoryApiService);
  private readonly tagApi = inject(QuestionnaireTagApiService);
  private readonly permissions = inject(PermissionService);
  private readonly snack = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  readonly isGlobalAdmin = computed(() => this.permissions.isGlobalAdmin());
  readonly questionTypes = [
    { value: 'single_choice', label: QQUEST_TYPE_SINGLE },
    { value: 'multiple_choice', label: QQUEST_TYPE_MULTIPLE },
    { value: 'yes_no', label: QQUEST_TYPE_YES_NO },
    { value: 'open', label: QQUEST_TYPE_OPEN },
  ];

  loading = true;
  saving = false;
  readOnly = this.data.readOnly ?? false;
  editingId: number | null = this.data.questionId ?? null;
  categories: KnowledgeCategoryItem[] = [];
  tags: TagItem[] = [];

  readonly dialogNew = QQUEST_DIALOG_NEW;
  readonly dialogEdit = QQUEST_DIALOG_EDIT;
  readonly dialogView = QQUEST_DIALOG_VIEW;
  readonly fieldText = QQUEST_FIELD_TEXT;
  readonly fieldType = QQUEST_FIELD_TYPE;
  readonly fieldCategory = QQUEST_FIELD_CATEGORY;
  readonly fieldDifficulty = QQUEST_FIELD_DIFFICULTY;
  readonly fieldExplanation = QQUEST_FIELD_EXPLANATION;
  readonly fieldCorrectAnswer = QQUEST_FIELD_CORRECT_ANSWER;
  readonly fieldTags = QQUEST_FIELD_TAGS;
  readonly noTagsLabel = QQUEST_FIELD_NO_TAGS;
  readonly optionsTitle = QQUEST_OPTIONS_TITLE;
  readonly optionTextLabel = QQUEST_OPTION_TEXT;
  readonly optionCorrectLabel = QQUEST_OPTION_CORRECT;
  readonly addOptionLabel = QQUEST_OPTION_ADD;
  readonly lockedHint = QQUEST_LOCKED_HINT;
  readonly recordScope = QQUEST_RECORD_SCOPE;
  readonly scopeTenant = QQUEST_SCOPE_TENANT;
  readonly scopeGlobal = QQUEST_SCOPE_GLOBAL;
  readonly cancelLabel = QQUEST_CANCEL;
  readonly closeLabel = QQUEST_CLOSE;
  readonly savingLabel = QQUEST_SAVING;
  readonly saveLabel = QQUEST_SAVE;

  readonly form = this.fb.nonNullable.group({
    knowledgeCategoryId: [null as number | null, Validators.required],
    text: ['', Validators.required],
    type: ['single_choice', Validators.required],
    explanation: [''],
    correctAnswerText: [''],
    difficulty: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
    isActive: [true],
    tagIds: [[] as number[]],
    options: this.fb.array<FormGroup>([]),
  });

  readonly createScopeForm = this.fb.nonNullable.group({
    scope: ['TENANT' as TenantDataScope],
  });

  ngOnInit(): void {
    forkJoin({
      categories: this.categoryApi.list({ isActive: true }, 0, 500),
      tags: this.tagApi.list({ isActive: true }, 0, 500),
    }).subscribe({
      next: ({ categories, tags }) => {
        this.categories = categories.items;
        this.tags = tags.items;
        if (this.editingId) {
          this.loadQuestion(this.editingId);
        } else {
          this.loading = false;
          this.setDefaultOptions(2);
        }
      },
      error: () => {
        this.loading = false;
        this.snack.open(QQUEST_ERRORS_LOAD, QQUEST_SNACK_CLOSE, { duration: 3500 });
      },
    });

    this.form.controls.type.valueChanges.subscribe((type) => this.onTypeChange(type));
  }

  get title(): string {
    if (this.readOnly) {
      return this.dialogView;
    }
    return this.editingId ? this.dialogEdit : this.dialogNew;
  }

  get selectedCorrectIndex(): number {
    const index = this.optionsArray.controls.findIndex((group) => group.controls['correct'].value);
    return index >= 0 ? index : 0;
  }

  get optionsArray(): FormArray<FormGroup> {
    return this.form.controls.options;
  }

  get showOptions(): boolean {
    return this.form.controls.type.value !== 'open';
  }

  get showCorrectAnswerText(): boolean {
    return this.form.controls.type.value === 'open';
  }

  get isSingleCorrectType(): boolean {
    const type = this.form.controls.type.value;
    return type === 'single_choice' || type === 'yes_no';
  }

  private loadQuestion(id: number): void {
    this.api.getById(id).subscribe({
      next: (question) => {
        this.readOnly = this.readOnly || question.locked === true;
        this.patchForm(question);
        this.loading = false;
        if (this.readOnly) {
          this.form.disable();
        }
      },
      error: () => {
        this.loading = false;
        this.snack.open(QQUEST_ERRORS_LOAD, QQUEST_SNACK_CLOSE, { duration: 3500 });
      },
    });
  }

  private patchForm(question: QuestionItem): void {
    this.clearOptions();
    const options = question.options ?? [];
    if (options.length) {
      options.forEach((option) => this.addOption(option));
    } else if (question.type !== 'open') {
      this.setDefaultOptions(2);
    }

    this.form.patchValue({
      knowledgeCategoryId: question.knowledgeCategoryId,
      text: question.text,
      type: question.type,
      explanation: question.explanation ?? '',
      correctAnswerText: question.correctAnswerText ?? '',
      difficulty: question.difficulty ?? 3,
      isActive: question.isActive,
      tagIds: question.tagIds ?? [],
    });
  }

  onTypeChange(type: string): void {
    if (this.readOnly) {
      return;
    }
    if (type === 'open') {
      this.clearOptions();
      return;
    }
    if (type === 'yes_no') {
      this.setYesNoOptions();
      return;
    }
    if (this.optionsArray.length < 2) {
      this.setDefaultOptions(2);
    }
  }

  addOption(option?: QuestionOptionItem): void {
    this.optionsArray.push(
      this.fb.nonNullable.group({
        optionText: [option?.optionText ?? '', Validators.required],
        correct: [option?.correct ?? false],
        sortOrder: [option?.sortOrder ?? this.optionsArray.length],
      }),
    );
  }

  removeOption(index: number): void {
    if (this.readOnly || this.form.controls.type.value === 'yes_no') {
      return;
    }
    this.optionsArray.removeAt(index);
  }

  setCorrectOption(index: number): void {
    if (this.readOnly) {
      return;
    }
    this.optionsArray.controls.forEach((group, i) => {
      group.controls['correct'].setValue(i === index, { emitEvent: false });
    });
  }

  private clearOptions(): void {
    while (this.optionsArray.length) {
      this.optionsArray.removeAt(0);
    }
  }

  private setDefaultOptions(count: number): void {
    this.clearOptions();
    for (let i = 0; i < count; i++) {
      this.addOption();
    }
  }

  private setYesNoOptions(): void {
    this.clearOptions();
    this.addOption({ optionText: 'Sí', correct: true, sortOrder: 0 });
    this.addOption({ optionText: 'No', correct: false, sortOrder: 1 });
  }

  private buildOptionsPayload(): QuestionOptionItem[] {
    return this.optionsArray.controls.map((group, index) => ({
      optionText: String(group.controls['optionText'].value).trim(),
      correct: Boolean(group.controls['correct'].value),
      sortOrder: index,
    }));
  }

  private validateOptions(): boolean {
    const type = this.form.controls.type.value;
    if (type === 'open') {
      return true;
    }
    const options = this.buildOptionsPayload();
    if (options.length < 2) {
      return false;
    }
    const correctCount = options.filter((o) => o.correct).length;
    if (correctCount < 1) {
      return false;
    }
    if ((type === 'single_choice' || type === 'yes_no') && correctCount !== 1) {
      return false;
    }
    return true;
  }

  save(): void {
    if (this.readOnly) {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (!this.validateOptions()) {
      this.snack.open(QQUEST_ERRORS_OPTIONS, QQUEST_SNACK_CLOSE, { duration: 3500 });
      return;
    }

    const value = this.form.getRawValue();
    const type = value.type;
    const payload = {
      knowledgeCategoryId: value.knowledgeCategoryId!,
      text: value.text.trim(),
      type,
      explanation: value.explanation.trim() || undefined,
      correctAnswerText: type === 'open' ? value.correctAnswerText.trim() || undefined : undefined,
      difficulty: value.difficulty,
      status: 'draft',
      isActive: value.isActive,
      options: type === 'open' ? [] : this.buildOptionsPayload(),
    };
    const tagIds = value.tagIds ?? [];

    this.saving = true;
    const request$ = this.editingId
      ? this.api.update(this.editingId, payload)
      : this.api.create({
          ...payload,
          scope: this.isGlobalAdmin() ? this.createScopeForm.getRawValue().scope : undefined,
        });

    request$
      .pipe(
        switchMap((saved) => {
          const id = saved.id;
          if (!tagIds.length) {
            return of(saved);
          }
          return this.api.replaceTags(id, tagIds).pipe(map(() => saved));
        }),
      )
      .subscribe({
        next: () => {
          this.saving = false;
          this.dialogRef.close(true);
        },
        error: () => {
          this.saving = false;
          this.snack.open(QQUEST_ERRORS_SAVE, QQUEST_SNACK_CLOSE, { duration: 3500 });
        },
      });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
