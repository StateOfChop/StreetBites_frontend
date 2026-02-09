import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // Mostrar spinner antes de la petición
  loadingService.show();

  return next(req).pipe(
    finalize(() => {
      // Ocultar spinner cuando la petición termine (éxito o error)
      loadingService.hide();
    })
  );
};
