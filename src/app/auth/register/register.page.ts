import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UserRegistration } from '../shared/interfaces/userRegistration.interface';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  authService = inject(AuthService)
  router = inject(Router)
  notificationService = inject(NotificationService)
  credientials: UserRegistration = {
    username: '',
    email: '',
    password: ''
  }

  ngOnInit() {
    console.log('register page')
  }

  register = (credentials: UserRegistration) => {
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
