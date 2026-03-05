import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth/auth';
import { ToastService } from '../../shared/services/toast';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  file: File | null = null;
  error = '';
  readonly loading = signal(false);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    dateOfBirth: [''],
  });

  onFile(ev: Event) {
    const input = ev.target as HTMLInputElement;
    this.file = input.files?.[0] ?? null;
  }

  async submit() {
    this.error = '';
    this.form.markAllAsTouched();
    if (this.form.invalid || this.loading()) return;

    const v = this.form.getRawValue();
    const formData = new FormData();

    formData.append('email', v.email.trim());
    formData.append('firstName', v.firstName.trim());
    formData.append('lastName', v.lastName.trim());
    formData.append('username', v.username.trim());
    formData.append('password', v.password);
    if (v.dateOfBirth) formData.append('dateOfBirth', v.dateOfBirth);
    // role optional, default backend usually user
    // formData.append('role','user');

    if (this.file) formData.append('file', this.file);

    this.loading.set(true);
    try {
      await this.auth.register(formData);
      this.toast.success('Account created');
      // ✅ redirect behavior
      this.router.navigate(['/']);
    } catch (e: any) {
      this.error = e?.message ?? 'Registration failed';
      this.toast.error('Registration failed', this.error);
    } finally {
      this.loading.set(false);
    }
  }
}