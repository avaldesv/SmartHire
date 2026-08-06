import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { PositionService } from '../../../core/services/position.service';
import {
  DASHBOARD_KPI_INTERESTED,
  DASHBOARD_KPI_INTERESTED_SUB,
  DASHBOARD_KPI_PRESELECTED,
  DASHBOARD_KPI_PRESELECTED_SUB,
  DASHBOARD_KPI_TOTAL_POSITIONS,
  DASHBOARD_KPI_TOTAL_POSITIONS_SUB,
  DASHBOARD_LOAD_KPIS_ERROR,
  DASHBOARD_NEW_REQUISITION,
  DASHBOARD_SECTION_REQUESTS,
  DASHBOARD_SNACK_CLOSE,
  DASHBOARD_SUBTITLE,
  DASHBOARD_WELCOME,
} from '../../../core/i18n/dashboard-labels';
import {
  POSITIONS_CLEAR_FILTERS,
  POSITIONS_LESS_FILTERS,
  POSITIONS_MORE_FILTERS,
} from '../../../core/i18n/positions-labels';
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card.component';
import { PositionsTableComponent } from '../../positions/shared/positions-table/positions-table.component';

@Component({
  selector: 'sh-dashboard',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    KpiCardComponent,
    PositionsTableComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly positionService = inject(PositionService);
  private readonly snack = inject(MatSnackBar);

  readonly user = this.auth.currentUser;
  readonly welcomeLabel = DASHBOARD_WELCOME;
  readonly subtitle = DASHBOARD_SUBTITLE;
  readonly kpiTotalPositions = DASHBOARD_KPI_TOTAL_POSITIONS;
  readonly kpiTotalPositionsSub = DASHBOARD_KPI_TOTAL_POSITIONS_SUB;
  readonly kpiPreselected = DASHBOARD_KPI_PRESELECTED;
  readonly kpiPreselectedSub = DASHBOARD_KPI_PRESELECTED_SUB;
  readonly kpiInterested = DASHBOARD_KPI_INTERESTED;
  readonly kpiInterestedSub = DASHBOARD_KPI_INTERESTED_SUB;
  readonly sectionRequests = DASHBOARD_SECTION_REQUESTS;
  readonly newRequisition = DASHBOARD_NEW_REQUISITION;
  readonly clearFiltersLabel = POSITIONS_CLEAR_FILTERS;
  readonly moreFiltersLabel = POSITIONS_MORE_FILTERS;
  readonly lessFiltersLabel = POSITIONS_LESS_FILTERS;

  kpis = { totalPositions: 0, preselected: 0, interested: 0 };

  ngOnInit(): void {
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
      error: () => {
        this.snack.open(DASHBOARD_LOAD_KPIS_ERROR, DASHBOARD_SNACK_CLOSE, { duration: 4000 });
      },
    });
  }
}
