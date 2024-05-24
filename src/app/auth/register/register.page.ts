import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth-service.service';

export interface Credentials {
  username:string;
  password:string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  isToastOpen = false;
  credientials: Credentials = {
    username: '',
    password: ''
  }
  constructor(public authService: AuthService) { }

  ngOnInit() {
    console.log('register page')
  }

  register = (credentials: Credentials) => {
    this.authService.emailSignUp(credentials)
  }
}
