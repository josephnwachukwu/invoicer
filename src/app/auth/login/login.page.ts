import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth-service.service';

export interface Credentials {
  username:string;
  password:string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isToastOpen = false;
  credientials: Credentials = {
    username: '',
    password: ''
  }
  constructor(public authService: AuthService) { }

  ngOnInit() {
    console.log('login page')
  }

  login = (credentials: Credentials) => {
    this.authService.emailSignIn(credentials)
  }

}
