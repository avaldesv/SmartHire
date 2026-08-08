import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { FeedbackDialogService } from '../../../core/feedback/feedback-dialog.service';
import { AiSearchApiService } from '../../../core/services/ai-search-api.service';
import { PositionAiPromptApiService } from '../../../core/services/position-ai-prompt-api.service';
import { AiSearchResultView } from '../../../shared/models/ai-search.model';

@Component({
  selector: 'sh-ai-chat',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  templateUrl: './ai-chat.component.html',
  styleUrl: './ai-chat.component.scss',
})
export class AiChatComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly aiSearchApi = inject(AiSearchApiService);
  private readonly aiPromptApi = inject(PositionAiPromptApiService);
  private readonly feedback = inject(FeedbackDialogService);

  readonly positionId = +this.route.parent!.snapshot.paramMap.get('positionId')!;
  loading = false;
  savingCriteria = false;
  loadingCriteria = true;
  submitting = false;
  sessionId: number | null = null;
  results: AiSearchResultView[] = [];
  messages: { role: 'user' | 'ai'; text: string }[] = [
    { role: 'ai', text: 'Hola, soy tu asistente de selección. Configura los criterios y buscaré candidatos compatibles.' },
  ];

  readonly criteriaForm = this.fb.nonNullable.group({
    mandatory: ['', Validators.required],
    optional: [''],
    desirable: [''],
  });

  readonly searchForm = this.fb.nonNullable.group({
    count: [5, [Validators.required, Validators.min(1), Validators.max(20)]],
    years: [2, Validators.required],
    sources: [['Postulados', 'Jobboard', 'BUC']],
  });

  ngOnInit(): void {
    this.loadPromptConfig();
  }

  loadPromptConfig(): void {
    this.loadingCriteria = true;
    this.aiPromptApi.get(this.positionId).subscribe({
      next: (config) => {
        this.criteriaForm.patchValue({
          mandatory: config.mandatory,
          optional: config.optional,
          desirable: config.desirable,
        });
        this.loadingCriteria = false;
      },
      error: (err) => {
        this.loadingCriteria = false;
        this.feedback.showSuccess('No se pudo cargar la configuración de prompts');
      },
    });
  }

  saveCriteria(): void {
    if (this.criteriaForm.invalid) {
      this.criteriaForm.markAllAsTouched();
      return;
    }
    const v = this.criteriaForm.getRawValue();
    this.savingCriteria = true;
    this.aiPromptApi
      .upsert(this.positionId, {
        mandatory: v.mandatory.trim(),
        optional: v.optional.trim() || null,
        desirable: v.desirable.trim() || null,
      })
      .subscribe({
        next: () => {
          this.savingCriteria = false;
          this.feedback.showSuccess('Criterios de búsqueda guardados');
        },
        error: (err) => {
          this.savingCriteria = false;
          this.feedback.showSuccess('No se pudieron guardar los criterios');
        },
      });
  }

  search(): void {
    if (this.searchForm.invalid || this.criteriaForm.invalid) {
      this.criteriaForm.markAllAsTouched();
      return;
    }
    const f = this.searchForm.getRawValue();
    const prompt = this.buildPrompt();
    this.messages.push({ role: 'user', text: prompt });
    this.loading = true;
    this.results = [];
    this.sessionId = null;

    this.aiSearchApi
      .query({
        positionId: this.positionId,
        prompt,
        sources: this.mapSources(f.sources),
        count: f.count,
        yearsExperience: f.years,
      })
      .subscribe({
        next: (res) => {
          this.sessionId = res.sessionId;
          this.results = (res.results ?? []).map((item) => ({
            resultId: item.resultId,
            candidateId: item.candidateId,
            name: [item.firstName, item.lastName].filter(Boolean).join(' ').trim() || `Candidato #${item.candidateId}`,
            email: item.email ?? '—',
            phone: item.phone ?? '—',
            compatibility: Number(item.compatibilityPercent ?? 0),
            evidence: item.evidence ?? '',
            selected: true,
          }));
          this.loading = false;
          const count = this.results.length;
          this.messages.push({
            role: 'ai',
            text: count
              ? `Encontré ${count} candidato(s) compatibles. Revisa el ranking y agrégalos a preselección.`
              : 'No encontré candidatos con los criterios actuales. Ajusta fuentes o años de experiencia.',
          });
        },
        error: (err) => {
          this.loading = false;
          this.feedback.showSuccess('No se pudo ejecutar la búsqueda IA');
        },
      });
  }

  addSelectedToPreselection(): void {
    if (!this.sessionId) return;
    const resultIds = this.results.filter((r) => r.selected).map((r) => r.resultId);
    if (!resultIds.length) {
      this.feedback.showSuccess('Selecciona al menos un candidato');
      return;
    }
    this.submitting = true;
    this.aiSearchApi.addToPreselection({ sessionId: this.sessionId, resultIds }).subscribe({
      next: (res) => {
        this.submitting = false;
        this.feedback.showSuccess(`${res.updatedCount} candidato(s) agregado(s) a preselección`);
        this.messages.push({
          role: 'ai',
          text: `Agregué ${res.updatedCount} candidato(s) a preselección para esta posición.`,
        });
      },
      error: (err) => {
        this.submitting = false;
        this.feedback.showSuccess('No se pudo agregar a preselección');
      },
    });
  }

  toggleAll(checked: boolean): void {
    this.results.forEach((r) => (r.selected = checked));
  }

  private buildPrompt(): string {
    const v = this.criteriaForm.getRawValue();
    return [
      `Obligatorio: ${v.mandatory.trim()}`,
      v.optional.trim() ? `Opcional: ${v.optional.trim()}` : '',
      v.desirable.trim() ? `Deseable: ${v.desirable.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n');
  }

  private mapSources(sources: string[]): string[] {
    return sources.map((s) => {
      const normalized = s.trim().toLowerCase();
      if (normalized.includes('postul')) return 'postulados';
      if (normalized.includes('buc')) return 'buc';
      if (normalized.includes('job')) return 'jobboard';
      if (normalized.includes('seguimiento')) return 'seguimiento';
      return normalized;
    });
  }
}
