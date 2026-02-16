import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { ApiService } from '../service/api.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule, RouterLink]
})
export class ProfilePage implements OnInit {

  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  public auth = inject(AuthService);
  private toastCtrl = inject(ToastController);

  userId!: number;
  user: any;
  bets: any[] = [];
  newAvatar: string = '';

  ngOnInit() {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadUser();
    this.loadUserBets();
  }

  loadUser() {
    this.user = this.auth.user;
    this.newAvatar = this.user?.avatar || '';
  }

  loadUserBets() {
    this.api.getUserBets(this.userId).subscribe({
      next: res => this.bets = res,
      error: err => console.error('Error cargando apuestas', err)
    });
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2000, position: 'bottom' });
    toast.present();
  }

  // generar avatar aleatorio
  generateDiceBear() {
    const seed = Math.random().toString(36).substring(2, 10);
    this.newAvatar = `https://api.dicebear.com/6.x/bottts/svg?seed=${seed}`;
  }

  // guardo avatar y actualizo auth.user
  updateAvatar() {
    if (!this.newAvatar) return;

    this.api.updateUser(this.userId, { avatar: this.newAvatar }).subscribe({
      next: (res: any) => {
        this.user.avatar = res.avatar;
        this.auth.user!.avatar = res.avatar;
        this.showToast('Avatar actualizado');
      },
      error: (err: any) => {
        console.error('Error actualizando avatar', err);
        this.showToast('Error al guardar avatar');
      }
    });
  }

  get totalBets(): number {
    return this.bets?.length || 0;
  }

  get betsWon(): number {
    return this.bets?.filter(b => (b.pointsEarned || 0) > 0).length || 0;
  }

  get totalPoints(): number {
    return this.bets?.reduce((acc, b) => acc + (b.pointsEarned || 0), 0) || 0;
  }

}