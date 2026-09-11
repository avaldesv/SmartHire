import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FeedbackDialogService } from '../../../core/feedback/feedback-dialog.service';
import {
  ANALYSIS_DETAIL_BODY,
  ANALYSIS_DETAIL_HINT,
  ANALYSIS_DETAIL_TITLE,
  ANALYSIS_KPI_APPLICATIONS,
  ANALYSIS_KPI_AVG_COMPATIBILITY,
  ANALYSIS_KPI_HIRED,
  ANALYSIS_KPI_PRESELECTED,
  ANALYSIS_KPI_WITH_INTERVIEW,
  ANALYSIS_LOAD_ERROR,
  ANALYSIS_LOAD_METRICS_ERROR,
} from '../../../core/i18n/analysis-labels';
import { CandidateApplicationApiService } from '../../../core/services/candidate-application-api.service';
import { CandidateApplicationListItem } from '../../../shared/models/candidate-application.model';
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card.component';

@Component({
  selector: 'sh-analysis',
  standalone: true,
  imports: [MatCardModule, MatProgressSpinnerModule, KpiCardComponent],
  templateUrl: './analysis.component.html',
  styleUrl: './analysis.component.scss',
})
export class AnalysisComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly applicationApi = inject(CandidateApplicationApiService);
  private readonly feedback = inject(FeedbackDialogService);

  readonly positionId = +this.route.parent!.snapshot.paramMap.get('positionId')!;
  readonly labels = {
    loadError: ANALYSIS_LOAD_ERROR,
    kpiApplications: ANALYSIS_KPI_APPLICATIONS,
    kpiAvgCompatibility: ANALYSIS_KPI_AVG_COMPATIBILITY,
    kpiPreselected: ANALYSIS_KPI_PRESELECTED,
    kpiWithInterview: ANALYSIS_KPI_WITH_INTERVIEW,
    kpiHired: ANALYSIS_KPI_HIRED,
    detailTitle: ANALYSIS_DETAIL_TITLE,
    detailBody: ANALYSIS_DETAIL_BODY,
    detailHint: ANALYSIS_DETAIL_HINT,
  };
  loading = true;
  loadError = false;
  stats = { total: 0, avgCompatibility: 0, interviewed: 0, hired: 0, selected: 0 };

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    this.loading = true;
    this.loadError = false;
    this.applicationApi.list(0, 1, { positionId: this.positionId }).subscribe({
      next: (first) => {
        const total = first.total;
        if (total === 0) {
          this.stats = { total: 0, avgCompatibility: 0, interviewed: 0, hired: 0, selected: 0 };
          this.loading = false;
          return;
        }
        const size = Math.min(total, 500);
        if (size === first.items.length) {
          this.applyStats(first.items, total);
          return;
        }
        this.applicationApi.list(0, size, { positionId: this.positionId }).subscribe({
          next: (res) => {
            this.applyStats(res.items, total);
          },
          error: () => this.onLoadError(),
        });
      },
      error: () => this.onLoadError(),
    });
  }

  private applyStats(items: CandidateApplicationListItem[], total: number): void {
    const compatValues = items
      .map((a) => a.compatibilityPercent)
      .filter((v): v is number => v != null);
    const avg = compatValues.length
      ? Math.round(compatValues.reduce((s, v) => s + v, 0) / compatValues.length)
      : 0;
    this.stats = {
      total,
      avgCompatibility: avg,
      interviewed: items.filter((a) => a.interviewScheduled).length,
      hired: items.filter((a) => a.isHired).length,
      selected: items.filter((a) => a.isSelected).length,
    };
    this.loading = false;
  }

  private onLoadError(): void {
    this.loading = false;
    this.loadError = true;
    this.feedback.showSuccess(ANALYSIS_LOAD_METRICS_ERROR);
  }
}
