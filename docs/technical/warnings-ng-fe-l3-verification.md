# Verification — clean compile NG8011 / NG8102 (`warnings-ng-fe-l3`)

**Fecha:** 2026-11-06  
**Key:** `warnings-ng-fe-l3`  
**Issue:** AVV-842 / SmartHire#752  
**Rama:** `feature/AVV-842_warnings-ng-verify`  
**SHA verificado:** `5cc0a3f` (`dev` con L1 inventario + L2 fixes mergeados: PR #753, #754)  
**Repo:** `smart_hire_recruiter_portal` (`avaldesv/SmartHire`)

## Comandos

| Comando | NG8011 | NG8102 | Resultado |
|---------|--------|--------|-----------|
| `npm run build` | **0** | **0** | Bundle OK |
| `npx ng serve --configuration remote --port 4311` | **0** | **0** | Serve OK (`http://localhost:4311/`) |

## Smoke UX (checklist RF)

| Pantalla / acción | Estado |
|-------------------|--------|
| Diálogo documentos candidato — botón Subir (estructura MatButton: icono/spinner + texto) | Verificado en código post-L2 (`candidate-documents-dialog`); build/serve limpios |
| Survey results — barra `completionRate` sin `??` muerto | Verificado en código post-L2 |
| Otros warnings (budgets, i18n faltante, CommonJS) | Fuera de alcance (no NG8011/NG8102) |

## Criterios RF §8

- [x] Sin warnings `NG8011` en build/start:remote  
- [x] Sin warnings `NG8102` en build/start:remote  
- [x] Sin `controlFlowPreventingContentProjection = suppress`  
- [x] Sin cambios API / migraciones / portal candidato en este lote  
- [x] `npm run build` OK  
- [x] Evidencia documentada (este archivo + comentario issue)

## PRs del RF

| Lote | PR |
|------|-----|
| L1 inventario | https://github.com/avaldesv/SmartHire/pull/753 |
| L2 fixes | https://github.com/avaldesv/SmartHire/pull/754 |
| L3 verificación | (este PR) |
