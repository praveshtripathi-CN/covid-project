import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-verify-signup',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2 class="heading">Verify signup OTP</h2>
    <p class="muted">Finish account creation by confirming your email.</p>

    <form [formGroup]="form" (ngSubmit)="submit()">
      <label>Email</label>
      <input type="email" formControlName="email" />

      <label>OTP</label>
      <input type="text" formControlName="otp" placeholder="6-digit code" />

      <button type="submit" [disabled]="form.invalid || loading()">Verify account</button>
    </form>

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
        background: linear-gradient(135deg, #22c55e, #16a34a);
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
export class VerifySignupComponent {
  loading = signal(false);
  message = signal('');
  error = signal('');

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    otp: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    route: ActivatedRoute
  ) {
    const email = route.snapshot.queryParamMap.get('email');
    if (email) {
      this.form.patchValue({ email });
    }
  }

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.message.set('');
    this.error.set('');

    const { email, otp } = this.form.getRawValue();
    if (!email || !otp) {
      this.loading.set(false);
      return;
    }

    this.auth.verifySignupOtp({ email, otp }).subscribe({
      next: (res) => {
        // Redirect immediately to login page after successful verification
        this.router.navigate(['/auth/login'], {
          queryParams: { email }
        });
      },
      error: (err) => {
        this.error.set(err.error?.message || 'OTP verification failed');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false)
    });
  }
}

