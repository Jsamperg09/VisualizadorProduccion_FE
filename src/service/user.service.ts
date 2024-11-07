import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ResponseApi } from "src/interfaces/api/responseApi";
import { UserCreateData, UserData } from "src/interfaces/user/userData";
import { UserLogin } from "src/interfaces/user/userLogin";
import { UserLoginResponse } from "src/interfaces/user/userLoginResponse";

@Injectable({ providedIn: 'root' })
export class UserService{

    constructor(private http: HttpClient) {}

   loginUser(user: UserLogin): Observable<UserLoginResponse>{
      return this.http.post<UserLoginResponse>(environment.apiUrl+'/login', user);
   }

   getUsers(): Observable<ResponseApi>{
      let auth = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
      return this.http.get<ResponseApi>(environment.apiUrl+'/Usuario', {headers: auth});
   }

   getFilters(data: UserData[]): any {
      if (!data || data.length <= 0)
         return Promise.resolve([]);

      return Promise.all(data.map(
         item => {
            return {
               nombre: item.nombre ?? null,
               apellido: item.apellido ?? null,
               correo: item.correo ?? null,
               rol: item.tipoUsuario ?? null,
            };
         }
      ).filter(item => item.nombre || item.correo || item.rol || item.apellido));
   }

   createUser(user: UserCreateData): Observable<ResponseApi>{
      let auth = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
      return this.http.post<ResponseApi>(environment.apiUrl+'/Usuario', user, {headers: auth});
   }

   updateUser(user: UserCreateData): Observable<ResponseApi>{
      let auth = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
      return this.http.patch<ResponseApi>(environment.apiUrl+'/Usuario', user, {headers: auth});
   }

   updatePasswordUser(id: number, contrasenaAntigua: string, contrasenaNueva: string): Observable<ResponseApi>{
      let auth = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
      return this.http.patch<ResponseApi>(environment.apiUrl+'/Usuario', {id, contrasenaAntigua, contrasenaNueva}, {headers: auth});
   }

   deleteUserById(id: number): Observable<ResponseApi>{
      let auth = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
      return this.http.delete<ResponseApi>(environment.apiUrl+'/Usuario', {headers: auth, body: {id}});
   }

}