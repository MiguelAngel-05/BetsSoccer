import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-plantilla',
  templateUrl: './plantilla.page.html',
  styleUrls: ['./plantilla.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterLink]
})
export class PlantillaPage implements OnInit {

  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  teamName: string = '';
  players: any[] = [];
  teamStats: any = null;
  position: number = 0;
  topScorer: any = null;

  ngOnInit() {
    this.teamName = this.route.snapshot.paramMap.get('teamName') || '';
    this.loadData();
  }

  loadData() {
    this.loadPlayers();
    this.loadTeamStats();
  }

  loadPlayers() {
    this.http.get<any[]>(
      `https://api-futbol-app.vercel.app/api/teams/${this.teamName}/players`
    ).subscribe({
      next: data => {
        this.players = data;
        this.calculateTopScorer();
      },
      error: err => console.error('Error cargando jugadores', err)
    });
  }

  loadTeamStats() {
    this.http.get<any[]>(
      `https://api-futbol-app.vercel.app/api/league/standings`
    ).subscribe({
      next: data => {
        const index = data.findIndex(t => t.name === this.teamName);
        if (index !== -1) {
          this.teamStats = data[index];
          this.position = index + 1;
        }
      },
      error: err => console.error('Error cargando stats equipo', err)
    });
  }

  calculateTopScorer() {
    if (!this.players.length) return;
    this.topScorer = [...this.players]
      .sort((a, b) => b.goals - a.goals)[0];
  }

  get goalsPerMatch(): string {
  if (!this.teamStats) return '0.00';
  return (this.teamStats.gf / this.teamStats.pj).toFixed(2);
}
}