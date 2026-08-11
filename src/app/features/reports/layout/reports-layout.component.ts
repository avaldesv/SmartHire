import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SettingsService } from '../../../mock/services/settings.service';

interface ReportNavItem {
  label: string;
  slug: string;
  category: string;
}

/** Reports with a dedicated route (not /reports/view/:slug placeholder). */
const DIRECT_REPORT_SLUGS = new Set(['mmr', 'requisitions-by-month']);

/** Mock category labels replaced by dedicated nav entries. */
const REPLACED_GENERALES = new Set(['MMR', 'Requisitions per month']);

@Component({
  selector: 'sh-reports-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './reports-layout.component.html',
  styleUrl: './reports-layout.component.scss',
})
export class ReportsLayoutComponent implements OnInit {
  private readonly settings = inject(SettingsService);

  categories: Record<string, string[]> = {};
  navItems: ReportNavItem[] = [];

  ngOnInit(): void {
    this.settings.getReportCategories().subscribe((cats) => {
      this.categories = cats;
      this.navItems = [
        { label: 'MMR', slug: 'mmr', category: 'generales' },
        { label: 'Requisiciones por mes', slug: 'requisitions-by-month', category: 'generales' },
        ...cats.generales.filter((r) => !REPLACED_GENERALES.has(r)).map((r) => ({
          label: r,
          slug: r.toLowerCase().replace(/\s+/g, '-'),
          category: 'generales',
        })),
        ...cats.cubrimiento.map((r) => ({
          label: r,
          slug: r.toLowerCase().replace(/\s+/g, '-'),
          category: 'cubrimiento',
        })),
        ...cats.vacantes.map((r) => ({
          label: r,
          slug: r.toLowerCase().replace(/\s+/g, '-'),
          category: 'vacantes',
        })),
      ];
    });
  }

  reportLink(slug: string): string[] {
    return DIRECT_REPORT_SLUGS.has(slug) ? ['/reports', slug] : ['/reports/view', slug];
  }
}
