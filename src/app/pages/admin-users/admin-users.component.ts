import { HttpStatusCode } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterTable, UserCreateData, UserData } from 'src/interfaces/user/userData';
import { UserLoginResponse } from 'src/interfaces/user/userLoginResponse';
import { AuthService } from 'src/service/auth.service';
import { ExcelExportService } from 'src/service/excel-export.service';
import { SpinnerService } from 'src/service/spinner.service';
import { ToastService } from 'src/service/toast.service';
import { UserService } from 'src/service/user.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent {
  users: UserData[] = [];
  filters: FilterTable[] = [];
  usersPersisted: UserData[] = [];
  selectedRow: UserData | null = null;
  rows: number = 10;
  first: number = 0;
  tituloModal: string = 'Nuevo Usuario';
  user: UserLoginResponse;
  canSeeHome: boolean = false;
  isAdmin: boolean = false;
  nombres: string[] = []; 
  visible: boolean = false;
  userForm: FormGroup;
  profileOptions = [
    { label: 'Visualizador', value: '2' },
    { label: 'Administrador', value: '1' }
  ];
  usuario: UserCreateData = null!;

  constructor(
    private userService: UserService,
    private spinnerService: SpinnerService,
    private authService: AuthService,
    private excelExportService: ExcelExportService,
    private toastService: ToastService,
    private fb: FormBuilder    
  ) {
    this.user = {
      permissions: JSON.parse(localStorage.getItem('permissions')!) || [],
      rol: localStorage.getItem('role')!,
      token: localStorage.getItem('token')!,
      nombre: localStorage.getItem('nombre')!,
      email: localStorage.getItem('email')!
    };

    this.resetUserForm();
    
    this.userForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      idTipoUsuario: ['', Validators.required],
      rut: ['', Validators.required]
    });    
  }

  ngOnInit(){
    this.isAdmin = this.user.permissions.some(permission => permission.name === 'Lectura-Administrador');
    if (!this.isAdmin)
      this.canSeeHome = this.user.permissions.some(permission => permission.name === 'Lectura-Home');
    else
      this.canSeeHome = true;

    this.getUsers();
  }

  getUsers(){
    this.userService.getUsers().subscribe({
      next: (res) => {
        if (res.codigo == HttpStatusCode.Ok){          
          this.users = this.usersPersisted = Array.isArray(res.data) ? res.data : [];
          this.getFilters();
        } else if (res.codigo == HttpStatusCode.Unauthorized){
          this.toastService.showToast('error', 'Token no válido', 'Su token de seguridad expiró, por favor vuelva a ingresar.');
          this.logOut();
        }else{
          this.toastService.showToast('error', 'Ocurrió un error', res.mensaje);
        }
      },
      error: (res) => {
        if (res.codigo == HttpStatusCode.Unauthorized){
          this.toastService.showToast('error', 'Token no válido', 'Su token de seguridad expiró, por favor vuelva a ingresar.');
          this.logOut();
        }else{
          this.toastService.showToast('error', 'Ocurrió un error', undefined);
        }
        
        this.users = this.usersPersisted = [];
      }
    });    
  }

  editUser(user: UserData){
    this.usuario.id = user.id;
    this.usuario.nombre = user.nombre;
    this.usuario.apellido = user.apellido;
    this.usuario.email = user.correo;
    this.usuario.rut = user.rut;
    this.usuario.idTipoUsuario = Number.parseInt(this.profileOptions.find(profile => profile.label === user.tipoUsuario)?.value!);
    this.tituloModal = 'Editar Usuario';
    this.visible = true;
  }

  deleteUserById(id: number){
    let isValid = this.validateUserToDelete(id);
    if (isValid){
      this.userService.deleteUserById(id).subscribe({
        next: (res) => {
          if (res.codigo == HttpStatusCode.Ok){          
            this.toastService.showToast('success', 'Operación Exitosa', 'El usuario ha sido eliminado correctamente.');
            this.getUsers();
          } else if (res.codigo == HttpStatusCode.Unauthorized){
            this.toastService.showToast('error', 'Token no válido', 'Su token de seguridad expiró, por favor vuelva a ingresar.');
            this.logOut();
          }else{
            this.toastService.showToast('error', 'Ocurrió un error', res.mensaje);
          }
        },
        error: (res) => {
          if (res.codigo == HttpStatusCode.Unauthorized){
            this.toastService.showToast('error', 'Token no válido', 'Su token de seguridad expiró, por favor vuelva a ingresar.');
            this.logOut();
          }else{
            this.toastService.showToast('error', 'Ocurrió un error', undefined);
          }
        }
      });
    }
  }

  createUser() {
    this.tituloModal = 'Nuevo Usuario';
    this.userForm.reset();
    this.visible = true;
  }

  onSubmit() {
    if (this.userForm.valid) {
      let user: UserCreateData = {
        nombre: this.userForm.value['nombre'],
        apellido: this.userForm.value['apellido'],
        rut: this.userForm.value['rut'],
        email: this.userForm.value['email'],
        idTipoUsuario: this.userForm.value['idTipoUsuario']
      };

      this.userService.createUser(user).subscribe({
        next: (res) => {
          if (res.codigo == HttpStatusCode.Ok){          
            this.toastService.showToast('success', 'Operación Exitosa', 'El usuario ha sido creado correctamente.');
            this.getUsers();
            this.visible = false;
            this.resetUserForm();
          } else if (res.codigo == HttpStatusCode.Unauthorized){
            this.toastService.showToast('error', 'Token no válido', 'Su token de seguridad expiró, por favor vuelva a ingresar.');
            this.logOut();
          }else{
            this.toastService.showToast('error', 'Ocurrió un error', res.mensaje);
          }          
        }
      });      
    }
  }

  onUpdate(id: number) {
    if (this.userForm.valid) {
      let user: UserCreateData = {
        id: id,
        nombre: this.userForm.value['nombre'],
        apellido: this.userForm.value['apellido'],
        rut: this.userForm.value['rut'],
        email: this.userForm.value['email'],
        idTipoUsuario: this.userForm.value['idTipoUsuario']
      };

      this.userService.updateUser(user).subscribe({
        next: (res) => {
          if (res.codigo == HttpStatusCode.Ok){          
            this.toastService.showToast('success', 'Operación Exitosa', 'El usuario ha sido actualizado correctamente.');
            this.getUsers();
            this.visible = false;
            this.resetUserForm();
          } else if (res.codigo == HttpStatusCode.Unauthorized){
            this.toastService.showToast('error', 'Token no válido', 'Su token de seguridad expiró, por favor vuelva a ingresar.');
            this.logOut();
          }else{
            this.toastService.showToast('error', 'Ocurrió un error', res.mensaje);
          }          
        }
      });      
    }
  }

  onCancel() {
    this.userForm.reset();
    this.visible = false;
  }

  private resetUserForm(){
    this.usuario = {
      apellido: '',
      nombre: '',
      email: '',
      rut: '',
      idTipoUsuario: 0,
    }
  }

  private validateUserToDelete(id: number): boolean{
    let userData: UserData = this.usersPersisted.find(user => user.id == id)!
    
    if (userData.correo === this.user.email){
      this.toastService.showToast('error', 'No puede borrar su propio usuario');
      return false;
    }

    return true;
  }

  private logOut() {
    this.spinnerService.showSpinner();
    this.authService.logout();
    setTimeout(() => {
      this.spinnerService.hideSpinner();
    }, 1500);
  }

  private getFilters(){
    this.userService.getFilters(this.users).then((res: FilterTable[]) => {
      if (res){
        this.filters = res;
        this.nombres = [...new Set(res.map(item => `${item.nombre} ${item.apellido}`))];
      }
    });
  }
}