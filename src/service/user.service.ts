import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ResponseApi } from "src/interfaces/api/responseApi";
import { UserCreateData, UserData } from "src/interfaces/user/userData";
import { AesService } from "./aes.service";

@Injectable({ providedIn: 'root' })
export class UserService{

    constructor(private http: HttpClient, private encryptService: AesService) {}

   getUsers(): Observable<ResponseApi>{
      let auth = new HttpHeaders().set('Authorization', `Bearer ${JSON.parse(this.encryptService.decrypt(localStorage.getItem('userData') ?? '')).token}`);
      return this.http.get<ResponseApi>(environment.apiUrl+'/Usuario', {headers: auth});
   }

   getFilters(data: UserData[]): any {
      if (!data || data.length <= 0)
         return Promise.resolve([]);

      return Promise.all(data.map(
         item => {
            return {
               nombre: (`${item.nombre} ${item.apellido}`),
               correo: item.correo ?? null,
               tipoUsuario: item.tipoUsuario ?? null,
            };
         }
      ).filter(item => item.nombre || item.correo || item.tipoUsuario));
   }

   createUser(user: UserCreateData): Observable<ResponseApi>{
      let auth = new HttpHeaders().set('Authorization', `Bearer ${JSON.parse(this.encryptService.decrypt(localStorage.getItem('userData') ?? '')).token}`);
      return this.http.post<ResponseApi>(environment.apiUrl+'/Usuario', {data: this.encryptService.encrypt(JSON.stringify(user))}, {headers: auth});
   }

   updateUser(user: UserCreateData): Observable<ResponseApi>{
      let auth = new HttpHeaders().set('Authorization', `Bearer ${JSON.parse(this.encryptService.decrypt(localStorage.getItem('userData') ?? '')).token}`);
      return this.http.patch<ResponseApi>(environment.apiUrl+'/Usuario', {data: this.encryptService.encrypt(JSON.stringify(user))}, {headers: auth});
   }

   updatePasswordUser(id: number, contrasenaAntigua: string, contrasenaNueva: string): Observable<ResponseApi>{
      let auth = new HttpHeaders().set('Authorization', `Bearer ${JSON.parse(this.encryptService.decrypt(localStorage.getItem('userData') ?? '')).token}`);
      return this.http.patch<ResponseApi>(environment.apiUrl+'/Usuario/password', {data: this.encryptService.encrypt(JSON.stringify({id, contrasenaAntigua, contrasenaNueva}))}, {headers: auth});
   }

   deleteUserById(id: number): Observable<ResponseApi>{
      let auth = new HttpHeaders().set('Authorization', `Bearer ${JSON.parse(this.encryptService.decrypt(localStorage.getItem('userData') ?? '')).token}`);
      return this.http.delete<ResponseApi>(environment.apiUrl+'/Usuario', {headers: auth, body: {data: this.encryptService.encrypt(id.toString())}});
   }

}