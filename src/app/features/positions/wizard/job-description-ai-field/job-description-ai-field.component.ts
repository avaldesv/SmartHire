import { Component, Input, OnDestroy, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { GenerateJobDescriptionApiService } from '../../../../core/services/generate-job-description-api.service';

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
    MatSnackBarModule,
  ],
  templateUrl: './job-description-ai-field.component.html',
  styleUrl: './job-description-ai-field.component.scss',
})
export class JobDescriptionAiFieldComponent implements OnDestroy {
  private readonly api = inject(GenerateJobDescriptionApiService);
  private readonly snackBar = inject(MatSnackBar);

  @Input({ required: true }) control!: FormControl<string | null>;
  @Input() disabled = false;
  @Input() fieldLabel = $localize`:@@requisition.field.jobDescription:Descripción del puesto`;

  readonly sectionTitle = $localize`:@@requisition.section.jobRequirement:Requerimiento del Empleo`;
  readonly generateLabel = $localize`:@@requisition.action.generateJobDescription:Generar`;
  readonly translateLabel = $localize`:@@requisition.action.translateJobDescription:Traducir`;
  readonly languageLabel = $localize`:@@requisition.field.translateLanguage:Idioma`;
  readonly emptyPromptMessage = $localize`:@@requisition.jobDescription.emptyPrompt:Escribe una instrucción o borrador en el campo antes de generar.`;
  readonly generateErrorMessage = $localize`:@@requisition.jobDescription.generateError:No se pudo generar la descripción. Intenta de nuevo.`;

  selectedLanguage = 'es';
  generating = false;
  private conversationThreadId: string | null = null;

  ngOnDestroy(): void {
    this.conversationThreadId = null;
  }

  onGenerate(): void {
    if (this.disabled || this.generating) {
      return;
    }
    const pregunta = (this.control.value ?? '').trim();
    if (!pregunta) {
      this.snackBar.open(this.emptyPromptMessage, undefined, { duration: 4000 });
      return;
    }

    this.generating = true;
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
          this.generating = false;
        },
        error: () => {
          this.generating = false;
          this.snackBar.open(this.generateErrorMessage, undefined, { duration: 5000 });
        },
      });
  }
}
