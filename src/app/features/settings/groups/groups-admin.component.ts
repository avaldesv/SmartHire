import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SettingsService } from '../../../mock/services/settings.service';
import { UserGroup } from '../../../shared/models';

@Component({
  selector: 'sh-groups-admin',
  standalone: true,
  imports: [MatTableModule, MatChipsModule, MatProgressSpinnerModule],
  templateUrl: './groups-admin.component.html',
  styleUrl: './groups-admin.component.scss',
})
export class GroupsAdminComponent implements OnInit {
  private readonly settings = inject(SettingsService);

  loading = true;
  data: UserGroup[] = [];
  readonly columns = ['name', 'description', 'members', 'modules', 'active'];

  ngOnInit(): void {
    this.settings.getGroups().subscribe((g) => {
      this.data = g;
      this.loading = false;
    });
  }
}
