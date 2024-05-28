import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/notification.service';

export interface Credentials {
  email:string;
  password:string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  authService = inject(AuthService)
  router = inject(Router)
  notifications = inject(NotificationService)
  credientials: Credentials = {
    email: '',
    password: ''
  }

  ngOnInit() {
    console.log('login page')
  }

  login = (credentials: Credentials) => {
    this.authService.emailSignIn(credentials).subscribe({
      next: (data) =>{
        this.notifications.notify('it made it here')
        this.router.navigate(['/dashboard'])
      },
      error: (error) => {
        console.error(error.code);
        this.notifications.notify(error.code)
      }
    })
  }

}
