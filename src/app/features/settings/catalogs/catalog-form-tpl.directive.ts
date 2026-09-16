import { Directive, Input, TemplateRef } from '@angular/core';

/** Marks an ng-template as a catalog create/edit form body for MatDialog hosting. */
@Directive({
  selector: 'ng-template[catalogFormTpl]',
  standalone: true,
})
export class CatalogFormTplDirective {
  @Input({ alias: 'catalogFormTpl', required: true }) key!: string;

  constructor(readonly template: TemplateRef<unknown>) {}
}
