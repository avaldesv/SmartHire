import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CandidateApiService } from '../../../core/services/candidate-api.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { CandidateDetail } from '../../../shared/models/candidate.model';

@Component({
  selector: 'sh-candidate-profile',
  standalone: true,
  imports: [
    DatePipe,
    CurrencyPipe,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    PageHeaderComponent,
  ],
  templateUrl: './candidate-profile.component.html',
  styleUrl: './candidate-profile.component.scss',
})
export class CandidateProfileComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly candidateService = inject(CandidateApiService);
  private readonly snack = inject(MatSnackBar);

  loading = true;
  candidate: CandidateDetail | null = null;
  backToPreselectionLink: string[] | null = null;

  ngOnInit(): void {
    const from = this.route.snapshot.queryParamMap.get('from');
    const positionId = this.route.snapshot.queryParamMap.get('positionId');
    if (from === 'preselection' && positionId) {
      this.backToPreselectionLink = ['/selection', positionId, 'preselection'];
    }
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.candidateService.getById(id).subscribe({
      next: (c) => {
        this.candidate = c;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open('No se pudo cargar el candidato', 'Cerrar', { duration: 4000 });
      },
    });
  }
}
