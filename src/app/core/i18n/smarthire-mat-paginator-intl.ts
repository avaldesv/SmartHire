import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

/** Localized MatPaginator labels (Material defaults are English regardless of app locale). */
@Injectable()
export class SmarthireMatPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = $localize`:@@paginator.itemsPerPage:Elementos por página:`;
  override nextPageLabel = $localize`:@@paginator.nextPage:Página siguiente`;
  override previousPageLabel = $localize`:@@paginator.previousPage:Página anterior`;
  override firstPageLabel = $localize`:@@paginator.firstPage:Primera página`;
  override lastPageLabel = $localize`:@@paginator.lastPage:Última página`;

  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return $localize`:@@paginator.rangeEmpty:0 de ${length}:total:`;
    }
    const start = page * pageSize + 1;
    const end = Math.min((page + 1) * pageSize, length);
    return $localize`:@@paginator.range:${start}:start: – ${end}:end: de ${length}:total:`;
  };
}
