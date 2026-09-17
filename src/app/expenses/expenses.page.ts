import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { ExpensesService } from './expenses.service';
import { NotificationService } from '../shared/services/notification.service';
import { ExpenseReport, defaultExpenseReport,defaultLineItem } from './types/expenses.types';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.page.html',
  styleUrls: ['./expenses.page.scss'],
})
export class ExpensesPage implements OnInit, AfterViewInit {
  expensesService = inject(ExpensesService)
  notifications = inject(NotificationService)
  expenseReport:ExpenseReport = {...defaultExpenseReport, lineItems:[{...defaultLineItem}]}

  
  constructor() { }

  ngOnInit() {
    console.log('Expenses')
  }
  
  ngAfterViewInit(): void  {
    this.expensesService.getExpenses().subscribe({
      next: (data) => this.expensesService.expensesList.set(data),
      error: (e) => {this.notifications.notify(e.code)}
    })
  }

  delete = (id:any) => {
    this.expensesService.delete(id).subscribe({
      next: () => this.notifications.notify('Deleted Successfully'),
      error: (e) => this.notifications.notify(e.code)
    })
  }

}

