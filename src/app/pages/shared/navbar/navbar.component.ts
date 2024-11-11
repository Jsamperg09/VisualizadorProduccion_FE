import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserLoginResponse } from 'src/interfaces/user/userLoginResponse';
import { AesService } from 'src/service/aes.service';
import { AuthService } from 'src/service/auth.service';
import { SpinnerService } from 'src/service/spinner.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  user: UserLoginResponse;
  canSeeHome: boolean = false;
  isAdmin: boolean = false;
  actualRoute: string = '';

  constructor(
    private authService: AuthService,
    private spinnerService: SpinnerService,
    private route: Router,
    private encryptService: AesService
  ) {
    this.user = {
      permissions: JSON.parse(this.encryptService.decrypt(localStorage.getItem('userData') ?? '')).permissions || [],
      rol: JSON.parse(this.encryptService.decrypt(localStorage.getItem('userData') ?? '')).rol,
      token: JSON.parse(this.encryptService.decrypt(localStorage.getItem('userData') ?? '')).token,
      nombre: JSON.parse(this.encryptService.decrypt(localStorage.getItem('userData') ?? '')).nombre,
      email: JSON.parse(this.encryptService.decrypt(localStorage.getItem('userData') ?? '')).email,
      apellido: JSON.parse(this.encryptService.decrypt(localStorage.getItem('userData') ?? '')).apellido,
      rut: JSON.parse(this.encryptService.decrypt(localStorage.getItem('userData') ?? '')).rut,
      idTipoUsuario: JSON.parse(this.encryptService.decrypt(localStorage.getItem('userData') ?? '')).idTipoUsuario
    }
  }

  ngOnInit(){
    this.actualRoute = this.route.url;
    this.isAdmin = this.user.permissions.some(permission => permission.name === 'Lectura-Administrador');
    if (!this.isAdmin)
      this.canSeeHome = this.user.permissions.some(permission => permission.name === 'Lectura-Home');
    else
      this.canSeeHome = true;
  }

  logOut() {
    this.spinnerService.showSpinner();
    this.authService.logout();
    setTimeout(() => {
      this.spinnerService.hideSpinner();
    }, 1500);
  }
}
