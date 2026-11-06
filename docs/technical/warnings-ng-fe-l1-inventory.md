# Inventory — NG8011 / NG8102 (`warnings-ng-fe-l1`)

**Fecha:** 2026-11-06  
**Key:** `warnings-ng-fe-l1`  
**Issue:** AVV-840 / SmartHire#750  
**Rama:** `feature/AVV-840_warnings-ng-inventory`  
**SHA base:** `273e407` (`dev` at inventory time)  
**Repo:** `smart_hire_recruiter_portal` (`avaldesv/SmartHire`)

## Comandos ejecutados

| Comando | Resultado NG8011 | Resultado NG8102 |
|---------|------------------|------------------|
| `npm run build` (production) | **0** | **0** |
| `npx ng build --configuration=development` | **0** | **0** |
| `npx ng serve --configuration remote --port 4310` | **0** | **0** |

Build/serve completaron OK. Otros avisos presentes (fuera de alcance de este RF): budgets de bundle/SCSS, CommonJS (`@stomp/stompjs`, `jszip`), keys i18n faltantes (`No translation found for…`).

## Conclusión para L2

**El compilador Angular en `dev` actual no emite NG8011 ni NG8102.**

Según el plan/RF: L2 puede limitarse a smoke/confirmación o cancelarse con nota del PO. No hay lista de archivos obligatorios a corregir por warning emitido.

### Contexto del reporte original

En un clone desfasado (`D:\TEMP\via\SmartHire`) al ejecutar `npm run start:remote` se reportaron:

| Código | Archivo (clone TEMP) | Nota vs `dev` actual |
|--------|----------------------|----------------------|
| NG8011 | `candidate-documents-dialog.component.html` (~178, `mat-icon` upload en `@else`) | El patrón con wrapper `.upload-btn-content` + `mat-icon` + texto **sigue** en `dev`; el compilador **no** lo marca ahora. |
| NG8102 ×4 | `position-cancel-dialog.component.html` (`impact.*Count ?? 0`) | En `dev` los totales **ya** usan `{{ impact.positionsCount }}` etc. **sin** `??`. |

## Candidatos estáticos del RF (no emitidos por el compilador)

Útiles solo si el PO pide limpieza preventiva en L2; **no** son deuda de warning actual:

### Posible patrón NG8011 (control flow + `mat-icon` en botones)

| Archivo | Nota |
|---------|------|
| `src/app/features/candidates/dialogs/candidate-documents-dialog/candidate-documents-dialog.component.html` | Botón stroked Subir: `@else` con `span.upload-btn-content` → `mat-icon` + texto |
| `src/app/features/positions/wizard/dynamic-wizard-step/dynamic-wizard-step.component.html` | `@else` + `mat-icon` |
| `src/app/features/positions/list/publication-generate-dialog/publication-generate-dialog.component.html` | `@else` + `mat-icon` |
| `src/app/features/settings/interview-calendar/interview-calendar-config-dialog.component.html` | `@else` + `mat-icon` |

### `?? 0` en HTML (pueden o no ser NG8102 según tipado)

| Archivo | Expresión |
|---------|-----------|
| `notifications-admin.component.html` | `row.attempts ?? 0` |
| `catalogs-admin.component.html` | `row.recruitersCount ?? 0` |
| `positions-table.component.html` | `applicantsCount` / `preselectedCount` / `hiredCount` con `?? 0` |
| `surveys-admin.component.html` | `row.questionCount ?? 0` |
| `survey-results.component.html` | `row.completionRate ?? 0` |

## Criterios L1

- [x] Comentario/lista de NG8011/NG8102 reproducidos (vacía — documentado)
- [x] Comando + rama/SHA indicados
- [x] Sin warnings: documentado para decisión PO sobre L2
- [x] Sin cambios de producto (solo este inventario)
