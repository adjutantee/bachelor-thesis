import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from '../Models/login.model';
import { Register } from '../Models/register.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7275/api/Authentication';

  constructor(private http: HttpClient) { }

  login(loginData: Login): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, loginData);
  }

  register(registerData: Register): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, registerData);
  }
}
