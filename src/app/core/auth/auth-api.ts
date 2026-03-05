import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../enviroments/enviroment';
import { User } from '../../shared/interfaces/user';

export type AuthResponse = { token: string; user: User };
export type CheckResponse = { valid: boolean };
export type LoginPayload = { email: string; password: string };

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private readonly http = inject(HttpClient);

  // your env already includes /api at the end
  private readonly base = environment.apiBaseUrl ?? '/api';

  async register(formData: FormData): Promise<AuthResponse> {
    return await firstValueFrom(
      this.http.post<AuthResponse>(`${this.base}/auth/register`, formData)
    ).catch(this.handle);
  }

  async login(payload: LoginPayload): Promise<AuthResponse> {
    return await firstValueFrom(
      this.http.post<AuthResponse>(`${this.base}/auth/login`, payload, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
    ).catch(this.handle);
  }

  async check(): Promise<CheckResponse> {
    return await firstValueFrom(
      this.http.post<CheckResponse>(`${this.base}/auth/check`, {})
    ).catch(this.handle);
  }

  async getMe(): Promise<User> {
    return await firstValueFrom(this.http.get<User>(`${this.base}/user`)).catch(this.handle);
  }

  async updateMe(formData: FormData): Promise<User> {
    return await firstValueFrom(this.http.patch<User>(`${this.base}/user`, formData)).catch(
      this.handle
    );
  }

  async deleteMe(): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${this.base}/user`)).catch(this.handle);
  }

  private handle(err: unknown): never {
    const e = err as HttpErrorResponse;

    const body: any = (e as any)?.error ?? {};
    const message =
      body?.message ||
      (typeof body === 'string' ? body : '') ||
      (e as any)?.message ||
      'Request failed';

    const errors: string[] = Array.isArray(body?.errors) ? body.errors : [];
    const details = errors.length ? ` (${errors.join(', ')})` : '';

    throw new Error(`${message}${details}`);
  }
}