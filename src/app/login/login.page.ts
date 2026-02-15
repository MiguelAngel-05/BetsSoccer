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
import { AuthService } from '../service/auth.service';

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

  constructor(private router: Router, private authService: AuthService) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
  if (!this.email || !this.password) {
    alert('Completa todos los campos');
    return;
  }

  this.authService.login(this.email, this.password).subscribe({
    next: (res) => {
      console.log('Login correcto', res);
      this.router.navigateByUrl('/home');
    },
    error: (err) => {
      console.error(err);
      alert(err.error?.error || 'Error al iniciar sesión');
    }
  });


  
}

}