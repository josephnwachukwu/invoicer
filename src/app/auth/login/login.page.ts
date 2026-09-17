import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators} from '@angular/forms';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UserLoginInterface } from '../shared/interfaces/userLogin.interface';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  authService = inject(AuthService)
  router = inject(Router)
  notifications = inject(NotificationService)
  formBuilder = inject(FormBuilder)

  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  })

  ngOnInit() {
    console.log('login page')
  }

  login = () => {
    this.authService.emailSignIn(this.loginForm.value as UserLoginInterface).subscribe({
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
