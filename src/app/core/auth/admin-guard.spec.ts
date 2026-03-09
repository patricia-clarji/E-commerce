import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { vi } from 'vitest';

import { adminGuard } from './admin-guard';
import { AuthService } from './auth';

describe('adminGuard', () => {
  let authMock: {
    isAuthenticated: ReturnType<typeof vi.fn>;
    isAdmin: ReturnType<typeof vi.fn>;
  };

  let routerMock: {
    createUrlTree: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    authMock = {
      isAuthenticated: vi.fn(),
      isAdmin: vi.fn(),
    };

    routerMock = {
      createUrlTree: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  it('redirects guest users to login', () => {
    const tree = {} as UrlTree;

    authMock.isAuthenticated.mockReturnValue(false);
    routerMock.createUrlTree.mockReturnValue(tree);

    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as any, { url: '/admin' } as any)
    );

    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/admin' },
    });
    expect(result).toBe(tree);
  });

  it('redirects non-admin users to home', () => {
    const tree = {} as UrlTree;

    authMock.isAuthenticated.mockReturnValue(true);
    authMock.isAdmin.mockReturnValue(false);
    routerMock.createUrlTree.mockReturnValue(tree);

    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as any, { url: '/admin' } as any)
    );

    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/']);
    expect(result).toBe(tree);
  });

  it('allows admin users', () => {
    authMock.isAuthenticated.mockReturnValue(true);
    authMock.isAdmin.mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as any, { url: '/admin' } as any)
    );

    expect(result).toBe(true);
  });
});
