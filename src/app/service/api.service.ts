import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

export type RankingFilter = 'weekly' | 'monthly' | 'all';

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

  getMatchById(id: string | number) {
  return this.http.get<any>(`${this.baseUrl}/matches/${id}`);
}

getUserBets(userId: number) {
  return this.http.get<any[]>(`${this.baseUrl}/bets/user/${userId}`);
}

 // Obtener notificaciones de usuario
  getNotifications(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/notifications/user/${userId}`);
  }

  // Obtener apuestas de un partido
  getBetsByMatch(matchId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/bets/match/${matchId}`);
  }

  // Sumar puntos a un usuario
  addPointsToUser(userId: number, points: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${userId}/add-points`, { points });
  }

  // Crear notificación
  createNotification(notif: { userId: number, message: string, read?: boolean, createdAt: Date }): Observable<any> {
    return this.http.post(`${this.baseUrl}/notifications`, notif);
  }

  // Actualizar stats de equipos tras partido
  updateTeamStats(home: string, away: string, homeScore: number, awayScore: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/teams/update-stats`, { home, away, homeScore, awayScore });
  }

  /** Obtener ranking global de usuarios */
  getRanking(filter: RankingFilter = 'all'): Observable<any[]> {
    // Si tu endpoint solo devuelve toda la lista, puedes filtrar en frontend
    return this.http.get<any[]>(`${this.baseUrl}/leaderboard`);
  }


}
