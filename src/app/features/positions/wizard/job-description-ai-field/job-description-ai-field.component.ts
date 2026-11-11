import { Component, HostBinding, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
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
import { PortalLanguageCatalogService } from '../../../../core/services/portal-language-catalog.service';
import { PortalLanguage } from '../../../../shared/models/portal-language.model';
import {
  appendJobDescriptionLanguageInstruction,
  buildJobDescriptionPrompt,
  jobDescriptionLanguageDisplayName,
  type JobDescriptionPromptCatalogLabels,
  type JobDescriptionPromptSnapshot,
} from './build-job-description-prompt';
import { sanitizeJobDescriptionChatMessage } from './sanitize-job-description-chat';

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
  private readonly portalLanguagesCatalog = inject(PortalLanguageCatalogService);

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

  portalLanguages: PortalLanguage[] = [];
  selectedLanguageId: number | null = null;
  busyAction: 'generate' | 'translate' | null = null;
  private conversationThreadId: string | null = null;
  private languagesSub: Subscription | null = null;

  get busy(): boolean {
    return this.busyAction !== null;
  }

  ngOnInit(): void {
    this.languagesSub = this.portalLanguagesCatalog.load().subscribe({
      next: (languages) => {
        this.portalLanguages = languages;
        this.selectedLanguageId = this.portalLanguagesCatalog.resolveDefault(languages)?.id ?? null;
      },
      error: () => {
        this.portalLanguages = [];
        this.selectedLanguageId = null;
      },
    });
  }

  ngOnDestroy(): void {
    this.languagesSub?.unsubscribe();
    this.conversationThreadId = null;
  }

  onGenerate(): void {
    if (this.disabled || this.busy || !this.showAiActions) {
      return;
    }
    const languageName = this.selectedLanguageName();
    if (!languageName) {
      return;
    }
    const basePregunta = (this.control.value ?? '').trim();
    if (basePregunta) {
      this.runChat(this.appendLanguageInstruction(basePregunta, languageName), 'generate');
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
        this.runChat(this.buildJobDescriptionPregunta(positionName, languageName), 'generate', {
          sanitizeDelimiters: true,
        }),
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
  buildJobDescriptionPregunta(positionName: string, languageName: string): string {
    const snapshot = this.promptSnapshotFactory?.() ?? {};
    return buildJobDescriptionPrompt({ ...snapshot, positionName }, this.promptLabels ?? {}, languageName);
  }

  onTranslate(): void {
    if (this.disabled || this.busy || !this.showAiActions) {
      return;
    }
    const languageName = this.selectedLanguageName();
    if (!languageName) {
      return;
    }
    const jobDescription = (this.control.value ?? '').trim();
    if (!jobDescription) {
      this.feedback.showWarning(FEEDBACK_GENERIC_WARNING_TITLE, this.emptyTranslateMessage);
      return;
    }
    this.runChat(this.buildTranslatePregunta(jobDescription, languageName), 'translate');
  }

  /**
   * External chat expects the catalog name in the prompt, e.g.
   * "mejorar redaccion. En idioma English (US)."
   */
  appendLanguageInstruction(pregunta: string, languageName: string): string {
    return appendJobDescriptionLanguageInstruction(pregunta, languageName);
  }

  /**
   * Translate prompt: "{jobDescription}. Traducir el texto anterior al idioma: English (US)."
   */
  buildTranslatePregunta(jobDescription: string, languageName: string): string {
    const trimmed = jobDescription.trim().replace(/\.?\s*$/, '');
    return `${trimmed}. Traducir el texto anterior al idioma: ${jobDescriptionLanguageDisplayName(languageName)}.`;
  }

  private selectedLanguageName(): string | null {
    const name = this.portalLanguages.find((language) => language.id === this.selectedLanguageId)?.name ?? '';
    const trimmed = name.trim();
    return trimmed || null;
  }

  /**
   * `sanitizeDelimiters` applies only to job-description Auto Generate.
   * Optional `maxChars` remains available for clipped flows.
   */
  private runChat(
    pregunta: string,
    action: 'generate' | 'translate',
    options?: { maxChars?: number; sanitizeDelimiters?: boolean },
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
          if (options?.sanitizeDelimiters) {
            message = sanitizeJobDescriptionChatMessage(message);
          }
          const maxChars = options?.maxChars;
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
