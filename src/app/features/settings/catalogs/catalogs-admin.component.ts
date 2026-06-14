import { Component, inject, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SettingsService } from '../../../mock/services/settings.service';
import { CatalogItem } from '../../../shared/models';

@Component({
  selector: 'sh-catalogs-admin',
  standalone: true,
  imports: [MatTabsModule, MatTableModule, MatProgressSpinnerModule],
  templateUrl: './catalogs-admin.component.html',
  styleUrl: './catalogs-admin.component.scss',
})
export class CatalogsAdminComponent implements OnInit {
  private readonly settings = inject(SettingsService);

  loading = true;
  allCatalogs: CatalogItem[] = [];
  categories: string[] = [];
  readonly columns = ['key1', 'key2', 'name', 'description', 'active'];

  ngOnInit(): void {
    this.settings.getCatalogs().subscribe((items) => {
      this.allCatalogs = items;
      this.categories = [...new Set(items.map((c) => c.category))];
      this.loading = false;
    });
  }

  getByCategory(cat: string): CatalogItem[] {
    return this.allCatalogs.filter((c) => c.category === cat);
  }
}
