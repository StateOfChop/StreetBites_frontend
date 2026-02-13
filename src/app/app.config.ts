import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { CORE_PROVIDERS } from './core/core.providers';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([
      loadingInterceptor,  // Primero para que muestre spinner antes de todo
      authInterceptor,     // Agrega token a cada petición
      errorInterceptor     // Maneja errores al final
    ])),
    ...CORE_PROVIDERS
  ]
};
