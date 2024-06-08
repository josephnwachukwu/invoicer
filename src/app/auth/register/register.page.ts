import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators} from '@angular/forms';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UserRegistrationInterface } from '../shared/interfaces/userRegistration.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  authService = inject(AuthService)
  router = inject(Router)
  formBuilder = inject(FormBuilder)
  notificationService = inject(NotificationService)

  registerForm = this.formBuilder.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    agreeToTos: [false, Validators.requiredTrue]
  })

  ngOnInit() {
    console.log('register page')
  }

  register = () => {
    this.authService.emailSignUp(this.registerForm.value as UserRegistrationInterface)
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
