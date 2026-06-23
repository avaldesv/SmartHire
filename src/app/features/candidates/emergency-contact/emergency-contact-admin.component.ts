import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { CandidateEmergencyContactApiService } from '../../../core/services/candidate-emergency-contact-api.service';
import { CatalogKinshipService } from '../../../core/services/catalog-kinship.service';
import { CatalogKinship } from '../../../shared/models/catalog-kinship.model';
import {
  CandidateEmergencyContact,
  CandidateEmergencyContactPayload,
} from '../../../shared/models/candidate-emergency-contact.model';

@Component({
  selector: 'sh-emergency-contact-admin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    PageHeaderComponent,
  ],
  templateUrl: './emergency-contact-admin.component.html',
  styleUrl: './emergency-contact-admin.component.scss',
})
export class EmergencyContactAdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);
  private readonly contactApi = inject(CandidateEmergencyContactApiService);
  private readonly kinshipService = inject(CatalogKinshipService);

  readonly candidateId = Number(this.route.snapshot.paramMap.get('id'));

  loading = true;
  saving = false;
  showForm = false;
  editingId: number | null = null;
  contacts: CandidateEmergencyContact[] = [];
  kinships: CatalogKinship[] = [];
  readonly columns = ['name', 'phone', 'email', 'active', 'actions'];

  readonly contactForm = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    secondLastName: [''],
    kinshipId: [null as number | null, Validators.required],
    phonePrefix: ['+52'],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    isActive: [true],
  });

  ngOnInit(): void {
    if (!this.candidateId || Number.isNaN(this.candidateId)) {
      this.snack.open('Candidato inválido', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/candidates']);
      return;
    }
    this.kinshipService.list(0, 100).subscribe({
      next: ({ items }) => {
        this.kinships = items.filter((k) => k.isActive);
        this.loadContacts();
      },
      error: () => {
        this.loading = false;
        this.snack.open('No se pudo cargar el catálogo de parentesco', 'Cerrar', { duration: 3500 });
      },
    });
  }

  loadContacts(): void {
    this.loading = true;
    this.contactApi.list(this.candidateId, 0, 20).subscribe({
      next: ({ items }) => {
        this.contacts = items;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open('No se pudieron cargar los contactos de emergencia', 'Cerrar', { duration: 3500 });
      },
    });
  }

  openCreate(): void {
    this.editingId = null;
    this.showForm = true;
    this.contactForm.reset({
      firstName: '',
      lastName: '',
      secondLastName: '',
      kinshipId: null,
      phonePrefix: '+52',
      phone: '',
      email: '',
      isActive: true,
    });
  }

  openEdit(row: CandidateEmergencyContact): void {
    this.editingId = row.id;
    this.showForm = true;
    this.contactForm.patchValue({
      firstName: row.firstName,
      lastName: row.lastName,
      secondLastName: row.secondLastName ?? '',
      kinshipId: row.kinshipId,
      phonePrefix: row.phonePrefix ?? '+52',
      phone: row.phone,
      email: row.email ?? '',
      isActive: row.active,
    });
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingId = null;
  }

  save(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    const payload = this.buildPayload();
    this.saving = true;
    const request$ =
      this.editingId != null
        ? this.contactApi.update(this.candidateId, this.editingId, payload)
        : this.contactApi.create(this.candidateId, payload);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.showForm = false;
        this.editingId = null;
        this.snack.open('Contacto guardado', 'Cerrar', { duration: 3000 });
        this.loadContacts();
      },
      error: (err) => {
        this.saving = false;
        const message =
          err?.error?.message ?? err?.error?.detail ?? 'No se pudo guardar el contacto';
        this.snack.open(message, 'Cerrar', { duration: 4000 });
      },
    });
  }

  kinshipName(id: number | null): string {
    if (id == null) {
      return '—';
    }
    return this.kinships.find((k) => k.id === id)?.name ?? String(id);
  }

  private buildPayload(): CandidateEmergencyContactPayload {
    const value = this.contactForm.getRawValue();
    return {
      firstName: value.firstName.trim(),
      lastName: value.lastName.trim(),
      secondLastName: value.secondLastName.trim() || null,
      kinshipId: value.kinshipId,
      phonePrefix: value.phonePrefix.trim() || null,
      phone: value.phone.trim(),
      email: value.email.trim() || null,
      isActive: value.isActive,
    };
  }

  back(): void {
    this.router.navigate(['/candidates', this.candidateId]);
  }
}
