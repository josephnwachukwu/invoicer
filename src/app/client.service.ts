import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth/auth-service.service';
import { Firestore, collection, collectionData, query, where, deleteDoc, doc, setDoc, collectionGroup, addDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { Client } from './client.interface'
@Injectable({
  providedIn: 'root'
})
export class ClientService {
  authService = inject(AuthService)
  fireStore = inject(Firestore)
  clientCollection = collection(this.fireStore, 'clients')
  clients = signal<any[]>([])
  constructor() { }

  getClients = (): Observable<any[]> => {
    const q = query(this.clientCollection, where('uid', '==', this.authService.currentUser.uid))
    return collectionData(q, { idField: 'id'})
  }

  add = (client:Client): Observable<any> => {
    const promise = addDoc(collection(this.fireStore, 'clients'), {...client})
    return from(promise)
  }

  delete = (id:string):Observable<any> => {
    const docref = doc(this.fireStore, 'clients/' + id)
    const promise = deleteDoc(docref)
    return from(promise)
  }
}
