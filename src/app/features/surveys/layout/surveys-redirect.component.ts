import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppPermissions } from '../../../core/auth/app-permissions';
import { PermissionService } from '../../../core/services/permission.service';

/** Redirects /surveys to the first tab the user can access. */
@Component({
  selector: 'sh-surveys-redirect',
  standalone: true,
  template: '',
})
export class SurveysRedirectComponent implements OnInit {
  private readonly permissions = inject(PermissionService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    if (this.permissions.hasAuthority(AppPermissions.SURVEY_READ)) {
      void this.router.navigate(['/surveys', 'list'], { replaceUrl: true });
      return;
    }
    if (this.permissions.hasAuthority(AppPermissions.SURVEY_RESULTS_READ)) {
      void this.router.navigate(['/surveys', 'results'], { replaceUrl: true });
      return;
    }
    void this.router.navigate(['/unauthorized'], { replaceUrl: true });
  }
}
