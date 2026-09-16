import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'sh-unauthorized',
  standalone: true,
  imports: [RouterLink, MatButtonModule],
  template: `
    <section class="unauthorized">
      <h1>Acceso denegado</h1>
      <p>No tienes permisos para ver esta sección. Contacta al administrador si necesitas acceso.</p>
      <a mat-flat-button color="primary" routerLink="/home">Volver al inicio</a>
    </section>
  `,
  styles: `
    .unauthorized {
      max-width: 32rem;
      margin: 4rem auto;
      text-align: center;
      display: grid;
      gap: 1rem;
    }
  `,
})
export class UnauthorizedComponent {}
