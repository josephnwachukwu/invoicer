import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { AuthService } from '../auth/auth-service.service';
import { NotificationService } from '../shared/services/notification.service'
import { ExpenseReport, defaultExpenseReport, defaultLineItem, categoriesList } from '../expenses/types/expenses.types';
import { ExpensesService } from '../expenses/expenses.service';
import { doc, docData, Firestore } from '@angular/fire/firestore';
import { IonModal } from '@ionic/angular';
import { Router } from '@angular/router';
import { UtilsService } from '../shared/services/utils.service';
import { filter, switchMap, take, timeout } from 'rxjs';
@Component({
  selector: 'app-create-expense-report',
  standalone: false,
  templateUrl: './create-expense-report.page.html',
  styleUrls: ['./create-expense-report.page.scss'],
})
export class CreateExpenseReportPage implements AfterViewInit {
  @ViewChild(IonModal) modal!: IonModal;
  authService = inject(AuthService)
  private fireStore = inject(Firestore)
  expensesService = inject(ExpensesService)
  router = inject(Router)
  private notifications = inject(NotificationService)
  utils = inject(UtilsService)
  expenseReport:ExpenseReport = {};
  categoriesList = categoriesList;
  generatingExpense = false;

  dateFormat = {
    showTimeLabel: false,
    date: {
      weekday: 'short',
      month: 'long',
      day: '2-digit',
    }
  }
  constructor() { }

  ngAfterViewInit(): void {
    this.expenseReport = {...defaultExpenseReport, lineItems:[{...defaultLineItem}], uid: this.authService.currentUser?.uid || ''}
  }

  addLineItem = () => this.expenseReport.lineItems?.push({...defaultLineItem})

  saveReport = (action:string) => {
    this.generatingExpense = true;
    this.expensesService.add({...this.expenseReport, currentAction: action}).pipe(
      switchMap(result => docData(doc(this.fireStore, 'expenses', result.id))),
      filter(report => Boolean(report?.['downloadUrl'])),
      take(1),
      timeout(60000),
    ).subscribe({
      next: () => {
        this.notifications.notify('Expense Created Successfully!');
        this.generatingExpense = false;
        this.modal.dismiss(null, 'done');
        this.router.navigate(['/expenses']);
      },
      error: (e) => {
        this.notifications.notify(e.code)
        this.generatingExpense = false;
      }
    })
  }

  showActions = () => {

  }

  cancelModal = () => {
    this.modal.dismiss(null, 'cancel');
  }

  calculate = (exp:ExpenseReport) => {
    exp.totalAmount = 0
    exp.subTotal = exp.lineItems!.reduce((total:number, lineItem:any) =>  total + this.utils.parseNumber(lineItem.total), 0);
    exp.totalAmount = exp.hasAdvanceAmt && exp.advanceAmount! > 0 ? exp.subTotal - exp.advanceAmount! : exp.subTotal
  }

  
}
