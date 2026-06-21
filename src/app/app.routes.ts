import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

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
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./core/layout/shell.component').then((m) => m.ShellComponent),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./features/home/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'positions',
        loadComponent: () => import('./features/positions/list/positions-list.component').then((m) => m.PositionsListComponent),
      },
      {
        path: 'positions/new',
        loadComponent: () => import('./features/positions/wizard/position-wizard.component').then((m) => m.PositionWizardComponent),
      },
      {
        path: 'positions/:id/edit',
        loadComponent: () => import('./features/positions/wizard/position-wizard.component').then((m) => m.PositionWizardComponent),
      },
      {
        path: 'candidates',
        loadComponent: () => import('./features/candidates/list/candidates-list.component').then((m) => m.CandidatesListComponent),
      },
      {
        path: 'candidates/new',
        loadComponent: () => import('./features/candidates/form/candidate-form.component').then((m) => m.CandidateFormComponent),
      },
      {
        path: 'candidates/:id/edit',
        loadComponent: () => import('./features/candidates/form/candidate-form.component').then((m) => m.CandidateFormComponent),
      },
      {
        path: 'candidates/:id/beneficiary',
        loadComponent: () =>
          import('./features/candidates/beneficiary-wizard/beneficiary-wizard.component').then((m) => m.BeneficiaryWizardComponent),
      },
      {
        path: 'candidates/:id',
        loadComponent: () => import('./features/candidates/profile/candidate-profile.component').then((m) => m.CandidateProfileComponent),
      },
      {
        path: 'selection/:positionId',
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
        loadComponent: () => import('./features/questionnaires/list/questionnaires-list.component').then((m) => m.QuestionnairesListComponent),
      },
      {
        path: 'questionnaires/assign',
        loadComponent: () => import('./features/questionnaires/assign/questionnaire-assign.component').then((m) => m.QuestionnaireAssignComponent),
      },
      {
        path: 'tracking',
        loadComponent: () => import('./features/tracking/pipeline/tracking-pipeline.component').then((m) => m.TrackingPipelineComponent),
      },
      {
        path: 'reports',
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
        loadComponent: () => import('./features/settings/layout/settings-layout.component').then((m) => m.SettingsLayoutComponent),
        children: [
          { path: '', redirectTo: 'users', pathMatch: 'full' },
          {
            path: 'users',
            loadComponent: () => import('./features/settings/users/users-admin.component').then((m) => m.UsersAdminComponent),
          },
          {
            path: 'groups',
            loadComponent: () => import('./features/settings/groups/groups-admin.component').then((m) => m.GroupsAdminComponent),
          },
          {
            path: 'catalogs',
            loadComponent: () => import('./features/settings/catalogs/catalogs-admin.component').then((m) => m.CatalogsAdminComponent),
          },
          {
            path: 'notifications',
            loadComponent: () =>
              import('./features/settings/notifications/notifications-admin.component').then((m) => m.NotificationsAdminComponent),
          },
          {
            path: 'documents',
            loadComponent: () => import('./features/settings/documents/documents-config.component').then((m) => m.DocumentsConfigComponent),
          },
          {
            path: 'prompts',
            loadComponent: () => import('./features/settings/prompts/prompts-config.component').then((m) => m.PromptsConfigComponent),
          },
          {
            path: 'cvs',
            loadComponent: () => import('./features/settings/cvs/cvs-config.component').then((m) => m.CvsConfigComponent),
          },
          {
            path: 'interviews',
            loadComponent: () => import('./features/settings/interviews/interviews-config.component').then((m) => m.InterviewsConfigComponent),
          },
          {
            path: 'pipeline-stages',
            loadComponent: () => import('./features/settings/pipeline-stages/pipeline-stages.component').then((m) => m.PipelineStagesComponent),
          },
          {
            path: 'system',
            loadComponent: () => import('./features/settings/system/system-config.component').then((m) => m.SystemConfigComponent),
          },
          {
            path: 'audit',
            loadComponent: () => import('./features/settings/audit/audit-logs.component').then((m) => m.AuditLogsComponent),
          },
        ],
      },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
