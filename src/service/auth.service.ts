import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserLogin } from 'src/interfaces/user/userLogin';
import { AesService } from './aes.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authStatus = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private router: Router, private encryptService: AesService) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('userData');
  }

  get isAuthenticated(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  login(userLogin: UserLogin, returnUrl: string = '/home'): Observable<any> {
    return this.http.post(`${environment.apiUrl}/login`, {data: this.encryptService.encrypt(JSON.stringify(userLogin))}).pipe(
      tap((response: any) => {
        response.data = this.encryptService.encrypt(JSON.stringify(convertKeysToCamelCase(JSON.parse(this.encryptService.decrypt(response.data)))));
        localStorage.setItem('userData', response.data);
        this.authStatus.next(true);
        this.router.navigateByUrl(returnUrl);
      })
    );
  }

  logout(pathReturn = '/login'): void {
    localStorage.removeItem('userData');
    this.authStatus.next(false);
    this.router.navigate([pathReturn]);
  }
}

function toCamelCase(key: string): string {
  return key.charAt(0).toLowerCase() + key.slice(1);
}

function convertKeysToCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(item => convertKeysToCamelCase(item));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = toCamelCase(key);
      acc[camelKey] = convertKeysToCamelCase(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
}