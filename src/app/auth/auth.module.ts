import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth-service.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  providers: [
    AuthService
  ]
})
export class AuthModule { }
