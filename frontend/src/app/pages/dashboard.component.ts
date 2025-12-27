import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { firstValueFrom } from 'rxjs';

interface SummaryCard {
  title: string;
  value: string;
  hint: string;
}

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="grid">
      <div class="card" *ngFor="let card of cards()">
        <p class="label">{{ card.title }}</p>
        <h3>{{ card.value }}</h3>
        <p class="hint">{{ card.hint }}</p>
      </div>
    </div>

    <div class="panels">
      <div class="panel">
        <div class="panel-header">
          <div>
            <p class="label">Data explorer</p>
            <h3>Quick access</h3>
          </div>
        </div>
        <div class="link-grid">
          <a routerLink="/country-latest">Country Latest</a>
          <a routerLink="/worldometer">Worldometer</a>
          <a routerLink="/full-grouped">Full Grouped</a>
          <a routerLink="/day-wise">Day Wise</a>
          <a routerLink="/usa-county">USA County</a>
          <a routerLink="/clean-complete">Clean Complete</a>
        </div>
      </div>

      <div class="panel secondary">
        <p class="label">Need admin actions?</p>
        <p class="hint">
          Create, update and delete endpoints require ADMIN role. Use the same
          login flow; the UI will expose dangerous actions only when your role is
          ADMIN.
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 14px;
        margin-bottom: 18px;
      }

      .card {
        padding: 16px;
        border-radius: 14px;
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), #0b1224);
        border: 1px solid rgba(255, 255, 255, 0.08);
      }

      .label {
        margin: 0;
        color: #a5b4fc;
        font-size: 12px;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }

      h3 {
        margin: 6px 0;
      }

      .hint {
        margin: 0;
        color: #cbd5e1;
        font-size: 13px;
      }

      .panels {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 16px;
      }

      .panel {
        background: #0b1224;
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        padding: 16px;
      }

      .panel.secondary {
        background: linear-gradient(135deg, rgba(34, 197, 94, 0.12), #0b1224);
      }

      .panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 14px;
      }

      .link-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 10px;
      }

      .link-grid a {
        display: block;
        padding: 12px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.04);
        color: #e2e8f0;
        text-decoration: none;
        border: 1px solid transparent;
      }

      .link-grid a:hover {
        border-color: rgba(99, 102, 241, 0.6);
      }

      @media (max-width: 900px) {
        .panels {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class DashboardComponent implements OnInit {
  cards = signal<SummaryCard[]>([
    { title: 'Country Latest', value: 'Loading...', hint: '' },
    { title: 'Worldometer', value: 'Loading...', hint: '' },
    { title: 'Day Wise', value: 'Loading...', hint: '' },
    { title: 'USA County', value: 'Loading...', hint: '' }
  ]);

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadCounts();
  }

  private loadCounts() {
    // Use small page fetches to derive counts
    Promise.all([
      firstValueFrom(this.api.getPage<any>('/api/country-latest/page', { size: 1 })),
      firstValueFrom(this.api.getPage<any>('/api/worldometer/page', { size: 1 })),
      firstValueFrom(this.api.getPage<any>('/api/daywise/page', { size: 1 })),
      firstValueFrom(this.api.getPage<any>('/api/usa-county/page', { size: 1 }))
    ])
      .then(([c1, c2, c3, c4]) => {
        this.cards.set([
          {
            title: 'Country Latest',
            value: c1?.totalElements != null ? `${c1.totalElements}` : '—',
            hint: 'Total records'
          },
          {
            title: 'Worldometer',
            value: c2?.totalElements != null ? `${c2.totalElements}` : '—',
            hint: 'Total records'
          },
          {
            title: 'Day Wise',
            value: c3?.totalElements != null ? `${c3.totalElements}` : '—',
            hint: 'Total records'
          },
          {
            title: 'USA County',
            value: c4?.totalElements != null ? `${c4.totalElements}` : '—',
            hint: 'Total records'
          }
        ]);
      })
      .catch((error) => {
        console.error('Failed to load dashboard data:', error);
        this.cards.set([
          { title: 'Country Latest', value: 'N/A', hint: 'Failed to load' },
          { title: 'Worldometer', value: 'N/A', hint: 'Failed to load' },
          { title: 'Day Wise', value: 'N/A', hint: 'Failed to load' },
          { title: 'USA County', value: 'N/A', hint: 'Failed to load' }
        ]);
      });
  }
}

