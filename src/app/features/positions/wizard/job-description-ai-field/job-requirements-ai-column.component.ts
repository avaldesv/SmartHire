import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FeedbackDialogService } from '../../../../core/feedback/feedback-dialog.service';
import { FEEDBACK_GENERIC_WARNING_TITLE } from '../../../../core/i18n/feedback-labels';
import { GenerateJobDescriptionApiService } from '../../../../core/services/generate-job-description-api.service';
import { LocaleService } from '../../../../core/services/locale.service';
import {
  buildJobDescriptionPrompt,
  jobDescriptionLanguageDisplayName,
  type JobDescriptionPromptCatalogLabels,
  type JobDescriptionPromptSnapshot,
} from './build-job-description-prompt';
import { JobDescriptionAiFieldComponent } from './job-description-ai-field.component';
import {
  buildJobRequirementsPrompt,
  buildJobRequirementsTranslatePrompt,
  formatJobRequirementsTriple,
  parseJobRequirementsJson,
  splitTranslatedRequirements,
  type JobRequirementsPromptLanguage,
} from './build-job-requirements-prompt';
import { sanitizeJobDescriptionChatMessage } from './sanitize-job-description-chat';

type ChatSide = 'description' | 'requirements';
type ChatAction = 'generate' | 'translate';

