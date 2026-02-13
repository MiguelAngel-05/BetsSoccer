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
  IonCheckbox,
  IonItem,
  IonLabel
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,  // 👈 necesario para routerLink
    IonContent,
    IonCard,
    IonIcon,
    IonButton,
    IonInput,
    IonCheckbox,
    IonItem,
    IonLabel
  ]
})
export class RegisterPage {

  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  termsAccepted: boolean = false;

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  register() {
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      alert('Completa todos los campos');
      return;
    }

    if (!this.termsAccepted) {
      alert('Debes aceptar los términos');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    console.log('Usuario registrado:', this.username);

    // 🔥 Redirige al login
    this.router.navigateByUrl('/login');
  }
}