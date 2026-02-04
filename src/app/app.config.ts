import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { CORE_PROVIDERS } from './core/core.providers';
import { SharedModule } from './shared/shared.imports';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    ...CORE_PROVIDERS
  ]
};
