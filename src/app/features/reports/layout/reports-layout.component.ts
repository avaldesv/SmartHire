import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  REPORTS_NAV_BEHAVIOR,
  REPORTS_NAV_CATEGORY_COVERAGE,
  REPORTS_NAV_CATEGORY_GENERAL,
  REPORTS_NAV_CATEGORY_VACANCIES,
  REPORTS_NAV_CONSOLIDATED,
  REPORTS_NAV_METRICS,
  REPORTS_NAV_MMR,
  REPORTS_NAV_POSITIONS_IN_PROCESS,
  REPORTS_NAV_PROCESS_FUNNEL,
  REPORTS_NAV_REQUISITIONS_BY_SOURCE,
  REPORTS_NAV_SEGMENTED_SUMMARY,
  REPORTS_NAV_STATUS_BY_REQUISITION,
  REPORTS_NAV_TOP_INCIDENTS,
  REPORTS_PAGE_TITLE,
  REPORTS_PERF_TITLE,
  REPORTS_RBM_TITLE,
} from '../../../core/i18n/reports-i18n-labels';

interface ReportNavItem {
  label: string;
  slug: string;
  category: 'generales' | 'cubrimiento' | 'vacantes';
}

/** Only reports with a real screen (placeholders hidden). */
const IMPLEMENTED_REPORTS: ReportNavItem[] = [
  { label: REPORTS_NAV_MMR, slug: 'mmr', category: 'generales' },
  { label: REPORTS_RBM_TITLE, slug: 'requisitions-by-month', category: 'generales' },
  { label: REPORTS_NAV_STATUS_BY_REQUISITION, slug: 'status-by-requisition', category: 'generales' },
  { label: REPORTS_NAV_PROCESS_FUNNEL, slug: 'process-funnel', category: 'generales' },
  { label: REPORTS_PERF_TITLE, slug: 'recruiter-performance', category: 'generales' },
  { label: REPORTS_NAV_CONSOLIDATED, slug: 'consolidado', category: 'cubrimiento' },
  { label: REPORTS_NAV_SEGMENTED_SUMMARY, slug: 'resumen-segmentado', category: 'cubrimiento' },
  { label: REPORTS_NAV_TOP_INCIDENTS, slug: 'tops-incidencias', category: 'cubrimiento' },
  { label: REPORTS_NAV_METRICS, slug: 'metricas', category: 'vacantes' },
  { label: REPORTS_NAV_POSITIONS_IN_PROCESS, slug: 'requisitions-in-process', category: 'vacantes' },
  { label: REPORTS_NAV_BEHAVIOR, slug: 'comportamiento', category: 'vacantes' },
  { label: REPORTS_NAV_REQUISITIONS_BY_SOURCE, slug: 'requisitions-by-source', category: 'vacantes' },
];

const CATEGORY_ORDER: Array<ReportNavItem['category']> = ['generales', 'cubrimiento', 'vacantes'];

const CATEGORY_LABELS: Record<ReportNavItem['category'], string> = {
  generales: REPORTS_NAV_CATEGORY_GENERAL,
  cubrimiento: REPORTS_NAV_CATEGORY_COVERAGE,
  vacantes: REPORTS_NAV_CATEGORY_VACANCIES,
};

@Component({
  selector: 'sh-reports-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './reports-layout.component.html',
  styleUrl: './reports-layout.component.scss',
})
export class ReportsLayoutComponent {
  readonly pageTitle = REPORTS_PAGE_TITLE;
  readonly navItems = IMPLEMENTED_REPORTS;
  readonly categoryOrder = CATEGORY_ORDER;
  readonly categoryLabels = CATEGORY_LABELS;

  categoryHasItems(category: ReportNavItem['category']): boolean {
    return this.navItems.some((item) => item.category === category);
  }
}
