import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Dashboard', url: '/dashboard', icon: 'speedometer' },
    { title: 'Invoices', url: '/invoices', icon: 'newspaper' },
    { title: 'Clients', url: '/clients', icon: 'storefront' },
    { title: 'Projects', url: '/projects', icon: 'mail' },
    { title: 'Expenses', url: '/expenses', icon: 'receipt' },
    { title: 'Login', url: '/login', icon: 'log-in' },
    { title: 'Register', url: '/register', icon: 'person-add' },
    // { title: 'Profits and Loss', url: '/folder/archived', icon: 'archive' },
    { title: 'Create Invoice', url: '/create-invoice', icon: 'add' },
    { title: 'Profile', url: '/profile', icon: 'person' },
    // { title: 'Spam', url: '/folder/spam', icon: 'warning' },
  ];
  constructor() {}
}
