import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = 'https://api-futbol-gold.vercel.app/api';

  constructor(private http: HttpClient) {}

  // ===== AUTH =====

  login(email: string, password: string) {
    return this.http.post<any>(`${this.API_URL}/login`, {
      email,
      password
    }).pipe(
      tap(res => this.saveSession(res))
    );
  }

  register(username: string, email: string, password: string) {
    return this.http.post<any>(`${this.API_URL}/register`, {
      username,
      email,
      password
    }).pipe(
      tap(res => this.saveSession(res))
    );
  }

  logout() {
    localStorage.clear();
  }

  // ===== SESSION =====

  private saveSession(res: any) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
  }

  // ===== GETTERS =====

  get token(): string | null {
    return localStorage.getItem('token');
  }

  get user(): any | null {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }

  get userId(): number | null {
    return this.user?.id ?? null;
  }

  isLogged(): boolean {
    return !!this.token;
  }
}
