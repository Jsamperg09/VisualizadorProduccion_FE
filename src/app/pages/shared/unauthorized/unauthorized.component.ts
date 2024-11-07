import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/service/auth.service';
import { SpinnerService } from 'src/service/spinner.service';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.css'
})
export class UnauthorizedComponent {
  @Input()
  pathReturn: string = '/login';
  
  constructor(private router: Router, private spinnerService: SpinnerService, private authService: AuthService) {}

  logOut() {
    this.spinnerService.showSpinner();
    this.authService.logout(this.pathReturn);
    setTimeout(() => {
      this.spinnerService.hideSpinner();
    }, 1500);
  }
}
