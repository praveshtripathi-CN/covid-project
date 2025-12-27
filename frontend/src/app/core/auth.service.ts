import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthResponse, OtpPayload } from './models';

interface Credentials {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'covid19_token';
  private readonly roleKey = 'covid19_role';

  token = signal<string | null>(this.readToken());
  role = signal<string | null>(this.readRole());

  constructor(private http: HttpClient, private router: Router) {}

  signup(payload: Credentials) {
    return this.http.post(`${environment.apiBaseUrl}/auth/signup`, payload, {
      responseType: 'text'
    });
  }

  verifySignupOtp(payload: OtpPayload) {
    return this.http.post(
      `${environment.apiBaseUrl}/auth/verify-signup-otp`,
      payload,
      { responseType: 'text' }
    );
  }

  login(payload: Credentials) {
    return this.http.post(`${environment.apiBaseUrl}/auth/login`, payload, {
      responseType: 'text'
    });
  }

  verifyLoginOtp(payload: OtpPayload) {
    return this.http.post<AuthResponse>(
      `${environment.apiBaseUrl}/auth/verify-login-otp`,
      payload
    );
  }

  saveSession(auth: AuthResponse) {
    localStorage.setItem(this.tokenKey, auth.token);
    localStorage.setItem(this.roleKey, auth.role);
    this.token.set(auth.token);
    this.role.set(auth.role);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    this.token.set(null);
    this.role.set(null);
    this.router.navigate(['/auth/login']);
  }

  private readToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private readRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }
}

