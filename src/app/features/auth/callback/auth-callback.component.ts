import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { from, of, switchMap } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { msalScopes } from '../../../core/auth/msal.config';

@Component({
  selector: 'sh-auth-callback',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="callback-page">
      <mat-spinner diameter="40" />
      <p>Completando inicio de sesión...</p>
    </div>
  `,
  styles: `
    .callback-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }
  `,
})
export class AuthCallbackComponent implements OnInit {
  private readonly msal = inject(MsalService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.msal
      .handleRedirectObservable()
      .pipe(
        switchMap((result) => {
          if (result?.accessToken) {
            return of(result.accessToken);
          }
          const account = this.msal.instance.getAllAccounts()[0];
          if (!account) {
            throw new Error('No Azure account after redirect');
          }
          return from(
            this.msal.acquireTokenSilent({
              scopes: msalScopes,
              account,
            }),
          ).pipe(switchMap((silent) => of(silent.accessToken)));
        }),
        switchMap((accessToken) => this.auth.exchangeSsoToken(accessToken)),
      )
      .subscribe({
        next: () => this.router.navigate(['/home']),
        error: () => this.router.navigate(['/login'], { queryParams: { ssoError: '1' } }),
      });
  }
}
