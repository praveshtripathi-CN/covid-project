import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { PageResponse } from './models';
import { AuthService } from './auth.service';
import { catchError, throwError, EMPTY } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  getPage<T>(
    path: string,
    options: {
      page?: number;
      size?: number;
      sortBy?: string;
      sortDir?: 'asc' | 'desc';
      keyword?: string;
      country?: string;
    } = {}
  ) {
    let params = new HttpParams();
    const entries = Object.entries(options).filter(
      ([, value]) => value !== undefined && value !== null && value !== ''
    );
    entries.forEach(([key, value]) => {
      params = params.set(key, `${value}`);
    });

    return this.http.get<PageResponse<T>>(
      `${environment.apiBaseUrl}${path}`,
      { params }
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  delete(path: string) {
    return this.http.delete(`${environment.apiBaseUrl}${path}`, {
      responseType: 'text'
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  create<T>(path: string, data: T) {
    return this.http.post<T>(`${environment.apiBaseUrl}${path}`, data).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  update<T>(path: string, data: T) {
    return this.http.put<T>(`${environment.apiBaseUrl}${path}`, data).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  getById<T>(path: string) {
    return this.http.get<T>(`${environment.apiBaseUrl}${path}`).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  private handleError(error: any) {
    if (error.status === 403) {
      this.auth.logout();
      return EMPTY; // or throwError, but EMPTY prevents further handling
    }
    return throwError(() => error);
  }
}

