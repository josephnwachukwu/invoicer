import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../../auth/auth-service.service';
import { Firestore, collection, collectionData, query, where, deleteDoc, doc, addDoc, updateDoc, docData } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { Client } from '../../client.interface';


@Injectable({
  providedIn: 'root'
})
export class ClientService {
  authService = inject(AuthService)
  fireStore = inject(Firestore)
  clientsCollection = collection(this.fireStore, 'clients')
  clients = signal<any[]>([])
  constructor() { }

  /**
   * Gets a list of clients by User Id
   * @returns A list of clients
   */
  getClients = (): Observable<Client[]> => {
    const user = this.authService.currentUser;
    const q = query(this.clientsCollection, where('uid', '==', user.uid))
    return collectionData(q, { idField: 'id'})
  }
  /**
   * Adds a new client
   * @param client 
   * @returns 
   */
  add = (client:Client): Observable<any> => {
    const promise = addDoc(this.clientsCollection, {...client})
    return from(promise)
  }

  /**
   * Deletes a client
   * @param id 
   * @returns 
   */
  delete = (id:string):Observable<any> => {
    const docref = doc(this.fireStore, 'clients/' + id)
    const promise = deleteDoc(docref)
    return from(promise)
  }

  /**
   * Updates a client
   * @param client 
   * @returns 
   */
  update = (client: Client):Observable<any> => {
    const docref = doc(this.fireStore, `clients/${client.id}`)
    const promise = updateDoc(docref, {...client})
    return from(promise) 
  }

  /**
   * Gets a Specific client by Id
   * @param id 
   * @returns an Observable with client data
   */
  getClientById = (id:any):Observable<Client> => {
    const clientRef = doc(this.fireStore, `clients/${id}`)
    const promise = docData(clientRef, {idField: 'id'})
    return promise as Observable<Client>
  }
}
