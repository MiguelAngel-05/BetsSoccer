import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-liga',
  templateUrl: './liga.page.html',
  styleUrls: ['./liga.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterLink]
})
export class LigaPage implements OnInit {

  search = '';
  activarFilter: 'general' | 'home' | 'away' = 'general';

  currentRound = 0;
  totalRounds = 38;
  totalMatches = 0;
  totalGoals = 0;

  teams: any[] = [];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadStandings();
  }

  getTeamLogo(name: string): string {
    const map: any = {
      'Real Madrid': 'RealMadrid.png',
      'FC Barcelona': 'FCBarcelona.png',
      'Atlético Madrid': 'AtleticoMadrid.png',
      'Valencia CF': 'ValenciaCF.png',
      'Celta de Vigo': 'CeltadeVigo.png',
      'Girona FC': 'GironaCF.png',
      'Athletic Club': 'AthleticClub.png',
      'Real Betis': 'RealBetis.png',
      'Sevilla FC': 'SevillaFC.png',
      'Osasuna': 'Osasuna.png',
      'Villarreal': 'Villarreal.png',
      'Getafe CF': 'GetafeCF.png',
      'Granada CF': 'GranadaCF.png',
      'Cádiz CF': 'CadizCF.png',
      'Deportivo Alavés': 'DeportivoAlaves.png',
      'UD Almería': 'UDAlmeria.png',
      'UD Las Palmas': 'UDLasPalmas.png',
      'Rayo Vallecano': 'RayoVallecano.png',
      'RCD Mallorca': 'RCDMallorca.png',
      'Real Sociedad': 'RealSociedad.png',
      'default': 'default.png'
    };
    return `assets/teams/${map[name] || 'default.png'}`;
  }

  loadStandings() {
    this.api.getStandings().subscribe({
      next: (data) => {
        this.teams = data.map(team => ({
          name: team.name,
          played: team.pj,
          win: team.pg,
          draw: team.pe,
          lose: team.pp,
          gf: team.gf,
          ga: team.gc,
          dg: team.gf - team.gc,
          points: team.pts,
          form: this.generateForm()
        }));

        this.totalMatches = this.teams.reduce((a, b) => a + b.played, 0) / 2;
        this.totalGoals = this.teams.reduce((a, b) => a + b.gf, 0);
        this.currentRound = Math.max(...this.teams.map(t => t.played));
      },
      error: (err) => console.error('Error cargando clasificación', err)
    });
  }

  getRowClass(index: number) {
    if (index < 4) return 'champions';
    if (index < 6) return 'europa';
    if (index >= this.teams.length - 3) return 'descenso';
    return '';
  }

  generateForm(): string[] {
    const forms = ['W', 'D', 'L'];
    return Array.from({ length: 5 }, () =>
      forms[Math.floor(Math.random() * forms.length)]
    );
  }

  setFilter(type: 'general' | 'home' | 'away') {
    this.activarFilter = type;
  }

  getStats(team: any) {
    if (!team) return { played: 0, win: 0, draw: 0, lose: 0, gf: 0, ga: 0, dg: 0, points: 0, form: [] };
    if (team.stats) {
      if (this.activarFilter === 'home') return team.stats.home;
      if (this.activarFilter === 'away') return team.stats.away;
      return team.stats.general;
    }
    return { ...team }; // devuelve las propiedades ya mapeadas
  }

  getFilteredTeams() {
    return this.teams
      .filter(team => team.name.toLowerCase().includes(this.search.toLowerCase()))
      .map(team => {
        const stats = this.activarFilter === 'home'
          ? team.stats?.home || team
          : this.activarFilter === 'away'
          ? team.stats?.away || team
          : team.stats?.general || team;
        return { ...team, ...stats };
      });
  }

  goToTeam(teamName: string) {
  this.router.navigate(['/plantilla', teamName]);
}

}
