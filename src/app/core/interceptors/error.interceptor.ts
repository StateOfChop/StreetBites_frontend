import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error';

      switch (error.status) {
        case 401:
          // No autorizado - token inválido o expirado
          errorMessage = 'Sesión expirada. Por favor inicie sesión nuevamente.';
          authService.logout();
          break;

        case 403:
          // Sin permisos
          errorMessage = 'No tiene permisos para realizar esta acción.';
          router.navigate(['/']);
          break;

        case 404:
          // No encontrado
          errorMessage = 'El recurso solicitado no fue encontrado.';
          break;

        case 500:
          // Error del servidor
          errorMessage = 'Error del servidor. Por favor intente más tarde.';
          break;

        default:
          // Obtener mensaje del backend si existe
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
      }

      // Emitir error con mensaje procesado
      return throwError(() => ({ ...error, userMessage: errorMessage }));
    })
  );
};
