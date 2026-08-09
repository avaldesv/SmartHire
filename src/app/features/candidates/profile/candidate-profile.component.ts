import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  CANDIDATE_PROFILE_BACK_PRESELECTION,
  CANDIDATE_PROFILE_BENEFICIARIES,
  CANDIDATE_PROFILE_EDIT,
  CANDIDATE_PROFILE_EMERGENCY,
  CANDIDATE_PROFILE_SUBTITLE,
} from '../../../core/i18n/candidate-profile-labels';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { CandidateProfileViewComponent } from './candidate-profile-view.component';

@Component({
  selector: 'sh-candidate-profile',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, PageHeaderComponent, CandidateProfileViewComponent],
  templateUrl: './candidate-profile.component.html',
  styleUrl: './candidate-profile.component.scss',
})
export class CandidateProfileComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  readonly labels = {
    subtitle: CANDIDATE_PROFILE_SUBTITLE,
    backPreselection: CANDIDATE_PROFILE_BACK_PRESELECTION,
    edit: CANDIDATE_PROFILE_EDIT,
    beneficiaries: CANDIDATE_PROFILE_BENEFICIARIES,
    emergency: CANDIDATE_PROFILE_EMERGENCY,
  };

  candidateId = 0;
  candidateName = '';
  backToPreselectionLink: string[] | null = null;

  ngOnInit(): void {
    const from = this.route.snapshot.queryParamMap.get('from');
    const positionId = this.route.snapshot.queryParamMap.get('positionId');
    if (from === 'preselection' && positionId) {
      this.backToPreselectionLink = ['/selection', positionId, 'preselection'];
    }
    this.candidateId = +this.route.snapshot.paramMap.get('id')!;
    const firstName = this.route.snapshot.queryParamMap.get('firstName') ?? '';
    const lastName = this.route.snapshot.queryParamMap.get('lastName') ?? '';
    this.candidateName = `${firstName} ${lastName}`.trim();
  }
}
