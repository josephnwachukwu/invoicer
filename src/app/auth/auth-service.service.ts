import { Injectable } from '@angular/core';
//import { AngularFireAuth } from '@angular/fire/compat/auth';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,  
  getAuth,
  createUserWithEmailAndPassword,
  updateCurrentUser,
  updateProfile,
  updatePassword
} from '@angular/fire/auth'
import { Subscription } from 'rxjs';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Credentials } from './login/login.page';


export interface User {
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
  //authState$ = authState(this.auth);
  authStateSubscription!: Subscription;

  constructor(public auth: Auth, private firestore: Firestore, private router: Router, /*private notify: NotifyService,*/) { 
    // this.authStateSubscription = this.authState$.subscribe((aUser: User | null) => {
    //   //handle auth state changes here. Note, that user will be null if there is no currently logged in user.
    //   console.log(aUser);
    // })
  }

  // Register Via Email
  //emailSignUp(email: string, password: string) {
    // return this.auth
    //   .createUserWithEmailAndPassword(email, password)
    //   .then(credential => {
    //     this.notify.update('Welcome new user!', 'success');
    //     return this.updateUserData(credential.user); // if using firestore
    //   })
    //   .catch(error => this.handleError(error));
  //}

  // emailLogin(email: string, password: string) {
  //   this.afAuth
  //     .signInWithEmailAndPassword(email, password)
  //     .then(credential => {
  //       console.log('Welcome back!', 'success');
  //       console.log('user credentials', credential.user)
  //       this.router.navigate(['/dashboard']);
  //       this.user = credential.user

  //     })
  //     .catch(error => this.handleError(error));
  // }

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

  /*

  */
  emailSignIn = (credentials:any) => {
    signInWithEmailAndPassword(this.auth, credentials.username, credentials.password)
     .then(data => {
        console.log(data.user)
        // Redirect to dashboard
     })
     .catch((error) => this.handleError(error))
  }

  /*

  */
  emailSignUp = (credentials:any) => {
    createUserWithEmailAndPassword(this.auth, credentials.username, credentials.password)
    .then(data => {
      console.log(data)
    })
    .catch((error) => this.handleError(error))
  }

  /*

  */
  signOut = () => {
    signOut(this.auth)
    .then(() => {
      // Navigate to home page
    })
    .catch((error) => this.handleError(error))
  }

  /*

  */
  updateUser = (user:User) => {
    updateProfile(user, user)
    .then((data) => {

    })
    .catch((error) => this.handleError(error))
  }

  /*

  */
 handleError = (error:Error) => {
  console.error(error.message)
  // Toast Service
 }

}
