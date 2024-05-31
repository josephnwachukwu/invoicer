import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth/auth-service.service';
import { Firestore, collection, collectionData, query, where, deleteDoc, doc, setDoc, collectionGroup } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';

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
}
