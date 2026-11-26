import { Component, ElementRef, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { LocaleService } from '../services/locale.service';
import { PermissionService } from '../services/permission.service';
import { TenantContextService } from '../services/tenant-context.service';
import { UserSettingsApiService } from '../services/user-settings-api.service';
import { CatalogCompanyService } from '../services/catalog-company.service';
import { FeedbackDialogService } from '../feedback/feedback-dialog.service';
import { FEEDBACK_GENERIC_WARNING_TITLE } from '../i18n/feedback-labels';
import { CatalogCompany } from '../../shared/models/catalog-company.model';
import { PortalLanguage } from '../../shared/models/portal-language.model';
import { AppPermissions } from '../auth/app-permissions';
import { MAIN_NAV_ITEMS } from '../i18n/nav-labels';
import { INTERVIEW_CAL_MENU } from '../i18n/interview-calendar-labels';
import { PORTAL_CRED_MENU } from '../i18n/portal-credentials-labels';
import {
  USERS_PHOTO_SIZE_ERROR,
  USERS_PHOTO_TYPE_ERROR,
  USERS_PHOTO_UPLOAD_ERROR,
  USERS_PHOTO_UPLOAD_SUCCESS,
} from '../i18n/users-labels';
import { interviewCalendarDialogConfig } from '../../features/settings/interview-calendar/interview-calendar-dialog.constants';
import { jobPortalCredentialsDialogConfig } from '../../features/settings/job-portal-credentials/job-portal-credentials-dialog.constants';
import { NotificationBellComponent } from './notification-bell/notification-bell.component';
import { InterviewCalendarConfigDialogComponent } from '../../features/settings/interview-calendar/interview-calendar-config-dialog.component';
import { JobPortalCredentialsDialogComponent } from '../../features/settings/job-portal-credentials/job-portal-credentials-dialog.component';

const OWN_PHOTO_MAX_BYTES = 10 * 1024 * 1024;
const OWN_PHOTO_ALLOWED_TYPES = new Set(['image/png', 'image/jpeg', 'image/jpg']);

@Component({
  selector: 'sh-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    NotificationBellComponent,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent implements OnInit {
  @ViewChild('ownPhotoInput') ownPhotoInput?: ElementRef<HTMLInputElement>;

  private readonly auth = inject(AuthService);
  private readonly localeService = inject(LocaleService);
  private readonly permissions = inject(PermissionService);
  private readonly tenantContext = inject(TenantContextService);
  private readonly companyService = inject(CatalogCompanyService);
  private readonly userSettingsApi = inject(UserSettingsApiService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly feedback = inject(FeedbackDialogService);

  readonly interviewCalendarMenuLabel = INTERVIEW_CAL_MENU;
  readonly portalCredentialsMenuLabel = PORTAL_CRED_MENU;
  readonly user = this.auth.currentUser;
  readonly activeLocale = this.localeService.activeLocale;
  readonly activePortalLanguageId = this.localeService.portalLanguageId;
  readonly isGlobalAdmin = computed(() => this.permissions.isGlobalAdmin());
  readonly activeCompanyId = this.tenantContext.activeCompanyId;
  readonly tenantOptions = signal<CatalogCompany[]>([]);
  readonly portalLanguages = signal<PortalLanguage[]>([]);
  readonly languageChanging = signal(false);
  readonly photoUploading = signal(false);

  readonly activeLanguageName = computed(() => {
    const currentId = this.activePortalLanguageId() ?? this.user()?.portalLanguageId;
    return this.portalLanguages().find((language) => language.id === currentId)?.name ?? '';
  });

  readonly navItems = computed(() =>
    MAIN_NAV_ITEMS.filter((item) => {
      if (item.path === '/settings') {
        return this.permissions.canAccessSettings();
      }
      if (item.path === '/surveys') {
        return this.permissions.hasAny([
          AppPermissions.SURVEY_READ,
          AppPermissions.SURVEY_RESULTS_READ,
        ]);
      }
      return this.permissions.hasAuthority(item.authority);
    }),
  );

  ngOnInit(): void {
    this.loadPortalLanguages();
    if (this.isGlobalAdmin()) {
      this.loadTenantOptions();
    }
  }

  onLanguageChange(portalLanguageId: number): void {
    const selected = this.portalLanguages().find((item) => item.id === portalLanguageId);
    if (!selected || selected.locale === this.activeLocale() || this.isActiveLanguage(portalLanguageId)) {
      return;
    }
    this.languageChanging.set(true);
    this.userSettingsApi.updateMySettings(portalLanguageId).subscribe({
      next: () => this.localeService.changePortalLanguage(selected.id, selected.locale),
      error: () => this.languageChanging.set(false),
    });
  }

  isActiveLanguage(portalLanguageId: number): boolean {
    const currentId = this.activePortalLanguageId() ?? this.user()?.portalLanguageId;
    return currentId === portalLanguageId;
  }

  onTenantChange(companyId: number): void {
    if (companyId === this.activeCompanyId()) {
      return;
    }
    this.tenantContext.setCompanyId(companyId);
    this.auth.loadCurrentUserProfile().subscribe({ error: () => undefined });
    void this.router.navigate(['/home']);
  }

  logout(): void {
    this.auth.completeLogout();
  }

  openInterviewCalendar(): void {
    this.dialog.open(InterviewCalendarConfigDialogComponent, interviewCalendarDialogConfig());
  }

  openJobPortalCredentials(): void {
    this.dialog.open(JobPortalCredentialsDialogComponent, jobPortalCredentialsDialogConfig());
  }

  pickOwnPhoto(): void {
    this.ownPhotoInput?.nativeElement.click();
  }

  onOwnPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file || this.photoUploading()) {
      return;
    }
    const type = (file.type || '').toLowerCase();
    if (!OWN_PHOTO_ALLOWED_TYPES.has(type)) {
      this.feedback.showError(FEEDBACK_GENERIC_WARNING_TITLE, USERS_PHOTO_TYPE_ERROR);
      return;
    }
    if (file.size > OWN_PHOTO_MAX_BYTES) {
      this.feedback.showError(FEEDBACK_GENERIC_WARNING_TITLE, USERS_PHOTO_SIZE_ERROR);
      return;
    }
    this.photoUploading.set(true);
    this.auth.uploadOwnPhoto(file).subscribe({
      next: () => {
        this.photoUploading.set(false);
        this.feedback.showSuccess(USERS_PHOTO_UPLOAD_SUCCESS);
      },
      error: (err) => {
        this.photoUploading.set(false);
        this.feedback.showApiError(err, { fallbackMessage: USERS_PHOTO_UPLOAD_ERROR });
      },
    });
  }

  private loadTenantOptions(): void {
    this.companyService.list(0, 200).subscribe({
      next: (res) => this.tenantOptions.set(res.items),
      error: () => undefined,
    });
  }

  private loadPortalLanguages(): void {
    this.userSettingsApi.listPortalLanguages().subscribe({
      next: (languages) =>
        this.portalLanguages.set([...languages].sort((a, b) => a.sortOrder - b.sortOrder)),
      error: () => undefined,
    });
  }
}
