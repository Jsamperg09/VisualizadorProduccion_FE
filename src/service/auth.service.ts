import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserLogin } from 'src/interfaces/user/userLogin';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authStatus = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private router: Router) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  get isAuthenticated(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  login(userLogin: UserLogin, returnUrl: string = '/home'): Observable<any> {
    return this.http.post(`${environment.apiUrl}/login`, userLogin).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('permissions', JSON.stringify(response.data.permissions));
        localStorage.setItem('role', response.data.rol);
        localStorage.setItem('nombre', response.data.nombre);
        localStorage.setItem('email', response.data.email);
        this.authStatus.next(true);
        this.router.navigateByUrl(returnUrl);
      })
    );
  }

  logout(pathReturn = '/login'): void {
    localStorage.removeItem('token');
    localStorage.removeItem('permissions');
    localStorage.removeItem('role');
    localStorage.removeItem('nombre');
    localStorage.removeItem('email');
    this.authStatus.next(false);
    this.router.navigate([pathReturn]);
  }
}
