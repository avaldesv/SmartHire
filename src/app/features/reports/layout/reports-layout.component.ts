import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface ReportNavItem {
  label: string;
  slug: string;
  category: 'generales' | 'cubrimiento' | 'vacantes';
}

/** Only reports with a real screen (placeholders hidden). */
const IMPLEMENTED_REPORTS: ReportNavItem[] = [
  { label: 'MMR', slug: 'mmr', category: 'generales' },
  { label: 'Requisiciones por mes', slug: 'requisitions-by-month', category: 'generales' },
  { label: 'Estatus por requisición', slug: 'status-by-requisition', category: 'generales' },
  { label: 'Funnel del proceso', slug: 'process-funnel', category: 'generales' },
  { label: 'Desempeño', slug: 'recruiter-performance', category: 'generales' },
  { label: 'Consolidado', slug: 'consolidado', category: 'cubrimiento' },
  { label: 'Requisiciones en proceso', slug: 'requisitions-in-process', category: 'vacantes' },
  { label: 'Requisiciones por fuente', slug: 'requisitions-by-source', category: 'vacantes' },
];

const CATEGORY_ORDER: Array<ReportNavItem['category']> = ['generales', 'cubrimiento', 'vacantes'];

const CATEGORY_LABELS: Record<ReportNavItem['category'], string> = {
  generales: 'Generales',
  cubrimiento: 'Cubrimiento',
  vacantes: 'Vacantes',
};

@Component({
  selector: 'sh-reports-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './reports-layout.component.html',
  styleUrl: './reports-layout.component.scss',
})
export class ReportsLayoutComponent {
  readonly navItems = IMPLEMENTED_REPORTS;
  readonly categoryOrder = CATEGORY_ORDER;
  readonly categoryLabels = CATEGORY_LABELS;

  categoryHasItems(category: ReportNavItem['category']): boolean {
    return this.navItems.some((item) => item.category === category);
  }
}
