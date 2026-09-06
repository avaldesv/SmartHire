import { Component, effect, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FeedbackDialogService } from '../../../core/feedback/feedback-dialog.service';
import { AuthService } from '../../../core/services/auth.service';
import { PositionService } from '../../../core/services/position.service';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import {
  DASHBOARD_KPI_INTERESTED,
  DASHBOARD_KPI_INTERESTED_SUB,
  DASHBOARD_KPI_PRESELECTED,
  DASHBOARD_KPI_PRESELECTED_SUB,
  DASHBOARD_KPI_TOTAL_POSITIONS,
  DASHBOARD_KPI_TOTAL_POSITIONS_SUB,
  DASHBOARD_LOAD_KPIS_ERROR,
  DASHBOARD_SUBTITLE,
  DASHBOARD_WELCOME,
} from '../../../core/i18n/dashboard-labels';
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card.component';
import { PositionsPanelComponent } from '../../positions/shared/positions-panel/positions-panel.component';

@Component({
  selector: 'sh-dashboard',
  standalone: true,
  imports: [MatIconModule, KpiCardComponent, PositionsPanelComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly positionService = inject(PositionService);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly tenantContext = inject(TenantContextService);
  private tenantReloadReady = false;

  readonly user = this.auth.currentUser;
  readonly welcomeLabel = DASHBOARD_WELCOME;
  readonly subtitle = DASHBOARD_SUBTITLE;
  readonly kpiTotalPositions = DASHBOARD_KPI_TOTAL_POSITIONS;
  readonly kpiTotalPositionsSub = DASHBOARD_KPI_TOTAL_POSITIONS_SUB;
  readonly kpiPreselected = DASHBOARD_KPI_PRESELECTED;
  readonly kpiPreselectedSub = DASHBOARD_KPI_PRESELECTED_SUB;
  readonly kpiInterested = DASHBOARD_KPI_INTERESTED;
  readonly kpiInterestedSub = DASHBOARD_KPI_INTERESTED_SUB;

  kpis = { totalPositions: 0, preselected: 0, interested: 0 };

  constructor() {
    effect(() => {
      this.tenantContext.activeCompanyId();
      if (!this.tenantReloadReady) {
        return;
      }
      this.loadKpis();
    });
  }

  ngOnInit(): void {
    this.tenantReloadReady = true;
    this.loadKpis();
  }

  loadKpis(): void {
    this.positionService.getDashboardKpis().subscribe({
      next: (res) => {
        this.kpis = {
          totalPositions: res.totalPositions,
          preselected: res.preselectedCandidates,
          interested: res.interestedCandidates,
        };
      },
      error: (err) => {
        this.feedback.showApiError(err, { fallbackMessage: DASHBOARD_LOAD_KPIS_ERROR });
      },
    });
  }
}
