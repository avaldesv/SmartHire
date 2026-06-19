# G5 — Inventario paridad RF ↔ mock frontend

**Issue:** [AVV-146](https://linear.app/avv1208/issue/AVV-146) / [GitHub #2](https://github.com/avaldesv/SmartHire/issues/2)  
**Repo:** `smart_hire_recruiter_portal`  
**Referencia:** RF-001–RF-018 (`docs/MIGRACION_SMARTHIRE_ANALISIS.md`)  
**EPIC:** EPIC-14 Portal Reclutador (Propuesta A — Smart Hire Pro)  
**Fecha:** 2026-06-19

---

## 1. Resumen ejecutivo

| Métrica | Valor |
|---------|-------|
| RFs en alcance portal reclutador | RF-001–RF-018 (18) |
| Cobertura mock **Parcial+** | 16 / 18 |
| Cobertura **N/A** (otro producto) | RF-016 Portal candidato |
| Cobertura **Backend-only** | RF-019 (documentado en G3, fuera G5) |
| Rutas Angular implementadas | 28 pantallas lazy-loaded |
| Datos | 100% mock (`src/app/mock/`) |

**Conclusión:** la maqueta cubre **navegación y shells** de casi todos los RF del portal interno. Los deltas críticos están en profundidad funcional (acciones masivas, integraciones, paginación server-side, portal candidato separado).

---

## 2. Leyenda de cobertura

| Nivel | Significado |
|-------|-------------|
| **Full** | Flujo principal visible y usable en mock |
| **Partial** | Pantalla/ruta existe; faltan campos, acciones o reglas de negocio |
| **Shell** | Layout placeholder; datos estáticos o snackbar simulado |
| **None** | No implementado en este repo |
| **N/A** | Fuera del portal reclutador |

---

## 3. Tabla paridad RF ↔ mock

| RF | Título | Cobertura | Frame / ruta mock | Delta principal |
|----|--------|-----------|-------------------|-----------------|
| RF-001 | Autenticación y sesión | Partial | `frame_login` → `/login` | SSO simulado; sin MSAL, refresh token ni logout remoto |
| RF-002 | Gestión usuarios | Partial | `frame_settings_users` → `/settings/users` | Grid mock; sin CRUD real, roles, toggle activo, auditoría |
| RF-003 | Gestión grupos | Partial | `frame_settings_groups` → `/settings/groups` | Lista mock; sin permisos por módulo |
| RF-004 | Catálogos maestros | Partial | `frame_settings_catalogs` → `/settings/catalogs` | Tabs UI; sin CRUD paginado 1744+ carreras |
| RF-005 | Notificaciones | Partial | `frame_settings_notifications` → `/settings/notifications` | Toggle activo; sin editor plantillas `{{vars}}`, WhatsApp template ID |
| RF-006 | Dashboard Inicio | Partial | `frame_home` → `/home` | KPIs + **18 cols** + paginador client-side; faltan filtros coordinador/reclutador/país combinados AND |
| RF-007 | Acciones requisiciones | Shell | `frame_home_actions` → menú fila `/home` | Solo 3 acciones menú; faltan carga masiva, duplicar, publicación, cancelación, postular, históricos |
| RF-008 | Creación posición wizard | Partial | `frame_position_wizard` → `/positions/new` | **8 pasos** mat-stepper; botón ATS simulado; falta GENERAR JSON, IA descripción, envío ERP |
| RF-009 | Actualización posición | Partial | `frame_position_edit` → `/positions/:id/edit` | Mismo wizard; tab documentos simplificado vs validación IA nombre/vigencia |
| RF-010 | Gestión candidatos | Partial | `frame_candidates_*` → `/candidates`, `/new`, `/:id` | Alta manual + perfil fiscal; cascada colonia mock; sin upload CV IA |
| RF-011 | Postulación/vinculación | Shell | (desde selección/candidatos) | Sin modales pool multi-select paginados |
| RF-012 | Selección IA | Partial | `frame_selection_ai` → `/selection/:id/ai` | Chat mock; fuentes BUC/postulados UI; sin ranking real ni persistencia historial |
| RF-013 | Preselección y análisis | Partial | `frame_selection_pre` → `/selection/:id/preselection` | Grid 7 cols + 4 botones toolbar; legacy exige **15+ acciones** por fila |
| RF-013 ext. | Seguimiento pipeline | Shell | `frame_tracking` → `/tracking` | Kanban estático 3 cards placeholder; extiende visibilidad RF-013 cross-requisición |
| RF-014 | Complementación candidato | Partial | `frame_beneficiary` → `/candidates/:id/beneficiary` | Wizard beneficiarios; contactos emergencia simplificados |
| RF-015 | Cuestionarios | Partial | `frame_questionnaires` → `/questionnaires`, `/assign` | Catálogo + asignación mock; sin config preguntas ponderación/tiempo |
| RF-016 | Portal candidato | **N/A** | — | Producto separado (`docs/design/PORTAL_*`); no incluido en maqueta reclutador |
| RF-017 | Reportes | Partial | `frame_reports_mmr` → `/reports/mmr`, `/reports/view/:slug` | MMR con KPIs mock; sidebar categorías parcial; sin export |
| RF-018 | Configuraciones | Partial | `frame_settings_*` → `/settings/*` (10 sub-rutas) | Shells: docs, prompts, CVs, entrevistas, etapas, sistema, bitácoras |

---

## 4. RF-013 ext. — Seguimiento (`/tracking`)

| Aspecto | Legacy Appian | Mock Angular |
|---------|---------------|--------------|
| Propósito | Visibilidad pipeline candidatos por etapa, cross-requisición | Kanban por etapas configurables |
| Datos | Candidatos reales por etapa workflow | Placeholder `Candidato 1..3` por columna |
| Acciones | Drill-down a requisición/candidato | Ninguna |
| Config etapas | `MPIA_ETAPA` / settings | `/settings/pipeline-stages` (mock) |

**Dictamen:** `/tracking` se documenta como **extensión RF-013** para seguimiento transversal; no reemplaza la grid de preselección por posición. Implementación productiva debe consumir `workflow-service` con datos reales.

---

## 5. Gaps críticos para validación PO

| # | Gap | RF | Severidad | Recomendación |
|---|-----|-----|-----------|---------------|
| 1 | Portal candidato ausente | RF-016 | Alta | Proyecto/repo separado; no bloquea EPIC-14 |
| 2 | Preselección sin acciones legacy (contrato, SMART, validar docs…) | RF-013 | Alta | Descomponer en historias US por acción |
| 3 | Acciones toolbar requisiciones incompletas | RF-007 | Alta | Matriz acciones × permisos RBAC |
| 4 | Integraciones ATS/ERP solo snackbar | RF-008, RF-013 | Alta | Depende G3 INT-* + backend |
| 5 | Paginación/filtros client-side (5–50 rows) | RF-006, NFR-02 | Media | AG-Grid + API paginada |
| 6 | SSO real Azure AD | RF-001 | Media | Depende G4 AUTH-* |
| 7 | Tracking kanban placeholder | RF-013 ext. | Baja | Conectar workflow al implementar módulo |

**Validación PO:** ☐ Pendiente — revisar gaps #2, #3, #4 como bloqueantes MVP reclutador.

---

## 6. Mapa frames → rutas (EPIC-14)

| Frame ID | Componente | Ruta |
|----------|------------|------|
| `frame_login` | `LoginComponent` | `/login` |
| `frame_shell` | `ShellComponent` | layout autenticado |
| `frame_home` | `DashboardComponent` | `/home` |
| `frame_positions_list` | `PositionsListComponent` | `/positions` |
| `frame_position_wizard` | `PositionWizardComponent` | `/positions/new`, `/positions/:id/edit` |
| `frame_candidates_list` | `CandidatesListComponent` | `/candidates` |
| `frame_candidate_form` | `CandidateFormComponent` | `/candidates/new`, `/:id/edit` |
| `frame_candidate_profile` | `CandidateProfileComponent` | `/candidates/:id` |
| `frame_beneficiary` | `BeneficiaryWizardComponent` | `/candidates/:id/beneficiary` |
| `frame_selection_ai` | `AiChatComponent` | `/selection/:positionId/ai` |
| `frame_selection_pre` | `PreselectionComponent` | `/selection/:positionId/preselection` |
| `frame_selection_analysis` | `AnalysisComponent` | `/selection/:positionId/analysis` |
| `frame_tracking` | `TrackingPipelineComponent` | `/tracking` |
| `frame_reports` | `ReportsLayoutComponent` | `/reports/*` |
| `frame_settings` | `SettingsLayoutComponent` | `/settings/*` |

---

## 7. Mock issues → estado Parity Reviewed

Issues mock del portal marcados como revisados contra este inventario:

| Área mock | Issue sugerido | Estado paridad |
|-----------|----------------|----------------|
| Auth mock | Conectar RF-001 / AUTH-01-FE | Parity Reviewed — delta documentado §3 |
| Home grid | Paginación server-side RF-006 | Parity Reviewed |
| Position wizard | INT-07 send-ATS | Parity Reviewed |
| Preselection | RF-013 acciones completas | Parity Reviewed — gap crítico #2 |
| Tracking kanban | RF-013 ext. workflow API | Parity Reviewed |
| Settings shells | RF-002–005, RF-018 backend | Parity Reviewed |

---

## 8. Criterios de aceptación G5

- [x] Tabla features: RF, cobertura, delta, frame
- [x] tracking → RF-013 ext. documentado (§4)
- [ ] PO valida gaps críticos (§5 — pendiente sesión PO)
- [x] Mock issues → Parity Reviewed (§7)

---

## 9. Próximos pasos

1. Sesión PO: validar gaps §5 (#2, #3, #4).
2. Fase RA (AVV-150): usar esta matriz como input backlog frontend.
3. Integración API: reemplazar `mock/services/*` según módulos backend listos (security → home → catalog).

## Referencias

- `README.md` — mapa features ↔ RF
- `src/app/app.routes.ts` — rutas
- `docs/MIGRACION_SMARTHIRE_ANALISIS.md` — RF-001–RF-019
- `docs/design/RECRUITER_3_PROPUESTAS_DISENO.md` — Propuesta A
