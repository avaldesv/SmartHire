import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'sh-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  loading = false;
  error = '';

  readonly form = this.fb.nonNullable.group({
    email: ['admin', [Validators.required]],
    password: ['', Validators.required],
  });

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('ssoError') === '1') {
      this.error = 'No se pudo completar el inicio de sesión con SSO. Intente de nuevo o use usuario y contraseña.';
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';
    const { email, password } = this.form.getRawValue();
    this.auth.login(email, password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/home']);
      },
      error: () => {
        this.loading = false;
        this.error = 'No se pudo iniciar sesión. Intente de nuevo.';
      },
    });
  }

  ssoLogin(): void {
    if (!this.auth.isSsoEnabled()) {
      this.error = 'SSO corporativo no está configurado en este entorno. Use usuario y contraseña.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.auth.ssoLogin();
  }
}
