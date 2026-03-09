import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { AuthService } from './auth';
import { AuthApi } from './auth-api';
import { CartService } from '../../shared/services/cart';

describe('AuthService', () => {
  let service: AuthService;

  const authApiMock = {
    getCurrentUser: vi.fn().mockReturnValue(of(null)),
    login: vi.fn(),
    register: vi.fn(),
    updateUser: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  const cookieMock = {
    get: vi.fn().mockReturnValue(''),
    set: vi.fn(),
    delete: vi.fn(),
  };

  const cartMock = {
    restoreForUser: vi.fn(),
    clearSession: vi.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: AuthApi, useValue: authApiMock },
        { provide: Router, useValue: routerMock },
        { provide: CookieService, useValue: cookieMock },
        { provide: CartService, useValue: cartMock },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should logout and clear session', () => {
    service.logout(false);

    expect(cartMock.clearSession).toHaveBeenCalled();
  });
});
