import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import {
  IonContent,
  IonCard,
  IonIcon,
  IonButton,
  IonInput,
  IonItem
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,   // 👈 IMPORTANTE para routerLink
    IonContent,
    IonCard,
    IonIcon,
    IonButton,
    IonInput,
    IonItem
  ]
})
export class LoginPage {

  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (!this.email || !this.password) {
      alert('Completa todos los campos');
      return;
    }

    console.log('Login OK:', this.email);

    // 🔥 Redirige al home
    this.router.navigateByUrl('/home');
  }
}