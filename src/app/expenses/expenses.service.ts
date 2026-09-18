import { Injectable, inject, signal } from '@angular/core';
import { AuthService } from '../auth/auth-service.service';
import { Firestore, addDoc, collection, collectionData, doc, docData, query, serverTimestamp, updateDoc, where } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { ExpenseReport } from './types/expenses.types';
import { omitUndefined } from '../shared/utils/firestore-data';

@Injectable({ providedIn: 'root' })
export class ExpensesService {
  private readonly authService = inject(AuthService);
  private readonly firestore = inject(Firestore);
  private readonly expensesCollection = collection(this.firestore, 'expenses');
  readonly expensesList = signal<ExpenseReport[]>([]);

  getExpenses(): Observable<ExpenseReport[]> {
    const uid = this.requireUid();
    return collectionData(query(this.expensesCollection, where('uid', '==', uid)), { idField: 'id' }) as Observable<ExpenseReport[]>;
  }

  add(expenseReport: ExpenseReport): Observable<any> {
    const uid = this.requireUid();
    const { id: _id, ...report } = expenseReport;
    return from(addDoc(this.expensesCollection, omitUndefined({ ...report, uid, ownerId: uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })));
  }

  delete(id: string): Observable<void> {
    return from(updateDoc(doc(this.firestore, 'expenses', id), { archived: true, updatedAt: serverTimestamp() }));
  }

  update(expenseReport: ExpenseReport): Observable<void> {
    const { id, uid: _uid, ownerId: _ownerId, ...changes } = expenseReport;
    if (!id) throw new Error('Expense report ID is required.');
    return from(updateDoc(doc(this.firestore, 'expenses', id), omitUndefined({ ...changes, updatedAt: serverTimestamp() })));
  }

  getExpenseReportById(id: string): Observable<ExpenseReport> {
    return docData(doc(this.firestore, 'expenses', id), { idField: 'id' }) as Observable<ExpenseReport>;
  }

  downloadExpenseReport(expenseReport: ExpenseReport): Observable<any> {
    return this.add({ ...expenseReport, currentAction: 'download' });
  }

  private requireUid(): string {
    const uid = this.authService.currentUser?.uid;
    if (!uid) throw new Error('Authentication required.');
    return uid;
  }
}
