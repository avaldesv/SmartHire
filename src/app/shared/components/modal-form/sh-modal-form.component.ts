import {
  AfterViewInit,
  Component,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

/** Maps each `sh-modal-form` host element to its component instance (content-projection safe). */
const MODAL_FORM_BY_HOST = new WeakMap<HTMLElement, ShModalFormComponent>();

/**
 * Marks footer action buttons for {@link ShModalFormComponent}.
 * Teleports into `mat-dialog-actions` (works with ngTemplateOutlet inside shells).
 */
@Directive({
  selector: '[shModalActions]',
  standalone: true,
})
export class ShModalActionsDirective implements AfterViewInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private modal: ShModalFormComponent | null = null;

  ngAfterViewInit(): void {
    const source = this.host.nativeElement;
    const modalEl = source.closest('sh-modal-form');
    const modal = modalEl ? MODAL_FORM_BY_HOST.get(modalEl) ?? null : null;
    if (!modal) {
      return;
    }
    this.modal = modal;
    // Content may still be settling (e.g. *ngIf); attach on next macrotask if needed.
    queueMicrotask(() => modal.attachActions(source));
  }

  ngOnDestroy(): void {
    this.modal?.detachActions(this.host.nativeElement);
    this.modal = null;
  }
}

/**
 * Canonical MatDialog form layout: branded header + content + actions footer.
 * Reference: Postular candidatos del pool.
 */
@Component({
  selector: 'sh-modal-form',
  standalone: true,
  imports: [MatDialogModule, NgClass],
  template: `
    <div class="sh-catalog-dialog-header" mat-dialog-title>
      <span class="sh-catalog-dialog-header__text">{{ title }}</span>
      <ng-content select="[shModalHeaderExtra]" />
    </div>
    <mat-dialog-content
      class="sh-catalog-dialog-body"
      [ngClass]="contentClass"
    >
      <ng-content />
    </mat-dialog-content>
    <mat-dialog-actions align="end" #actionsHost></mat-dialog-actions>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        min-height: 0;
        height: 100%;
      }
    `,
  ],
})
export class ShModalFormComponent implements AfterViewInit, OnDestroy {
  private static formIdSeq = 0;

  private readonly hostRef = inject(ElementRef<HTMLElement>);

  @Input({ required: true }) title!: string;
  /** Extra class(es) on mat-dialog-content (e.g. pool-dialog-body). */
  @Input() contentClass = '';

  @ViewChild('actionsHost', { read: ElementRef })
  private actionsHost?: ElementRef<HTMLElement>;

  private readonly attached = new Set<HTMLElement>();
  private viewReady = false;
  private pending: HTMLElement[] = [];

  constructor() {
    // Register early so [shModalActions] can resolve via closest() before AfterViewInit.
    MODAL_FORM_BY_HOST.set(this.hostRef.nativeElement, this);
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    for (const el of this.pending) {
      this.attachActions(el);
    }
    this.pending = [];
  }

  ngOnDestroy(): void {
    MODAL_FORM_BY_HOST.delete(this.hostRef.nativeElement);
    this.attached.clear();
    this.pending = [];
  }

  attachActions(source: HTMLElement): void {
    if (!this.viewReady || !this.actionsHost) {
      if (!this.pending.includes(source)) {
        this.pending.push(source);
      }
      return;
    }
    const host = this.actionsHost.nativeElement;
    if (this.attached.has(source) || host.contains(source)) {
      return;
    }
    // Bind submit buttons to the original form before teleporting them into
    // mat-dialog-actions (outside <form>), otherwise Guardar never fires ngSubmit.
    const form = source.closest('form');
    if (form) {
      if (!form.id) {
        ShModalFormComponent.formIdSeq += 1;
        form.id = `sh-modal-form-${ShModalFormComponent.formIdSeq}`;
      }
      source.querySelectorAll<HTMLButtonElement>('button[type="submit"]').forEach((btn) => {
        if (!btn.getAttribute('form')) {
          btn.setAttribute('form', form.id);
        }
        // MatButton in the teleported footer does not reliably fire native submit.
        btn.addEventListener('click', (event) => {
          event.preventDefault();
          if (btn.disabled) {
            return;
          }
          form.requestSubmit();
        });
      });
    }
    // display:contents so buttons join mat-dialog-actions flex row
    source.style.display = 'contents';
    host.appendChild(source);
    this.attached.add(source);
  }

  detachActions(source: HTMLElement): void {
    this.pending = this.pending.filter((el) => el !== source);
    if (!this.attached.has(source)) {
      return;
    }
    this.attached.delete(source);
    source.remove();
  }
}
