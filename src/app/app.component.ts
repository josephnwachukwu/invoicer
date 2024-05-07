import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Clients', url: '/folder/clients', icon: 'mail' },
    { title: 'Invoices', url: '/folder/invoices', icon: 'paper-plane' },
    { title: 'Expenses', url: '/folder/expenses', icon: 'heart' },
    { title: 'Profits and Loss', url: '/folder/archived', icon: 'archive' },
    { title: 'Create Invoice', url: '/create-invoice', icon: 'trash' },
    { title: 'Spam', url: '/folder/spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {}
}
