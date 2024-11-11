import { HttpStatusCode } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterTableUser, UserCreateData, UserData } from 'src/interfaces/user/userData';
import { UserLoginResponse } from 'src/interfaces/user/userLoginResponse';
import { AesService } from 'src/service/aes.service';
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
  filters: FilterTableUser[] = [];
  names: string[] = [];
  nameFiltered: string = "";
  roles: string[] = [];
  roleFiltered: string = "";
  emails: string[] = [];
  emailFiltered: string = "";
  searchData: string = "";
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
    private encryptService: AesService,
    private toastService: ToastService,
    private fb: FormBuilder    
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
        if (res.status == HttpStatusCode.Unauthorized){
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
    let isValid = this.validateUserToDelete(user.id, true);
    if (isValid){
      this.usuario.id = user.id;
      this.usuario.nombre = user.nombre;
      this.usuario.apellido = user.apellido;
      this.usuario.email = user.correo;
      this.usuario.rut = user.rut;
      this.usuario.idTipoUsuario = user.idTipoUsuario;
      this.tituloModal = 'Editar Usuario';
      this.visible = true;
    }
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
          if (res.status == HttpStatusCode.Unauthorized){
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

  get nameSelected() {
    return this.nameFiltered;
  }

  set nameSelected(value) {
    this.nameFiltered = value;
    this.filters = this.filters.filter(item => item.nombre === this.nameSelected);
    this.generateFilterByData(this.filters);
  }

  get roleSelected() {
    return this.roleFiltered;
  }

  set roleSelected(value) {
    this.roleFiltered = value;
    this.filters = this.filters.filter(item => item.tipoUsuario === this.roleFiltered);
    this.generateFilterByData(this.filters);
  }

  get emailSelected() {
    return this.emailFiltered;
  }

  set emailSelected(value) {
    this.emailFiltered = value;
    this.filters = this.filters.filter(item => item.correo === this.emailFiltered);
    this.generateFilterByData(this.filters);
  }
  
  filterData() {
    this.users = this.usersPersisted;
    this.spinnerService.showSpinner();    
    this.users = this.users.filter(item => 
      (this.nameSelected === '' || `${item.nombre} ${item.apellido}` === this.nameSelected) &&
      (this.searchData === '' || `${item.nombre} ${item.apellido}`.includes(this.searchData)) &&
      (this.roleSelected === '' || item.tipoUsuario === this.roleSelected) &&
      (this.emailSelected === '' || item.correo === this.emailSelected)
    );
    setTimeout(() => {
      this.spinnerService.hideSpinner();
    }, 1500);        
  }

  resetFilter(){
    this.users = this.usersPersisted;
    this.nameFiltered = this.roleFiltered = this.emailFiltered = '';
    this.getFilters();
    setTimeout(() => {
      this.spinnerService.hideSpinner();
    }, 1500);    
  }


  private generateFilterByData(res: FilterTableUser[]){
    if (this.nameFiltered == ''){
      this.names = Array.from(new Set(
        res
          .map(item => item.nombre?.trim())
          .filter(center => center)
      ));
    }

    if (this.emailFiltered == ''){
      this.emails = Array.from(new Set(
        res
          .map(item => item.correo?.trim())
          .filter(producerCode => producerCode)
      ));
    } 
    if (this.roleFiltered == ''){
      this.roles = Array.from(new Set(
        res
          .map(item => item.tipoUsuario?.trim())
          .filter(tipoUsuario => tipoUsuario)
      ));
    }
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

  private validateUserToDelete(id: number, isEdit: boolean = false): boolean{
    let userData: UserData = this.usersPersisted.find(user => user.id == id)!
    
    if (userData.correo === this.user.email){
      if (isEdit)
        this.toastService.showToast('error', 'No puede editar su propio usuario');
      else
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
    this.userService.getFilters(this.users).then((res: FilterTableUser[]) => {
      if (res){
        this.filters = res;
        this.generateFilterByData(res);
      }
    });
  }
}