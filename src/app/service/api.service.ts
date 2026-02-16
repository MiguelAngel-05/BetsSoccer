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

  // matches
  getMatches(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/matches`);
  }

  // bet
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

  // auth
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

 // obtener notis de un user
  getNotifications(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/notifications/user/${userId}`);
  }

  // obtener apuestas
  getBetsByMatch(matchId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/bets/match/${matchId}`);
  }

  // sumar puntos
  addPointsToUser(userId: number, points: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${userId}/add-points`, { points });
  }

  // crear notificacion
  createNotification(notif: { userId: number, message: string, read?: boolean, createdAt: Date }): Observable<any> {
    return this.http.post(`${this.baseUrl}/notifications`, notif);
  }

  // actualizar statss
  updateTeamStats(home: string, away: string, homeScore: number, awayScore: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/teams/update-stats`, { home, away, homeScore, awayScore });
  }

  // rank global
  getRanking(filter: RankingFilter = 'all'): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/leaderboard`);
  }

  getStandings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/league/standings`);
  }

  // actu usuario
  updateUser(userId: number, data: any) {
    const token = this.auth.token;
    return this.http.put(`${this.baseUrl}/users/${userId}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // obtener msg
getMessages(matchId: number) {
  return this.http.get<any[]>(`${this.baseUrl}/messages/${matchId}`);
}

// enviar msg
sendMessage(payload: { matchId: number, username: string, text: string }) {
  return this.http.post<any>(`${this.baseUrl}/messages`, payload);
}

}
