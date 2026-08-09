import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FeedbackDialogService } from '../../../core/feedback/feedback-dialog.service';
import {
  CANDIDATE_PROFILE_ACTIVE,
  CANDIDATE_PROFILE_AVERAGE,
  CANDIDATE_PROFILE_CITY,
  CANDIDATE_PROFILE_COUNTRY,
  CANDIDATE_PROFILE_CREATED,
  CANDIDATE_PROFILE_CURP,
  CANDIDATE_PROFILE_EDUCATION_SECTION,
  CANDIDATE_PROFILE_EMAIL,
  CANDIDATE_PROFILE_EM_DASH,
  CANDIDATE_PROFILE_ERRORS_CANDIDATE,
  CANDIDATE_PROFILE_ERRORS_SECTIONS,
  CANDIDATE_PROFILE_EXPERIENCE,
  CANDIDATE_PROFILE_EXPERIENCE_SECTION,
  CANDIDATE_PROFILE_EXPIRES,
  CANDIDATE_PROFILE_GENERAL,
  CANDIDATE_PROFILE_GENDER,
  CANDIDATE_PROFILE_GRADUATE,
  CANDIDATE_PROFILE_ID,
  CANDIDATE_PROFILE_INACTIVE,
  CANDIDATE_PROFILE_LANGUAGES_SECTION,
  CANDIDATE_PROFILE_LOCATION,
  CANDIDATE_PROFILE_NSS,
  CANDIDATE_PROFILE_NOT_FOUND,
  CANDIDATE_PROFILE_NOT_REGISTERED,
  CANDIDATE_PROFILE_NO_COURSES,
  CANDIDATE_PROFILE_NO_EDUCATION,
  CANDIDATE_PROFILE_NO_EXPERIENCE,
  CANDIDATE_PROFILE_NO_LANGUAGES,
  CANDIDATE_PROFILE_NO_SKILLS,
  CANDIDATE_PROFILE_OFFICIAL_ID,
  CANDIDATE_PROFILE_PHONE,
  CANDIDATE_PROFILE_PRESENT,
  CANDIDATE_PROFILE_RFC,
  CANDIDATE_PROFILE_SALARY,
  CANDIDATE_PROFILE_SKILLS_SECTION,
  CANDIDATE_PROFILE_SOURCE,
  CANDIDATE_PROFILE_STATE,
  CANDIDATE_PROFILE_STATUS,
  CANDIDATE_PROFILE_COURSES_SECTION,
  candidateKindLabel,
  candidateProfileExperienceYears,
  candidateProfileSkillYears,
  candidateSkillLevelLabel,
} from '../../../core/i18n/candidate-profile-labels';
import { CandidateApiService } from '../../../core/services/candidate-api.service';
import { CandidateProfileSectionApiService } from '../../../core/services/candidate-profile-section-api.service';
import { CandidateDetail } from '../../../shared/models/candidate.model';
import {
  CandidateCourseCertification,
  CandidateEducation,
  CandidateExperience,
  CandidateLanguage,
  CandidateSkill,
} from '../../../shared/models/candidate-profile-section.model';

@Component({
  selector: 'sh-candidate-profile-view',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, MatCardModule, MatIconModule, MatChipsModule, MatProgressSpinnerModule],
  templateUrl: './candidate-profile-view.component.html',
  styleUrl: './candidate-profile-view.component.scss',
})
export class CandidateProfileViewComponent implements OnChanges {
  @Input({ required: true }) candidateId!: number;

  private readonly candidateService = inject(CandidateApiService);
  private readonly profileSectionsApi = inject(CandidateProfileSectionApiService);
  private readonly feedback = inject(FeedbackDialogService);

