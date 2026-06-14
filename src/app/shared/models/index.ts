export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  initials: string;
  role: 'RECRUITER' | 'COORDINATOR' | 'ADMIN';
  branch: string;
  permissions: string[];
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ListQuery {
  search?: string;
  page?: number;
  pageSize?: number;
  status?: string;
  client?: string;
  country?: string;
  recruiter?: string;
  dateFrom?: string;
  dateTo?: string;
}

export type RequisitionStatus = 'Abierta' | 'En Proceso' | 'En Revisión' | 'Cerrada' | 'Selección' | 'Análisis';

export interface Requisition {
  id: number;
  requisitionNo: string;
  name: string;
  ot: string;
  createdAt: string;
  positionsCount: number;
  applicants: number;
  preselected: number;
  firstDay: string | null;
  recruiter: string;
  type: string;
  category: string;
  brand: string;
  client: string;
  clientKey: string;
  unit: string;
  city: string;
  state: string;
  status: RequisitionStatus;
  country: string;
  createdBy: string;
  coordinator: string;
}

export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  curp?: string;
  rfc?: string;
  nss?: string;
  gender?: string;
  country: string;
  city: string;
  state: string;
  desiredSalary?: number;
  source: string;
  active: boolean;
  createdAt: string;
  specialties?: string[];
  experienceYears?: number;
}

export interface PreselectionCandidate extends Candidate {
  compatibility: number;
  stage: string;
  interviewScheduled: boolean;
  documentsComplete: boolean;
  selected: boolean;
  smartSent: boolean;
}

export interface SystemUser {
  id: number;
  active: boolean;
  username: string;
  firstName: string;
  lastName: string;
  nickname: string;
  email: string;
  phone: string;
  country: string;
  branch: string;
  area: string;
  department: string;
  profile: string;
  supervisor: string;
  createdAt: string;
  createdBy: string;
  modifiedAt: string;
  modifiedBy: string;
}

export interface UserGroup {
  id: number;
  name: string;
  description: string;
  members: number;
  modules: string[];
  active: boolean;
}

export interface CatalogItem {
  id: number;
  key1: string;
  key2?: string;
  name: string;
  description: string;
  active: boolean;
  category: string;
}

export interface NotificationTemplate {
  id: number;
  action: string;
  channels: ('Correo' | 'WhatsApp')[];
  templateId: string;
  message: string;
  active: boolean;
}

export interface Questionnaire {
  id: number;
  name: string;
  category: string;
  questionsCount: number;
  acceptancePercent: number;
  type: string;
  active: boolean;
}

export interface Question {
  id: number;
  text: string;
  validAnswer: string;
  weight: number;
  maxSeconds: number;
}

export interface PipelineStage {
  id: number;
  name: string;
  order: number;
  color: string;
  candidatesCount: number;
}

export interface ReportKpi {
  label: string;
  value: string | number;
  trend?: string;
}

export interface MmrRow {
  indicator: string;
  months: number[];
}

export interface AiSearchResult {
  candidateId: number;
  name: string;
  email: string;
  phone: string;
  compatibility: number;
  evidence: string;
}

export interface Beneficiary {
  type: 'Primario' | 'Contingente';
  firstName: string;
  lastName: string;
  relationship: string;
  irrevocable: boolean;
  age: number;
  percent: number;
  country: string;
  phone: string;
  email: string;
}

export interface PositionWizardData {
  clientCountry: string;
  brand: string;
  recruitmentType: string;
  coverageCategory: string;
  ot: string;
  clientKey: string;
  legalName: string;
  contactName: string;
  clientPosition: string;
  generalNotes: string;
  contractType: string;
  shift: string;
  salary: number;
  workDays: string;
  address: string;
  city: string;
  state: string;
  requirements: string;
  languages: string;
  documents: string[];
}

export interface AuditLog {
  id: number;
  user: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
  details: string;
}
