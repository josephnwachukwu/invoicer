import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/notification.service';

export interface Credentials {
  username:string;
  email:string;
  password:string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  authService = inject(AuthService)
  router = inject(Router)
  notificationService = inject(NotificationService)
  credientials: Credentials = {
    username: '',
    email: '',
    password: ''
  }

  ngOnInit() {
    console.log('register page')
  }

  register = (credentials: Credentials) => {
    this.authService.emailSignUp(credentials)
    .subscribe({
      next: ()=>{
      this.router.navigate(['/dashboard'])
    },
    error: (error) => {
      console.error(error.code)
      this.notificationService.notify(error.code)
  }})
  }
}
