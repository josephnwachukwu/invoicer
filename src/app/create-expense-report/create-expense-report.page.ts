import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth/auth-service.service';
import { NotificationService } from '../shared/services/notification.service'
import { ExpenseReport, defaultExpenseReport, defaultLineItem, categoriesList } from '../expenses/types/expenses.types';
import { ExpensesService } from '../expenses/expenses.service';
import { doc, Firestore, onSnapshot } from '@angular/fire/firestore';
import { IonModal } from '@ionic/angular';
import { Router } from '@angular/router';
import { UtilsService } from '../shared/services/utils.service';
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

  ngOnInit() {
    console.log('create expense')
    console.log(this.authService.currentUser)
  }

  ngAfterViewInit(): void {
    this.expenseReport = {...defaultExpenseReport, lineItems:[{...defaultLineItem}], /*employeeName: this.authService.currentUserSignal()!.displayName,*/ uid: this.authService.currentUser.uid}
  }

  addLineItem = () => this.expenseReport.lineItems?.push({...defaultLineItem})

  saveReport = (action:string) => {
    this.generatingExpense = true;
    this.expensesService.add({...this.expenseReport, currentAction: action}).subscribe({
      next: (data) => {
        console.log('data', data.id)
        if(data.id) {
          console.log(`the id of the document is ${data.id}`)
          const unsub = onSnapshot(
            doc(this.fireStore, "expenses", data.id), 
            { includeMetadataChanges: true }, 
            (doc) => {
              const expenseReportData = doc.data()
              console.log(`doc looking for changes`, expenseReportData)
              if(expenseReportData!['downloadUrl'] !== "") {
                console.log(`download url present`)
                this.notifications.notify('Expense Created Successfully!')
                this.generatingExpense = false;
                this.modal.dismiss(null, 'done');
                this.router.navigate(['/expenses'])
              }
            });
        }
        
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
    console.log('calculate', exp.hasAdvanceAmt && exp.advanceAmount! > 0 ? Number(exp.subTotal) - Number(exp.advanceAmount) : Number(exp.subTotal))
  }

  // downloadExpenseReport = (expenseReport:ExpenseReport) => {
  //   this.expensesService.downloadExpenseReport(expenseReport)
  // }

  // emailExpenseReport = (texpenseReport: ExpenseReport) => {

  // }
}
