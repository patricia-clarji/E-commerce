//protects routes that should only be accessible by admin users
import { CanActivateFn, CanActivateChildFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth';

// AdminGuard checks if the user is authenticated and has the 'admin' role.
export const adminGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/login'], {
      // after login, the app send them back to where they originally wanted to go.
      queryParams: { returnUrl: state.url },
    });
  }

  if (!auth.isAdmin()) {
    return router.createUrlTree(['/']);
  }

  return true;
};

export const adminChildGuard: CanActivateChildFn = (route, state) => adminGuard(route, state);
