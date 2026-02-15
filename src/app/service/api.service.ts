import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {

  private baseUrl = 'https://api-futbol-app.vercel.app/api';
  // local: http://localhost:3000/api

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  private headers(): HttpHeaders {
    const token = this.auth.token;
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  // MATCHES
  getMatches(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/matches`);
  }

  // BET
  placeBet(data: {
    userId: number;
    matchId: number;
    homeScore: number;
    awayScore: number;
  }) {
    return this.http.post(
      `${this.baseUrl}/bets`,
      data,
      { headers: this.headers() }
    );
  }

  // AUTH
  login(email: string, password: string) {
    return this.http.post(`${this.baseUrl}/login`, { email, password });
  }

  register(data: any) {
    return this.http.post(`${this.baseUrl}/register`, data);
  }
}
