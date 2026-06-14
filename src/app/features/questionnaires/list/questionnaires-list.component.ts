import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SettingsService } from '../../../mock/services/settings.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { Questionnaire } from '../../../shared/models';

@Component({
  selector: 'sh-questionnaires-list',
  standalone: true,
  imports: [RouterLink, MatTableModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, PageHeaderComponent],
  templateUrl: './questionnaires-list.component.html',
  styleUrl: './questionnaires-list.component.scss',
})
export class QuestionnairesListComponent implements OnInit {
  private readonly settings = inject(SettingsService);

  loading = true;
  data: Questionnaire[] = [];
  readonly columns = ['name', 'category', 'questionsCount', 'acceptancePercent', 'type', 'active', 'actions'];

  ngOnInit(): void {
    this.settings.getQuestionnaires().subscribe((q) => {
      this.data = q;
      this.loading = false;
    });
  }
}
