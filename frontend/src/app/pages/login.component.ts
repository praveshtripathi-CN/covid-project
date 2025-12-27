import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <h2 class="heading">Login</h2>
    <p class="muted">
      Enter your email and password to receive a one-time login OTP.
    </p>

    <form [formGroup]="form" (ngSubmit)="submit()">
      <label>Email</label>
      <input type="email" formControlName="email" placeholder="user@domain.com" />
      <div class="error" *ngIf="form.controls.email.touched && form.controls.email.invalid">
        Email is required and must be valid.
      </div>

      <label>Password</label>
      <input type="password" formControlName="password" placeholder="••••••••" />
      <div class="error" *ngIf="form.controls.password.touched && form.controls.password.invalid">
        Password is required.
      </div>

      <button type="submit" [disabled]="form.invalid || loading()">Send OTP</button>
    </form>

    <p class="muted small">
      Don't have an account?
      <a routerLink="/auth/signup">Create one</a>
    </p>

    <div class="notice success" *ngIf="message()">{{ message() }}</div>
    <div class="notice error" *ngIf="error()">{{ error() }}</div>
  `,
  styles: [
    `
      .heading {
        margin: 0 0 6px;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin: 18px 0;
      }

      label {
        font-size: 13px;
        color: #cbd5e1;
      }

      input {
        padding: 10px 12px;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: #0f172a;
        color: #e2e8f0;
      }

      input:focus {
        outline: 2px solid rgba(99, 102, 241, 0.6);
      }

      button {
        margin-top: 6px;
        background: linear-gradient(135deg, #6366f1, #0ea5e9);
        color: #fff;
        border: none;
        border-radius: 10px;
        padding: 12px;
        font-weight: 700;
        cursor: pointer;
        transition: opacity 0.2s ease;
      }

      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .muted {
        color: #cbd5e1;
        margin: 0;
      }

      .muted.small {
        font-size: 13px;
      }

      .error {
        color: #fca5a5;
        font-size: 12px;
      }

      .notice {
        padding: 10px 12px;
        border-radius: 10px;
        margin-top: 12px;
      }

      .notice.success {
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
      }

      .notice.error {
        background: rgba(248, 113, 113, 0.15);
        color: #f87171;
      }
    `
  ]
})
export class LoginComponent {
  loading = signal(false);
  message = signal('');
  error = signal('');

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.message.set('');
    this.error.set('');

    const { email, password } = this.form.getRawValue();
    if (!email || !password) {
      this.loading.set(false);
      return;
    }

    this.auth.login({ email, password }).subscribe({
      next: (text) => {
        this.message.set(text || 'OTP sent. Check your email.');
        this.router.navigate(['/auth/login/verify'], {
          queryParams: { email }
        });
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Login failed');
      },
      complete: () => this.loading.set(false)
    });
  }
}

