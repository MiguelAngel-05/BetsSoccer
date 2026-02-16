import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private authService: AuthService) {
    this.initApp();
  }

  async initApp() {
    // carga sesion desde il capacitor
    await this.authService.loadSession();

    if (this.authService.isLogged()) {
      console.log('Usuario logueado:', this.authService.user);
    } else {
      console.log('No hay sesión activa');
    }
  }
}
