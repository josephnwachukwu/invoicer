import { Component, inject } from '@angular/core';
import { FormBuilder, Validators} from '@angular/forms';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UserLoginInterface } from '../shared/interfaces/userLogin.interface';


@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  authService = inject(AuthService)
  router = inject(Router)
  notifications = inject(NotificationService)
  formBuilder = inject(FormBuilder)

  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  })

  login = () => {
    this.authService.emailSignIn(this.loginForm.value as UserLoginInterface).subscribe({
      next: (data) =>{
        this.router.navigate(['/dashboard'])
      },
      error: (error) => {
        this.notifications.notify(error.code)
      }
    })
  }

}
