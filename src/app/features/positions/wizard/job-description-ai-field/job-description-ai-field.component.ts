import { Component, HostBinding, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { FeedbackDialogService } from '../../../../core/feedback/feedback-dialog.service';
import {
  FEEDBACK_GENERIC_WARNING_TITLE,
  FEEDBACK_UNDERSTOOD,
} from '../../../../core/i18n/feedback-labels';
import { GenerateJobDescriptionApiService } from '../../../../core/services/generate-job-description-api.service';
import { LocaleService } from '../../../../core/services/locale.service';
import {
  appendJobDescriptionLanguageInstruction,
  buildJobDescriptionPrompt,
  jobDescriptionLanguageDisplayName,
  type JobDescriptionPromptCatalogLabels,
  type JobDescriptionPromptLanguage,
  type JobDescriptionPromptSnapshot,
} from './build-job-description-prompt';

/** UI codes for the language selector used when generating/translating job descriptions. */
export type JobDescriptionOutputLanguage = JobDescriptionPromptLanguage;

export type JobDescriptionAutoGenerateMode = 'jobDescription';

@Component({
  selector: 'sh-job-description-ai-field',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './job-description-ai-field.component.html',
  styleUrl: './job-description-ai-field.component.scss',
})
export class JobDescriptionAiFieldComponent implements OnInit, OnDestroy {
  private readonly api = inject(GenerateJobDescriptionApiService);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly localeService = inject(LocaleService);

  @Input({ required: true }) control!: FormControl<string | null>;
  @Input() disabled = false;
  @Input() fieldLabel = $localize`:@@requisition.field.jobDescription:Descripción del puesto`;
  /** When null/empty, the section heading is hidden (e.g. requirements columns). */
  @Input() sectionTitle: string | null = $localize`:@@requisition.section.jobRequirement:Requerimiento del Empleo`;
  @Input() rows = 6;
  /** Stretch textarea so the field fills the parent column height (aligned bottom with sibling). */
  @Input() fillHeight = false;
  /**
   * Optional source (job description). When the field is empty and mode is set,
   * Generar offers Auto Generar based on this control.
   */
  @Input() sourceControl: FormControl<string | null> | null = null;
  @Input() autoGenerateMode: JobDescriptionAutoGenerateMode | null = null;
  /** Full wizard snapshot (all steps). Used only for jobDescription Auto Generate. */
  @Input() promptSnapshotFactory: (() => JobDescriptionPromptSnapshot) | null = null;
  @Input() promptLabels: JobDescriptionPromptCatalogLabels | null = null;
  /** Show live character counter after Traducir (job description). */
  @Input() showCharCount = false;
  /** Hide Generar / Idioma / Traducir (used by the unified requirements column). */
  @Input() showAiActions = true;

  @HostBinding('class.job-description-ai-host--fill')
  get hostFillHeight(): boolean {
    return this.fillHeight;
  }

  readonly generateLabel = $localize`:@@requisition.action.generateJobDescription:Generar`;
  readonly translateLabel = $localize`:@@requisition.action.translateJobDescription:Traducir`;
  readonly languageLabel = $localize`:@@requisition.field.translateLanguage:Idioma`;
  readonly autoGenerateLabel = $localize`:@@requisition.action.autoGenerateRequirements:Auto Generar`;
  readonly charactersLabel = $localize`:@@requisition.jobDescription.characters:Caracteres`;
  readonly emptyPromptMessage = $localize`:@@requisition.jobDescription.emptyPrompt:Escribe una instrucción o borrador en el campo antes de generar.`;
  readonly autoGenerateFromPositionNameMessage = $localize`:@@requisition.jobDescription.autoGenerateFromPositionName:Pulsa Entendido para escribir una instrucción o borrador en el campo. Pulsa Auto Generar para crear el texto a partir de los datos de la requisición.`;
  readonly emptyPositionNameForAutoGenerateMessage = $localize`:@@requisition.jobDescription.emptyPositionNameForAutoGenerate:Escribe el nombre del puesto antes de auto generar la descripción.`;
  readonly emptyTranslateMessage = $localize`:@@requisition.jobDescription.emptyTranslate:Escribe o genera una descripción antes de traducir.`;
  readonly generateErrorMessage = $localize`:@@requisition.jobDescription.generateError:No se pudo generar la descripción. Intenta de nuevo.`;
  readonly translateErrorMessage = $localize`:@@requisition.jobDescription.translateError:No se pudo traducir la descripción. Intenta de nuevo.`;
  readonly understoodLabel = FEEDBACK_UNDERSTOOD;

  get showSectionTitle(): boolean {
    return !!this.sectionTitle?.trim();
  }

  get characterCount(): number {
    return (this.control?.value ?? '').length;
  }

  selectedLanguage: JobDescriptionOutputLanguage = 'es';
  busyAction: 'generate' | 'translate' | null = null;
  private conversationThreadId: string | null = null;

  get busy(): boolean {
    return this.busyAction !== null;
  }

  ngOnInit(): void {
    this.selectedLanguage = this.resolveDefaultLanguage(this.localeService.activeLocale());
  }

  ngOnDestroy(): void {
    this.conversationThreadId = null;
  }

  onGenerate(): void {
    if (this.disabled || this.busy || !this.showAiActions) {
      return;
    }
    const basePregunta = (this.control.value ?? '').trim();
    if (basePregunta) {
      this.runChat(this.appendLanguageInstruction(basePregunta, this.selectedLanguage), 'generate');
      return;
    }

    if (this.autoGenerateMode === 'jobDescription') {
      const positionName = (this.sourceControl?.value ?? '').trim();
      if (!positionName) {
        this.feedback.showWarning(
          FEEDBACK_GENERIC_WARNING_TITLE,
          this.emptyPositionNameForAutoGenerateMessage,
        );
        return;
      }
      this.openAutoGenerateConfirm(this.autoGenerateFromPositionNameMessage, () =>
        this.runChat(this.buildJobDescriptionPregunta(positionName, this.selectedLanguage), 'generate', 1000),
      );
      return;
    }

    this.feedback.showWarning(FEEDBACK_GENERIC_WARNING_TITLE, this.emptyPromptMessage);
  }

  private openAutoGenerateConfirm(message: string, onConfirm: () => void): void {
    this.feedback
      .confirm({
        title: FEEDBACK_GENERIC_WARNING_TITLE,
        message,
        cancelLabel: this.understoodLabel,
        confirmLabel: this.autoGenerateLabel,
        iconType: 'warning',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          onConfirm();
        }
      });
  }

  /**
   * Auto Generate (empty textarea): Appian-style prompt from wizard snapshot.
   */
  buildJobDescriptionPregunta(
    positionName: string,
    language: JobDescriptionOutputLanguage,
  ): string {
    const snapshot = this.promptSnapshotFactory?.() ?? {};
    return buildJobDescriptionPrompt({ ...snapshot, positionName }, this.promptLabels ?? {}, language);
  }

  onTranslate(): void {
    if (this.disabled || this.busy || !this.showAiActions) {
      return;
    }
    const jobDescription = (this.control.value ?? '').trim();
    if (!jobDescription) {
      this.feedback.showWarning(FEEDBACK_GENERIC_WARNING_TITLE, this.emptyTranslateMessage);
      return;
    }
    this.runChat(this.buildTranslatePregunta(jobDescription, this.selectedLanguage), 'translate');
  }

  /** Maps authenticated user locale (es-MX, en-US, …) to selector value. */
  resolveDefaultLanguage(locale: string | null | undefined): JobDescriptionOutputLanguage {
    const normalized = (locale ?? '').trim().toLowerCase();
    if (normalized === 'en' || normalized.startsWith('en-')) {
      return 'en';
    }
    return 'es';
  }

  /**
   * External chat expects the target language in the prompt text, e.g.
   * "mejorar redaccion. En idioma inglés."
   */
  appendLanguageInstruction(
    pregunta: string,
    language: JobDescriptionOutputLanguage,
  ): string {
    return appendJobDescriptionLanguageInstruction(pregunta, language);
  }

  /**
   * Translate prompt: "{jobDescription}. Traducir el texto anterior al idioma: inglés."
   */
  buildTranslatePregunta(
    jobDescription: string,
    language: JobDescriptionOutputLanguage,
  ): string {
    const trimmed = jobDescription.trim().replace(/\.?\s*$/, '');
    return `${trimmed}. Traducir el texto anterior al idioma: ${this.languageDisplayName(language)}.`;
  }

  languageDisplayName(language: JobDescriptionOutputLanguage): string {
    return jobDescriptionLanguageDisplayName(language);
  }

  private runChat(
    pregunta: string,
    action: 'generate' | 'translate',
    maxChars?: number,
  ): void {
    this.busyAction = action;
    this.api
      .generate({
        pregunta,
        conversationThreadId: this.conversationThreadId,
      })
      .subscribe({
        next: (res) => {
          let message = res.message ?? '';
          if (maxChars != null && maxChars > 0 && message.length > maxChars) {
            message = message.slice(0, maxChars).trimEnd();
          }
          this.control.setValue(message);
          this.control.markAsDirty();
          this.conversationThreadId = res.conversationThreadId || null;
          this.busyAction = null;
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
}
