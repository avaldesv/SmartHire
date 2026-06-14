import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CandidateService } from '../../../mock/services/candidate.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { Candidate } from '../../../shared/models';

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
    PageHeaderComponent,
  ],
  templateUrl: './candidate-profile.component.html',
  styleUrl: './candidate-profile.component.scss',
})
export class CandidateProfileComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly candidateService = inject(CandidateService);

  loading = true;
  candidate: Candidate | null = null;

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.candidateService.getById(id).subscribe((c) => {
      this.candidate = c ?? null;
      this.loading = false;
    });
  }
}
