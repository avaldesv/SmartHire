# Feedback dialogs — portal reclutador

## Objetivo

Todo feedback de usuario (error, advertencia, información, éxito y confirmación) debe mostrarse con **`FeedbackDialogService`**, no con `MatSnackBar` ni `window.confirm`.

Epic: **AVV-578** — API error i18n + feedback modal dialogs.

## Servicios

| Servicio | Uso |
|----------|-----|
| `FeedbackDialogService` | Mostrar modales (`showError`, `showWarning`, `showInfo`, `showSuccess`, `confirm`, `showApiError`) |
| `ApiErrorResolverService` | Resolver `errorCode` del API → título/mensaje localizados |

## Patrones

```typescript
// Error de API
this.feedback.showApiError(err, { fallbackMessage: MY_FALLBACK_LABEL });

// Éxito
this.feedback.showSuccess(MY_SUCCESS_LABEL);

// Validación / advertencia
this.feedback.showWarning(FEEDBACK_GENERIC_WARNING_TITLE, MY_VALIDATION_LABEL);

// Información
this.feedback.showInfo(FEEDBACK_GENERIC_INFO_TITLE, MY_INFO_LABEL);

// Confirmación
this.feedback.confirm({
  title: FEEDBACK_GENERIC_WARNING_TITLE,
  message: MY_CONFIRM_LABEL,
  confirmWarn: true,
}).subscribe((ok) => {
  if (!ok) return;
  // acción
});
```

## Catálogo de errorCodes

Los códigos del backend se mapean en `src/app/core/i18n/api-error-catalog*.ts`:

- `api-error-catalog.ts` — base (usuario, tenant, auth)
- `api-error-catalog-requisition.ts` — posiciones / formulario requisición
- `api-error-catalog-catalog.ts` — catálogos
- `api-error-catalog-security.ts` — seguridad / grupos reclutadores
- `api-error-catalog-notification.ts` — notificaciones
- `api-error-catalog-questionnaire.ts` — cuestionarios

Prioridad del resolver: **catálogo local → `userMessage`/`title` del API → mensaje genérico**.

El header `language` (vía `language.interceptor.ts`) permite que el backend devuelva mensajes ya traducidos; el catálogo frontend actúa como respaldo offline.

## MatSnackBar — deprecado

**No usar `MatSnackBar` en features nuevas.**

Excepciones temporales: ninguna en producción tras AVV-589. Si necesitas feedback transitorio de progreso (p. ej. bulk upload), evalúa indicador inline en el diálogo, no snackbar.

`ApiErrorTranslationService` está **@deprecated** — usar `ApiErrorResolverService` + `FeedbackDialogService`.

## Referencias

- Componente: `src/app/core/feedback/feedback-dialog.component.ts`
- Labels: `src/app/core/i18n/feedback-labels.ts`
- Piloto original: `features/settings/users/users-admin.component.ts`
