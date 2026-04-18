import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginIdentifier: string = '';  // Либо email, либо username
  loginPassword: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onLogin() {
    this.authService.login({
      loginUserName: this.loginIdentifier,  // Отправляем идентификатор (может быть либо username, либо email)
      loginEmail: this.loginIdentifier,     // Логика на бэкенде решит, что это
      loginPassword: this.loginPassword
    }).subscribe(
      response => {
        localStorage.setItem('token', response.token);  // Сохраняем токен
        this.router.navigate(['/dashboard']);  // Перенаправляем пользователя на дашборд
      },
      error => {
        console.error('Login failed', error);
      }
    );
  }
}
