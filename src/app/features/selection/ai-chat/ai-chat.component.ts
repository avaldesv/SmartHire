import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CandidateService } from '../../../mock/services/candidate.service';
import { AiSearchResult } from '../../../shared/models';

@Component({
  selector: 'sh-ai-chat',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './ai-chat.component.html',
  styleUrl: './ai-chat.component.scss',
})
export class AiChatComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly candidateService = inject(CandidateService);

  readonly positionId = +this.route.parent!.snapshot.paramMap.get('positionId')!;
  loading = false;
  results: AiSearchResult[] = [];
  messages: { role: 'user' | 'ai'; text: string }[] = [
    { role: 'ai', text: 'Hola, soy tu asistente de selección. Configura los parámetros y buscaré candidatos compatibles.' },
  ];

  readonly searchForm = this.fb.nonNullable.group({
    count: [5, [Validators.required, Validators.min(1), Validators.max(20)]],
    years: [2, Validators.required],
    sources: [['Jobboard', 'BUC']],
    prompt: ['Buscar candidatos con experiencia en finanzas'],
  });

  search(): void {
    if (this.searchForm.invalid) return;
    const f = this.searchForm.getRawValue();
    this.messages.push({ role: 'user', text: f.prompt });
    this.loading = true;
    this.results = [];
    this.candidateService.searchAi(this.positionId, f.count, f.years, f.sources).subscribe((res) => {
      this.results = res;
      this.loading = false;
      this.messages.push({
        role: 'ai',
        text: `Encontré ${res.length} candidatos con compatibilidad superior al 80%.`,
      });
    });
  }
}
