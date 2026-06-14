import { Requisition, RequisitionStatus } from '../../shared/models';

const clients = [
  'Tecnología Global S.A. de C.V.',
  'Soluciones Integrales Corp.',
  'Innovación Digital Mexicana',
  'Servicios Corporativos del Norte',
  'Manufactura Avanzada S.A.',
  'Finanzas Corporativas MX',
  'Retail Express México',
  'Logística Integral S.A.',
];

const recruiters = ['Gerardo Quintana', 'María López', 'Carlos Ruiz', 'Ana Torres', 'Luis Mendoza'];
const cities = ['CDMX', 'Monterrey', 'Guadalajara', 'Querétaro', 'Puebla'];
const states = ['Ciudad de México', 'Nuevo León', 'Jalisco', 'Querétaro', 'Puebla'];
const statuses: RequisitionStatus[] = ['Abierta', 'En Proceso', 'En Revisión', 'Cerrada', 'Selección', 'Análisis'];
const types = ['Reclutamiento Puro', 'RPO', 'Staffing'];
const categories = ['Operativo', 'Administrativo', 'Técnico', 'Gerencial'];
const brands = ['Smart Hire MX', 'Cliente Directo', 'Marca A'];

function pad(n: number, len = 4): string {
  return String(n).padStart(len, '0');
}

export const MOCK_REQUISITIONS: Requisition[] = Array.from({ length: 857 }, (_, i) => {
  const id = 1172 - i;
  const num = 857 - i;
  const status = statuses[i % statuses.length];
  const client = clients[i % clients.length];
  const cityIdx = i % cities.length;
  return {
    id,
    requisitionNo: `REQ-2025-${pad(num)}`,
    name: i % 3 === 0 ? 'Agente de Finanzas' : i % 3 === 1 ? 'Desarrollador Frontend' : 'Ejecutivo de Ventas',
    ot: `OT-${101350 + i}`,
    createdAt: new Date(2025, 4, 1 + (i % 28)).toISOString(),
    positionsCount: 1 + (i % 5),
    applicants: 5 + (i % 40),
    preselected: i % 8,
    firstDay: i % 4 === 0 ? '2025-06-15' : null,
    recruiter: recruiters[i % recruiters.length],
    type: types[i % types.length],
    category: categories[i % categories.length],
    brand: brands[i % brands.length],
    client,
    clientKey: `CL-${1000 + (i % 200)}`,
    unit: `UN-${(i % 12) + 1}`,
    city: cities[cityIdx],
    state: states[cityIdx],
    status,
    country: 'México',
    createdBy: recruiters[(i + 1) % recruiters.length],
    coordinator: recruiters[(i + 2) % recruiters.length],
  };
});

export const MOCK_KPIS = {
  totalPositions: 857,
  preselected: 3768,
  interested: 3,
};
