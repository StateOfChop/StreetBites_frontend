import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  // Si ya está logueado, redirigir al dashboard o home
  // TODO: Mejorar la redirección según rol (Service debería tener esta lógica)
  if (authService.isAdmin()) {
    return router.createUrlTree(['/admin']);
  }
  return router.createUrlTree(['/products']);
};
