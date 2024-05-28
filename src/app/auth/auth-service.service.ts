import { inject, Injectable, signal } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,  
  getAuth,
  createUserWithEmailAndPassword,
  updateCurrentUser,
  updateProfile,
  updatePassword,
  user
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
  currentUserSignal = signal<UserInterface | null | undefined>(undefined)


  // // Sends email allowing user to reset password
  // resetPassword(email: string) {
  //   const fbAuth = this.afAuth;

  //   return fbAuth
  //     .sendPasswordResetEmail(email)
  //     .then(() => this.notify.update('Password update email sent', 'info'))
  //     .catch(error => this.handleError(error));
  // }

  // // If error, console log and notify user
  // private handleError(error: Error) {
  //   console.error(error);
  //   this.notify.update(error.message, 'error');
  // }

  // // Sets user data to firestore after succesful login
  // private updateUserData(user) {

  //   const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
  //   return userRef.set(user);
  // }

  // updateUser(user) {
  //   const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

  //   return userRef.set(user)
  //   .then(()=>{
  //     this.notify.update('User Updated Successfully', 'success');
  //   })
  // }

  /** 
   * Logs user into firebase account
   * @param credentials email and password
  */
  emailSignIn = (credentials:any):Observable<void> => {
    this.notifications.notify('test 1')
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

  */
  signOut = ():Observable<void> => {
    const promise = signOut(this.auth)
    return from(promise)
  }

  /*

  */
  updateUserProfile = (user:any) => {
    updateProfile(user, {displayName: 'new user', photoURL: ''})
    .then((data) => {
      //setDoc()
    })
  }

}
