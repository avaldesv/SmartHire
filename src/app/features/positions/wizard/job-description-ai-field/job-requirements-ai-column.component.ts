import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { FeedbackDialogService } from '../../../../core/feedback/feedback-dialog.service';
import { FEEDBACK_GENERIC_WARNING_TITLE } from '../../../../core/i18n/feedback-labels';
import { GenerateJobDescriptionApiService } from '../../../../core/services/generate-job-description-api.service';
import { LocaleService } from '../../../../core/services/locale.service';
import { JobDescriptionAiFieldComponent } from './job-description-ai-field.component';
import {
  buildJobRequirementsPrompt,
  buildJobRequirementsTranslatePrompt,
  formatJobRequirementsTriple,
  parseJobRequirementsJson,
  splitTranslatedRequirements,
  type JobRequirementsPromptLanguage,
} from './build-job-requirements-prompt';

@Component({
  selector: 'sh-job-requirements-ai-column',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    JobDescriptionAiFieldComponent,
  ],
  templateUrl: './job-requirements-ai-column.component.html',
  styleUrl: './job-requirements-ai-column.component.scss',
})
export class JobRequirementsAiColumnComponent implements OnInit, OnDestroy {
  private readonly api = inject(GenerateJobDescriptionApiService);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly localeService = inject(LocaleService);

  @Input({ required: true }) mandatoryControl!: FormControl<string | null>;
  @Input({ required: true }) optionalControl!: FormControl<string | null>;
  @Input({ required: true }) desirableControl!: FormControl<string | null>;
  @Input({ required: true }) positionNameControl!: FormControl<string | null>;
  @Input({ required: true }) jobDescriptionControl!: FormControl<string | null>;
  @Input() mandatoryLabel = $localize`:@@requisition.field.requirementsMandatory:Requisitos obligatorios`;
  @Input() optionalLabel = $localize`:@@requisition.field.requirementsOptional:Requisitos opcionales`;
  @Input() desirableLabel = $localize`:@@requisition.field.requirementsDesirable:Requisitos deseables`;
  @Input() mandatoryDisabled = false;
  @Input() optionalDisabled = false;
  @Input() desirableDisabled = false;

  readonly generateLabel = $localize`:@@requisition.action.generateJobDescription:Generar`;
  readonly translateLabel = $localize`:@@requisition.action.translateJobDescription:Traducir`;
  readonly languageLabel = $localize`:@@requisition.field.translateLanguage:Idioma`;
  readonly emptyPositionNameMessage = $localize`:@@requisition.requirements.emptyPositionName:Escribe el nombre del puesto antes de generar los requisitos.`;
  readonly emptyTranslateMessage = $localize`:@@requisition.requirements.emptyTranslate:Escribe o genera al menos un tipo de requisito antes de traducir.`;
  readonly invalidJsonMessage = $localize`:@@requisition.requirements.invalidJson:No se pudo leer la respuesta de requisitos. El contenido anterior se conservó.`;
  readonly invalidTranslateSplitMessage = $localize`:@@requisition.requirements.invalidTranslateSplit:No se pudo separar la traducción de los tres tipos de requisitos. El contenido anterior se conservó.`;
  readonly generateErrorMessage = $localize`:@@requisition.requirements.generateError:No se pudieron generar los requisitos. Intenta de nuevo.`;
  readonly translateErrorMessage = $localize`:@@requisition.requirements.translateError:No se pudieron traducir los requisitos. Intenta de nuevo.`;

  selectedLanguage: JobRequirementsPromptLanguage = 'es';
  busyAction: 'generate' | 'translate' | null = null;
  private conversationThreadId: string | null = null;

  get busy(): boolean {
    return this.busyAction !== null;
  }

  get toolbarDisabled(): boolean {
    return this.busy || (this.mandatoryDisabled && this.optionalDisabled && this.desirableDisabled);
  }

  ngOnInit(): void {
    const normalized = (this.localeService.activeLocale() ?? '').trim().toLowerCase();
    this.selectedLanguage = normalized === 'en' || normalized.startsWith('en-') ? 'en' : 'es';
  }

  ngOnDestroy(): void {
    this.conversationThreadId = null;
  }

  onGenerate(): void {
    if (this.toolbarDisabled) {
      return;
    }
    const positionName = (this.positionNameControl.value ?? '').trim();
    if (!positionName) {
      this.feedback.showWarning(FEEDBACK_GENERIC_WARNING_TITLE, this.emptyPositionNameMessage);
      return;
    }
    const pregunta = buildJobRequirementsPrompt(
      {
        positionName,
        jobDescription: this.jobDescriptionControl.value,
      },
      this.selectedLanguage,
    );
    if (!pregunta) {
      this.feedback.showWarning(FEEDBACK_GENERIC_WARNING_TITLE, this.emptyPositionNameMessage);
      return;
    }
    this.runChat(pregunta, 'generate');
  }

  onTranslate(): void {
    if (this.toolbarDisabled) {
      return;
    }
    const blocks = {
      mandatory: (this.mandatoryControl.value ?? '').trim(),
      optional: (this.optionalControl.value ?? '').trim(),
      desirable: (this.desirableControl.value ?? '').trim(),
    };
    if (!blocks.mandatory && !blocks.optional && !blocks.desirable) {
      this.feedback.showWarning(FEEDBACK_GENERIC_WARNING_TITLE, this.emptyTranslateMessage);
      return;
    }
    this.runChat(buildJobRequirementsTranslatePrompt(blocks, this.selectedLanguage), 'translate');
  }

  private runChat(pregunta: string, action: 'generate' | 'translate'): void {
    this.busyAction = action;
    this.api
      .generate({
        pregunta,
        conversationThreadId: this.conversationThreadId,
      })
      .subscribe({
        next: (res) => {
          const message = res.message ?? '';
          this.conversationThreadId = res.conversationThreadId || null;
          const applied = action === 'generate' ? this.applyGenerate(message) : this.applyTranslate(message);
          this.busyAction = null;
          if (!applied) {
            this.feedback.showWarning(
              FEEDBACK_GENERIC_WARNING_TITLE,
              action === 'generate' ? this.invalidJsonMessage : this.invalidTranslateSplitMessage,
            );
          }
        },
        error: (err) => {
          this.busyAction = null;
          this.feedback.showApiError(err, {
            fallbackMessage:
              action === 'translate' ? this.translateErrorMessage : this.generateErrorMessage,
          });
        },
      });
  }

  private applyGenerate(message: string): boolean {
    const parsed = parseJobRequirementsJson(message);
    if (!parsed) {
      return false;
    }
    const formatted = formatJobRequirementsTriple(parsed);
    this.patchBlock(this.mandatoryControl, this.mandatoryDisabled, formatted.mandatory);
    this.patchBlock(this.optionalControl, this.optionalDisabled, formatted.optional);
    this.patchBlock(this.desirableControl, this.desirableDisabled, formatted.desirable);
    return true;
  }

  private applyTranslate(message: string): boolean {
    const split = splitTranslatedRequirements(message);
    if (!split) {
      return false;
    }
    this.patchBlock(this.mandatoryControl, this.mandatoryDisabled, split.mandatory);
    this.patchBlock(this.optionalControl, this.optionalDisabled, split.optional);
    this.patchBlock(this.desirableControl, this.desirableDisabled, split.desirable);
    return true;
  }

  private patchBlock(control: FormControl<string | null>, disabled: boolean, value: string): void {
    if (disabled) {
      return;
    }
    control.setValue(value);
    control.markAsDirty();
  }
}
