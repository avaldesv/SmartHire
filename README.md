# Smart Hire — Portal Reclutadores (Maqueta Angular)

Maqueta funcional del **portal interno de reclutadores** Smart Hire, basada en la **Propuesta A — Smart Hire Pro**.  
Datos **100% mock** (sin backend). Cubre los módulos y pantallas definidos en los RF/NFR del análisis de migración.

## Requisitos

- Node.js 20+
- npm 10+

## Inicio rápido

```bash
cd smarthire-recruiter-portal
npm install
npm start
```

Abrir http://localhost:4200 → redirige a `/login`.

**Login mock:** cualquier correo corporativo o botón «Iniciar sesión con SSO» → sesión simulada como Gerardo Quintana.

## Arquitectura frontend (alineada al target)

```
src/app/
├── core/           # Shell, auth mock, guards
├── shared/         # Modelos, KPI card, badges, page header
├── mock/           # Datos y servicios simulando microservicios
└── features/       # Módulos lazy-loaded por dominio
    ├── auth/
    ├── home/
    ├── positions/
    ├── candidates/
    ├── selection/
    ├── questionnaires/
    ├── tracking/
    ├── reports/
    └── settings/
```

| Feature Angular | Microservicio target | RF |
|-----------------|---------------------|-----|
| `home` | requisition-service | RF-006, RF-007 |
| `positions` | requisition-service + integration | RF-008, RF-009 |
| `candidates` | candidate-service | RF-010–RF-014 |
| `selection` | ai-service + workflow | RF-012, RF-013 |
| `questionnaires` | questionnaire-service | RF-015 |
| `tracking` | workflow-service | Seguimiento pipeline |
| `reports` | report-service | RF-017 |
| `settings` | user, catalog, notification | RF-002–RF-005, RF-018 |

## Rutas principales

| Ruta | Pantalla |
|------|----------|
| `/home` | Dashboard KPIs + grid solicitudes (19 cols) + toolbar acciones |
| `/positions` | Lista requisiciones |
| `/positions/new` | Wizard 8 pasos crear posición |
| `/positions/:id/edit` | Wizard editar posición |
| `/selection/:positionId/ai` | Chat IA preselección |
| `/selection/:positionId/preselection` | Grid preselección + acciones |
| `/selection/:positionId/analysis` | Vista análisis |
| `/candidates` | Pool candidatos |
| `/candidates/new` | Alta candidato |
| `/candidates/:id` | Perfil fiscal MX |
| `/candidates/:id/beneficiary` | Wizard beneficiarios |
| `/questionnaires` | Catálogo evaluaciones |
| `/questionnaires/assign` | Asignación a requisición |
| `/tracking` | Pipeline kanban por etapas |
| `/reports/mmr` | Reporte MMR + fill rate |
| `/reports/view/:slug` | Reportes genéricos (sidebar) |
| `/settings/*` | Usuarios, grupos, catálogos, notificaciones, docs, prompts, CVs, entrevistas, etapas, sistema, bitácoras |

## Diseño — Smart Hire Pro

- Marca: **Smart Hire** (sin identidad Manpower)
- Colores: teal `#0D9488`, navy `#1E3A5F`, fondo `#F8FAFC`
- Tipografía: Inter + JetBrains Mono (IDs)
- Layout: top nav horizontal + content area

## Build producción

```bash
npm run build
```

Salida en `dist/smarthire-recruiter-portal/`.

## Próximo paso (integración real)

1. Reemplazar `mock/services/*` por HTTP clients apuntando al API Gateway.
2. MSAL Angular para SSO Azure AD (RF-001).
3. Interceptor JWT + manejo RBAC por permisos.
4. AG-Grid o virtual scroll para grids 857+ registros (NFR-02).

## Referencias

- Análisis funcional: `../docs/MIGRACION_SMARTHIRE_ANALISIS.md`
- Propuesta diseño A: `../docs/design/recruiter-propuesta-a-smart-hire-pro.png`
- Linear: issue AVV-138 (propuestas) → spec UI definitiva pendiente
