import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CandidateApplicationApiService } from '../../../core/services/candidate-application-api.service';
import { CandidateApplicationListItem } from '../../../shared/models/candidate-application.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

export interface TrackingKanbanCard {
  applicationId: number;
  candidateName: string;
  positionId: number;
  compatibility: number | null;
}

export interface TrackingKanbanColumn {
  status: string;
  label: string;
  color: string;
  cards: TrackingKanbanCard[];
}

const STATUS_META: Record<string, { label: string; color: string; order: number }> = {
  APPLIED: { label: 'Postulados', color: '#64748b', order: 1 },
  PRESELECTION: { label: 'Preselección', color: '#2563eb', order: 2 },
  INTERVIEW: { label: 'Entrevista', color: '#8b5cf6', order: 3 },
  EVALUATION: { label: 'Evaluación', color: '#f97316', order: 4 },
  DOCUMENTS: { label: 'Documentos', color: '#0d9488', order: 5 },
  HIRED: { label: 'Contratados', color: '#16a34a', order: 6 },
  RELEASED: { label: 'Liberados', color: '#94a3b8', order: 7 },
};

const FALLBACK_COLORS = ['#64748b', '#2563eb', '#8b5cf6', '#f97316', '#0d9488', '#16a34a'];

@Component({
  selector: 'sh-tracking-pipeline',
  standalone: true,
  imports: [MatCardModule, MatProgressSpinnerModule, MatSnackBarModule, PageHeaderComponent],
  templateUrl: './tracking-pipeline.component.html',
  styleUrl: './tracking-pipeline.component.scss',
})
export class TrackingPipelineComponent implements OnInit {
  private readonly applicationApi = inject(CandidateApplicationApiService);
  private readonly snack = inject(MatSnackBar);

  loading = true;
  loadError = false;
  columns: TrackingKanbanColumn[] = [];
  totalApplications = 0;

  ngOnInit(): void {
    this.loadKanban();
  }

  private loadKanban(): void {
    this.loading = true;
    this.loadError = false;
    this.applicationApi.list(0, 1).subscribe({
      next: (first) => {
        const total = first.total;
        this.totalApplications = total;
        if (total === 0) {
          this.columns = [];
          this.loading = false;
          return;
        }
        const size = Math.min(total, 200);
        this.applicationApi.list(0, size).subscribe({
          next: (res) => {
            this.columns = this.buildColumns(res.items);
            this.loading = false;
          },
          error: () => this.onLoadError(),
        });
      },
      error: () => this.onLoadError(),
    });
  }

  private buildColumns(items: CandidateApplicationListItem[]): TrackingKanbanColumn[] {
    const grouped = new Map<string, TrackingKanbanCard[]>();
    for (const app of items) {
      const status = (app.status || 'UNKNOWN').toUpperCase();
      const name = [app.candidateFirstName, app.candidateLastName].filter(Boolean).join(' ').trim()
        || app.candidateEmail
        || `Candidato #${app.candidateId}`;
      const list = grouped.get(status) ?? [];
      list.push({
        applicationId: app.id,
        candidateName: name,
        positionId: app.positionId,
        compatibility: app.compatibilityPercent,
      });
      grouped.set(status, list);
    }

    return [...grouped.entries()]
      .map(([status, cards], index) => {
        const meta = STATUS_META[status];
        return {
          status,
          label: meta?.label ?? status,
          color: meta?.color ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length],
          cards,
          order: meta?.order ?? 99,
        };
      })
      .sort((a, b) => a.order - b.order)
      .map(({ status, label, color, cards }) => ({ status, label, color, cards }));
  }

  private onLoadError(): void {
    this.loading = false;
    this.loadError = true;
    this.snack.open('No se pudo cargar el pipeline de seguimiento', 'Cerrar', { duration: 4000 });
  }
}
