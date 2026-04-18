import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';  // Убедитесь, что сервис подключен
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerUserName: string = '';
  registerEmail: string = '';
  registerFirstName: string = '';
  registerLastName: string = '';
  registerPassword: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onRegister() {
    const registerData = {
      registerUserName: this.registerUserName,
      registerEmail: this.registerEmail,
      registerFirstName: this.registerFirstName,
      registerLastName: this.registerLastName,
      registerPassword: this.registerPassword
    };

    this.authService.register(registerData).subscribe(
      response => {
        console.log('Registration successful', response);
        this.router.navigate(['/login']);  // Перенаправляем на страницу логина
      },
      error => {
        console.error('Registration failed', error);
      }
    );
  }
}
