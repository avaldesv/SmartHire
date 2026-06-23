import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { ApplicationAuditLogApiService } from '../../../../core/services/application-audit-log-api.service';
import { ApplicationAuditLogItem } from '../../../../shared/models/application-audit-log.model';

export interface ApplicationAuditLogDialogData {
  applicationId: number;
  candidateName: string;
  positionId?: number;
}

@Component({
  selector: 'sh-application-audit-log-dialog',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './application-audit-log-dialog.component.html',
  styleUrl: './application-audit-log-dialog.component.scss',
})
export class ApplicationAuditLogDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<ApplicationAuditLogDialogComponent>);
  readonly data = inject<ApplicationAuditLogDialogData>(MAT_DIALOG_DATA);
  private readonly auditApi = inject(ApplicationAuditLogApiService);
  private readonly snack = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  loading = true;
  saving = false;
  rows: ApplicationAuditLogItem[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;

  readonly columns = ['createdAt', 'action', 'message', 'performedBy', 'commitment'];

  readonly form = this.fb.nonNullable.group({
    message: ['', [Validators.required, Validators.maxLength(2000)]],
    action: ['NOTE'],
    commitment: [''],
  });

  readonly actionOptions = [
    { value: 'NOTE', label: 'Nota' },
    { value: 'CONTACT', label: 'Contacto' },
    { value: 'INTERVIEW', label: 'Entrevista' },
    { value: 'DOCUMENT', label: 'Documento' },
    { value: 'STATUS', label: 'Estado' },
  ];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.auditApi.list(this.data.applicationId, this.pageIndex, this.pageSize).subscribe({
      next: (res) => {
        this.rows = res.items;
        this.total = res.total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open('No se pudo cargar la bitácora', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onPage(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.load();
  }

  addEntry(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.saving = true;
    this.auditApi
      .create(this.data.applicationId, {
        message: v.message.trim(),
        action: v.action || 'NOTE',
        actionType: 'MANUAL',
        commitment: v.commitment.trim() || null,
      })
      .subscribe({
        next: () => {
          this.saving = false;
          this.form.reset({ message: '', action: 'NOTE', commitment: '' });
          this.pageIndex = 0;
          this.load();
          this.snack.open('Entrada registrada', 'Cerrar', { duration: 3000 });
        },
        error: () => {
          this.saving = false;
          this.snack.open('No se pudo guardar la entrada', 'Cerrar', { duration: 4000 });
        },
      });
  }

  actionLabel(code: string | null | undefined): string {
    if (!code) {
      return '—';
    }
    return this.actionOptions.find((o) => o.value === code)?.label ?? code;
  }

  close(): void {
    this.dialogRef.close();
  }
}
