import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class HomePage implements OnInit {

  matches: any[] = [];
  filteredMatches: any[] = [];

  search = '';
  filter: 'all' | 'live' | 'pending' | 'finished' = 'all';

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private toast: ToastController
  ) {}

  ngOnInit() {
    this.loadMatches();
  }

  loadMatches() {
    this.api.getMatches().subscribe(res => {
      this.matches = res;
      this.applyFilters();
    });
  }

  applyFilters() {
  const term = this.search.toLowerCase().trim();

  this.filteredMatches = this.matches
    .filter(m => {
      const teams = `${m.home} ${m.away}`.toLowerCase();
      return teams.includes(term);
    })
    .filter(m => {
      if (this.filter === 'all') return true;
      if (this.filter === 'live') return m.status === 'live';
      if (this.filter === 'pending') return m.status === 'pending';
      if (this.filter === 'finished') return m.status === 'finished';
      return true;
    });
}

  setFilter(type: any) {
    this.filter = type;
    this.applyFilters();
  }

  async bet(match: any) {
  if (!this.auth.isLogged() || !this.auth.user) {
    return this.showToast('Debes iniciar sesión');
  }

  const payload = {
    userId: this.auth.user.id,
    matchId: match.id,
    homeScore: 1,
    awayScore: 0
  };

  this.api.placeBet(payload).subscribe({
    next: () => this.showToast('Apuesta realizada ✅'),
    error: err => this.showToast(err.error?.error || 'Error al apostar')
  });
}

  async showToast(msg: string) {
    const t = await this.toast.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });
    t.present();
  }
}