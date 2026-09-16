import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

/**
 * Localized MatPaginator labels for every `sh-paginator` / MatPaginator.
 * Strings are compile-time `$localize` (es-MX source, en-US/es-ES XLF targets).
 */
@Injectable()
export class SmarthireMatPaginatorIntl extends MatPaginatorIntl {
  constructor() {
    super();
    this.itemsPerPageLabel = $localize`:@@paginator.itemsPerPage:Elementos por página:`;
    this.nextPageLabel = $localize`:@@paginator.nextPage:Página siguiente`;
    this.previousPageLabel = $localize`:@@paginator.previousPage:Página anterior`;
    this.firstPageLabel = $localize`:@@paginator.firstPage:Primera página`;
    this.lastPageLabel = $localize`:@@paginator.lastPage:Última página`;
  }

  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return $localize`:@@paginator.rangeEmpty:0 de ${length}:total:`;
    }
    const start = page * pageSize + 1;
    const end = Math.min((page + 1) * pageSize, length);
    return $localize`:@@paginator.range:${start}:start: – ${end}:end: de ${length}:total:`;
  };
}
