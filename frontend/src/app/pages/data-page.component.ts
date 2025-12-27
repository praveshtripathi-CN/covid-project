import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../core/api.service';
import { PageResponse } from '../core/models';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../core/auth.service';

interface RouteData {
  title: string;
  endpoint: string;
  keywordLabel?: string;
}

@Component({
  standalone: true,
  selector: 'app-data-page',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <div>
        <p class="label">Dataset</p>
        <h2>{{ title }}</h2>
        <p class="hint">Live data served from the backend with pagination.</p>
      </div>
      <div class="controls">
        <label>
          Page size
          <select [(ngModel)]="pageSize" (change)="load()">
            <option [value]="5">5</option>
            <option [value]="10">10</option>
            <option [value]="25">25</option>
          </select>
        </label>
      </div>
    </div>

    <div class="toolbar">
      <input
        type="text"
        [(ngModel)]="keyword"
        [placeholder]="keywordLabel || 'Search keyword...'"
        (keyup.enter)="load()"
      />
      <select [(ngModel)]="sortBy" (change)="load()">
        <option *ngFor="let col of columns()" [value]="col">{{ col }}</option>
      </select>
      <select [(ngModel)]="sortDir" (change)="load()">
        <option value="asc">Asc</option>
        <option value="desc">Desc</option>
      </select>
      <button (click)="load()" [disabled]="loading()">Refresh</button>
      <button
        *ngIf="isAdmin()"
        class="success"
        (click)="openCreateModal()"
        [disabled]="loading()"
      >
        Create New
      </button>
    </div>

    <div class="notice error" *ngIf="error()">{{ error() }}</div>

    <div class="table-wrapper" *ngIf="!loading()">
      <table *ngIf="rows().length; else empty">
        <thead>
          <tr>
            <th *ngFor="let col of columns()">{{ col }}</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of rows()">
            <td *ngFor="let col of columns()">
              {{ formatValue(row[col]) }}
            </td>
            <td>
              <button class="ghost" (click)="select(row)">Details</button>
              <button
                class="primary"
                *ngIf="isAdmin()"
                (click)="openUpdateModal(row)"
                [disabled]="!row.id || saving()"
              >
                Update
              </button>
              <button
                class="danger"
                *ngIf="isAdmin()"
                (click)="deleteRow(row.id)"
                [disabled]="!row.id || deleting()"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <button (click)="prev()" [disabled]="page === 0">Prev</button>
      <span>Page {{ page + 1 }} of {{ totalPages }}</span>
      <button (click)="next()" [disabled]="page + 1 >= totalPages">Next</button>
    </div>

    <div class="detail" *ngIf="selected()">
      <p class="label">Selected row</p>
      <pre>{{ selected() | json }}</pre>
    </div>

    <!-- Create/Update Modal -->
    <div class="modal-overlay" *ngIf="showModal()" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ editingRow() ? 'Update Record' : 'Create New Record' }}</h3>
          <button class="close-btn" (click)="closeModal()">×</button>
        </div>
        <div class="modal-body">
          <div *ngFor="let col of editableColumns()" class="form-field">
            <label>{{ col }}</label>
            <input
              *ngIf="!isComplexField(formData()[col])"
              type="text"
              [ngModel]="formatFormValue(formData()[col])"
              (ngModelChange)="updateFormField(col, $event)"
              [placeholder]="col"
            />
            <textarea
              *ngIf="isComplexField(formData()[col])"
              [ngModel]="formatFormValue(formData()[col])"
              (ngModelChange)="updateFormField(col, $event)"
              [placeholder]="col"
              rows="3"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="ghost" (click)="closeModal()">Cancel</button>
          <button class="success" (click)="saveRecord()" [disabled]="saving()">
            {{ saving() ? 'Saving...' : (editingRow() ? 'Update' : 'Create') }}
          </button>
        </div>
      </div>
    </div>

    <ng-template #empty>
      <div class="empty">No data found.</div>
    </ng-template>
  `,
  styles: [
    `
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }
      .label {
        margin: 0;
        color: #a5b4fc;
        font-size: 12px;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      h2 {
        margin: 4px 0;
      }
      .hint {
        margin: 0;
        color: #cbd5e1;
      }
      .controls select {
        padding: 8px;
        border-radius: 10px;
        background: #0b1224;
        color: #e2e8f0;
        border: 1px solid rgba(255, 255, 255, 0.08);
      }
      .toolbar {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        margin-bottom: 12px;
      }
      .toolbar input,
      .toolbar select {
        padding: 10px 12px;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: #0f172a;
        color: #e2e8f0;
      }
      .toolbar button,
      .pagination button {
        background: linear-gradient(135deg, #6366f1, #0ea5e9);
        color: #fff;
        border: none;
        border-radius: 10px;
        padding: 10px 12px;
        cursor: pointer;
      }
      .table-wrapper {
        overflow-x: auto;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        margin-bottom: 10px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        min-width: 600px;
      }
      th,
      td {
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      }
      th {
        color: #cbd5e1;
        background: rgba(255, 255, 255, 0.02);
      }
      .pagination {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 10px 0 16px;
      }
      .detail pre {
        background: #0b1224;
        padding: 12px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: #e2e8f0;
      }
      .ghost {
        background: rgba(255, 255, 255, 0.06);
        border: none;
        color: #e2e8f0;
        border-radius: 8px;
        padding: 6px 10px;
        cursor: pointer;
        margin-right: 6px;
      }
      .success {
        background: linear-gradient(135deg, #22c55e, #16a34a);
        color: #fff;
        border: none;
        border-radius: 8px;
        padding: 6px 10px;
        cursor: pointer;
      }
      .primary {
        background: rgba(99, 102, 241, 0.2);
        border: 1px solid rgba(99, 102, 241, 0.4);
        color: #a5b4fc;
        border-radius: 8px;
        padding: 6px 10px;
        cursor: pointer;
        margin-right: 6px;
      }
      .danger {
        background: rgba(248, 113, 113, 0.2);
        border: 1px solid rgba(248, 113, 113, 0.4);
        color: #fecaca;
        border-radius: 8px;
        padding: 6px 10px;
        cursor: pointer;
      }
      .empty {
        padding: 14px;
        color: #cbd5e1;
      }
      .notice.error {
        padding: 10px 12px;
        border-radius: 10px;
        background: rgba(248, 113, 113, 0.15);
        color: #f87171;
        margin-bottom: 12px;
      }
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }
      .modal-content {
        background: #0f172a;
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        width: 90%;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
      }
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .modal-header h3 {
        margin: 0;
      }
      .close-btn {
        background: transparent;
        border: none;
        color: #e2e8f0;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .modal-body {
        padding: 20px;
      }
      .form-field {
        margin-bottom: 16px;
      }
      .form-field label {
        display: block;
        margin-bottom: 6px;
        color: #a5b4fc;
        font-size: 13px;
      }
      .form-field input,
      .form-field textarea {
        width: 100%;
        padding: 10px 12px;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: #0b1224;
        color: #e2e8f0;
        font-family: inherit;
      }
      .form-field textarea {
        resize: vertical;
      }
      .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        padding: 16px 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
    `
  ]
})
export class DataPageComponent implements OnInit {
  title = '';
  endpoint = '';
  keywordLabel = '';

  page = 0;
  pageSize = 10;
  sortBy = 'id';
  sortDir: 'asc' | 'desc' = 'asc';
  keyword = '';

  totalPages = 1;

  loading = signal(false);
  deleting = signal(false);
  saving = signal(false);
  error = signal('');
  rows = signal<any[]>([]);
  columns = signal<string[]>([]);
  selected = signal<any | null>(null);
  showModal = signal(false);
  editingRow = signal<any | null>(null);
  formData = signal<any>({});

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const data = this.route.snapshot.data as RouteData;
    this.title = data.title;
    this.endpoint = data.endpoint;
    this.keywordLabel = data.keywordLabel || 'Search keyword...';
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set('');
    
    // Worldometer endpoint uses 'country' parameter instead of 'keyword'
    const isWorldometer = this.endpoint.includes('/worldometer/');
    const searchParam = isWorldometer ? { country: this.keyword } : { keyword: this.keyword };
    
    this.api
      .getPage<any>(this.endpoint, {
        page: this.page,
        size: this.pageSize,
        sortBy: this.sortBy,
        sortDir: this.sortDir,
        ...searchParam
      })
      .subscribe({
        next: (res: PageResponse<any>) => {
          this.rows.set(res.content || []);
          this.totalPages = res.totalPages || 1;
          const cols = res.content?.length
            ? Object.keys(res.content[0]).slice(0, 8)
            : this.columns();
          this.columns.set(cols.length ? cols : ['id']);
          if (!cols.includes(this.sortBy)) {
            this.sortBy = cols[0] || 'id';
          }
        },
        error: (err) =>
          this.error.set(err.error?.message || 'Failed to load data'),
        complete: () => this.loading.set(false)
      });
  }

  prev() {
    if (this.page === 0) return;
    this.page -= 1;
    this.load();
  }

  next() {
    if (this.page + 1 >= this.totalPages) return;
    this.page += 1;
    this.load();
  }

  select(row: any) {
    this.selected.set(row);
  }

  deleteRow(id: any) {
    if (!id) return;
    this.deleting.set(true);
    this.api.delete(`${this.endpoint}/${id}`).subscribe({
      next: () => this.load(),
      error: (err) =>
        this.error.set(err.error?.message || 'Delete failed (admin only)'),
      complete: () => this.deleting.set(false)
    });
  }

  formatValue(value: any) {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return value;
  }

  isAdmin() {
    return this.auth.role() === 'ROLE_ADMIN';
  }

  openCreateModal() {
    this.editingRow.set(null);
    const emptyData: any = {};
    this.columns().forEach(col => {
      emptyData[col] = '';
    });
    this.formData.set(emptyData);
    this.showModal.set(true);
  }

  openUpdateModal(row: any) {
    this.editingRow.set(row);
    const data: any = { ...row };
    this.formData.set(data);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingRow.set(null);
    this.formData.set({});
  }

  saveRecord() {
    if (this.saving()) return;
    
    this.saving.set(true);
    this.error.set('');

    const data: any = {};
    const formData = this.formData();
    
    // Process form data - convert strings to appropriate types
    this.editableColumns().forEach(col => {
      const value = formData[col];
      if (value === '' || value === null || value === undefined) {
        // Skip empty values or set to null
        data[col] = null;
      } else if (this.isComplexField(value)) {
        // Try to parse JSON if it's a string representation of an object
        try {
          data[col] = typeof value === 'string' ? JSON.parse(value) : value;
        } catch {
          data[col] = value;
        }
      } else {
        // Try to convert to number if it looks like a number
        const numValue = Number(value);
        data[col] = !isNaN(numValue) && value !== '' ? numValue : value;
      }
    });

    // For update, include the id
    if (this.editingRow()?.id) {
      data.id = this.editingRow().id;
    }

    const isEditing = !!this.editingRow();
    const baseEndpoint = this.endpoint.replace('/page', '');
    const endpoint = isEditing 
      ? `${baseEndpoint}/${this.editingRow()?.id}`
      : baseEndpoint;

    const request = isEditing
      ? this.api.update(endpoint, data)
      : this.api.create(endpoint, data);

    request.subscribe({
      next: () => {
        this.closeModal();
        this.load();
      },
      error: (err) => {
        this.error.set(err.error?.message || `Failed to ${isEditing ? 'update' : 'create'} record`);
        this.saving.set(false);
      },
      complete: () => this.saving.set(false)
    });
  }

  editableColumns(): string[] {
    // Exclude id from editable columns (it's auto-generated for create)
    return this.columns().filter(col => col !== 'id' || this.editingRow());
  }

  isComplexField(value: any): boolean {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  formatFormValue(value: any): string {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  }

  updateFormField(field: string, value: string) {
    const currentData = { ...this.formData() };
    currentData[field] = value;
    this.formData.set(currentData);
  }
}

