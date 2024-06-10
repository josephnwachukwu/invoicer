import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../auth/auth-service.service';
import { Firestore, collection, collectionData, query, where, deleteDoc, doc, addDoc, updateDoc, docData } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { ExpenseReport } from './types/expenses.types';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  authService = inject(AuthService)
  fireStore = inject(Firestore)
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


}
