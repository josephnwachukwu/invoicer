import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { LoginPageModule } from './login/login.module';
//import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AuthService } from './auth-service.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    //LoginPageModule,
    //AngularFireAuthModule
  ],
  providers: [
    AuthService
  ]
})
export class AuthModule { }
