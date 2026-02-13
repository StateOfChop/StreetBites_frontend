import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/auth.models';

/**
 * Factory function para crear guard con roles específicos
 */
export function roleGuard(allowedRoles: UserRole[]): CanActivateFn {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.currentUser();

    if (!user) {
      return router.createUrlTree(['/auth/login']);
    }

    if (allowedRoles.includes(user.role)) {
      return true;
    }

    // Usuario sin permisos, redirigir según rol
    if (user.role === UserRole.ADMIN) {
      return router.createUrlTree(['/admin']);
    }
    return router.createUrlTree(['/products']);
  };
}

/**
 * Guard para rutas de solo ADMIN
 */
export const adminGuard: CanActivateFn = roleGuard([UserRole.ADMIN]);
