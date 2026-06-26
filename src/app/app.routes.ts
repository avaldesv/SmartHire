import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';
import { permissionGuard } from './core/guards/permission.guard';
import { AppPermissions } from './core/auth/app-permissions';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'auth/callback',
    loadComponent: () => import('./features/auth/callback/auth-callback.component').then((m) => m.AuthCallbackComponent),
  },
  {
    path: 'unauthorized',
    canActivate: [authGuard],
    loadComponent: () => import('./features/auth/unauthorized/unauthorized.component').then((m) => m.UnauthorizedComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./core/layout/shell.component').then((m) => m.ShellComponent),
    children: [
      {
        path: 'home',
        canActivate: [permissionGuard],
        data: { authorities: [AppPermissions.HOME_READ] },
        loadComponent: () => import('./features/home/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'positions',
        canActivate: [permissionGuard],
        data: { authorities: [AppPermissions.REQUISITION_READ] },
        loadComponent: () => import('./features/positions/list/positions-list.component').then((m) => m.PositionsListComponent),
      },
      {
        path: 'positions/new',
        canActivate: [permissionGuard],
        data: { authorities: [AppPermissions.REQUISITION_CREATE] },
        loadComponent: () => import('./features/positions/wizard/position-wizard.component').then((m) => m.PositionWizardComponent),
      },
      {
        path: 'positions/:id/edit',
        canActivate: [permissionGuard],
        data: { authorities: [AppPermissions.REQUISITION_EDIT] },
        loadComponent: () => import('./features/positions/wizard/position-wizard.component').then((m) => m.PositionWizardComponent),
      },
      {
        path: 'candidates',
        canActivate: [permissionGuard],
        data: { authorities: [AppPermissions.CANDIDATE_READ] },
        loadComponent: () => import('./features/candidates/list/candidates-list.component').then((m) => m.CandidatesListComponent),
      },
      {
        path: 'candidates/new',
        canActivate: [permissionGuard],
        data: { authorities: [AppPermissions.CANDIDATE_CREATE] },
        loadComponent: () => import('./features/candidates/form/candidate-form.component').then((m) => m.CandidateFormComponent),
      },
      {
        path: 'candidates/:id/edit',
        canActivate: [permissionGuard],
        data: { authorities: [AppPermissions.CANDIDATE_EDIT] },
        loadComponent: () => import('./features/candidates/form/candidate-form.component').then((m) => m.CandidateFormComponent),
      },
      {
        path: 'candidates/:id/beneficiary',
        canActivate: [permissionGuard],
        data: { authorities: [AppPermissions.CANDIDATE_EDIT] },
        loadComponent: () =>
          import('./features/candidates/beneficiary-wizard/beneficiary-wizard.component').then((m) => m.BeneficiaryWizardComponent),
      },
      {
        path: 'candidates/:id/emergency-contact',
        canActivate: [permissionGuard],
        data: { authorities: [AppPermissions.CANDIDATE_EDIT] },
        loadComponent: () =>
          import('./features/candidates/emergency-contact/emergency-contact-admin.component').then(
            (m) => m.EmergencyContactAdminComponent,
          ),
      },
      {
        path: 'candidates/:id',
        canActivate: [permissionGuard],
        data: { authorities: [AppPermissions.CANDIDATE_READ] },
        loadComponent: () => import('./features/candidates/profile/candidate-profile.component').then((m) => m.CandidateProfileComponent),
      },
      {
        path: 'selection/:positionId',
        canActivate: [permissionGuard],
        data: { authorities: [AppPermissions.SELECTION_READ] },
        loadComponent: () => import('./features/selection/layout/selection-layout.component').then((m) => m.SelectionLayoutComponent),
        children: [
          { path: '', redirectTo: 'ai', pathMatch: 'full' },
          {
            path: 'ai',
            loadComponent: () => import('./features/selection/ai-chat/ai-chat.component').then((m) => m.AiChatComponent),
          },
          {
            path: 'preselection',
            loadComponent: () => import('./features/selection/preselection/preselection.component').then((m) => m.PreselectionComponent),
          },
          {
            path: 'analysis',
            loadComponent: () => import('./features/selection/analysis/analysis.component').then((m) => m.AnalysisComponent),
          },
        ],
      },
      {
        path: 'questionnaires',
        canActivate: [permissionGuard],
        data: { authorities: [AppPermissions.QUESTIONNAIRE_READ] },
        loadComponent: () => import('./features/questionnaires/list/questionnaires-list.component').then((m) => m.QuestionnairesListComponent),
      },
      {
        path: 'questionnaires/assign',
        canActivate: [permissionGuard],
        data: { authorities: [AppPermissions.QUESTIONNAIRE_READ] },
        loadComponent: () => import('./features/questionnaires/assign/questionnaire-assign.component').then((m) => m.QuestionnaireAssignComponent),
      },
      {
        path: 'tracking',
        canActivate: [permissionGuard],
        data: { authorities: [AppPermissions.TRACKING_READ] },
        loadComponent: () => import('./features/tracking/pipeline/tracking-pipeline.component').then((m) => m.TrackingPipelineComponent),
      },
      {
        path: 'reports',
        canActivate: [permissionGuard],
        data: { authorities: [AppPermissions.REPORT_READ] },
        loadComponent: () => import('./features/reports/layout/reports-layout.component').then((m) => m.ReportsLayoutComponent),
        children: [
          { path: '', redirectTo: 'mmr', pathMatch: 'full' },
          {
            path: 'mmr',
            loadComponent: () => import('./features/reports/mmr/mmr-report.component').then((m) => m.MmrReportComponent),
          },
          {
            path: 'view/:slug',
            loadComponent: () => import('./features/reports/report-view/report-view.component').then((m) => m.ReportViewComponent),
          },
        ],
      },
      {
        path: 'settings',
        canActivate: [permissionGuard],
        data: {
          authorities: [
            AppPermissions.SETTINGS_USERS_READ,
            AppPermissions.SETTINGS_GROUPS_READ,
            AppPermissions.SETTINGS_CATALOGS_READ,
            AppPermissions.SETTINGS_NOTIFICATIONS_READ,
            AppPermissions.SETTINGS_SYSTEM_READ,
          ],
        },
        loadComponent: () => import('./features/settings/layout/settings-layout.component').then((m) => m.SettingsLayoutComponent),
        children: [
          { path: '', redirectTo: 'users', pathMatch: 'full' },
          {
            path: 'users',
            canActivate: [permissionGuard],
            data: { authorities: [AppPermissions.SETTINGS_USERS_READ] },
            loadComponent: () => import('./features/settings/users/users-admin.component').then((m) => m.UsersAdminComponent),
          },
          {
            path: 'groups',
            canActivate: [permissionGuard],
            data: { authorities: [AppPermissions.SETTINGS_GROUPS_READ] },
            loadComponent: () => import('./features/settings/groups/groups-admin.component').then((m) => m.GroupsAdminComponent),
          },
          {
            path: 'catalogs',
            canActivate: [permissionGuard],
            data: { authorities: [AppPermissions.SETTINGS_CATALOGS_READ] },
            loadComponent: () => import('./features/settings/catalogs/catalogs-admin.component').then((m) => m.CatalogsAdminComponent),
          },
 /*          {
            path: 'notifications',
            canActivate: [permissionGuard],
            data: { authorities: [AppPermissions.SETTINGS_NOTIFICATIONS_READ] },
            loadComponent: () =>
              import('./features/settings/notifications/notifications-admin.component').then((m) => m.NotificationsAdminComponent),
          },
          {
            path: 'documents',
            canActivate: [permissionGuard],
            data: { authorities: [AppPermissions.SETTINGS_SYSTEM_READ] },
            loadComponent: () => import('./features/settings/documents/documents-config.component').then((m) => m.DocumentsConfigComponent),
          }, 
          {
            path: 'prompts',
            canActivate: [permissionGuard],
            data: { authorities: [AppPermissions.SETTINGS_SYSTEM_READ] },
            loadComponent: () => import('./features/settings/prompts/prompts-config.component').then((m) => m.PromptsConfigComponent),
          },
          {
            path: 'cvs',
            canActivate: [permissionGuard],
            data: { authorities: [AppPermissions.SETTINGS_SYSTEM_READ] },
            loadComponent: () => import('./features/settings/cvs/cvs-config.component').then((m) => m.CvsConfigComponent),
          },
          {
            path: 'interviews',
            canActivate: [permissionGuard],
            data: { authorities: [AppPermissions.SETTINGS_SYSTEM_READ] },
            loadComponent: () => import('./features/settings/interviews/interviews-config.component').then((m) => m.InterviewsConfigComponent),
          },*/
          {
            path: 'pipeline-stages',
            canActivate: [permissionGuard],
            data: { authorities: [AppPermissions.SETTINGS_SYSTEM_READ] },
            loadComponent: () => import('./features/settings/pipeline-stages/pipeline-stages.component').then((m) => m.PipelineStagesComponent),
          },
       /*    {
            path: 'system',
            canActivate: [permissionGuard],
            data: { authorities: [AppPermissions.SETTINGS_SYSTEM_READ] },
            loadComponent: () => import('./features/settings/system/system-config.component').then((m) => m.SystemConfigComponent),
          }, */
          {
            path: 'audit',
            canActivate: [permissionGuard],
            data: { authorities: [AppPermissions.SETTINGS_SYSTEM_READ] },
            loadComponent: () => import('./features/settings/audit/audit-logs.component').then((m) => m.AuditLogsComponent),
          },
        ],
      },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
