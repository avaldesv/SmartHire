import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CandidateApiService } from '../../../core/services/candidate-api.service';
import { CandidateProfileSectionApiService } from '../../../core/services/candidate-profile-section-api.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { CandidateDetail } from '../../../shared/models/candidate.model';
import {
  CandidateCourseCertification,
  CandidateEducation,
  CandidateExperience,
  CandidateLanguage,
  CandidateSkill,
} from '../../../shared/models/candidate-profile-section.model';

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
  private readonly profileSectionsApi = inject(CandidateProfileSectionApiService);
  private readonly snack = inject(MatSnackBar);

  loading = true;
  sectionsLoading = false;
  candidate: CandidateDetail | null = null;
  backToPreselectionLink: string[] | null = null;

  experiences: CandidateExperience[] = [];
  educations: CandidateEducation[] = [];
  courses: CandidateCourseCertification[] = [];
  languages: CandidateLanguage[] = [];
  skills: CandidateSkill[] = [];

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
        this.loadProfileSections(id);
      },
      error: () => {
        this.loading = false;
        this.snack.open('No se pudo cargar el candidato', 'Cerrar', { duration: 4000 });
      },
    });
  }

  formatDate(value: string | null | undefined): string {
    if (!value) return '—';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: '2-digit' });
  }

  formatDateRange(start: string | null | undefined, end: string | null | undefined): string {
    return `${this.formatDate(start)} – ${end ? this.formatDate(end) : 'Actual'}`;
  }

  kindLabel(kind: string | null | undefined): string {
    switch (kind) {
      case 'COURSE':
        return 'Curso';
      case 'CERTIFICATION':
        return 'Certificación';
      case 'OTHER':
        return 'Otro';
      default:
        return '—';
    }
  }

  skillLevelLabel(level: string | null | undefined): string {
    switch (level) {
      case 'BASIC':
        return 'Básico';
      case 'INTERMEDIATE':
        return 'Intermedio';
      case 'ADVANCED':
        return 'Avanzado';
      case 'EXPERT':
        return 'Experto';
      default:
        return level || '—';
    }
  }

  private loadProfileSections(candidateId: number): void {
    this.sectionsLoading = true;
    forkJoin({
      experiences: this.profileSectionsApi.listExperiences(candidateId),
      educations: this.profileSectionsApi.listEducations(candidateId),
      courses: this.profileSectionsApi.listCourseCertifications(candidateId),
      languages: this.profileSectionsApi.listLanguages(candidateId),
      skills: this.profileSectionsApi.listSkills(candidateId),
    }).subscribe({
      next: (res) => {
        this.experiences = res.experiences.items;
        this.educations = res.educations.items;
        this.courses = res.courses.items;
        this.languages = res.languages.items;
        this.skills = res.skills.items;
        this.sectionsLoading = false;
      },
      error: () => {
        this.sectionsLoading = false;
        this.snack.open('No se pudieron cargar las secciones del perfil', 'Cerrar', { duration: 4000 });
      },
    });
  }
}
