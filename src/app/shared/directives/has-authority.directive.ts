import { Directive, Input, TemplateRef, ViewContainerRef, inject, effect } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { PermissionService } from '../services/permission.service';

@Directive({
  selector: '[shHasAuthority]',
  standalone: true,
})
export class HasAuthorityDirective {
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly permissions = inject(PermissionService);
  private readonly auth = inject(AuthService);

  private required: string[] = [];

  @Input()
  set shHasAuthority(value: string | string[]) {
    this.required = Array.isArray(value) ? value : [value];
    this.render();
  }

  constructor() {
    effect(() => {
      this.auth.currentUser();
      this.render();
    });
  }

  private render(): void {
    this.viewContainer.clear();
    if (this.required.length === 0 || this.permissions.hasAny(this.required)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
