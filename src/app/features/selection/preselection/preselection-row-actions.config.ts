export type PreselectionRowActionId =
  | 'viewProfile'
  | 'downloadCv'
  | 'modifyCompatibility'
  | 'scheduleInterview'
  | 'viewDocuments'
  | 'validateInfo'
  | 'validateStudies'
  | 'auditLog'
  | 'sendSmart'
  | 'generateContract'
  | 'notifyQuestionnaire'
  | 'deselectRow';

export interface PreselectionRowAction {
  id: PreselectionRowActionId;
  label: string;
  icon: string;
  /** At least one permission required to show the action (RF-013 L4 RBAC shell). */
  permissions: readonly string[];
  dividerBefore?: boolean;
}

/** Row menu actions for RF-013 preselection (L4–L16). */
export const PRESELECTION_ROW_ACTIONS: readonly PreselectionRowAction[] = [
  {
    id: 'viewProfile',
    label: 'Ver perfil',
    icon: 'person',
    permissions: ['candidates:read'],
  },
  {
    id: 'downloadCv',
    label: 'Descargar CV',
    icon: 'download',
    permissions: ['candidates:read'],
  },
  {
    id: 'modifyCompatibility',
    label: 'Modificar compatibilidad',
    icon: 'tune',
    permissions: ['candidates:write'],
    dividerBefore: true,
  },
  {
    id: 'scheduleInterview',
    label: 'Solicitar cita entrevista',
    icon: 'event',
    permissions: ['candidates:write'],
  },
  {
    id: 'viewDocuments',
    label: 'Ver documentos',
    icon: 'folder_open',
    permissions: ['candidates:read'],
  },
  {
    id: 'validateInfo',
    label: 'Validar información',
    icon: 'fact_check',
    permissions: ['candidates:write'],
    dividerBefore: true,
  },
  {
    id: 'validateStudies',
    label: 'Validar estudios',
    icon: 'school',
    permissions: ['candidates:write'],
  },
  {
    id: 'auditLog',
    label: 'Bitácora',
    icon: 'history',
    permissions: ['candidates:read', 'settings:admin'],
  },
  {
    id: 'sendSmart',
    label: 'Enviar a SMART',
    icon: 'send',
    permissions: ['candidates:write', 'positions:write'],
    dividerBefore: true,
  },
  {
    id: 'generateContract',
    label: 'Generar contrato',
    icon: 'description',
    permissions: ['candidates:write', 'positions:write'],
  },
  {
    id: 'notifyQuestionnaire',
    label: 'Notificar cuestionario',
    icon: 'mail',
    permissions: ['candidates:write'],
  },
  {
    id: 'deselectRow',
    label: 'Deseleccionar',
    icon: 'person_remove',
    permissions: ['candidates:write'],
    dividerBefore: true,
  },
];
