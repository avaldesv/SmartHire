import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { FeedbackDialogService } from '../../../../core/feedback/feedback-dialog.service';
import { FEEDBACK_GENERIC_WARNING_TITLE } from '../../../../core/i18n/feedback-labels';
import { GenerateJobDescriptionApiService } from '../../../../core/services/generate-job-description-api.service';
import { LocaleService } from '../../../../core/services/locale.service';

/** UI codes for the language selector used when generating/translating job descriptions. */
export type JobDescriptionOutputLanguage = 'es' | 'en';

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

  readonly generateLabel = $localize`:@@requisition.action.generateJobDescription:Generar`;
  readonly translateLabel = $localize`:@@requisition.action.translateJobDescription:Traducir`;
  readonly languageLabel = $localize`:@@requisition.field.translateLanguage:Idioma`;
  readonly emptyPromptMessage = $localize`:@@requisition.jobDescription.emptyPrompt:Escribe una instrucción o borrador en el campo antes de generar.`;
  readonly emptyTranslateMessage = $localize`:@@requisition.jobDescription.emptyTranslate:Escribe o genera una descripción antes de traducir.`;
  readonly generateErrorMessage = $localize`:@@requisition.jobDescription.generateError:No se pudo generar la descripción. Intenta de nuevo.`;
  readonly translateErrorMessage = $localize`:@@requisition.jobDescription.translateError:No se pudo traducir la descripción. Intenta de nuevo.`;

  get showSectionTitle(): boolean {
    return !!this.sectionTitle?.trim();
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
    if (this.disabled || this.busy) {
      return;
    }
    const basePregunta = (this.control.value ?? '').trim();
    if (!basePregunta) {
      this.feedback.showWarning(FEEDBACK_GENERIC_WARNING_TITLE, this.emptyPromptMessage);
      return;
    }
    this.runChat(this.appendLanguageInstruction(basePregunta, this.selectedLanguage), 'generate');
  }

  onTranslate(): void {
    if (this.disabled || this.busy) {
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
    const trimmed = pregunta.trim().replace(/\.?\s*$/, '');
    return `${trimmed}. En idioma ${this.languageDisplayName(language)}.`;
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
    return language === 'en' ? 'inglés' : 'español';
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
          this.control.setValue(res.message ?? '');
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
