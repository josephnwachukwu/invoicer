import { Injectable, inject, signal } from '@angular/core';
import { Auth, User, createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile } from '@angular/fire/auth';
import { Firestore, doc, docData, serverTimestamp, setDoc, updateDoc } from '@angular/fire/firestore';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, firstValueFrom, from, of, switchMap, tap } from 'rxjs';
import { UserLoginInterface } from './shared/interfaces/userLogin.interface';
import { UserRegistrationInterface } from './shared/interfaces/userRegistration.interface';
import { UserProfile, defaultUserProfile } from './shared/interfaces/userProfile.interface';
import { environment } from '../../environments/environment';
import { AnalyticsService } from '../shared/services/analytics.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly firestore = inject(Firestore);
  private readonly http = inject(HttpClient);
  private readonly analytics = inject(AnalyticsService);

  readonly currentUserSignal = signal<UserProfile | null | undefined>(undefined);
  readonly firebaseUserSignal = signal<User | null | undefined>(undefined);
  readonly ready = signal(false);

  constructor() {
    onAuthStateChanged(this.auth, async user => {
      this.firebaseUserSignal.set(user);
      if (!user) {
        this.currentUserSignal.set(null);
        this.ready.set(true);
        return;
      }
      try {
        const token = await user.getIdToken();
        const profile = await firstValueFrom(this.http.post<UserProfile>(`${environment.functionBaseUrl}/profile/ensure`, {}, {
          headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
        }));
        this.currentUserSignal.set(profile || this.profileFromAuth(user));
      } catch {
        this.currentUserSignal.set(this.profileFromAuth(user));
      } finally {
        this.ready.set(true);
      }
    });
  }

  get currentUser(): User | null { return this.auth.currentUser; }
  get isPremiumMember(): boolean { return this.currentUserSignal()?.tier === 'premium'; }

  emailSignIn(credentials: UserLoginInterface): Observable<void> {
    return from(signInWithEmailAndPassword(this.auth, credentials.email, credentials.password)).pipe(
      tap(() => this.analytics.track('login', { method: 'password' })),
      switchMap(() => of(undefined)),
    );
  }

  emailSignUp(credentials: UserRegistrationInterface): Observable<void> {
    return from(createUserWithEmailAndPassword(this.auth, credentials.email, credentials.password).then(async result => {
      await updateProfile(result.user, { displayName: credentials.username });
      const profile: UserProfile = {
        ...defaultUserProfile,
        id: result.user.uid,
        uid: result.user.uid,
        email: result.user.email || credentials.email,
        displayName: credentials.username,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(doc(this.firestore, 'users', result.user.uid), profile);
      this.currentUserSignal.set(profile);
      this.analytics.track('sign_up', { method: 'password' });
    }));
  }

  sendPasswordReset(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email));
  }

  signOut(): Observable<void> {
    return from(signOut(this.auth)).pipe(tap(() => {
      this.currentUserSignal.set(null);
      this.firebaseUserSignal.set(null);
    }));
  }

  updateUserProfile(profile: Partial<UserProfile>): Observable<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Authentication required.');
    return from(Promise.all([
      updateProfile(user, { displayName: profile.displayName ?? user.displayName, photoURL: profile.photoURL ?? user.photoURL }),
      updateDoc(doc(this.firestore, 'users', user.uid), { ...profile, updatedAt: serverTimestamp() }),
    ]).then(() => undefined));
  }

  profile$(uid?: string): Observable<UserProfile | undefined> {
    const userId = uid || this.auth.currentUser?.uid;
    if (!userId) return of(undefined);
    return docData(doc(this.firestore, 'users', userId), { idField: 'id' }) as Observable<UserProfile>;
  }

  deleteAccount(): Observable<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Authentication required.');
    return from(user.getIdToken()).pipe(
      switchMap(token => this.http.delete<void>(`${environment.functionBaseUrl}/account`, { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) })),
      tap(() => {
        this.currentUserSignal.set(null);
        this.firebaseUserSignal.set(null);
      }),
    );
  }

  private profileFromAuth(user: User): UserProfile {
    return { id: user.uid, uid: user.uid, email: user.email || '', displayName: user.displayName || '', photoURL: user.photoURL || defaultUserProfile.photoURL, tier: 'basic' };
  }
}
