import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { UserLogin } from "src/interfaces/user/userLogin";
import { UserLoginResponse } from "src/interfaces/user/userLoginResponse";

@Injectable({ providedIn: 'root' })
export class UserService{

    constructor(private http: HttpClient) {}

    loginUser(user: UserLogin): Observable<UserLoginResponse>{
        return this.http.post<UserLoginResponse>(environment.apiUrl+'/login', user);
    }
}