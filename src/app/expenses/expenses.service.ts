import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../auth/auth-service.service';
import { Firestore, collection, collectionData, query, where, deleteDoc, doc, addDoc, updateDoc, docData } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { ExpenseReport } from './types/expenses.types';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../shared/services/notification.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  authService = inject(AuthService)
  fireStore = inject(Firestore)
  http = inject(HttpClient)
  notifications = inject(NotificationService)
  expensesCollection = collection(this.fireStore, 'expenses')
  expensesList = signal<ExpenseReport[]>([])

  constructor() { }

  getExpenses = ():Observable<ExpenseReport[]> => {
    const user = this.authService.currentUser
    const q = query(this.expensesCollection, where('uid', '==', user.uid))
    return collectionData(q, { idField: 'id'})
  }

  add = (expenseReport: ExpenseReport): Observable<any> => {
    return from(addDoc(this.expensesCollection, {...expenseReport}))
  }

  delete = (id:string): Observable<any> => {
    const docRef = doc(this.fireStore, `expenses/${id}`)
    return from(deleteDoc(docRef))
  }

  update = (expenseReport: ExpenseReport): Observable<any> => {
    const docRef = doc(this.fireStore, `expenses/${expenseReport.id}`)
    return from(updateDoc(docRef, {...expenseReport}))
  }

  getExpenseReportById = (id:string): Observable<ExpenseReport> => {
    const expenseRef = doc(this.fireStore, `expenses/${id}`)
    return from(docData(expenseRef, {idField: 'id'})) as Observable<ExpenseReport>
  }

  downloadExpenseReport = (expenseReport:ExpenseReport) => {
    //this.processingInvoice.set(true)
    // Blob type is required
    const httpOptions = {
      responseType: 'blob' as 'json'
    };

    // save the invoice
    addDoc(this.expensesCollection, {...expenseReport}).then((docRef:any) => {
      console.log('data', docRef.id)

      const stamp = Date.now().toString();
      var fileName = "expense-report-" + stamp + ".pdf";
      var a = document.createElement("a");
      document.body.appendChild(a);

      // Use local emulators in development and the deployed Firebase function in production.
      const functionBaseUrl = environment.production
        ? 'https://us-central1-invoicer-6022f.cloudfunctions.net/app'
        : 'http://localhost:5001/invoicer-6022f/us-central1/app';
      const appBaseUrl = environment.production
        ? 'https://invoicer.me'
        : 'http://localhost:4200';
      const reportUrl = encodeURIComponent(`${appBaseUrl}/view-expense/${docRef.id}`);

      this.http.get(`${functionBaseUrl}/saveandupload?url=${reportUrl}`, httpOptions).subscribe((data:any) => {
        const file = new Blob([data], { type: 'application/pdf' });
        const downloadURL = URL.createObjectURL(file);
        a.href = downloadURL;
        a.download = fileName;
        a.click();
      });

    }).then(()=>{
      this.notifications.notify('Invoice processed successfully')
      //this.processingInvoice.set(false)
    });
  }


}
