import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../service/api.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, RouterLink]
})
export class RankingPage implements OnInit {

  users: any[] = [];
  topUser: any = null;
  filter: 'weekly' | 'monthly' | 'all' = 'weekly';
  search = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadRanking();
  }

  loadRanking() {
    this.api.getRanking(this.filter).subscribe({
      next: (res: any[]) => {
        this.users = res.sort((a,b) => b.points - a.points);
        this.topUser = this.users.length > 0 ? this.users[0] : null;
      },
      error: (err: any) => console.error('Error loading ranking', err)
    });
  }

  setFilter(f: 'weekly' | 'monthly' | 'all') {
    this.filter = f;
    this.loadRanking();
  }

  filteredUsers() {
    const term = this.search.toLowerCase().trim();
    return this.users.filter(u => u.username.toLowerCase().includes(term));
  }

  getMedal(index: number) {
    switch(index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return '';
    }
  }

  getGlow(index: number) {
    return index === 0 ? 'top-glow' : '';
  }

  

}