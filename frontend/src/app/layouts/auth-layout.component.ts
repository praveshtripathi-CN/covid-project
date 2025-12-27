import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-auth-layout',
  imports: [RouterOutlet, RouterLink, NgClass],
  template: `
    <div class="auth-shell">
      <div class="brand">
        <div class="logo">C19</div>
        <div class="meta">
          <p class="title">COVID-19 Intelligence</p>
          <p class="subtitle">Secure access with OTP</p>
        </div>
      </div>
      <div class="panel">
        <router-outlet></router-outlet>
      </div>
      <div class="links">
        <a routerLink="/auth/login" routerLinkActive="active">Login</a>
        <a routerLink="/auth/signup" routerLinkActive="active">Sign up</a>
      </div>
    </div>
  `,
  styles: [
    `
      .auth-shell {
        min-height: 100vh;
        display: grid;
        grid-template-rows: auto 1fr auto;
        background: radial-gradient(circle at 10% 20%, #e6f4ff 0, transparent 25%),
          radial-gradient(circle at 90% 10%, #e9d5ff 0, transparent 18%),
          linear-gradient(135deg, #0f172a, #0b1a2f 60%, #0f172a);
        color: #e2e8f0;
        padding: 32px 16px;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0 auto 24px auto;
      }

      .logo {
        width: 48px;
        height: 48px;
        border-radius: 16px;
        background: linear-gradient(135deg, #06b6d4, #2563eb);
        display: grid;
        place-items: center;
        font-weight: 700;
        letter-spacing: 1px;
      }

      .meta .title {
        margin: 0;
        font-size: 18px;
        font-weight: 700;
      }

      .meta .subtitle {
        margin: 0;
        color: #cbd5e1;
        font-size: 13px;
      }

      .panel {
        margin: 0 auto;
        width: min(540px, 95vw);
        background: #0b1224;
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 18px;
        padding: 24px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      }

      .links {
        display: flex;
        justify-content: center;
        gap: 16px;
        margin-top: 18px;
      }

      .links a {
        color: #cbd5e1;
        text-decoration: none;
        font-weight: 600;
        padding: 6px 10px;
        border-radius: 8px;
      }

      .links a.active {
        background: rgba(99, 102, 241, 0.15);
        color: #fff;
      }

      @media (max-width: 640px) {
        .panel {
          padding: 18px;
        }
      }
    `
  ]
})
export class AuthLayoutComponent {}

