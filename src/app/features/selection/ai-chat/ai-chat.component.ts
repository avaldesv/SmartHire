import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AiSearchApiService } from '../../../core/services/ai-search-api.service';
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
    MatSnackBarModule,
  ],
  templateUrl: './ai-chat.component.html',
  styleUrl: './ai-chat.component.scss',
})
export class AiChatComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly aiSearchApi = inject(AiSearchApiService);
  private readonly snack = inject(MatSnackBar);

  readonly positionId = +this.route.parent!.snapshot.paramMap.get('positionId')!;
  loading = false;
  submitting = false;
  sessionId: number | null = null;
  results: AiSearchResultView[] = [];
  messages: { role: 'user' | 'ai'; text: string }[] = [
    { role: 'ai', text: 'Hola, soy tu asistente de selección. Configura los parámetros y buscaré candidatos compatibles.' },
  ];

  readonly searchForm = this.fb.nonNullable.group({
    count: [5, [Validators.required, Validators.min(1), Validators.max(20)]],
    years: [2, Validators.required],
    sources: [['Postulados', 'Jobboard', 'BUC']],
    prompt: ['Buscar candidatos con experiencia en finanzas'],
  });

  search(): void {
    if (this.searchForm.invalid) return;
    const f = this.searchForm.getRawValue();
    this.messages.push({ role: 'user', text: f.prompt });
    this.loading = true;
    this.results = [];
    this.sessionId = null;

    this.aiSearchApi
      .query({
        positionId: this.positionId,
        prompt: f.prompt,
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
        error: () => {
          this.loading = false;
          this.snack.open('No se pudo ejecutar la búsqueda IA', 'Cerrar', { duration: 4000 });
        },
      });
  }

  addSelectedToPreselection(): void {
    if (!this.sessionId) return;
    const resultIds = this.results.filter((r) => r.selected).map((r) => r.resultId);
    if (!resultIds.length) {
      this.snack.open('Selecciona al menos un candidato', 'Cerrar', { duration: 3000 });
      return;
    }
    this.submitting = true;
    this.aiSearchApi.addToPreselection({ sessionId: this.sessionId, resultIds }).subscribe({
      next: (res) => {
        this.submitting = false;
        this.snack.open(`${res.updatedCount} candidato(s) agregado(s) a preselección`, 'Cerrar', { duration: 3500 });
        this.messages.push({
          role: 'ai',
          text: `Agregué ${res.updatedCount} candidato(s) a preselección para esta posición.`,
        });
      },
      error: () => {
        this.submitting = false;
        this.snack.open('No se pudo agregar a preselección', 'Cerrar', { duration: 4000 });
      },
    });
  }

  toggleAll(checked: boolean): void {
    this.results.forEach((r) => (r.selected = checked));
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
