import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import './locale/register-locale-data';

// sockjs-client expects Node-like `global`
(window as unknown as { global: unknown }).global = window;

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
