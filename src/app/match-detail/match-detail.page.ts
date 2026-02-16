import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-match-detail',
  templateUrl: './match-detail.page.html',
  styleUrls: ['./match-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class MatchDetailPage implements OnInit {

  match: any;
  events: any[] = [];

  betHome = 0;
  betAway = 0;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private auth: AuthService,
    private toast: ToastController
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadMatch(id);
  }

  loadMatch(id: string) {
  this.api.getMatchById(id).subscribe(res => {
    this.match = res; // directamente el partido
    this.events = res.events || [];
  });
}

  async placeBet() {
    if (!this.auth.isLogged() || !this.auth.user) {
      return this.showToast('Debes iniciar sesión');
    }

    const payload = {
      userId: this.auth.user.id,
      matchId: this.match.id,
      homeScore: this.betHome,
      awayScore: this.betAway
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