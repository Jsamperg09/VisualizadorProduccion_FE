import { HttpStatusCode } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserCreateData } from 'src/interfaces/user/userData';
import { UserLoginResponse } from 'src/interfaces/user/userLoginResponse';
import { AesService } from 'src/service/aes.service';
import { AuthService } from 'src/service/auth.service';
import { SpinnerService } from 'src/service/spinner.service';
import { ToastService } from 'src/service/toast.service';
import { UserService } from 'src/service/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {
  userForm: FormGroup;
  passwordForm: FormGroup;
  user: UserLoginResponse;

  constructor(
    private fb: FormBuilder,
    private encryptService: AesService,
    private toastService: ToastService,
    private userService: UserService,
    private spinnerService: SpinnerService,
    private authService: AuthService,
    private router: Router
  ){
    this.userForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      idTipoUsuario: ['', Validators.required],
      rut: ['', Validators.required]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, passwordValidator()]],
      confirmPassword: ['', [Validators.required]]
    });

    this.user = {
      permissions: JSON.parse(this.encryptService.decrypt(localStorage.getItem('userData') ?? '')).permissions || [],
      rol: JSON.parse(this.encryptService.decrypt(localStorage.getItem('userData') ?? '')).rol,
      token: JSON.parse(this.encryptService.decrypt(localStorage.getItem('userData') ?? '')).token,
      nombre: JSON.parse(this.encryptService.decrypt(localStorage.getItem('userData') ?? '')).nombre,
      email: JSON.parse(this.encryptService.decrypt(localStorage.getItem('userData') ?? '')).email,
      apellido: JSON.parse(this.encryptService.decrypt(localStorage.getItem('userData') ?? '')).apellido,
      rut: JSON.parse(this.encryptService.decrypt(localStorage.getItem('userData') ?? '')).rut,
      idTipoUsuario: JSON.parse(this.encryptService.decrypt(localStorage.getItem('userData') ?? '')).idTipoUsuario,
      id: JSON.parse(this.encryptService.decrypt(localStorage.getItem('userData') ?? '')).id
    };    
  }

  editUser(){
    if (this.userForm.valid){
      let userUpdate: UserCreateData = {
        apellido: this.user.apellido,
        nombre: this.user.nombre,
        idTipoUsuario: Number.parseInt(this.user.idTipoUsuario),
        email: this.user.email!,
        rut: this.user.rut,
        id: this.user.id
      };
  
      this.userService.updateUser(userUpdate).subscribe({
        next: (res) => {
          if (res.codigo == HttpStatusCode.Ok){          
            this.toastService.showToast(undefined, 'Operación Exitosa', 'La información ingresada ha sido actualizada.');
          } else if (res.codigo == HttpStatusCode.Unauthorized){
            this.toastService.showToast('error', 'Token no válido', 'Su token de seguridad expiró, por favor vuelva a ingresar.');
            this.logOut();
          }else{
            this.toastService.showToast('error', 'Ocurrió un error', res.mensaje);
          }
        },
        error: (res) => {
          if (res.status == HttpStatusCode.Unauthorized){
            this.toastService.showToast('error', 'Token no válido', 'Su token de seguridad expiró, por favor vuelva a ingresar.');
            this.logOut();
          }else{
            this.toastService.showToast('error', 'Ocurrió un error', res.error.mensaje);
          }
        }
      });
    }
  }

  cancelForm(){
    this.router.navigate(['/home']);
  }

  editPasswordUser(){
    if (this.passwordForm.valid){
      const formData = this.passwordForm.value;

      this.userService.updatePasswordUser(this.user.id!, formData.currentPassword, formData.newPassword).subscribe({
        next: (res) => {
          if (res.codigo == HttpStatusCode.Ok){          
            this.toastService.showToast(undefined, 'Operación Exitosa', 'La contraseña ingresada ha sido actualizada.');
          } else if (res.codigo == HttpStatusCode.Unauthorized){
            this.toastService.showToast('error', 'Token no válido', 'Su token de seguridad expiró, por favor vuelva a ingresar.');
            this.logOut();
          }else{
            this.toastService.showToast('error', 'Ocurrió un error', res.mensaje);
          }
        },
        error: (res) => {
          if (res.status == HttpStatusCode.Unauthorized){
            this.toastService.showToast('error', 'Token no válido', 'Su token de seguridad expiró, por favor vuelva a ingresar.');
            this.logOut();
          }else{
            this.toastService.showToast('error', 'Ocurrió un error', res.error.mensaje);
          }
        }
      });
    }
  }

  private logOut() {
    this.spinnerService.showSpinner();
    this.authService.logout();
    setTimeout(() => {
      this.spinnerService.hideSpinner();
    }, 1500);
  }  
}

function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[@$!%*?&]/.test(value);
    const isValidLength = value.length >= 8;

    const passwordValid = hasUpperCase && hasNumber && hasSpecialChar && isValidLength;

    return !passwordValid ? {
      passwordStrength: {
        hasUpperCase,
        hasNumber,
        hasSpecialChar,
        isValidLength
      }
    } : null;
  };
}