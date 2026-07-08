import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  forwardRef,
  inject,
} from '@angular/core';
import { ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Subscription } from 'rxjs';
import {
  QEXAM_GEN_DIFFICULTY_FILTER,
  QEXAM_GEN_DIFFICULTY_MAX,
  QEXAM_GEN_DIFFICULTY_MIN,
  QEXAM_GEN_EXCLUDE_HINT,
  QEXAM_GEN_EXCLUDE_QUESTIONS,
  QEXAM_GEN_INTRO,
  QEXAM_GEN_QUESTION_TYPES,
  QEXAM_GEN_QUESTION_TYPES_HINT,
  QEXAM_GEN_SELECT_CATEGORIES,
  QEXAM_GEN_UNSUPPORTED_JSON,
} from '../../../core/i18n/questionnaire-exams-labels';
import { QQUEST_TYPES, qquestTypeLabel } from '../../../core/i18n/questionnaire-questions-labels';
import { QuestionnaireKnowledgeCategoryApiService } from '../../../core/services/questionnaire-knowledge-category-api.service';
import { QuestionnaireQuestionnaireApiService } from '../../../core/services/questionnaire-questionnaire-api.service';
import { KnowledgeCategoryItem, QuestionnaireQuestionLinkItem } from '../../../shared/models/questionnaire-v2.model';
import { buildGenerationConfigJson, parseGenerationConfig } from './exam-generation-config.util';

@Component({
  selector: 'sh-exam-generation-config-panel',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ExamGenerationConfigPanelComponent),
      multi: true,
    },
  ],
  templateUrl: './exam-generation-config-panel.component.html',
  styleUrl: './exam-generation-config-panel.component.scss',
})
export class ExamGenerationConfigPanelComponent implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly categoryApi = inject(QuestionnaireKnowledgeCategoryApiService);
  private readonly questionnaireApi = inject(QuestionnaireQuestionnaireApiService);

  @Input() questionnaireId: number | null = null;

  private valueChange?: (value: string | null) => void;
  private touched?: () => void;
  private sub?: Subscription;
  private disabled = false;

  categories: KnowledgeCategoryItem[] = [];
  questionnaireQuestions: QuestionnaireQuestionLinkItem[] = [];
  hasUnsupportedKeys = false;

  readonly intro = QEXAM_GEN_INTRO;
  readonly questionTypesLabel = QEXAM_GEN_QUESTION_TYPES;
  readonly questionTypesHint = QEXAM_GEN_QUESTION_TYPES_HINT;
  readonly difficultyFilterLabel = QEXAM_GEN_DIFFICULTY_FILTER;
  readonly difficultyMinLabel = QEXAM_GEN_DIFFICULTY_MIN;
  readonly difficultyMaxLabel = QEXAM_GEN_DIFFICULTY_MAX;
  readonly categoriesLabel = QEXAM_GEN_SELECT_CATEGORIES;
  readonly excludeQuestionsLabel = QEXAM_GEN_EXCLUDE_QUESTIONS;
  readonly unsupportedJsonLabel = QEXAM_GEN_UNSUPPORTED_JSON;
  readonly excludeHint = QEXAM_GEN_EXCLUDE_HINT;

  readonly questionTypeOptions = QQUEST_TYPES.map((t) => ({
    value: t.value,
    label: qquestTypeLabel(t.value),
  }));

  readonly rulesForm = this.fb.nonNullable.group({
    filterDifficulty: [false],
    difficultyMin: [1],
    difficultyMax: [5],
    questionTypes: [[] as string[]],
    knowledgeCategoryIds: [[] as number[]],
    excludeQuestionIds: [[] as number[]],
  });

  ngOnInit(): void {
    this.categoryApi.list({ isActive: true }, 0, 500).subscribe({
      next: ({ items }) => {
        this.categories = items;
      },
    });

    this.sub = this.rulesForm.valueChanges.subscribe(() => {
      this.emitValue();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['questionnaireId']) {
      this.loadQuestionnaireQuestions(this.questionnaireId);
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  writeValue(value: string | null): void {
    this.patchFromValue(value);
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.valueChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.touched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.rulesForm.disable({ emitEvent: false });
    } else {
      this.rulesForm.enable({ emitEvent: false });
    }
  }

  questionPreview(link: QuestionnaireQuestionLinkItem): string {
    const text = link.text?.trim() || `Pregunta #${link.questionId}`;
    return text.length > 60 ? `${text.slice(0, 60)}…` : text;
  }

  markTouched(): void {
    this.touched?.();
  }

  private loadQuestionnaireQuestions(questionnaireId: number | null): void {
    if (questionnaireId == null) {
      this.questionnaireQuestions = [];
      this.rulesForm.patchValue({ excludeQuestionIds: [] }, { emitEvent: false });
      this.emitValue();
      return;
    }
    this.questionnaireApi.listQuestions(questionnaireId).subscribe({
      next: (links) => {
        this.questionnaireQuestions = links;
        const allowed = new Set(links.map((l) => l.questionId));
        const current = this.rulesForm.controls.excludeQuestionIds.value;
        const filtered = current.filter((id) => allowed.has(id));
        if (filtered.length !== current.length) {
          this.rulesForm.patchValue({ excludeQuestionIds: filtered }, { emitEvent: false });
        }
        this.emitValue();
      },
      error: () => {
        this.questionnaireQuestions = [];
      },
    });
  }

  private patchFromValue(value: string | null): void {
    const parsed = parseGenerationConfig(value);
    this.hasUnsupportedKeys = parsed.hasUnsupportedKeys;
    const config = parsed.config;
    this.rulesForm.patchValue(
      {
        filterDifficulty: config.difficultyMin != null || config.difficultyMax != null,
        difficultyMin: config.difficultyMin ?? 1,
        difficultyMax: config.difficultyMax ?? 5,
        questionTypes: config.questionTypes ?? [],
        knowledgeCategoryIds: config.knowledgeCategoryIds ?? [],
        excludeQuestionIds: config.excludeQuestionIds ?? [],
      },
      { emitEvent: false },
    );
  }

  private emitValue(): void {
    if (this.disabled) {
      return;
    }
    const raw = this.rulesForm.getRawValue();
    const config = {
      difficultyMin: raw.filterDifficulty ? raw.difficultyMin : undefined,
      difficultyMax: raw.filterDifficulty ? raw.difficultyMax : undefined,
      questionTypes: raw.questionTypes.length ? raw.questionTypes : undefined,
      knowledgeCategoryIds: raw.knowledgeCategoryIds.length ? raw.knowledgeCategoryIds : undefined,
      excludeQuestionIds: raw.excludeQuestionIds.length ? raw.excludeQuestionIds : undefined,
    };
    this.valueChange?.(buildGenerationConfigJson(config));
  }
}
