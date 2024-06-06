import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth/auth-service.service';
import  { Firestore, collection, collectionData, query, where, deleteDoc, doc, setDoc, addDoc, docData } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { Invoice } from './models/invoice.model';

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
    const user = this.authService.currentUser;
    const q = query(this.invoiceCollection, where("uid", '==', user.uid))
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

  updateInvoice = (invoiceId:string, data: Invoice): Observable<void> => {
    const docref = doc(this.fireStore, 'invoices/' + invoiceId)
    const promise = setDoc(docref, data)
    return from(promise)
  }

  createInvoice = (invoice:Invoice) => {
    const user = this.authService.currentUser;
    const itemList = invoice.lineItems.map((obj:any)=> {return Object.assign({}, obj)})
    if(user && user.uid) {
      const payload = {
        ...invoice,
        uid: user.uid,
        lineItems: itemList
      }
      return addDoc(collection(this.fireStore, 'invoices'), {...payload})
    }
    else {
      const payload = {
        ...invoice,
        uid: 'tempUser',
        lineItems: itemList
      }
      return addDoc(collection(this.fireStore, 'invoices'), {...payload})
    }
  }

  /**
   * Gets a Specific Invoice by Id
   * @param id 
   * @returns an Observable with Invoice data
   */
  getInvoiceById = (id:any):Observable<Invoice> => {
    const invoiceRef = doc(this.fireStore, `invoices/${id}`)
    const promise = docData(invoiceRef, {idField: 'id'})
    return promise as Observable<Invoice>
  }

  saveInvoice = (invoice:Invoice) => {
    const promise = addDoc(this.invoiceCollection, {...invoice})
    return from(promise)
  }


}
