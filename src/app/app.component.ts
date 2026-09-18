import { Component, inject } from '@angular/core';
import { AuthService } from './auth/auth-service.service';
import { NotificationService } from './shared/services/notification.service';
import { Router } from '@angular/router';
import { ConnectivityService } from './shared/services/connectivity.service';
@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  authService = inject(AuthService)
  notificationService = inject(NotificationService)
  router = inject(Router)
  connectivity = inject(ConnectivityService)

  
  public authenticatedPages = [
    // { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Dashboard', url: '/dashboard', icon: 'speedometer' },
    { title: 'Invoices', url: '/invoices', icon: 'newspaper' },
    { title: 'Clients', url: '/clients', icon: 'storefront' },
    // { title: 'Projects', url: '/projects', icon: 'mail' },
    { title: 'Expenses', url: '/expenses', icon: 'receipt' },
    { title: 'New Invoice', url: '/create-invoice', icon: 'add' },
    { title: 'New Expense Report', url: '/create-expense-report', icon: 'add' },
    { title: 'Profile', url: '/profile', icon: 'person' },
  ];

  public publicPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Login', url: '/login', icon: 'log-in' },
    { title: 'Register', url: '/register', icon: 'person-add' },
    // { title: 'New Invoice', url: '/create-invoice', icon: 'add' },
    { title: 'Pricing', url: '/pricing', icon: 'receipt'}
    
  ]


  signOut(): void {
    this.authService.signOut().subscribe(() => this.router.navigate(['/']));
  }
}
