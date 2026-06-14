import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SettingsService } from '../../../mock/services/settings.service';

interface ReportNavItem {
  label: string;
  slug: string;
  category: string;
}

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
        ...cats.generales.filter((r) => r !== 'MMR').map((r) => ({
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
}
