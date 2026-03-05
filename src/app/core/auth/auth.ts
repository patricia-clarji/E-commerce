import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

import { AuthApi } from './auth-api';
import { User } from '../../shared/interfaces/user';

const TOKEN_KEY = 'nx_token';
const USER_KEY = 'nx_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(AuthApi);
  private readonly router = inject(Router);

  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // SSR-safe initial state
  readonly token = signal<string | null>(this.isBrowser ? this.loadToken() : null);
  readonly user = signal<User | null>(this.isBrowser ? this.loadUser() : null);

  // keep both styles supported:
  // - templates call auth.isAuthenticated()
  // - other code can use auth.isAuthenticatedComputed()
  readonly isAuthenticatedComputed = computed(() => !!this.token());
  readonly isAdminComputed = computed(() => (this.user()?.role ?? 'user') === 'admin');

  constructor() {
    if (!this.isBrowser) return;

    // persist
    effect(() => {
      const t = this.token();
      if (t) localStorage.setItem(TOKEN_KEY, t);
      else localStorage.removeItem(TOKEN_KEY);
    });

    effect(() => {
      const u = this.user();
      if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
      else localStorage.removeItem(USER_KEY);
    });
  }

  // ✅ keep your existing calling style
  isAuthenticated(): boolean {
    return this.isAuthenticatedComputed();
  }

  isAdmin(): boolean {
    return this.isAdminComputed();
  }

  // ✅ interceptor uses this
  getToken(): string | null {
    return this.token();
  }

  async login(email: string, password: string): Promise<User> {
    const res = await this.api.login({ email, password });
    this.setSession(res.token, res.user);
    return res.user;
  }

  async register(formData: FormData): Promise<User> {
    const res = await this.api.register(formData);
    this.setSession(res.token, res.user);
    return res.user;
  }

  async checkToken(): Promise<boolean> {
    if (!this.token()) return false;
    try {
      const res = await this.api.check();
      return !!res.valid;
    } catch {
      this.logout(false);
      return false;
    }
  }

  async refreshMe(): Promise<User> {
    const me = await this.api.getMe();
    this.user.set(me);
    return me;
  }

  async updateProfile(formData: FormData): Promise<User> {
    const updated = await this.api.updateMe(formData);
    this.user.set(updated);
    return updated;
  }

  async deleteAccount(): Promise<void> {
    await this.api.deleteMe();
    this.logout();
  }

  logout(navigate = true) {
    this.token.set(null);
    this.user.set(null);
    if (navigate) this.router.navigate(['/login']);
  }

  private setSession(token: string, user: User) {
    this.token.set(token);
    this.user.set(user);
  }

  private loadToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private loadUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }
}