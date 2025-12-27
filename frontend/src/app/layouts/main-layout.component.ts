import { Component, computed, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { AuthService } from '../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgClass, NgIf],
  template: `
    <div class="app-shell">
      <header class="topbar">
        <div class="brand">
          <div class="logo">C19</div>
          <div class="meta">
            <p class="title">COVID-19 Dashboard</p>
            <p class="subtitle">Insightful analytics & data</p>
          </div>
        </div>
        <div class="actions">
          <span class="role" *ngIf="role() as r">Role: {{ r }}</span>
          <button class="ghost" (click)="auth.logout()">Logout</button>
        </div>
      </header>

      <div class="body">
        <nav class="sidebar">
          <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="exact">
            Overview
          </a>
          <a routerLink="/country-latest" routerLinkActive="active">Country Latest</a>
          <a routerLink="/worldometer" routerLinkActive="active">Worldometer</a>
          <a routerLink="/full-grouped" routerLinkActive="active">Full Grouped</a>
          <a routerLink="/day-wise" routerLinkActive="active">Day Wise</a>
          <a routerLink="/usa-county" routerLinkActive="active">USA County</a>
          <a routerLink="/clean-complete" routerLinkActive="active">Clean Complete</a>
        </nav>
        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      .app-shell {
        min-height: 100vh;
        background: #0f172a;
        color: #e2e8f0;
        display: flex;
        flex-direction: column;
      }

      .topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 24px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        position: sticky;
        top: 0;
        background: rgba(15, 23, 42, 0.9);
        backdrop-filter: blur(8px);
        z-index: 10;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .logo {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background: linear-gradient(135deg, #6366f1, #0ea5e9);
        display: grid;
        place-items: center;
        font-weight: 700;
      }

      .meta .title {
        margin: 0;
        font-size: 18px;
        font-weight: 700;
      }

      .meta .subtitle {
        margin: 0;
        font-size: 12px;
        color: #cbd5e1;
      }

      .actions {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .role {
        font-size: 13px;
        color: #a5b4fc;
      }

      .ghost {
        background: transparent;
        color: #e2e8f0;
        border: 1px solid rgba(226, 232, 240, 0.2);
        border-radius: 10px;
        padding: 8px 12px;
        cursor: pointer;
        transition: background 0.2s ease, border-color 0.2s ease;
      }

      .ghost:hover {
        background: rgba(226, 232, 240, 0.1);
        border-color: rgba(226, 232, 240, 0.4);
      }

      .body {
        display: grid;
        grid-template-columns: 240px 1fr;
        min-height: calc(100vh - 72px);
      }

      .sidebar {
        border-right: 1px solid rgba(255, 255, 255, 0.08);
        padding: 18px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        background: #0b1224;
      }

      .sidebar a {
        color: #cbd5e1;
        text-decoration: none;
        padding: 10px 12px;
        border-radius: 10px;
        transition: background 0.2s ease, color 0.2s ease;
      }

      .sidebar a.active,
      .sidebar a:hover {
        background: rgba(99, 102, 241, 0.15);
        color: #fff;
      }

      .content {
        padding: 20px 24px 40px;
      }

      @media (max-width: 900px) {
        .body {
          grid-template-columns: 1fr;
        }

        .sidebar {
          flex-direction: row;
          flex-wrap: wrap;
          border-right: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
      }
    `
  ]
})
export class MainLayoutComponent {
  exact = { exact: true };
  role = computed(() => this.auth.role());

  constructor(public auth: AuthService) {}
}

