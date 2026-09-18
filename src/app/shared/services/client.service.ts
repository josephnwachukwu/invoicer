import { Injectable, inject, signal } from '@angular/core';
import { AuthService } from '../../auth/auth-service.service';
import { Firestore, addDoc, collection, collectionData, doc, docData, query, serverTimestamp, updateDoc, where } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { Client } from '../../client.interface';
import { omitUndefined } from '../utils/firestore-data';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private readonly authService = inject(AuthService);
  private readonly firestore = inject(Firestore);
  private readonly clientsCollection = collection(this.firestore, 'clients');
  readonly clients = signal<Client[]>([]);

  getClients(): Observable<Client[]> {
    const uid = this.requireUid();
    return collectionData(query(this.clientsCollection, where('ownerId', '==', uid)), { idField: 'id' }) as Observable<Client[]>;
  }

  add(client: Client): Observable<any> {
    const uid = this.requireUid();
    return from(addDoc(this.clientsCollection, omitUndefined({ ...client, ownerId: uid, uid, archived: false, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })));
  }

  delete(id: string): Observable<void> {
    return from(updateDoc(doc(this.firestore, 'clients', id), { archived: true, updatedAt: serverTimestamp() }));
  }

  update(client: Client): Observable<void> {
    const { id, ownerId: _ownerId, uid: _uid, ...changes } = client;
    if (!id) throw new Error('Client ID is required.');
    return from(updateDoc(doc(this.firestore, 'clients', id), omitUndefined({ ...changes, updatedAt: serverTimestamp() })));
  }

  getClientById(id: string): Observable<Client> {
    return docData(doc(this.firestore, 'clients', id), { idField: 'id' }) as Observable<Client>;
  }

  private requireUid(): string {
    const uid = this.authService.currentUser?.uid;
    if (!uid) throw new Error('Authentication required.');
    return uid;
  }
}
