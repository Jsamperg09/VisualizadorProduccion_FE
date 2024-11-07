import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserLoginResponse } from 'src/interfaces/user/userLoginResponse';
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
    private route: Router
  ) {
    this.user = {
      permissions: JSON.parse(localStorage.getItem('permissions')!) || [],
      rol: localStorage.getItem('role')!,
      token: localStorage.getItem('token')!,
      nombre: localStorage.getItem('nombre')!
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
