import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserLogin } from 'src/interfaces/user/userLogin';
import { AuthService } from 'src/service/auth.service';
import { ToastService } from 'src/service/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hide: boolean = true;
  returnUrl: string = '';

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(1)]]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      
      let userLogin: UserLogin = {
        correo: formData.email,
        contrasena: formData.password
      };
      
      this.authService.login(userLogin).subscribe({
          next: (res) =>{            
            if (res.codigo == HttpStatusCode.Ok){          
              this.router.navigate([this.returnUrl])
            }else{
              this.toastService.showToast('error', 'Ocurrió un error', res.mensaje);
            }            
          },
          error: (error) => this.toastService.showToast('error', 'Ocurrió un error', error.error.mensaje),
        }
      );
    }
  }
}
