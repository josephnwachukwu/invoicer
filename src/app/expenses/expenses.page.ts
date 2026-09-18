import { AfterViewInit, Component, DestroyRef, inject } from '@angular/core';
import { ExpensesService } from './expenses.service';
import { NotificationService } from '../shared/services/notification.service';
import { ExpenseReport, defaultExpenseReport,defaultLineItem } from './types/expenses.types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-expenses',
  standalone: false,
  templateUrl: './expenses.page.html',
  styleUrls: ['./expenses.page.scss'],
})
export class ExpensesPage implements AfterViewInit {
  expensesService = inject(ExpensesService)
  notifications = inject(NotificationService)
  private readonly destroyRef = inject(DestroyRef)
  expenseReport:ExpenseReport = {...defaultExpenseReport, lineItems:[{...defaultLineItem}]}

  
  constructor() { }

  ngAfterViewInit(): void  {
    this.expensesService.getExpenses().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
