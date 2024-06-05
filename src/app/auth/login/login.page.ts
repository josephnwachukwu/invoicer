import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UserLogin } from '../shared/interfaces/userLogin.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  authService = inject(AuthService)
  router = inject(Router)
  notifications = inject(NotificationService)
  credientials: UserLogin = {
    email: '',
    password: ''
  }

  ngOnInit() {
    console.log('login page')
  }

  login = (credentials: UserLogin) => {
    this.authService.emailSignIn(credentials).subscribe({
      next: (data) =>{
        this.router.navigate(['/dashboard'])
      },
      error: (error) => {
        console.error(error.code);
        this.notifications.notify(error.code)
      }
    })
  }

}