@Component({
  selector: 'sh-job-requirements-ai-column',
  standalone: true,
  imports: [JobDescriptionAiFieldComponent],
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
  @Input() descriptionDisabled = false;
  @Input() promptSnapshotFactory: (() => JobDescriptionPromptSnapshot) | null = null;
  @Input() promptLabels: JobDescriptionPromptCatalogLabels | null = null;

  readonly generateLabel = $localize`:@@requisition.action.generateJobDescription:Generar`;
  readonly translateLabel = $localize`:@@requisition.action.translateJobDescription:Traducir`;
  readonly languageLabel = $localize`:@@requisition.field.translateLanguage:Idioma`;
  readonly emptyPositionNameMessage = $localize`:@@requisition.requirements.emptyPositionName:Escribe el nombre del puesto antes de generar los requisitos.`;
  readonly emptyBothTranslateMessage = $localize`:@@requisition.jobRequirementBlock.emptyTranslate:Escribe la descripción del puesto o al menos un requisito antes de traducir.`;
  readonly invalidJsonMessage = $localize`:@@requisition.requirements.invalidJson:No se pudo leer la respuesta de requisitos. El contenido anterior se conservó.`;
  readonly invalidTranslateSplitMessage = $localize`:@@requisition.requirements.invalidTranslateSplit:No se pudo separar la traducción de los tres tipos de requisitos. El contenido anterior se conservó.`;
  readonly generateErrorMessage = $localize`:@@requisition.requirements.generateError:No se pudieron generar los requisitos. Intenta de nuevo.`;
  readonly translateErrorMessage = $localize`:@@requisition.requirements.translateError:No se pudieron traducir los requisitos. Intenta de nuevo.`;
  readonly descriptionGenerateErrorMessage = $localize`:@@requisition.jobDescription.generateError:No se pudo generar la descripción. Intenta de nuevo.`;
  readonly descriptionTranslateErrorMessage = $localize`:@@requisition.jobDescription.translateError:No se pudo traducir la descripción. Intenta de nuevo.`;

  selectedLanguage: JobRequirementsPromptLanguage = 'es';
  busyAction: ChatAction | null = null;
  private pendingCalls = 0;
  private descriptionThreadId: string | null = null;
  private requirementsThreadId: string | null = null;

  get busy(): boolean {
    return this.busyAction !== null;
  }

  get toolbarDisabled(): boolean {
    const requirementsLocked =
      this.mandatoryDisabled && this.optionalDisabled && this.desirableDisabled;
    return this.busy || (requirementsLocked && this.descriptionDisabled);
  }

  ngOnInit(): void {
    const normalized = (this.localeService.activeLocale() ?? '').trim().toLowerCase();
    this.selectedLanguage = normalized === 'en' || normalized.startsWith('en-') ? 'en' : 'es';
  }

  ngOnDestroy(): void {
    this.descriptionThreadId = null;
    this.requirementsThreadId = null;
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
    const snapshot = { ...(this.promptSnapshotFactory?.() ?? {}), positionName };
    const labels = this.promptLabels ?? {};
    const descriptionPregunta = buildJobDescriptionPrompt(snapshot, labels, this.selectedLanguage);
    const requirementsPregunta = buildJobRequirementsPrompt(
      { positionName, snapshot, labels },
      this.selectedLanguage,
    );
    this.beginCalls('generate', 2);
    this.runSide('description', descriptionPregunta, 'generate');
    this.runSide('requirements', requirementsPregunta, 'generate');
  }

  onTranslate(): void {
    if (this.toolbarDisabled) {
      return;
    }
    const description = (this.jobDescriptionControl.value ?? '').trim();
    const blocks = {
      mandatory: (this.mandatoryControl.value ?? '').trim(),
      optional: (this.optionalControl.value ?? '').trim(),
      desirable: (this.desirableControl.value ?? '').trim(),
    };
    const hasRequirements = !!(blocks.mandatory || blocks.optional || blocks.desirable);
    const translateDescription = !!description && !this.descriptionDisabled;
    if (!translateDescription && !hasRequirements) {
      this.feedback.showWarning(FEEDBACK_GENERIC_WARNING_TITLE, this.emptyBothTranslateMessage);
      return;
    }
    const count = (translateDescription ? 1 : 0) + (hasRequirements ? 1 : 0);
    this.beginCalls('translate', count);
    if (translateDescription) {
      const trimmed = description.replace(/\.?\s*$/, '');
      const pregunta = `${trimmed}. Traducir el texto anterior al idioma: ${jobDescriptionLanguageDisplayName(this.selectedLanguage)}.`;
      this.runSide('description', pregunta, 'translate');
    }
    if (hasRequirements) {
      this.runSide(
        'requirements',
        buildJobRequirementsTranslatePrompt(blocks, this.selectedLanguage),
        'translate',
      );
    }
  }

  private beginCalls(action: ChatAction, count: number): void {
    this.busyAction = action;
    this.pendingCalls = count;
  }

  private finishCall(): void {
    this.pendingCalls -= 1;
    if (this.pendingCalls <= 0) {
      this.pendingCalls = 0;
      this.busyAction = null;
    }
  }

  private runSide(side: ChatSide, pregunta: string, action: ChatAction): void {
    const threadId = side === 'description' ? this.descriptionThreadId : this.requirementsThreadId;
    this.api
      .generate({
        pregunta,
        conversationThreadId: threadId,
      })
      .subscribe({
        next: (res) => {
          if (side === 'description') {
            this.descriptionThreadId = res.conversationThreadId || null;
            this.applyDescription(res.message ?? '', action);
          } else {
            this.requirementsThreadId = res.conversationThreadId || null;
            const applied =
              action === 'generate' ? this.applyGenerate(res.message ?? '') : this.applyTranslate(res.message ?? '');
            if (!applied) {
              this.feedback.showWarning(
                FEEDBACK_GENERIC_WARNING_TITLE,
                action === 'generate' ? this.invalidJsonMessage : this.invalidTranslateSplitMessage,
              );
            }
          }
          this.finishCall();
        },
        error: (err) => {
          this.feedback.showApiError(err, {
            fallbackMessage:
              side === 'description'
                ? action === 'translate'
                  ? this.descriptionTranslateErrorMessage
                  : this.descriptionGenerateErrorMessage
                : action === 'translate'
                  ? this.translateErrorMessage
                  : this.generateErrorMessage,
          });
          this.finishCall();
        },
      });
  }

  private applyDescription(message: string, action: ChatAction): void {
    if (this.descriptionDisabled) {
      return;
    }
    const value = action === 'generate' ? sanitizeJobDescriptionChatMessage(message) : message.trim();
    this.jobDescriptionControl.setValue(value);
    this.jobDescriptionControl.markAsDirty();
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
