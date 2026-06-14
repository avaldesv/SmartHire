import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CandidateService } from '../../../mock/services/candidate.service';
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
  private readonly candidateService = inject(CandidateService);

  readonly positionId = +this.route.parent!.snapshot.paramMap.get('positionId')!;
  loading = true;
  stats = { total: 0, avgCompatibility: 0, interviewed: 0, hired: 0 };

  ngOnInit(): void {
    this.candidateService.getPreselection(this.positionId).subscribe((items) => {
      const total = items.length;
      const avg = total ? Math.round(items.reduce((s, c) => s + c.compatibility, 0) / total) : 0;
      this.stats = {
        total,
        avgCompatibility: avg,
        interviewed: items.filter((c) => c.interviewScheduled).length,
        hired: items.filter((c) => c.stage === 'Contratado').length,
      };
      this.loading = false;
    });
  }
}
