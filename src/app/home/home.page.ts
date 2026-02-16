import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { AuthService } from '../service/auth.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule]
})
export class HomePage implements OnInit, OnDestroy {

  matches: any[] = [];
  filteredMatches: any[] = [];
  userBets: any[] = [];
  search = '';
  filter: 'all' | 'live' | 'pending' | 'finished' = 'all';
  private refreshSub?: Subscription;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private toast: ToastController,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadMatches();
    this.loadUserBets();
    this.loadUserNotifications();
    this.refreshSub = interval(5000).subscribe(() => this.updateLiveMatches());
  }

  ngOnDestroy() {
    this.refreshSub?.unsubscribe();
  }

  /** Carga todos los partidos */
  loadMatches() {
    this.api.getMatches().subscribe({
      next: res => { this.matches = res; this.applyFilters(); },
      error: err => console.error('Error cargando partidos', err)
    });
  }

  /** Carga apuestas del usuario logueado */
  loadUserBets() {
    if (!this.auth.isLogged() || !this.auth.user) return;
    this.api.getUserBets(this.auth.user.id).subscribe({
      next: res => this.userBets = res,
      error: err => console.error('Error cargando apuestas', err)
    });
  }

  /** Carga notificaciones pendientes del usuario */
  loadUserNotifications() {
    if (!this.auth.isLogged() || !this.auth.user) return;
    this.api.getNotifications(this.auth.user.id).subscribe(notifs => {
      notifs.forEach(n => {
        this.showToast(n.message);
        // opcional: marcar como leída en backend
      });
    });
  }

  /** Filtra partidos según búsqueda y tipo */
  applyFilters() {
    const term = this.search.toLowerCase().trim();
    this.filteredMatches = this.matches
      .filter(m => `${m.home} ${m.away}`.toLowerCase().includes(term))
      .filter(m => this.filter === 'all' ? true : m.status === this.filter);
  }

  setFilter(type: any) {
    this.filter = type;
    this.applyFilters();
  }

  /** Navega a detalle solo si el partido terminó */
  goToMatchDetail(match: any) {
    if (match.status !== 'finished') {
      this.showToast('Este partido aún no ha terminado');
      return;
    }
    this.router.navigate(['/match-detail', match.id]);
  }

  /** Toast */
  async showToast(msg: string) {
    const t = await this.toast.create({ message: msg, duration: 2000, position: 'bottom' });
    t.present();
  }

  /** Devuelve la apuesta del usuario si existe */
  hasBet(matchId: number) {
    return this.userBets.find(b => b.matchId === matchId);
  }

  /** Apostar en un partido pendiente */
  async bet(match: any) {
    if (!this.auth.isLogged() || !this.auth.user) return this.showToast('Debes iniciar sesión');

    if (this.hasBet(match.id)) return this.showToast('Ya has apostado en este partido');

    const alert = await this.alertCtrl.create({
      header: 'Tu porra',
      inputs: [
        { name: 'home', type: 'number', placeholder: match.home, min: 0 },
        { name: 'away', type: 'number', placeholder: match.away, min: 0 }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Apostar', handler: (data: { home: string; away: string }) => {
            const payload = {
              userId: this.auth.user!.id,
              matchId: match.id,
              homeScore: Number(data.home),
              awayScore: Number(data.away)
            };
            this.api.placeBet(payload).subscribe({
              next: (res: any) => {
                this.showToast('Apuesta realizada ✅');
                this.userBets.push(res);
              },
              error: err => this.showToast(err.error?.error || 'Error al apostar')
            });
          }
        }
      ]
    });
    await alert.present();
  }

  /** Actualiza partidos en vivo y detecta finalizados */
  private updateLiveMatches() {
    const liveOrPendingIds = this.matches
      .filter(m => m.status === 'live' || m.status === 'pending')
      .map(m => m.id);

    liveOrPendingIds.forEach(id => {
      this.api.getMatchById(id).subscribe({
        next: (res: any) => {
          const idx = this.matches.findIndex(m => m.id === id);
          if (idx !== -1) {
            this.matches[idx] = {
              ...this.matches[idx],
              homeScore: res.homeScore,
              awayScore: res.awayScore,
              status: res.status,
              minute: res.minute,
              events: res.events || []
            };
          }
          this.applyFilters();

          // Detectar partido terminado
          if (res.minute >= 90 && res.status !== 'finished') {
            res.status = 'finished';
            this.processFinishedMatch(res);
          }

        },
        error: err => console.error(`Error actualizando partido ${id}`, err)
      });
    });
  }

  /** Procesa un partido finalizado: reparto de puntos y actualización de equipos */
  private processFinishedMatch(match: any) {
    if (match.status !== 'finished') return;

    // 1️⃣ Reparto de puntos según apuestas
    this.api.getBetsByMatch(match.id).subscribe(bets => {
      bets.forEach((bet: any) => {
        let points = 0;

        if (bet.homeScore === match.homeScore && bet.awayScore === match.awayScore) points = 10;
        else if (
          (match.homeScore > match.awayScore && bet.homeScore > bet.awayScore) ||
          (match.homeScore < match.awayScore && bet.homeScore < bet.awayScore) ||
          (match.homeScore === match.awayScore && bet.homeScore === bet.awayScore)
        ) points = 5;

        if (points > 0) {
          this.api.addPointsToUser(bet.userId, points).subscribe();
          const notif = {
            userId: bet.userId,
            message: `¡Apuesta Ganada! Obtuviste ${points} puntos en ${match.home} vs ${match.away}`,
            read: false,
            createdAt: new Date()
          };
          this.api.createNotification(notif).subscribe();
        }
      });
    });

    // 2️⃣ Actualizar estadísticas de equipos
    this.api.updateTeamStats(match.home, match.away, match.homeScore, match.awayScore).subscribe();
  }

}