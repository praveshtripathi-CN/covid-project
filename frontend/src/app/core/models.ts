export interface AuthResponse {
  token: string;
  role: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // zero-based page index
  size: number;
}

export interface ApiError {
  message: string;
}

export interface OtpPayload {
  email: string;
  otp: string;
}

