import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../services/auth.service';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'sh-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule, MatMenuModule, MatBadgeModule],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  private readonly auth = inject(AuthService);
  readonly user = this.auth.currentUser;

  readonly navItems: NavItem[] = [
    { label: 'Inicio', path: '/home', icon: 'home' },
    { label: 'Posiciones', path: '/positions', icon: 'work' },
    { label: 'Candidatos', path: '/candidates', icon: 'people' },
    { label: 'Cuestionarios', path: '/questionnaires', icon: 'quiz' },
    { label: 'Seguimiento', path: '/tracking', icon: 'timeline' },
    { label: 'Reportes', path: '/reports', icon: 'bar_chart' },
    { label: 'Configuraciones', path: '/settings', icon: 'settings' },
  ];

  logout(): void {
    this.auth.completeLogout();
  }
}
