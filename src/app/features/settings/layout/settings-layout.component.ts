import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface SettingsNavItem {
  label: string;
  path: string;
}

@Component({
  selector: 'sh-settings-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './settings-layout.component.html',
  styleUrl: './settings-layout.component.scss',
})
export class SettingsLayoutComponent {
  readonly navItems: SettingsNavItem[] = [
    { label: 'Usuarios', path: 'users' },
    { label: 'Grupos', path: 'groups' },
    { label: 'Catálogos', path: 'catalogs' },
    { label: 'Notificaciones', path: 'notifications' },
    { label: 'Documentos', path: 'documents' },
    { label: 'Prompts IA', path: 'prompts' },
    { label: 'CVs', path: 'cvs' },
    { label: 'Entrevistas', path: 'interviews' },
    { label: 'Etapas', path: 'pipeline-stages' },
    { label: 'Sistema', path: 'system' },
    { label: 'Bitácoras', path: 'audit' },
  ];
}
