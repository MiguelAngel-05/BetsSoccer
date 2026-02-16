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
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
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

  constructor(private router: Router, private authService: AuthService) {}

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

  this.authService.register(this.username, this.email, this.password).subscribe({
    next: (res) => {
      console.log('Registro correcto', res);
      this.router.navigateByUrl('/home'); // ya logueado
    },
    error: (err) => {
      console.error(err);
      alert(err.error?.error || 'Error al registrarse');
    }
  });
}
  
  
}