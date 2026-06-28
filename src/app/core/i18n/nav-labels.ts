import { AppPermissions } from '../auth/app-permissions';

export interface MainNavItem {
  label: string;
  path: string;
  icon: string;
  authority: string;
}

export interface SettingsNavItem {
  label: string;
  path: string;
  authority: string;
}

export const MAIN_NAV_ITEMS: MainNavItem[] = [
  {
    label: $localize`:@@nav.main.home:Inicio`,
    path: '/home',
    icon: 'home',
    authority: AppPermissions.HOME_READ,
  },
  {
    label: $localize`:@@nav.main.positions:Posiciones`,
    path: '/positions',
    icon: 'work',
    authority: AppPermissions.REQUISITION_READ,
  },
  {
    label: $localize`:@@nav.main.candidates:Candidatos`,
    path: '/candidates',
    icon: 'people',
    authority: AppPermissions.CANDIDATE_READ,
  },
  {
    label: $localize`:@@nav.main.questionnaires:Cuestionarios`,
    path: '/questionnaires',
    icon: 'quiz',
    authority: AppPermissions.QUESTIONNAIRE_READ,
  },
  {
    label: $localize`:@@nav.main.tracking:Seguimiento`,
    path: '/tracking',
    icon: 'timeline',
    authority: AppPermissions.TRACKING_READ,
  },
  {
    label: $localize`:@@nav.main.reports:Reportes`,
    path: '/reports',
    icon: 'bar_chart',
    authority: AppPermissions.REPORT_READ,
  },
  {
    label: $localize`:@@nav.main.settings:Configuraciones`,
    path: '/settings',
    icon: 'settings',
    authority: AppPermissions.SETTINGS_USERS_READ,
  },
];

export const SETTINGS_NAV_ITEMS: SettingsNavItem[] = [
  {
    label: $localize`:@@nav.settings.users:Usuarios`,
    path: 'users',
    authority: AppPermissions.SETTINGS_USERS_READ,
  },
  {
    label: $localize`:@@nav.settings.groups:Grupos`,
    path: 'groups',
    authority: AppPermissions.SETTINGS_GROUPS_READ,
  },
  {
    label: $localize`:@@nav.settings.catalogs:Catálogos`,
    path: 'catalogs',
    authority: AppPermissions.SETTINGS_CATALOGS_READ,
  },
  {
    label: $localize`:@@nav.settings.notifications:Notificaciones`,
    path: 'notifications',
    authority: AppPermissions.SETTINGS_NOTIFICATIONS_READ,
  },
  {
    label: $localize`:@@nav.settings.documents:Documentos`,
    path: 'documents',
    authority: AppPermissions.SETTINGS_SYSTEM_READ,
  },
  {
    label: $localize`:@@nav.settings.prompts:Prompts IA`,
    path: 'prompts',
    authority: AppPermissions.SETTINGS_SYSTEM_READ,
  },
  {
    label: $localize`:@@nav.settings.cvs:CVs`,
    path: 'cvs',
    authority: AppPermissions.SETTINGS_SYSTEM_READ,
  },
  {
    label: $localize`:@@nav.settings.interviews:Entrevistas`,
    path: 'interviews',
    authority: AppPermissions.SETTINGS_SYSTEM_READ,
  },
  {
    label: $localize`:@@nav.settings.pipelineStages:Etapas`,
    path: 'pipeline-stages',
    authority: AppPermissions.SETTINGS_SYSTEM_READ,
  },
  {
    label: $localize`:@@nav.settings.system:Sistema`,
    path: 'system',
    authority: AppPermissions.SETTINGS_SYSTEM_READ,
  },
  {
    label: $localize`:@@nav.settings.audit:Bitácoras`,
    path: 'audit',
    authority: AppPermissions.SETTINGS_SYSTEM_READ,
  },
];

export const SNACK_CLOSE_ACTION = $localize`:@@common.close:Cerrar`;
export const COMMON_CANCEL = $localize`:@@common.cancel:Cancelar`;