  readonly labels = {
    general: CANDIDATE_PROFILE_GENERAL,
    id: CANDIDATE_PROFILE_ID,
    email: CANDIDATE_PROFILE_EMAIL,
    phone: CANDIDATE_PROFILE_PHONE,
    gender: CANDIDATE_PROFILE_GENDER,
    source: CANDIDATE_PROFILE_SOURCE,
    created: CANDIDATE_PROFILE_CREATED,
    experience: CANDIDATE_PROFILE_EXPERIENCE,
    salary: CANDIDATE_PROFILE_SALARY,
    officialId: CANDIDATE_PROFILE_OFFICIAL_ID,
    curp: CANDIDATE_PROFILE_CURP,
    rfc: CANDIDATE_PROFILE_RFC,
    nss: CANDIDATE_PROFILE_NSS,
    notRegistered: CANDIDATE_PROFILE_NOT_REGISTERED,
    location: CANDIDATE_PROFILE_LOCATION,
    country: CANDIDATE_PROFILE_COUNTRY,
    state: CANDIDATE_PROFILE_STATE,
    city: CANDIDATE_PROFILE_CITY,
    status: CANDIDATE_PROFILE_STATUS,
    active: CANDIDATE_PROFILE_ACTIVE,
    inactive: CANDIDATE_PROFILE_INACTIVE,
    experienceSection: CANDIDATE_PROFILE_EXPERIENCE_SECTION,
    educationSection: CANDIDATE_PROFILE_EDUCATION_SECTION,
    coursesSection: CANDIDATE_PROFILE_COURSES_SECTION,
    languagesSection: CANDIDATE_PROFILE_LANGUAGES_SECTION,
    skillsSection: CANDIDATE_PROFILE_SKILLS_SECTION,
    noExperience: CANDIDATE_PROFILE_NO_EXPERIENCE,
    noEducation: CANDIDATE_PROFILE_NO_EDUCATION,
    noCourses: CANDIDATE_PROFILE_NO_COURSES,
    noLanguages: CANDIDATE_PROFILE_NO_LANGUAGES,
    noSkills: CANDIDATE_PROFILE_NO_SKILLS,
    notFound: CANDIDATE_PROFILE_NOT_FOUND,
    present: CANDIDATE_PROFILE_PRESENT,
    graduate: CANDIDATE_PROFILE_GRADUATE,
    average: CANDIDATE_PROFILE_AVERAGE,
    expires: CANDIDATE_PROFILE_EXPIRES,
    emDash: CANDIDATE_PROFILE_EM_DASH,
  };

  loading = true;
  sectionsLoading = false;
  candidate: CandidateDetail | null = null;

  experiences: CandidateExperience[] = [];
  educations: CandidateEducation[] = [];
  courses: CandidateCourseCertification[] = [];
  languages: CandidateLanguage[] = [];
  skills: CandidateSkill[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['candidateId'] && this.candidateId) {
      this.loadCandidate(this.candidateId);
    }
  }

  formatDate(value: string | null | undefined): string {
    if (!value) return this.labels.emDash;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
  }

  formatDateRange(start: string | null | undefined, end: string | null | undefined): string {
    return `${this.formatDate(start)} – ${end ? this.formatDate(end) : this.labels.present}`;
  }

  kindLabel(kind: string | null | undefined): string {
    return candidateKindLabel(kind);
  }

  skillLevelLabel(level: string | null | undefined): string {
    return candidateSkillLevelLabel(level);
  }

  experienceYearsLabel(years: number | null | undefined): string {
    return candidateProfileExperienceYears(years ?? 0);
  }

  skillYearsLabel(years: number): string {
    return candidateProfileSkillYears(years);
  }

  private loadCandidate(id: number): void {
    this.loading = true;
    this.candidate = null;
    this.candidateService.getById(id).subscribe({
      next: (c) => {
        this.candidate = c;
        this.loading = false;
        this.loadProfileSections(id);
      },
      error: () => {
        this.loading = false;
        this.feedback.showApiError(null, { fallbackMessage: CANDIDATE_PROFILE_ERRORS_CANDIDATE });
      },
    });
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
        this.feedback.showApiError(null, { fallbackMessage: CANDIDATE_PROFILE_ERRORS_SECTIONS });
      },
    });
  }
}
