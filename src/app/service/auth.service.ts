import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, from, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = 'https://api-futbol-app.vercel.app/api';
  private _user: any = null;
  private _token: string | null = null;

  constructor(private http: HttpClient) {}

  // auth

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, { email, password }).pipe(
      switchMap(res => this.saveSession(res))
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/register`, { username, email, password }).pipe(
      switchMap(res => this.saveSession(res))
    );
  }

  logout(): Promise<void> {
    this._user = null;
    this._token = null;
    return Preferences.remove({ key: 'auth' });
  }

  // guardar sesion
  private saveSession(res: any): Observable<any> {
    this._user = res.user;
    this._token = res.token;
    return from(
      Preferences.set({
        key: 'auth',
        value: JSON.stringify({ token: this._token, user: this._user })
      })
    ).pipe(map(() => res.user));
  }

// cargar sesion
  async loadSession(): Promise<void> {
    const result = await Preferences.get({ key: 'auth' });
    if (result.value) {
      const data = JSON.parse(result.value);
      this._token = data.token;
      this._user = data.user;
    }
  }

  get token(): string | null {
    return this._token;
  }

  get user(): any | null {
    return this._user;
  }

  get userId(): number | null {
    return this._user?.id ?? null;
  }

  isLogged(): boolean {
    return !!this._token && !!this._user;
  }
}