import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from './auth/auth-service.service';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  authService = inject(AuthService)
  notificationService = inject(NotificationService)
  router = inject(Router)
  isToastOpen = false;

  
  public authenticatedPages = [
    // { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Dashboard', url: '/dashboard', icon: 'speedometer' },
    { title: 'Invoices', url: '/invoices', icon: 'newspaper' },
    { title: 'Clients', url: '/clients', icon: 'storefront' },
    { title: 'Projects', url: '/projects', icon: 'mail' },
    { title: 'Expenses', url: '/expenses', icon: 'receipt' },
    // { title: 'Login', url: '/login', icon: 'log-in' },
    { title: 'Register', url: '/register', icon: 'person-add' },
    { title: 'Create Invoice', url: '/create-invoice', icon: 'add' },
    { title: 'Profile', url: '/profile', icon: 'person' },
  ];

  public publicPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Login', url: '/login', icon: 'log-in' },
    { title: 'Create Invoice', url: '/create-invoice', icon: 'add' },
    
  ]


  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if(user){
        this.authService.currentUserSignal.set({
          email: user.email!,
          displayName: user.displayName!,
        })
        this.router.navigate(['/dashboard'])
      }
      else {
        this.authService.currentUserSignal.set(null)
        this.router.navigate(['/home'])
      }
      console.log(this.authService.currentUserSignal()?.email)
    })
  }


}
