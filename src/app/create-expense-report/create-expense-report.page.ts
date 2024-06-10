import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth/auth-service.service';
import { NotificationService } from '../shared/services/notification.service'
import { ExpenseReport, defaultExpenseReport,defaultLineItem } from '../expenses/types/expenses.types';
import { ExpensesService } from '../expenses/expenses.service';
import { Firestore } from '@angular/fire/firestore';
import { IonModal } from '@ionic/angular';
@Component({
  selector: 'app-create-expense-report',
  templateUrl: './create-expense-report.page.html',
  styleUrls: ['./create-expense-report.page.scss'],
})
export class CreateExpenseReportPage implements OnInit, AfterViewInit {
  @ViewChild(IonModal) modal!: IonModal;
  authService = inject(AuthService)
  private fireStore = inject(Firestore)
  expensesService = inject(ExpensesService)
  private notifications = inject(NotificationService)
  expenseReport:ExpenseReport = {};

  dateFormat = {
    showTimeLabel: false,
    date: {
      weekday: 'short',
      month: 'long',
      day: '2-digit',
    }
  }
  constructor() { }

  ngOnInit() {
    console.log('create expense')
    console.log(this.authService.currentUser)
  }

  ngAfterViewInit(): void {
    this.expenseReport = {...defaultExpenseReport, lineItems:[{...defaultLineItem}], /*employeeName: this.authService.currentUserSignal()!.displayName,*/ uid: this.authService.currentUser.uid}
  }

  addLineItem = () => this.expenseReport.lineItems?.push({...defaultLineItem})

  saveReport = () => {
    this.expensesService.add(this.expenseReport).subscribe({
      next: () => {
        this.notifications.notify('Expense Created Successfully!')
      },
      error: (e) => this.notifications.notify(e.code)
    })
  }
  showActions = () => {

  }

  cancelModal = () => {
    this.modal.dismiss(null, 'cancel');
  }
}
