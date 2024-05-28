import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth/auth-service.service';
import  { Firestore, collection, collectionData, query, where, deleteDoc, doc, setDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  authService = inject(AuthService)
  fireStore = inject(Firestore)
  invoiceCollection = collection(this.fireStore, 'invoices')
  invoices = signal<any[]>([])

  /**
   * 
   * @returns 
   */
  getInvoices = (): Observable<any[]> => {
    const q = query(this.invoiceCollection, where("uid", '==', 'gSln6c5kPveMOVtiITJongqHcX82'))
    return collectionData(q, { idField: 'id' })
  } 

  /**
   * 
   * @param invoiceId 
   * @returns 
   */
  deleteInvoice = (invoiceId:string): Observable<void> => {
    const docref = doc(this.fireStore, 'invoices/' + invoiceId)
    const promise = deleteDoc(docref)
    return from(promise)
  }

  updateInvoice = (invoiceId:string, data: {}): Observable<void> => {
    const docref = doc(this.fireStore, 'invoices/' + invoiceId)
    const promise = setDoc(docref, data)
    return from(promise)
  }

}
