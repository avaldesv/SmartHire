import { SystemUser, UserGroup, CatalogItem, NotificationTemplate, Questionnaire, PipelineStage, AuditLog } from '../../shared/models';

export const MOCK_SYSTEM_USERS: SystemUser[] = Array.from({ length: 504 }, (_, i) => ({
  id: i + 1,
  active: i % 15 !== 0,
  username: `user${i + 1}`,
  firstName: ['Gerardo', 'María', 'Carlos', 'Ana', 'Luis'][i % 5],
  lastName: ['Quintana', 'López', 'Ruiz', 'Torres', 'Mendoza'][i % 5],
  nickname: `u${i + 1}`,
  email: `usuario${i + 1}@empresa.com`,
  phone: `+52 55 ${1000 + i}`,
  country: 'México',
  branch: `Sucursal ${(i % 8) + 1}`,
  area: ['Reclutamiento', 'Operaciones', 'Admin'][i % 3],
  department: 'Talento',
  profile: i % 10 === 0 ? 'ADMIN' : 'RECRUITER',
  supervisor: 'Coordinador Regional',
  createdAt: '2024-01-15',
  createdBy: 'system',
  modifiedAt: '2025-05-01',
  modifiedBy: 'admin',
}));

export const MOCK_GROUPS: UserGroup[] = [
  { id: 1, name: 'Reclutadores CDMX', description: 'Equipo reclutamiento zona centro', members: 45, modules: ['home', 'positions', 'candidates'], active: true },
  { id: 2, name: 'Coordinadores', description: 'Supervisión y reportes', members: 12, modules: ['home', 'positions', 'reports', 'settings'], active: true },
  { id: 3, name: 'Administradores', description: 'Acceso total configuración', members: 8, modules: ['settings'], active: true },
];

export const MOCK_CATALOGS: CatalogItem[] = [
  { id: 1, key1: 'MX', key2: 'MEX', name: 'México', description: 'República Mexicana', active: true, category: 'País' },
  { id: 2, key1: 'CDMX', name: 'Ciudad de México', description: 'Entidad federativa', active: true, category: 'Entidad Federativa' },
  { id: 3, key1: 'FIN', name: 'Finanzas', description: 'Carrera universitaria', active: true, category: 'Carrera' },
  { id: 4, key1: 'TEC', name: 'Tecnología', description: 'Carrera universitaria', active: true, category: 'Carrera' },
];

export const MOCK_NOTIFICATIONS: NotificationTemplate[] = [
  { id: 1, action: 'ASIGNACION', channels: ['Correo', 'WhatsApp'], templateId: 'Hx743f3805...', message: 'Se te ha asignado la requisición {{req}} para {{puesto}} en {{cliente}}.', active: true },
  { id: 2, action: 'CANCELACION', channels: ['WhatsApp'], templateId: 'Hk2dc87c7...', message: 'La requisición {{req}} ha sido cancelada.', active: true },
  { id: 3, action: 'POSTULADO', channels: ['Correo'], templateId: 'Em001...', message: 'Nuevo candidato postulado a {{puesto}}.', active: true },
  { id: 4, action: 'VALIDACION', channels: ['Correo', 'WhatsApp'], templateId: 'Wa992...', message: 'Validación requerida para {{req}}.', active: true },
];

export const MOCK_QUESTIONNAIRES: Questionnaire[] = [
  { id: 1, name: 'Evaluación Técnica Finanzas', category: 'Finanzas', questionsCount: 15, acceptancePercent: 70, type: 'Escrita', active: true },
  { id: 2, name: 'Prueba Lógica General', category: 'Generales', questionsCount: 20, acceptancePercent: 60, type: 'Escrita', active: true },
  { id: 3, name: 'Inglés B2', category: 'Idiomas', questionsCount: 10, acceptancePercent: 80, type: 'Escrita', active: true },
];

export const MOCK_PIPELINE: PipelineStage[] = [
  { id: 1, name: 'Postulados', order: 1, color: '#64748b', candidatesCount: 128 },
  { id: 2, name: 'Preselección', order: 2, color: '#2563eb', candidatesCount: 45 },
  { id: 3, name: 'Entrevista', order: 3, color: '#8b5cf6', candidatesCount: 18 },
  { id: 4, name: 'Evaluación', order: 4, color: '#f97316', candidatesCount: 12 },
  { id: 5, name: 'Documentos', order: 5, color: '#0d9488', candidatesCount: 8 },
  { id: 6, name: 'Contratados', order: 6, color: '#16a34a', candidatesCount: 2 },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  user: 'gquintana@empresa.com',
  action: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN'][i % 4],
  entity: ['Requisition', 'Candidate', 'User', 'Catalog'][i % 4],
  entityId: String(1000 + i),
  timestamp: new Date(2025, 5, 1 + (i % 13), 9 + (i % 8)).toISOString(),
  details: `Acción ${i + 1} registrada en bitácora`,
}));

export const MOCK_REPORT_KPIS = {
  fillRateCurrent: '0.3%',
  fillRatePrevious: '0.8%',
  fillRateYtd: '1.2%',
};

export const MOCK_MMR_ROWS = [
  { indicator: 'Órdenes', months: [12, 15, 18, 14, 20, 22, 19, 17, 21, 16, 18, 20] },
  { indicator: 'Asociados', months: [8, 10, 12, 9, 14, 15, 13, 11, 14, 10, 12, 13] },
  { indicator: 'Fill Rate %', months: [1, 2, 1, 1, 2, 2, 1, 1, 2, 1, 2, 2] },
];

export const REPORT_CATEGORIES = {
  generales: ['MMR', 'Status per requisition', 'Requisitions per month', 'Fill Rate', 'Candidate status', 'Associate Starts', 'Coverage by user', 'Process funnel', 'Performance'],
  cubrimiento: ['Consolidated', 'Segmented summary', 'Incident tops'],
  vacantes: ['Coverage', 'Metrics'],
};
