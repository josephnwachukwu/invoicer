import { inject, Injectable, signal } from '@angular/core';
import { 
  Auth, 
  authState,
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,  
  getAuth,
  createUserWithEmailAndPassword,
  updateCurrentUser,
  updateProfile,
  updatePassword,
  user, 
  UserInfo,
  onAuthStateChanged,
} from '@angular/fire/auth'
import { Subscription, Observable, from } from 'rxjs';
import { Firestore, collection, addDoc, setDoc, collectionData, collectionGroup, DocumentReference } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { NotificationService } from '../notification.service';


export interface UserInterface {
  uid?: string;
  email?: string | null;
  photoURL?: string | null;
  displayName?: string;
}

export interface Error {
  message?:string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  auth = inject(Auth)
  firestore = inject(Firestore)
  router = inject(Router)
  user$ = user(this.auth)
  notifications = inject(NotificationService)
  currentUserSignal = signal<Partial<UserInterface> | null | undefined>(undefined)
  currentUser!: any

  constructor(){
    this.auth.onAuthStateChanged(user => {
      if(user){
        const {uid, email, displayName, photoURL} = user!
        this.currentUserSignal.set({uid, email, photoURL})
        this.currentUser = user
      }
    })
  }


  /** 
   * Logs user into firebase account
   * @param credentials email and password
  */
  emailSignIn = (credentials:any):Observable<void> => {
    const promise = signInWithEmailAndPassword(this.auth, credentials.email, credentials.password)
     .then(() => {})
     return from(promise)
  }

  /**
   * Registers a user with a new firebase account
   * @param credentials username email and password
   */
  emailSignUp = (credentials:any):Observable<void> => {
    const promise = createUserWithEmailAndPassword(this.auth, credentials.email, credentials.password)
    .then(data => {
      updateProfile(data.user, {displayName: credentials.username})
    })
    return from(promise)
  }

  /*
   * Signs User out of Firebase
  */
  signOut = ():Observable<void> => {
    const promise = signOut(this.auth)
    return from(promise)
  }

  /*
   * Updates the User Profile
  */
  updateUserProfile = (user:any) => {
    updateProfile(user, {displayName: 'new user', photoURL: ''})
    .then((data) => {
      //setDoc()
    })
  }

}
